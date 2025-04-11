import nodemailer from "nodemailer"

export const sendEmail = async (email: string, token: string) => {
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      auth: {
        user: "bhurtsahab786521@gmail.com",
        pass: "XO6RhS9VbTmYNMcI",
      },
    });
  
    const resetURL = `${process.env.FRONTEND_URL}/reset-password/${token}`;
  
    const mailOptions = {
      from: "bhurtsahab786521@gmail.com",
      to: email,
      subject: "Password Reset Request",
      html: `<p>Click <a href="${resetURL}">here</a> to reset your password</p>`
  
    };
  
    await transporter.sendMail(mailOptions);
  };