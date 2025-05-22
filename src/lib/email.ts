import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendContactEmail = async ({
  name,
  email,
  subject,
  message,
}: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) => {
  // Email to admin
  const adminMailOptions = {
    from: `"zFts Contact" <${process.env.SMTP_USER}>`,
    to: process.env.CONTACT_EMAIL,
    subject: `zFts Contact: ${subject}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>From:</strong> ${name} (${email})</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
    `,
  };

  // Copy to sender
  const senderMailOptions = {
    from: `"zFts Contact" <${process.env.SMTP_USER}>`,
    to: email,
    subject: `Thank you for contacting Thanatcha Saleekongchai`,
    html: `
      <h2>Thank you for your message!</h2>
      <p>Dear ${name},</p>
      <p>I have received your message and will get back to you as soon as possible.</p>
      <p>Here's a copy of your message:</p>
      <hr>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
      <hr>
      <p>Best regards,<br>Thanatcha Saleekongchai</p>
    `,
  };

  try {
    await transporter.sendMail(adminMailOptions);
    await transporter.sendMail(senderMailOptions);
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: 'Failed to send email' };
  }
};
