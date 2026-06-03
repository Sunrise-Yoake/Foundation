import { Resend } from 'resend';

// Настройки тем оформления для писем (соответствуют дизайну карточек и таблиц на сайте)
interface ThemeColors {
  primaryColor: string;
  labelBgColor: string;
  labelTextColor: string;
  tableBorderColor: string;
}

const colorThemes: Record<'orange' | 'green', ThemeColors> = {
  orange: {
    primaryColor: '#d97706', // Оранжево-янтарный стиль
    labelBgColor: '#fffbeb', // Светло-оранжевая подложка (amber-50)
    labelTextColor: '#b45309', // Текст (amber-700)
    tableBorderColor: '#fde68a', // Рамка (amber-200)
  },
  green: {
    primaryColor: '#0f766e', // Бирюзово-зеленый стиль
    labelBgColor: '#f0fdf4', // Светло-зеленая подложка (green-50)
    labelTextColor: '#115e59', // Текст (teal-800)
    tableBorderColor: '#bbf7d0', // Рамка (green-200)
  }
};

// Функция генерации красивого HTML-письма
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
              <!-- Основной Заголовок -->
              <h1 style="margin: 0 0 12px 0; color: ${chosenTheme.primaryColor}; font-size: 24px; font-weight: 800; tracking: -0.01em;">
                ${title}
              </h1>
              
              <!-- Разделительная полоска -->
              <div style="height: 2px; background-color: ${chosenTheme.primaryColor}; margin-bottom: 20px;"></div>
              
              <!-- Подзаголовок -->
              <p style="margin: 0 0 24px 0; color: #475569; font-size: 15px; line-height: 1.6;">
                ${subtitle}
              </p>
              
              <!-- Таблица с полями формы -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse; border: 1px solid ${chosenTheme.tableBorderColor}; border-radius: 8px; overflow: hidden;">
                ${tableRows}
              </table>
              
              ${detailsSection}
              
              <!-- Футер письма -->
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

  const { fullName, address, age, hasDisabledChildCard, phone, email, helpDetail } = req.body;

  if (!process.env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY is not set.");
    return res.status(500).json({ error: "Email service not configured" });
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    const htmlContent = generateEmailHTML({
      title: 'Новая анкета волонтера',
      subtitle: 'На вашем сайте "Мы как все" была заполнена новая анкета волонтера.',
      fields: [
        { label: 'ФИО волонтера', value: fullName },
        { label: 'Место жительства', value: address },
        { label: 'Возраст', value: age },
        { label: 'Есть удостоверение ребенка-инвалида?', value: hasDisabledChildCard ? "Да" : "Нет" },
        { label: 'Телефон', value: phone },
        { label: 'E-mail', value: email || 'Не указан' }
      ],
      detailsTitle: 'Чем я могу помочь проекту',
      detailsContent: helpDetail || 'Не указано',
      theme: 'green'
    });

    const { data, error } = await resend.emails.send({
      from: 'Fond <onboarding@resend.dev>',
      to: ['ksenyu.karaxanovoj@gmail.com'],
      subject: 'Новая анкета волонтера - "Мы как все"',
      text: `ФИО волонтера: ${fullName}\nМесто жительства: ${address}\nВозраст: ${age}\nЕсть удостоверение ребенка-инвалида?: ${hasDisabledChildCard ? "Да" : "Нет"}\nТелефон: ${phone}\nE-mail: ${email || "Не указан"}\n\nЧем я могу помочь проекту:\n${helpDetail || "Не указано"}`,
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