import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const { name, email, subject, message } = await req.json();

    // 1. Create the transporter using your .env credentials
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // alexwatson6001@gmail.com
        pass: process.env.EMAIL_PASS, // hytgcgstlvpehoix
      },
    });

    // 2. Setup email data
    const mailOptions = {
      from: `"${name}" <${email}>`, // Customer's name and email
      to: process.env.EMAIL_TO, // muhammadamanullah6001@gmail.com
      subject: `Halal Grocery Contact: ${subject}`,
      html: `
        <div style="font-family: sans-serif; padding: 30px; border: 1px solid #f0f0f0; border-radius: 10px;">
          <h2 style="color: #ea580c;">New Inquiry from Halal Grocery</h2>
          <p><strong>Customer Name:</strong> ${name}</p>
          <p><strong>Customer Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p><strong>Message:</strong></p>
          <p style="background: #f9f9f9; padding: 15px; border-radius: 5px;">${message}</p>
        </div>
      `,
    };

    // 3. Send the email
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: "Email sent successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Nodemailer error:", error);
    return NextResponse.json(
      { message: "Failed to send email." },
      { status: 500 }
    );
  }
}
