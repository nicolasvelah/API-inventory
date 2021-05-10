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
    const options = {
      //host: process.env.SMTP_URL,
      host: 'smtp.gmail.com', // For tests
      port: PORT,
      secure: PORT === 465, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    };
    this.transporter = nodemailer.createTransport(options);
  }

  public static getInstance(): EmailManager {
    if (!EmailManager.instance) {
      EmailManager.instance = new EmailManager();
    }
    return EmailManager.instance;
  }

  async sendEmail(data: SendEmailManagerData): Promise<any> {
    try {
      const mailOptions = {
        from: process.env.SMTP_USER,
        to: data.to,
        subject: data.subject,
        html: data.html,
      };
      return this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.log('Error en sendEmail:', error.message);
      return null;
    }
  }
}
