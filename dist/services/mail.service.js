"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mailStatus = exports.sendBlogToSubscribers = exports.notifyAdminsOfLead = void 0;
const zeptomail_1 = require("zeptomail");
const config_1 = require("../config");
const isMailConfigured = Boolean(config_1.config.zeptomailToken && config_1.config.zeptomailFromEmail);
const client = isMailConfigured
    ? new zeptomail_1.SendMailClient({ url: config_1.config.zeptomailUrl, token: config_1.config.zeptomailToken })
    : null;
const escapeHtml = (value) => value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
const mapRecipients = (recipients) => recipients.map((recipient) => ({
    email_address: {
        address: recipient.email,
        name: recipient.name || recipient.email,
    },
}));
const sendMail = async (recipients, subject, htmlbody, textbody) => {
    if (!client || recipients.length === 0) {
        return { skipped: true };
    }
    return client.sendMail({
        from: {
            address: config_1.config.zeptomailFromEmail,
            name: config_1.config.zeptomailFromName,
        },
        to: mapRecipients(recipients),
        reply_to: [
            {
                address: config_1.config.zeptomailReplyToEmail,
                name: config_1.config.zeptomailFromName,
            },
        ],
        subject,
        htmlbody,
        textbody,
        track_clicks: true,
        track_opens: true,
    });
};
const notifyAdminsOfLead = async (lead) => {
    const recipients = config_1.config.zeptomailAdminRecipients.map((email) => ({ email }));
    const date = lead.createdAt ? new Date(lead.createdAt).toLocaleString() : new Date().toLocaleString();
    const safeName = escapeHtml(lead.name);
    const safeEmail = escapeHtml(lead.email);
    const safePhone = escapeHtml(lead.phone || '-');
    const safeSubject = escapeHtml(lead.subject || 'General inquiry');
    const safeMessage = escapeHtml(lead.message).replace(/\n/g, '<br />');
    const subject = `New Contact Inquiry - ${lead.name}`;
    const htmlbody = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111;">
      <h2 style="margin:0 0 12px;">New Contact Form Submission</h2>
      <p style="margin:0 0 16px;">A new lead was submitted on the Greenstone website.</p>
      <table style="border-collapse:collapse;">
        <tr><td style="padding:6px 10px 6px 0;font-weight:700;">Name:</td><td>${safeName}</td></tr>
        <tr><td style="padding:6px 10px 6px 0;font-weight:700;">Email:</td><td>${safeEmail}</td></tr>
        <tr><td style="padding:6px 10px 6px 0;font-weight:700;">Phone:</td><td>${safePhone}</td></tr>
        <tr><td style="padding:6px 10px 6px 0;font-weight:700;">Subject:</td><td>${safeSubject}</td></tr>
        <tr><td style="padding:6px 10px 6px 0;font-weight:700;">Submitted:</td><td>${escapeHtml(date)}</td></tr>
      </table>
      <div style="margin-top:16px;padding:12px;border:1px solid #ddd;border-radius:8px;background:#fafafa;">
        <div style="font-weight:700;margin-bottom:6px;">Message</div>
        <div>${safeMessage}</div>
      </div>
      <p style="margin-top:16px;font-size:12px;color:#666;">Lead ID: ${escapeHtml(lead.id)}</p>
    </div>
  `;
    const textbody = `New Contact Form Submission
Name: ${lead.name}
Email: ${lead.email}
Phone: ${lead.phone || '-'}
Subject: ${lead.subject || 'General inquiry'}
Submitted: ${date}

Message:
${lead.message}

Lead ID: ${lead.id}`;
    return sendMail(recipients, subject, htmlbody, textbody);
};
exports.notifyAdminsOfLead = notifyAdminsOfLead;
const sendBlogToSubscribers = async (blog, subscriberEmails) => {
    if (subscriberEmails.length === 0) {
        return { sent: 0, failed: 0, skipped: true };
    }
    const recipients = subscriberEmails.map((email) => ({ email }));
    const blogUrl = `${config_1.config.siteUrl.replace(/\/$/, '')}/blog/${blog.id}`;
    const safeTitle = escapeHtml(blog.title);
    const safeExcerpt = escapeHtml(blog.excerpt || '').replace(/\n/g, '<br />');
    const safeAuthor = escapeHtml(blog.author);
    const safeRole = escapeHtml(blog.role);
    const subject = `New on Greenstone Blog: ${blog.title}`;
    const htmlbody = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111;">
      <h2 style="margin:0 0 10px;">${safeTitle}</h2>
      <p style="margin:0 0 8px;color:#555;">By ${safeAuthor} - ${safeRole}</p>
      <p style="margin:0 0 16px;">${safeExcerpt}</p>
      <a href="${blogUrl}" style="display:inline-block;background:#0f8a3b;color:#fff;text-decoration:none;padding:12px 18px;border-radius:999px;font-weight:700;">
        Read Full Article
      </a>
      <p style="margin-top:16px;font-size:12px;color:#666;">You are receiving this because you subscribed to Greenstone updates.</p>
    </div>
  `;
    const textbody = `${blog.title}
By ${blog.author} - ${blog.role}

${blog.excerpt}

Read full article: ${blogUrl}

You are receiving this because you subscribed to Greenstone updates.`;
    const batchSize = 50;
    let sent = 0;
    let failed = 0;
    for (let i = 0; i < recipients.length; i += batchSize) {
        const batch = recipients.slice(i, i + batchSize);
        try {
            await sendMail(batch, subject, htmlbody, textbody);
            sent += batch.length;
        }
        catch (error) {
            failed += batch.length;
            console.error('Newsletter batch failed:', error);
        }
    }
    return { sent, failed, skipped: false };
};
exports.sendBlogToSubscribers = sendBlogToSubscribers;
exports.mailStatus = {
    enabled: isMailConfigured,
};
