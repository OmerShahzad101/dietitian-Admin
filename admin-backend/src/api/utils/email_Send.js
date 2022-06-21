const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
        user: 'eebadali04@gmail.com',
        pass: 'jaocpzvzfphromgu'
    }

});

exports.SendEmail = (to, subject, html) => {
    try {
        const mailOptions = {
            from: 'eebadali04@gmail.com',
            to,
            subject,
            html,
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
            } else {
                console.log(`Email sent: ${info.response}`);
            }
        });

    } catch (error) {
        console.log(error);
    }
};