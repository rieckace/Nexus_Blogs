const express = require('express');
const nodemailer = require('nodemailer');
const ContactMessage = require('../models/ContactMessage');
const router = express.Router();

// Contact Route
router.post('/contact', async (req, res) => {
    const { name, email, message, subject } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ success: false, message: 'Name, email, and message are required' });
    }

    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;

    let saved;
    try {
        saved = await ContactMessage.create({
            name,
            email,
            subject: subject || '',
            message,
            status: 'received',
        });
    } catch (err) {
        console.error('Failed to save contact message:', err);
        return res.status(500).json({ success: false, message: 'Failed to save message' });
    }

    // Email isn't configured: accept message (stored in DB) and return success.
    if (!user || !pass) {
        return res.status(200).json({
            success: true,
            message: 'Message received. Email sending is not configured on the server yet.',
            id: saved._id,
        });
    }

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user,
                pass
            }
        });

        const mailOptions = {
            from: user,
            to: user,
            replyTo: email,
            subject: `Contact Form: ${subject || 'New message'} (from ${name})`,
            text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject || ''}\n\n${message}`
        };

        const info = await transporter.sendMail(mailOptions);
        await ContactMessage.findByIdAndUpdate(saved._id, { status: 'emailed' });
        return res.status(200).json({
            success: true,
            message: 'Message received and emailed successfully.',
            id: saved._id,
            transport: info?.response,
        });
    } catch (error) {
        console.error('Error sending contact email:', error);
        await ContactMessage.findByIdAndUpdate(saved._id, {
            status: 'email_failed',
            meta: { error: String(error?.message || error) },
        });
        return res.status(200).json({
            success: true,
            message: 'Message received. Email delivery failed on the server.',
            id: saved._id,
        });
    }
});



module.exports = router;
