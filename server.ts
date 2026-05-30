import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for contact form
  app.post("/api/contact", async (req, res) => {
    const { name, phone, email } = req.body;

    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not set.");
      return res.status(500).json({ error: "Email service not configured" });
    }

    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const { data, error } = await resend.emails.send({
        from: 'Fond <onboarding@resend.dev>', // Resend default for unverified domains
        to: ['ksenyu.karaxanovoj@gmail.com'],
        subject: 'Новая заявка с сайта "Мы как все"',
        text: `имя: ${name}\nконтактные данные\nпочта: ${email}\nтелефон: ${phone}`,
      });

      if (error) {
        console.error("Resend Error:", error);
        return res.status(400).json(error);
      }

      res.status(200).json({ success: true, data });
    } catch (err) {
      console.error("Internal Server Error:", err);
      res.status(500).json({ error: "Failed to send email" });
    }
  });

  // API Route for help requests
  app.post("/api/help-request", async (req, res) => {
    const { parentName, phone, email, childNameAge, description } = req.body;

    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not set.");
      return res.status(500).json({ error: "Email service not configured" });
    }

    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const { data, error } = await resend.emails.send({
        from: 'Fond <onboarding@resend.dev>', // Resend default for unverified domains
        to: ['ksenyu.karaxanovoj@gmail.com'],
        subject: 'Новая заявка на ПОЛУЧЕНИЕ ПОМОЩИ - "Мы как все"',
        text: `ФИО родителя/опекуна: ${parentName}\nТелефон: ${phone}\nE-mail: ${email}\nРебенок (имя и возраст): ${childNameAge}\n\nОписание ситуации и нужной помощи:\n${description}`,
      });

      if (error) {
        console.error("Resend Error:", error);
        return res.status(400).json(error);
      }

      res.status(200).json({ success: true, data });
    } catch (err) {
      console.error("Internal Server Error:", err);
      res.status(500).json({ error: "Failed to send email" });
    }
  });

  // API Route for volunteer requests
  app.post("/api/volunteer", async (req, res) => {
    const { fullName, address, age, hasDisabledChildCard, phone, email } = req.body;

    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not set.");
      return res.status(500).json({ error: "Сервис отправки писем не настроен (отсутствует API-ключ RESEND_API_KEY)." });
    }

    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const { data, error } = await resend.emails.send({
        from: 'Fond <onboarding@resend.dev>',
        to: ['ksenyu.karaxanovoj@gmail.com'],
        subject: 'Новая анкета ВОЛОНТЕРА - "Мы как все"',
        text: `ФИО: ${fullName}\nМесто жительства: ${address}\nВозраст: ${age}\nИмеет удостоверение ребенка-инвалида: ${hasDisabledChildCard ? "Да" : "Нет"}\nТелефон: ${phone}\nE-mail: ${email || 'Не указан'}`,
      });

      if (error) {
        console.error("Resend Error:", error);
        return res.status(400).json(error);
      }

      res.status(200).json({ success: true, data });
    } catch (err) {
      console.error("Internal Server Error:", err);
      res.status(500).json({ error: "Failed to send email" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }
}

startServer();
