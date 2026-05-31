import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for contact form
  app.post("/api/contact", async (req, res) => {
    const { name, phone, email } = req.body;

    if (!process.env.RESEND_API_KEY) {
      return res.status(500).json({
        error: "Email service not configured",
      });
    }

    try {
      const resend = new Resend(process.env.RESEND_API_KEY);

      const { data, error } = await resend.emails.send({
        from: "Fond <onboarding@resend.dev>",
        to: ["ksenyu.karaxanovoj@gmail.com"],
        subject: 'Новая заявка с сайта "Мы как все"',
        text: `Имя: ${name}
Телефон: ${phone}
E-mail: ${email}`,
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

  // API Route for help requests
  app.post("/api/help-request", async (req, res) => {
    const { parentName, phone, email, childNameAge, description } = req.body;

    if (!process.env.RESEND_API_KEY) {
      return res.status(500).json({
        error: "Email service not configured",
      });
    }

    try {
      const resend = new Resend(process.env.RESEND_API_KEY);

      const { data, error } = await resend.emails.send({
        from: "Fond <onboarding@resend.dev>",
        to: ["ksenyu.karaxanovoj@gmail.com"],
        subject: 'Новая заявка на ПОЛУЧЕНИЕ ПОМОЩИ - "Мы как все"',
        text: `ФИО родителя/опекуна: ${parentName}
Телефон: ${phone}
E-mail: ${email}
Ребёнок (имя и возраст): ${childNameAge}

Описание ситуации:
${description}`,
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

  // API Route for volunteer requests
  app.post("/api/volunteer", async (req, res) => {
    const {
      fullName,
      address,
      age,
      hasDisabledChildCard,
      phone,
      email,
    } = req.body;

    if (!process.env.RESEND_API_KEY) {
      return res.status(500).json({
        error:
          "Сервис отправки писем не настроен (отсутствует API-ключ RESEND_API_KEY).",
      });
    }

    try {
      const resend = new Resend(process.env.RESEND_API_KEY);

      const { data, error } = await resend.emails.send({
        from: "Fond <onboarding@resend.dev>",
        to: ["ksenyu.karaxanovoj@gmail.com"],
        subject: 'Новая анкета ВОЛОНТЕРА - "Мы как все"',
        text: `ФИО: ${fullName}
Место жительства: ${address}
Возраст: ${age}
Имеет удостоверение ребёнка-инвалида: ${
          hasDisabledChildCard ? "Да" : "Нет"
        }
Телефон: ${phone}
E-mail: ${email || "Не указан"}`,
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