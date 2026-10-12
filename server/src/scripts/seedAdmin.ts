import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { env } from '../config/env.js';
import { User } from '../models/User.js';

const seedAdmin = async () => {
  try {
    await mongoose.connect(env.MONGODB_URI);
    console.log('[Seed] Connected to database');

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@certiverify.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123456';
    const adminName = process.env.ADMIN_NAME || 'Platform Administrator';

    let admin = await User.findOne({ email: adminEmail.toLowerCase() });

    const passwordHash = await bcrypt.hash(adminPassword, 12);

    if (admin) {
      admin.passwordHash = passwordHash;
      admin.role = 'superadmin';
      admin.active = true;
      await admin.save();
      console.log(`[Seed] Existing admin updated: ${adminEmail}`);
    } else {
      admin = await User.create({
        name: adminName,
        email: adminEmail.toLowerCase(),
        passwordHash,
        role: 'superadmin',
        active: true,
      });
      console.log(`[Seed] New administrator created: ${adminEmail}`);
    }

    console.log(`[Seed Success] Default Admin Credentials:`);
    console.log(`Email:    ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
    console.log(`Role:     ${admin.role}`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error] Failed to seed administrator:', error);
    process.exit(1);
  }
};

seedAdmin();
