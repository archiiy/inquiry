import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, phone, company, service, projectDetails, timeSlot } = body;

  try {
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: process.env.AVIXR_TEAM_EMAIL,
      subject: `New Inquiry — ${service} from ${name}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
          <h2 style="color:#534AB7">New Client Inquiry — AVIXR</h2>
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:8px;color:#666;width:140px">Name</td><td style="padding:8px;font-weight:500">${name}</td></tr>
            <tr style="background:#f9f9f9"><td style="padding:8px;color:#666">Email</td><td style="padding:8px">${email}</td></tr>
            <tr><td style="padding:8px;color:#666">Phone</td><td style="padding:8px">${phone || '—'}</td></tr>
            <tr style="background:#f9f9f9"><td style="padding:8px;color:#666">Company</td><td style="padding:8px">${company || '—'}</td></tr>
            <tr><td style="padding:8px;color:#666">Service</td><td style="padding:8px"><strong>${service}</strong></td></tr>
            <tr style="background:#f9f9f9"><td style="padding:8px;color:#666">Preferred Slot</td><td style="padding:8px">${timeSlot}</td></tr>
          </table>
          <h3 style="margin-top:20px;color:#333">Project Details</h3>
          <p style="color:#555;line-height:1.6">${projectDetails}</p>
        </div>
      `,
    });

    await transporter.sendMail({
      from: `AVIXR Technologies <${process.env.GMAIL_USER}>`,
      to: email,
      subject: `We received your inquiry — AVIXR Technologies`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
          <h2 style="color:#534AB7">AVIXR Technologies</h2>
          <p style="color:#333;line-height:1.7;font-size:15px">Hi ${name},</p>
          <p style="color:#333;line-height:1.7;font-size:15px">Thank you for reaching out to AVIXR Technologies! We have received your inquiry regarding <strong>${service}</strong> and our team is reviewing your requirements.</p>
          <p style="color:#333;line-height:1.7;font-size:15px">We will get in touch with you shortly at your preferred time slot — <strong>${timeSlot}</strong>.</p>
          <div style="background:#f5f5f5;padding:16px;border-radius:8px;margin:20px 0">
            <p style="margin:0;color:#666;font-size:13px;margin-bottom:8px">Your inquiry summary</p>
            <p style="margin:4px 0;font-size:14px"><strong>Service:</strong> ${service}</p>
            <p style="margin:4px 0;font-size:14px"><strong>Consultation slot:</strong> ${timeSlot}</p>
            <p style="margin:4px 0;font-size:14px"><strong>Company:</strong> ${company || '—'}</p>
          </div>
          <p style="color:#888;font-size:13px">AVIXR Technologies, Chennai<br>contact@avixr.in</p>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      autoReply: `Hi ${name}, thank you for reaching out! We've received your inquiry regarding ${service} and will connect with you at your preferred slot — ${timeSlot}. See you soon!`
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: 'Something went wrong' }, { status: 500 });
  }
}
