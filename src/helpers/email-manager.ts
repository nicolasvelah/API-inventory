import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

export interface SendEmailManagerData {
  to: string | string[];
  subject: string;
  html: string;
}

export default class EmailManager {
  private transporter: Mail;

  private static instance: EmailManager;

  constructor() {
    const PORT = 465;
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_URL,
      port: PORT,
      secure: PORT === 465, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  public static getInstance(): EmailManager {
    if (!EmailManager.instance) {
      EmailManager.instance = new EmailManager();
    }
    return EmailManager.instance;
  }

  async sendEmail(data: SendEmailManagerData): Promise<any> {
    const mailOptions = {
      from: '"Bojuan 👻"  <bjuanacio@pas-hq.com>',
      to: data.to,
      subject: data.subject,
      html: data.html
    };
    return this.transporter.sendMail(mailOptions);
  }
}
