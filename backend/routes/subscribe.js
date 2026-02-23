const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

// Subscribe Route
router.post('/', async (req, res) => {
    const { email } = req.body;

    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;
    if (!user || !pass) {
        return res.status(500).json({ success: false, message: 'Email service is not configured' });
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user,
            pass
        }
    });

    const mailOptions = {
        from: user,
        to: email,
        subject: 'Subscription Confirmation',
        text: 'Thank you for subscribing to our blog!'
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).json({ success: false, message: 'Failed to send email' });
        }
        res.status(200).json({ success: true, message: 'Email sent: ' + info.response });
    });
});

module.exports = router;
