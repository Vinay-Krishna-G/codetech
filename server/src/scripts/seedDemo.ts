import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { env } from '../config/env.js';
import { User } from '../models/User.js';
import { Issuer } from '../models/Issuer.js';
import { Certificate } from '../models/Certificate.js';
import { AuditLog } from '../models/AuditLog.js';

const seedDemoData = async () => {
  try {
    await mongoose.connect(env.MONGODB_URI);
    console.log('[SeedDemo] Connected to MongoDB');

    // 1. Ensure Admin exists
    let admin = await User.findOne({ email: 'admin@certiverify.com' });
    if (!admin) {
      const passwordHash = await bcrypt.hash('Admin@123456', 12);
      admin = await User.create({
        name: 'Neela Santhosh Kumar',
        email: 'admin@certiverify.com',
        passwordHash,
        role: 'superadmin',
        active: true,
      });
    }

    // 2. Ensure Issuer exists
    let issuer = await Issuer.findOne({
      organizationName: 'CODTECH IT SOLUTIONS PRIVATE LIMITED',
    });

    if (!issuer) {
      issuer = await Issuer.create({
        organizationName: 'CODTECH IT SOLUTIONS PRIVATE LIMITED',
        address:
          '8-7-7/2, Plot NO.51, Opp: Naveena School, Hasthinapuram Central, Hyderabad, 500 079. Telangana',
        contactEmail: 'hr@codtechitsolutions.com',
        website: 'https://codtechitsolutions.com',
        phone: '+91 9848925128',
        authorizationDescription:
          'Premier Information Technology Services and Industry Internship Provider',
        defaultSignatoryName: 'NEELA SANTHOSH KUMAR',
        defaultSignatoryDesignation: 'Human Resources & Academic Head',
        badges: ['ISO 9001', 'AICTE', 'MSME', 'StartupIndia'],
      });
    }

    // 3. Clear previous demo certificates if any
    await Certificate.deleteMany({
      certificateId: { $in: ['DC6E30F05C735E02', 'CITS24', 'CITS-REVOKED-01', 'CV-WEB-9842'] },
    });

    // 4. Reference Certificate 1 from Image 3 (Mobile Verification Screen)
    const cert1 = await Certificate.create({
      certificateId: 'DC6E30F05C735E02',
      recipientName: 'Bellamkonda Jagadeesh',
      recipientEmail: 'jagadeesh.b@example.com',
      certificateType: 'Internship Experience',
      achievementTitle: 'Data Analytics',
      domain: 'Data Analytics',
      duration: '6 Weeks',
      description:
        'We appreciate his/her active participation, consistent efforts, and impressive contribution to the overall success of the internship. We wish him/her all the best in future endeavors.',
      remarks:
        'Demonstrated strong dedication, technical skills, and a positive learning attitude throughout the internship.',
      issuerId: issuer._id,
      issuingOrganization: 'CODTECH IT SOLUTIONS PRIVATE LIMITED',
      startDate: new Date('2026-06-18'),
      completionDate: new Date('2026-07-30'),
      issueDate: new Date('2026-07-30'),
      grade: 'Successfully Completed',
      signatoryName: 'NEELA SANTHOSH KUMAR',
      signatoryDesignation: 'Human Resources & Academic Head',
      signatoryEmail: 'hr@codtechitsolutions.com',
      status: 'valid',
      issuedBy: admin._id,
      allowPublicDownload: true,
    });

    // 5. Reference Certificate 2 from Image 1 (Full Certificate Document)
    const cert2 = await Certificate.create({
      certificateId: 'CITS24',
      recipientName: 'DOPPALAPUDI SUBHASH',
      recipientEmail: 'subhash.doppalapudi@example.com',
      certificateType: 'Internship Experience',
      achievementTitle: 'Data Analytics',
      domain: 'Data Analytics',
      duration: '6 Weeks',
      description:
        'We appreciate his/her active participation, consistent efforts, and impressive contribution to the overall success of the internship. We wish him/her all the best in future endeavors. We are confident that his/her dedication and skills will lead to great achievements ahead.',
      remarks:
        'Demonstrated strong dedication, technical skills, and a positive learning attitude throughout the internship.',
      issuerId: issuer._id,
      issuingOrganization: 'CODTECH IT SOLUTIONS PRIVATE LIMITED',
      startDate: new Date('2026-05-09'),
      completionDate: new Date('2026-06-20'),
      issueDate: new Date('2026-06-20'),
      grade: 'Successfully Completed',
      signatoryName: 'NEELA SANTHOSH KUMAR',
      signatoryDesignation: 'Human Resources & Academic Head',
      signatoryEmail: 'hr@codtechitsolutions.com',
      status: 'valid',
      issuedBy: admin._id,
      allowPublicDownload: true,
    });

    // 6. Revoked Certificate for testing revocation verification
    const cert3 = await Certificate.create({
      certificateId: 'CITS-REVOKED-01',
      recipientName: 'KUMAR SANJAY',
      recipientEmail: 'sanjay.k@example.com',
      certificateType: 'Project Completion',
      achievementTitle: 'Distributed Cloud Architecture',
      domain: 'Cloud Computing',
      duration: '8 Weeks',
      description: 'Project completion certificate for advanced cloud computing framework.',
      remarks: 'Project deliverables submitted.',
      issuerId: issuer._id,
      issuingOrganization: 'CODTECH IT SOLUTIONS PRIVATE LIMITED',
      startDate: new Date('2026-01-10'),
      completionDate: new Date('2026-03-05'),
      issueDate: new Date('2026-03-06'),
      grade: 'Grade B+',
      signatoryName: 'NEELA SANTHOSH KUMAR',
      signatoryDesignation: 'Human Resources & Academic Head',
      signatoryEmail: 'hr@codtechitsolutions.com',
      status: 'revoked',
      issuedBy: admin._id,
      revokedAt: new Date('2026-04-12'),
      revocationReason:
        'Administrative audit detected duplicate project submission without authorized verification.',
      revokedBy: admin._id,
      allowPublicDownload: false,
    });

    // 7. Additional Valid Sample (Full Stack Web Development)
    const cert4 = await Certificate.create({
      certificateId: 'CV-WEB-9842',
      recipientName: 'AARAV SHARMA',
      recipientEmail: 'aarav.sharma@example.com',
      certificateType: 'Training Completion',
      achievementTitle: 'Full-Stack MERN Development',
      domain: 'Full Stack Engineering',
      duration: '12 Weeks',
      description:
        'Successfully completed comprehensive training covering React, Node.js, Express, MongoDB, and secure API architectures.',
      remarks: 'Outstanding performance in capstone microservices assessment.',
      issuerId: issuer._id,
      issuingOrganization: 'CODTECH IT SOLUTIONS PRIVATE LIMITED',
      startDate: new Date('2026-02-01'),
      completionDate: new Date('2026-04-28'),
      issueDate: new Date('2026-04-29'),
      grade: 'Grade A+ with Distinction',
      signatoryName: 'NEELA SANTHOSH KUMAR',
      signatoryDesignation: 'Human Resources & Academic Head',
      signatoryEmail: 'hr@codtechitsolutions.com',
      status: 'valid',
      issuedBy: admin._id,
      allowPublicDownload: true,
    });

    // 8. Seed Audit Logs
    await AuditLog.create([
      {
        actorId: admin._id,
        actorEmail: admin.email,
        action: 'ISSUE',
        certificateId: cert1.certificateId,
        timestamp: new Date('2026-07-30T10:00:00Z'),
        metadata: { recipientName: cert1.recipientName },
      },
      {
        actorId: admin._id,
        actorEmail: admin.email,
        action: 'ISSUE',
        certificateId: cert2.certificateId,
        timestamp: new Date('2026-06-20T11:15:00Z'),
        metadata: { recipientName: cert2.recipientName },
      },
      {
        actorId: admin._id,
        actorEmail: admin.email,
        action: 'ISSUE',
        certificateId: cert3.certificateId,
        timestamp: new Date('2026-03-06T09:30:00Z'),
        metadata: { recipientName: cert3.recipientName },
      },
      {
        actorId: admin._id,
        actorEmail: admin.email,
        action: 'REVOKE',
        certificateId: cert3.certificateId,
        timestamp: new Date('2026-04-12T14:45:00Z'),
        metadata: { revocationReason: cert3.revocationReason },
      },
      {
        actorId: admin._id,
        actorEmail: admin.email,
        action: 'ISSUE',
        certificateId: cert4.certificateId,
        timestamp: new Date('2026-04-29T16:20:00Z'),
        metadata: { recipientName: cert4.recipientName },
      },
    ]);

    console.log('[SeedDemo] Successfully seeded demo certificates:');
    console.log(`- DC6E30F05C735E02 (Valid - Bellamkonda Jagadeesh)`);
    console.log(`- CITS24 (Valid - Doppalapudi Subhash)`);
    console.log(`- CITS-REVOKED-01 (Revoked - Kumar Sanjay)`);
    console.log(`- CV-WEB-9842 (Valid - Aarav Sharma)`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('[SeedDemo Error]:', error);
    process.exit(1);
  }
};

seedDemoData();
