const express = require('express');
const nodemailer = require('nodemailer');
const Subscriber = require('../models/Subscriber');
const router = express.Router();

// Subscribe Route
router.post('/', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;

    let saved;
    try {
        saved = await Subscriber.findOneAndUpdate(
            { email },
            { $set: { status: 'subscribed' } },
            { upsert: true, new: true }
        );
    } catch (err) {
        console.error('Failed to save subscriber:', err);
        return res.status(500).json({ success: false, message: 'Failed to save subscription' });
    }

    // Email isn't configured: accept subscription (stored in DB) and return success.
    if (!user || !pass) {
        return res.status(200).json({
            success: true,
            message: 'Subscribed successfully. Email confirmation is not configured on the server yet.',
            id: saved._id,
        });
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

    try {
        const info = await transporter.sendMail(mailOptions);
        return res.status(200).json({
            success: true,
            message: 'Subscribed successfully. Confirmation email sent.',
            id: saved._id,
            transport: info?.response,
        });
    } catch (error) {
        console.error('Error sending subscription email:', error);
        await Subscriber.findByIdAndUpdate(saved._id, {
            status: 'email_failed',
            meta: { error: String(error?.message || error) },
        });
        return res.status(200).json({
            success: true,
            message: 'Subscribed successfully. Email delivery failed on the server.',
            id: saved._id,
        });
    }
});

module.exports = router;
