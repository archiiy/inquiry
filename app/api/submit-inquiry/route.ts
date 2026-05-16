import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import nodemailer from 'nodemailer';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

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
    const aiResponse = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 1000,
      messages: [{
        role: 'user',
        content: `You are an AI inquiry assistant for AVIXR Technologies, a Chennai-based tech company.

Analyze this client inquiry and respond ONLY with a JSON object, no extra text:
{
  "priority": "High | Medium | Low",
  "priorityReason": "one sentence why",
  "keyRequirements": ["req1", "req2", "req3"],
  "routeTo": "which team should handle this",
  "autoReply": "warm 2-3 sentence personalized reply to the client addressing their SPECIFIC project details, mentioning their time slot"
}

Client: ${name}
Email: ${email}
Phone: ${phone || 'Not provided'}
Company: ${company || 'Not provided'}
Service: ${service}
Project details: ${projectDetails}
Preferred slot: ${timeSlot}`
      }]
    });

    const raw = aiResponse.content[0].type === 'text' ? aiResponse.content[0].text : '';
    const ai = JSON.parse(raw.replace(/```json|```/g, '').trim());

    // Email to AVIXR team with AI analysis
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: process.env.AVIXR_TEAM_EMAIL,
      subject: `[${ai.priority}] New Inquiry — ${service} from ${name}`,
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
            <tr><td style="padding:8px;color:#666">Priority</td><td style="padding:8px"><strong>${ai.priority}</strong> — ${ai.priorityReason}</td></tr>
            <tr style="background:#f9f9f9"><td style="padding:8px;color:#666">Route To</td><td style="padding:8px">${ai.routeTo}</td></tr>
          </table>
          <h3 style="margin-top:20px;color:#333">Project Details</h3>
          <p style="color:#555;line-height:1.6">${projectDetails}</p>
          <h3 style="color:#333">AI Extracted Requirements</h3>
          <ul>${ai.keyRequirements.map((r: string) => `<li style="color:#555;margin-bottom:4px">${r}</li>`).join('')}</ul>
        </div>
      `,
    });

    // Personalized auto-reply to client
    await transporter.sendMail({
      from: `AVIXR Technologies <${process.env.GMAIL_USER}>`,
      to: email,
      subject: `We received your inquiry — AVIXR Technologies`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
          <h2 style="color:#534AB7">AVIXR Technologies</h2>
          <p style="color:#333;line-height:1.7;font-size:15px">Hi ${name},</p>
          <p style="color:#333;line-height:1.7;font-size:15px">${ai.autoReply}</p>
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
      autoReply: ai.autoReply
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: 'Something went wrong' }, { status: 500 });
  }
}