require('dotenv').config();

const bcrypt = require('bcrypt');
const crypto = require('crypto');
const connectDB = require('../config/db');
const User = require('../models/User');

const DEMO_EMAIL = 'demo@test.com';
const DEMO_PASSWORD = 'demo@123';

function normalizeEmail(email) {
  if (typeof email !== 'string') return '';
  return email.trim().toLowerCase();
}

async function generateUniqueUsername(base) {
  const safeBase = String(base || 'demo').toLowerCase().replace(/[^a-z0-9_]/g, '_').slice(0, 20) || 'demo';
  const candidates = [safeBase];
  for (let i = 0; i < 6; i++) {
    candidates.push(`${safeBase}_${crypto.randomBytes(2).toString('hex')}`);
  }

  for (const candidate of candidates) {
    // eslint-disable-next-line no-await-in-loop
    const exists = await User.findOne({ username: candidate });
    if (!exists) return candidate;
  }

  return `${safeBase}_${crypto.randomBytes(4).toString('hex')}`;
}

async function main() {
  await connectDB();

  const email = normalizeEmail(DEMO_EMAIL);
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  const existing = await User.findOne({ email });
  if (existing) {
    existing.password = passwordHash;
    if (!existing.username) {
      existing.username = await generateUniqueUsername('demo');
    }
    await existing.save();
    console.log(`Demo user updated: ${email} (username: ${existing.username})`);
    return;
  }

  const username = await generateUniqueUsername('demo');
  const user = new User({
    username,
    email,
    password: passwordHash,
  });

  await user.save();
  console.log(`Demo user created: ${email} (username: ${username})`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Failed to seed demo user:', err);
    process.exit(1);
  });
