import nodemailer from "nodemailer";
import path from "path";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    // Configure your email transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com", // Example: Gmail
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Gmail app password
      },
    });

    // Send the email
    await transporter.sendMail({
      from: `"Easy Charts" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Book: Cooing Of A Homing Pigeon",
      text: "Thank you for your purchase! Please find your book attached.",
      attachments: [
        {
          filename: "Cooing-Of-A-Homing-Pigeon.pdf",
          path: path.join(process.cwd(), "public/books/cooing-of-a-homing-pigeon.pdf"),
        },
      ],
    });

    res.status(200).json({ message: "Book sent successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send book" });
  }
}
