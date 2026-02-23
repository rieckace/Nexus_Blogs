const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

// Contact Route
router.post('/contact', async (req, res) => {
    const { name, email, message } = req.body;

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
        subject: `Contact Form Submission from ${name}`,
        text: message
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).json({ success: false, message: 'Failed to send message' });
        }
        res.status(200).json({ success: true, message: 'Message sent: ' + info.response });
    });
});



module.exports = router;
