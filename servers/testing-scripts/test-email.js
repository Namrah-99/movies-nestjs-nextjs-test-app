const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com', // Replace with your SMTP server
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: 'namrahsaeed2@gmail.com', // Replace with your email
    pass: 'jyth uypx lezf ibjw', // Replace with your email password
  },
  tls: {
    rejectUnauthorized: false,
  },
  logger: true,
  debug: true,
});

transporter.sendMail(
  {
    from: '"Namrah" <namrahsaeed2@gmail.com>', // Replace with your email
    to: 'namrahsaeed2@gmail.com', // Replace with recipient's email
    subject: 'Test Email',
    text: 'Hello world?',
    html: '<b>Hello world?</b>',
  },
  (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
  },
);
