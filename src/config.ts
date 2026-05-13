import 'dotenv/config';

const rawZeptoUrl = process.env.ZEPTOMAIL_URL || process.env.ZEPTOMAIL_DOMAIN || 'api.zeptomail.com/';

const normalizeZeptoUrl = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return 'api.zeptomail.com/';
  try {
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      const parsed = new URL(trimmed);
      return `${parsed.host}/`;
    }
  } catch {
    // Fall back to raw value cleanup.
  }
  return trimmed.replace(/^https?:\/\//, '').replace(/\/v1\.1\/email\/?$/, '/').replace(/\/+$/, '/') || 'api.zeptomail.com/';
};

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  jwtSecret: process.env.JWT_SECRET || 'greenstone-super-secret-key-change-me',
  jwtExpiresIn: '7d',
  nodeEnv: process.env.NODE_ENV || 'development',

  adminEmail: process.env.ADMIN_EMAIL || 'admin@greenstoneltd.com',
  adminPassword: process.env.ADMIN_PASSWORD || 'GreenStone@2025!',
  adminName: process.env.ADMIN_NAME || 'Greenstone Admin',
  siteUrl: process.env.SITE_URL || 'https://greenstoneng.com',
  
  zeptomailUrl: normalizeZeptoUrl(rawZeptoUrl),
  zeptomailToken: process.env.ZEPTOMAIL_TOKEN || '',
  zeptomailFromEmail: process.env.ZEPTOMAIL_FROM_EMAIL || '',
  zeptomailFromName: process.env.ZEPTOMAIL_FROM_NAME || 'Greenstone Developments',
  zeptomailReplyToEmail: process.env.ZEPTOMAIL_REPLY_TO_EMAIL || process.env.ADMIN_EMAIL || 'admin@greenstoneltd.com',
  zeptomailAdminRecipients: process.env.ZEPTOMAIL_ADMIN_RECIPIENTS
    ? process.env.ZEPTOMAIL_ADMIN_RECIPIENTS.split(',').map((entry) => entry.trim()).filter(Boolean)
    : [process.env.ADMIN_EMAIL || 'admin@greenstoneltd.com'],
};
