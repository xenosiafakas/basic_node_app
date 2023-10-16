const nodemailer = require('nodemailer');
const { options } = require('nodemon/lib/config');

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_NAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const emailOptions = {
    from: 'username <username@email.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html :
  };

  await transporter.sendMail(emailOptions);
};

module.exports = sendEmail;
