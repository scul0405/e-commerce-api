const nodemailer = require('nodemailer');

const sendMail = async (receiveEmail, subject, message) => {
  const transport = nodemailer.createTransport({
    host: process.env.NODEMAILER_HOST,
    port: process.env.NODEMAILER_PORT,
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASSWORD,
    },
  });
  const mailOptions = {
    from: 'Food And Drink Team "foodanddrink@gmail.com"',
    to: receiveEmail,
    subject,
    text: message,
  };
  await transport.sendMail(mailOptions);
};

module.exports = sendMail;
