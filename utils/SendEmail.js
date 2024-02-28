var nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const sendEmail = (options) => {
  var transporter = nodemailer.createTransport({
    host: "mail.gmx.com",
    port: 587,
    // port: 465,
    tls: {
      ciphers: "SSLv3",
      rejectUnauthorized: false,
    },
    debug: true,
    auth: {
      type: "login",
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
      //   pass: 'ESIVZAE5N7BP32P2247T'
      // pass: '987leena9876'
    },
  });

  var mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: options.to,
    subject: options.subject,
    html: options.html,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
module.exports = sendEmail;