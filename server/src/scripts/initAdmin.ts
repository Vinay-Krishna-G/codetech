import readline from 'readline';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { env } from '../config/env.js';
import { User } from '../models/User.js';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Safely prompts for user input via terminal.
 */
const promptQuestion = (rl: readline.Interface, question: string): Promise<string> => {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
};

/**
 * Prompts for sensitive input with masking so the password is not displayed in the terminal.
 */
const promptPassword = (question: string): Promise<string> => {
  return new Promise((resolve) => {
    if (!process.stdin.isTTY) {
      // Non-interactive fallback
      const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
      rl.question(question, (ans) => {
        rl.close();
        resolve(ans.trim());
      });
      return;
    }

    const stdin = process.stdin;
    const stdout = process.stdout;
    let password = '';

    stdout.write(question);
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding('utf-8');

    const onData = (data: string) => {
      for (const char of data) {
        if (char === '\n' || char === '\r' || char === '\u0004') {
          // Enter or EOF
          stdin.setRawMode(false);
          stdin.pause();
          stdin.removeListener('data', onData);
          stdout.write('\n');
          resolve(password);
          return;
        } else if (char === '\u0003') {
          // Ctrl+C
          stdin.setRawMode(false);
          stdout.write('\n[Aborted]\n');
          process.exit(130);
        } else if (char === '\b' || char === '\x7f') {
          // Backspace
          if (password.length > 0) {
            password = password.slice(0, -1);
            stdout.write('\b \b');
          }
        } else if (char.charCodeAt(0) >= 32) {
          // Printable characters
          password += char;
          stdout.write('*');
        }
      }
    };

    stdin.on('data', onData);
  });
};

export const initAdmin = async () => {
  let rl: readline.Interface | null = null;
  try {
    console.log('====================================================');
    console.log('       CertiVerify Administrator Setup Tool         ');
    console.log('====================================================');
    console.log('[Connecting] Establishing secure connection to database...');

    const targetDb = process.env.DB_NAME;
    const connectOptions: mongoose.ConnectOptions = targetDb ? { dbName: targetDb } : {};
    const conn = await mongoose.connect(env.MONGODB_URI, connectOptions);
    console.log(`[Connected] Connected to database: "${conn.connection.name}" on host "${conn.connection.host}"\n`);

    let adminName = process.env.ADMIN_NAME;
    let adminEmail = process.env.ADMIN_EMAIL;
    let adminPassword = process.env.ADMIN_PASSWORD;

    rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    // 1. Prompt Name
    if (!adminName) {
      adminName = await promptQuestion(rl, 'Enter Administrator Full Name (e.g. System Administrator): ');
      if (!adminName) {
        adminName = 'System Administrator';
      }
    }

    // 2. Prompt Email
    while (!adminEmail || !emailRegex.test(adminEmail)) {
      adminEmail = await promptQuestion(rl, 'Enter Administrator Email: ');
      if (!emailRegex.test(adminEmail)) {
        console.log('  [Error] Invalid email address format. Please try again.');
        adminEmail = undefined;
      }
    }
    adminEmail = adminEmail.toLowerCase().trim();

    // 3. Check for existing administrator before asking for passwords
    const existingUser = await User.findOne({ email: adminEmail });
    if (existingUser) {
      console.log('\n----------------------------------------------------');
      console.log(`[Notice] An account with email "${adminEmail}" already exists in the database.`);
      console.log(`Role:    ${existingUser.role}`);
      console.log(`Active:  ${existingUser.active}`);
      console.log('Operation aborted: Existing account was NOT modified.');
      console.log('----------------------------------------------------');
      rl.close();
      await mongoose.disconnect();
      process.exit(0);
    }

    // 4. Prompt Password
    if (!adminPassword) {
      rl.close(); // Close rl before raw-mode password input
      rl = null;

      while (!adminPassword || adminPassword.length < 6) {
        adminPassword = await promptPassword('Enter Administrator Password (min 6 characters): ');
        if (adminPassword.length < 6) {
          console.log('  [Error] Password must be at least 6 characters in length.');
          adminPassword = undefined;
          continue;
        }

        const confirmPassword = await promptPassword('Confirm Administrator Password: ');
        if (adminPassword !== confirmPassword) {
          console.log('  [Error] Passwords do not match. Please try again.');
          adminPassword = undefined;
        }
      }
    } else {
      if (rl) {
        rl.close();
        rl = null;
      }
      if (adminPassword.length < 6) {
        throw new Error('ADMIN_PASSWORD environment variable must be at least 6 characters in length.');
      }
    }

    console.log('\n[Processing] Hashing credentials with bcrypt (cost factor: 12)...');
    const passwordHash = await bcrypt.hash(adminPassword, 12);

    console.log('[Processing] Creating administrator record in database...');
    const newAdmin = await User.create({
      name: adminName,
      email: adminEmail,
      passwordHash,
      role: 'admin',
      active: true,
    });

    console.log('\n====================================================');
    console.log('   [SUCCESS] Administrator Created Successfully!    ');
    console.log('====================================================');
    console.log(`Name:   ${newAdmin.name}`);
    console.log(`Email:  ${newAdmin.email}`);
    console.log(`Role:   ${newAdmin.role}`);
    console.log(`Active: ${newAdmin.active}`);
    console.log('Status: Ready for production login.');
    console.log('====================================================\n');

    await mongoose.disconnect();
    console.log('[Disconnected] Database connection closed.');
    process.exit(0);
  } catch (error: any) {
    if (rl) rl.close();
    console.error('\n[Failure] Administrator initialization failed:', error?.message || error);
    try {
      await mongoose.disconnect();
    } catch {
      // Ignore disconnect failure on exit
    }
    process.exit(1);
  }
};

// Execute if run directly
if (process.argv[1] && process.argv[1].endsWith('initAdmin.ts')) {
  initAdmin();
}
