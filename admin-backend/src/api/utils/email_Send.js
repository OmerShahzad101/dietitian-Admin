// const sgMail = require('@sendgrid/mail');

// sgMail.setApiKey('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');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    // host: "smtp.gmail.email",
    port: 465,
    secure: true, // true for 465, false for other ports
    
    auth: {
        user:  'healthiwealthi4@gmail.com',
        pass: 'qwerty@123'
    },
});

exports.SendEmail = (to, subject, html) => {
    try {
        const mailOptions = {
            from: 'healthiwealthi4@gmail.com',
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