import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

// Helper with themes matching the requested elegant card/table style
interface ThemeColors {
  primaryColor: string;
  labelBgColor: string;
  labelTextColor: string;
  tableBorderColor: string;
}

const colorThemes: Record<'orange' | 'green' | 'violet', ThemeColors> = {
  orange: {
    primaryColor: '#d97706', // Amber/orange theme
    labelBgColor: '#fffbeb', // Light amber background (amber-50)
    labelTextColor: '#b45309', // Amber-700 text
    tableBorderColor: '#fde68a', // Amber-200 border
  },
  green: {
    primaryColor: '#0f766e', // Teal-700
    labelBgColor: '#f0fdf4', // Green-50 background
    labelTextColor: '#115e59', // Teal-800 text
    tableBorderColor: '#bbf7d0', // Green-200 border
  },
  violet: {
    primaryColor: '#7c3aed', // Violet-600 theme
    labelBgColor: '#f5f3ff', // Light violet background (violet-50)
    labelTextColor: '#6d28d9', // Violet-700 text
    tableBorderColor: '#ddd6fe', // Violet-200 border
  }
};

function generateEmailHTML({
  title,
  subtitle,
  fields,
  detailsTitle,
  detailsContent,
  theme = 'violet'
}: {
  title: string;
  subtitle: string;
  fields: { label: string; value: string | undefined | null }[];
  detailsTitle?: string;
  detailsContent?: string;
  theme?: 'orange' | 'green' | 'violet';
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
              <!-- Main Title -->
              <h1 style="margin: 0 0 12px 0; color: ${chosenTheme.primaryColor}; font-size: 24px; font-weight: 800; tracking: -0.01em;">
                ${title}
              </h1>
              
              <!-- Color Divider Line -->
              <div style="height: 2px; background-color: ${chosenTheme.primaryColor}; margin-bottom: 20px;"></div>
              
              <!-- Subtitle Text -->
              <p style="margin: 0 0 24px 0; color: #475569; font-size: 15px; line-height: 1.6;">
                ${subtitle}
              </p>
              
              <!-- Bordered Clean Table -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse; border: 1px solid ${chosenTheme.tableBorderColor}; border-radius: 8px; overflow: hidden;">
                ${tableRows}
              </table>
              
              ${detailsSection}
              
              <!-- Clean Minimalist Footer -->
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

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for contact form (Задать вопрос)
  app.post("/api/contact", async (req, res) => {
    const { name, phone, email, topic } = req.body;

    if (!process.env.RESEND_API_KEY) {
      return res.status(500).json({
        error: "Email service not configured",
      });
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
        theme: 'violet'
      });

      const { data, error } = await resend.emails.send({
        from: "Fond <onboarding@resend.dev>",
        to: ["ksenyu.karaxanovoj@gmail.com"],
        subject: `Вопрос с сайта "Мы как все" — ${name}`,
        text: `Имя: ${name}\nТелефон: ${phone}\nE-mail: ${email || "Не указан"}\nТема обращения: ${topic || "Не указана"}`,
        html: htmlContent,
      });

      if (error) {
        console.error("Resend Error:", error);
        return res.status(400).json(error);
      }

      res.status(200).json({ success: true, data });
    } catch (err) {
      console.error("Internal Server Error:", err);
      res.status(500).json({
        error: "Failed to send email",
      });
    }
  });

  // API Route for help requests (Получить помощь)
  app.post("/api/help-request", async (req, res) => {
    const { parentName, phone, email, childNameAge, description } = req.body;

    if (!process.env.RESEND_API_KEY) {
      return res.status(500).json({
        error: "Email service not configured",
      });
    }

    try {
      const resend = new Resend(process.env.RESEND_API_KEY);

      const htmlContent = generateEmailHTML({
        title: 'Заявка на получение помощи',
        subtitle: 'На вашем сайте "Мы как все" была заполнена заявка на получение помощи.',
        fields: [
          { label: 'ФИО родителя/опекуна', value: parentName },
          { label: 'Телефон', value: phone },
          { label: 'E-mail', value: email || 'Не указан' },
          { label: 'Ребёнок (Имя и возраст)', value: childNameAge }
        ],
        detailsTitle: 'Описание ситуации',
        detailsContent: description,
        theme: 'violet'
      });

      const { data, error } = await resend.emails.send({
        from: "Fond <onboarding@resend.dev>",
        to: ["ksenyu.karaxanovoj@gmail.com"],
        subject: `Заявка на помощь от ${parentName} — "Мы как все"`,
        text: `ФИО родителя/опекуна: ${parentName}\nТелефон: ${phone}\nE-mail: ${email || "Не указан"}\nРебёнок (имя и возраст): ${childNameAge}\n\nОписание ситуации:\n${description}`,
        html: htmlContent,
      });

      if (error) {
        console.error("Resend Error:", error);
        return res.status(400).json(error);
      }

      res.status(200).json({ success: true, data });
    } catch (err) {
      console.error("Internal Server Error:", err);
      res.status(500).json({
        error: "Failed to send email",
      });
    }
  });

  // API Route for volunteer requests (Стать волонтером)
  app.post("/api/volunteer", async (req, res) => {
    const {
      fullName,
      address,
      age,
      hasDisabledChildCard,
      phone,
      email,
      helpDetail,
    } = req.body;

    if (!process.env.RESEND_API_KEY) {
      return res.status(500).json({
        error:
          "Сервис отправки писем не настроен (отсутствует API-ключ RESEND_API_KEY).",
      });
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
        from: "Fond <onboarding@resend.dev>",
        to: ["ksenyu.karaxanovoj@gmail.com"],
        subject: `Анкета волонтера: ${fullName} — "Мы как все"`,
        text: `ФИО: ${fullName}\nМесто жительства: ${address}\nВозраст: ${age}\nИмеет удостоверение ребёнка-инвалида: ${hasDisabledChildCard ? "Да" : "Нет"}\nТелефон: ${phone}\nE-mail: ${email || "Не указан"}\n\nЧем я могу помочь проекту:\n${helpDetail || "Не указано"}`,
        html: htmlContent,
      });

      if (error) {
        console.error("Resend Error:", error);
        return res.status(400).json(error);
      }

      res.status(200).json({ success: true, data });
    } catch (err) {
      console.error("Internal Server Error:", err);
      res.status(500).json({
        error: "Failed to send email",
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
      },
      appType: "spa",
    });

    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");

    app.use(express.static(distPath));

    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server:", error);
});