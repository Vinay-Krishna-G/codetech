import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app.js';
import { env } from '../config/env.js';
import { User } from '../models/User.js';
import { Certificate } from '../models/Certificate.js';
import bcrypt from 'bcryptjs';

describe('CertiVerify Full-Stack Backend Integration Tests', () => {
  let adminCookie: string;
  const testCertId = 'TEST-INT-001';

  beforeAll(async () => {
    await mongoose.connect(env.MONGODB_URI);

    // Clean up test fixtures if present
    await User.deleteMany({ email: 'testadmin@certiverify.com' });
    await Certificate.deleteMany({
      certificateId: { $in: [testCertId, 'TEST-DUP-001', 'TEST-REVOKE-001'] },
    });

    // Create test admin
    const passwordHash = await bcrypt.hash('AdminTest@123', 10);
    await User.create({
      name: 'Test Administrator',
      email: 'testadmin@certiverify.com',
      passwordHash,
      role: 'superadmin',
      active: true,
    });
  });

  afterAll(async () => {
    // Clean up test data
    await User.deleteMany({ email: 'testadmin@certiverify.com' });
    await Certificate.deleteMany({
      certificateId: { $in: [testCertId, 'TEST-DUP-001', 'TEST-REVOKE-001'] },
    });
    await mongoose.disconnect();
  });

  describe('1. Authentication Endpoints', () => {
    it('should fail login with incorrect password', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'testadmin@certiverify.com',
        password: 'WrongPassword999!',
      });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Invalid');
    });

    it('should fail login with non-existent user', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'nobody@nowhere.com',
        password: 'Password123!',
      });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should successfully log in and return HTTP-only auth cookie', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'testadmin@certiverify.com',
        password: 'AdminTest@123',
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.user).toBeDefined();
      expect(res.body.user.email).toBe('testadmin@certiverify.com');

      const cookies = (res.headers['set-cookie'] || []) as string[] | string;
      const cookieArray = Array.isArray(cookies) ? cookies : [cookies];
      expect(cookieArray.length).toBeGreaterThan(0);
      const tokenCookie = cookieArray.find((c: string) => c.startsWith('token='));
      expect(tokenCookie).toBeDefined();
      adminCookie = (tokenCookie as string).split(';')[0];
    });

    it('should return current authenticated user from /api/auth/me', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Cookie', adminCookie);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.user.email).toBe('testadmin@certiverify.com');
    });

    it('should reject unauthenticated access to /api/auth/me', async () => {
      const res = await request(app).get('/api/auth/me');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('2. Certificate Issuance & Validation', () => {
    it('should reject certificate creation without admin authentication', async () => {
      const res = await request(app).post('/api/certificates').send({
        recipientName: 'Unauth User',
        certificateType: 'Project Completion',
        achievementTitle: 'Security Bypass',
        completionDate: '2026-05-10',
      });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should reject issuance if completion date is after issue date', async () => {
      const res = await request(app)
        .post('/api/certificates')
        .set('Cookie', adminCookie)
        .send({
          recipientName: 'Invalid Date Student',
          certificateType: 'Training Completion',
          achievementTitle: 'Future Date Issue',
          completionDate: '2026-12-31',
          issueDate: '2026-01-01',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Completion date cannot be after the issue date');
    });

    it('should reject issuance if required fields are missing', async () => {
      const res = await request(app)
        .post('/api/certificates')
        .set('Cookie', adminCookie)
        .send({
          recipientName: '', // empty name
          certificateType: 'NonExistentType',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should successfully issue a valid certificate', async () => {
      const res = await request(app)
        .post('/api/certificates')
        .set('Cookie', adminCookie)
        .send({
          certificateId: testCertId,
          recipientName: 'SUBHASH VERMA',
          recipientEmail: 'subhash.v@example.com',
          certificateType: 'Internship Experience',
          achievementTitle: 'Data Analytics Engineering',
          domain: 'Data Analytics',
          duration: '6 Weeks',
          startDate: '2026-04-01',
          completionDate: '2026-05-15',
          issueDate: '2026-05-16',
          issuingOrganization: 'CODTECH IT SOLUTIONS PRIVATE LIMITED',
          grade: 'Successfully Completed',
          signatoryName: 'NEELA SANTHOSH KUMAR',
          signatoryDesignation: 'Human Resources & Academic Head',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.certificate.certificateId).toBe(testCertId);
      expect(res.body.certificate.status).toBe('valid');
    });

    it('should reject duplicate certificate ID', async () => {
      const res = await request(app)
        .post('/api/certificates')
        .set('Cookie', adminCookie)
        .send({
          certificateId: testCertId, // already exists
          recipientName: 'Another User',
          certificateType: 'Project Completion',
          achievementTitle: 'Duplicate Check',
          completionDate: '2026-05-10',
          issueDate: '2026-05-12',
        });

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('already exists');
    });
  });

  describe('3. Public Certificate Verification', () => {
    it('should return valid certificate details for an existing certificate', async () => {
      const res = await request(app).get(`/api/verify/${testCertId}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.status).toBe('valid');
      expect(res.body.certificate.certificateId).toBe(testCertId);
      expect(res.body.certificate.recipientName).toBe('SUBHASH VERMA');
      expect(res.body.certificate.issuingOrganization).toBe('CODTECH IT SOLUTIONS PRIVATE LIMITED');
    });

    it('should return 404 for an unknown certificate ID without fabricating records', async () => {
      const res = await request(app).get('/api/verify/NON-EXISTENT-ID-999');

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.status).toBe('not_found');
      expect(res.body.message).toContain('was not found');
    });

    it('should verify seeded reference certificate DC6E30F05C735E02', async () => {
      const res = await request(app).get('/api/verify/DC6E30F05C735E02');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.certificate.certificateId).toBe('DC6E30F05C735E02');
      expect(res.body.certificate.recipientName).toBe('Bellamkonda Jagadeesh');
      expect(res.body.certificate.achievementTitle).toBe('Data Analytics');
    });
  });

  describe('4. Certificate Revocation & Post-Revocation Verification', () => {
    it('should reject revocation without a mandatory reason of minimum length', async () => {
      const res = await request(app)
        .patch(`/api/admin/certificates/${testCertId}/revoke`)
        .set('Cookie', adminCookie)
        .send({
          revocationReason: 'abc', // too short
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should successfully revoke a certificate with valid reason', async () => {
      const res = await request(app)
        .patch(`/api/admin/certificates/${testCertId}/revoke`)
        .set('Cookie', adminCookie)
        .send({
          revocationReason: 'Credential rescinded following internal compliance review.',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.certificate.status).toBe('revoked');
      expect(res.body.certificate.revocationReason).toBe(
        'Credential rescinded following internal compliance review.'
      );
    });

    it('should immediately reflect revoked status on the public verification endpoint', async () => {
      const res = await request(app).get(`/api/verify/${testCertId}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.status).toBe('revoked');
      expect(res.body.certificate.status).toBe('revoked');
      expect(res.body.certificate.revokedAt).toBeDefined();
      expect(res.body.certificate.revocationReason).toContain('compliance review');
    });
  });

  describe('5. PDF and QR Generation', () => {
    it('should generate and stream a valid PDFKit certificate document', async () => {
      const res = await request(app).get(`/api/certificates/${testCertId}/pdf`);

      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toBe('application/pdf');
      expect(res.headers['content-disposition']).toContain(`Certificate-${testCertId}.pdf`);
      expect(res.body.length).toBeGreaterThan(1000); // verify non-empty binary payload
    });

    it('should generate QR code verification payload', async () => {
      const res = await request(app).get(`/api/certificates/${testCertId}/qr`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.qrDataUrl).toMatch(/^data:image\/png;base64,/);
      expect(res.body.verificationUrl).toContain(`/verify/${testCertId}`);
    });
  });

  describe('6. Admin Dashboard Stats & Audit Logs', () => {
    it('should retrieve database stats from aggregation', async () => {
      const res = await request(app)
        .get('/api/admin/stats')
        .set('Cookie', adminCookie);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.stats.totalIssued).toBeGreaterThan(0);
      expect(res.body.stats.activeCertificates).toBeGreaterThanOrEqual(0);
      expect(res.body.stats.revokedCertificates).toBeGreaterThanOrEqual(1);
    });

    it('should retrieve paginated audit logs', async () => {
      const res = await request(app)
        .get('/api/admin/audit-logs')
        .set('Cookie', adminCookie);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.logs)).toBe(true);
      expect(res.body.logs.length).toBeGreaterThan(0);
    });
  });
});
