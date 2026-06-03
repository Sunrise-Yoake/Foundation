import { Resend } from 'resend';

// Вспомогательный интерфейс для цветовых тем писем
interface ThemeColors {
  primaryColor: string;
  labelBgColor: string;
  labelTextColor: string;
  tableBorderColor: string;
}

const colorThemes: Record<'orange' | 'green', ThemeColors> = {
  orange: {
    primaryColor: '#d97706', // Оранжевый бренд-цвет
    labelBgColor: '#fffbeb', // Очень светлый оранжевый фон (amber-50)
    labelTextColor: '#b45309', // Тёмный оранжевый для текста ярлыков
    tableBorderColor: '#fde68a', // Светлая рамочка таблицы
  },
  green: {
    primaryColor: '#0f766e', // Бирюзовый/зелёный бренд-цвет
    labelBgColor: '#f0fdf4', // Светло-зеленый фон
    labelTextColor: '#115e59', // Тёмно-зеленый для текста ярлыков
    tableBorderColor: '#bbf7d0', // Светлая зелёная рамочка
  }
};

function generateEmailHTML({
  title,
  subtitle,
  fields,
  detailsTitle,
  detailsContent,
  theme = 'orange'
}: {
  title: string;
  subtitle: string;
  fields: { label: string; value: string | undefined | null }[];
  detailsTitle?: string;
  detailsContent?: string;
  theme?: 'orange' | 'green';
}): string {
  const chosenTheme = colorThemes[theme];

  const tableRows = fields
    .map(
      (f) => `
    <tr>
      <td style="padding: 14px 16px; background-color: ${chosenTheme.labelBgColor}; border: 1px solid ${chosenTheme.tableBorderColor}; color: ${chosenTheme.labelTextColor}; font-weight: bold; font-size: 14px; width: 40%; vertical-align: top; font-family: inherit;">
        ${f.label}:
      </td>
      <td style="padding: 14px 16px; background-color: #ffffff; border: 1px solid ${chosenTheme.tableBorderColor}; color: #334155; font-size: 14px; width: 60%; vertical-align: top; font-family: inherit;">
        ${f.value ? f.value.replace(/\n/g, '<br/>') : '<span style="color: #94a3b8; font-style: italic;">Не указано</span>'}
      </td>
    </tr>
  `
    )
    .join("");

  const detailsSection = (detailsTitle && detailsContent)
    ? `
    <div style="margin-top: 24px; padding: 20px; background-color: ${chosenTheme.labelBgColor}; border-left: 4px solid ${chosenTheme.primaryColor}; border-radius: 12px; border: 1px solid ${chosenTheme.tableBorderColor}; border-left-width: 4px;">
      <h3 style="margin: 0 0 10px 0; color: ${chosenTheme.labelTextColor}; font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;">
        ${detailsTitle}
      </h3>
      <p style="margin: 0; color: #1e293b; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">
        ${detailsContent}
      </p>
    </div>
  `
    : "";

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 650px; margin: 40px auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03), 0 1px 3px rgba(0, 0, 0, 0.02); border: 1px solid #e2e8f0; border-collapse: collapse;">
          <tr>
            <td style="padding: 32px 40px;">
              <!-- Главный заголовок -->
              <h1 style="margin: 0 0 12px 0; color: ${chosenTheme.primaryColor}; font-size: 24px; font-weight: 800; tracking: -0.01em;">
                ${title}
              </h1>
              
              <!-- Разделительная фирменная линия -->
              <div style="height: 2px; background-color: ${chosenTheme.primaryColor}; margin-bottom: 20px;"></div>
              
              <!-- Подзаголовок -->
              <p style="margin: 0 0 24px 0; color: #475569; font-size: 15px; line-height: 1.6;">
                ${subtitle}
              </p>
              
              <!-- Таблица с данными -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse; border: 1px solid ${chosenTheme.tableBorderColor}; border-radius: 8px; overflow: hidden;">
                ${tableRows}
              </table>
              
              ${detailsSection}
              
              <!-- Подпись -->
              <div style="margin-top: 36px; padding-top: 20px; text-align: center; font-size: 13px; color: #94a3b8;">
                Мы как все · Благотворительный фонд
              </div>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, phone, email, topic } = req.body;

  if (!process.env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY is not set.");
    return res.status(500).json({ error: "Email service not configured" });
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    const htmlContent = generateEmailHTML({
      title: 'Новое обращение (Задать вопрос)',
      subtitle: 'На вашем сайте "Мы как все" было заполнено новое обращение волонтёру.',
      fields: [
        { label: 'Имя', value: name },
        { label: 'Телефон', value: phone },
        { label: 'E-mail', value: email || 'Не указан' },
        { label: 'Тема обращения', value: topic || 'Не указана' }
      ],
      theme: 'orange'
    });

    const { data, error } = await resend.emails.send({
      from: 'Fond <onboarding@resend.dev>',
      to: ['ksenyu.karaxanovoj@gmail.com'],
      subject: `Вопрос с сайта "Мы как все" — ${name}`,
      text: `Имя: ${name}\nТелефон: ${phone}\nE-mail: ${email || "Не указан"}\nТема обращения: ${topic || "Не указана"}`,
      html: htmlContent,
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