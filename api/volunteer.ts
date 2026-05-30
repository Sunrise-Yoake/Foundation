import { Resend } from 'resend';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { fullName, address, age, hasDisabledChildCard, phone, email } = req.body;

  if (!process.env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY is not set.");
    return res.status(500).json({ error: "Email service not configured" });
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { data, error } = await resend.emails.send({
      from: 'Fond <onboarding@resend.dev>',
      to: ['ksenyu.karaxanovoj@gmail.com'],
      subject: 'Новая анкета ВОЛОНТЕРА - "Мы как все"',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <h2 style="color: #059669; border-bottom: 2px solid #10b981; padding-bottom: 10px; margin-top: 0;">Новая анкета волонтера</h2>
          <p style="font-size: 16px; color: #334155;">На вашем сайте "Мы как все" была заполнена новая анкета волонтера.</p>
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr style="background-color: #f0fdf4;">
              <td style="padding: 10px; font-weight: bold; width: 40%; color: #047857; border: 1px solid #d1fae5;">ФИО:</td>
              <td style="padding: 10px; color: #1e293b; border: 1px solid #d1fae5;">${fullName}</td>
            </tr>
            <tr>
              <td style="padding: 10px; font-weight: bold; color: #047857; border: 1px solid #d1fae5;">Место жительства:</td>
              <td style="padding: 10px; color: #1e293b; border: 1px solid #d1fae5;">${address}</td>
            </tr>
            <tr style="background-color: #f0fdf4;">
              <td style="padding: 10px; font-weight: bold; color: #047857; border: 1px solid #d1fae5;">Возраст:</td>
              <td style="padding: 10px; color: #1e293b; border: 1px solid #d1fae5;">${age}</td>
            </tr>
            <tr>
              <td style="padding: 10px; font-weight: bold; color: #047857; border: 1px solid #d1fae5;">Имеет удостоверение ребенка-инвалида:</td>
              <td style="padding: 10px; color: #1e293b; border: 1px solid #d1fae5;">${hasDisabledChildCard ? "Да" : "Нет"}</td>
            </tr>
            <tr style="background-color: #f0fdf4;">
              <td style="padding: 10px; font-weight: bold; color: #047857; border: 1px solid #d1fae5;">Телефон:</td>
              <td style="padding: 10px; color: #1e293b; border: 1px solid #d1fae5;">${phone}</td>
            </tr>
            <tr>
              <td style="padding: 10px; font-weight: bold; color: #047857; border: 1px solid #d1fae5;">E-mail:</td>
              <td style="padding: 10px; color: #1e293b; border: 1px solid #d1fae5;">${email || 'Не указан'}</td>
            </tr>
          </table>
          <div style="margin-top: 30px; font-size: 12px; color: #64748b; text-align: center;">Мы как все · Благотворительный фонд</div>
        </div>
      `
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