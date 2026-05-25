import { Resend } from 'resend';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, phone, email } = req.body;

  if (!process.env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY is not set.");
    return res.status(550).json({ error: "Email service not configured" });
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { data, error } = await resend.emails.send({
      from: 'Fond <onboarding@resend.dev>',
      to: ['ksenyu.karaxanovoj@gmail.com'],
      subject: 'Новая заявка с сайта "Мы как все"',
      text: `имя: ${name}\nконтактные данные\nпочта: ${email}\nтелефон: ${phone}`,
    });

    if (error) {
      console.error("Resend Error:", error);
      return res.status(400).json(error);
    }

    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("Internal Server Error:", err);
    return res.status(500).json({ error: "Failed to send email" });
  }
}