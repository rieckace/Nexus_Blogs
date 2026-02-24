const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const blogRoutes = require('./routes/blog');
const subscribeRoutes = require('./routes/subscribe');
const contactRoutes = require('./routes/contact');
const profileRoutes = require('./routes/profile');
// const commentRoutes = require('./routes/comments');

const PORT = process.env.PORT || 4000;
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
const allowedOrigins = [
    process.env.CLIENT_URL,
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
    'http://127.0.0.1:5173',
    'https://blogwebsitefrontend.vercel.app',
].filter(Boolean);

function normalizeOrigin(origin) {
    if (!origin) return origin;
    return origin.endsWith('/') ? origin.slice(0, -1) : origin;
}

const allowedOriginSet = new Set(allowedOrigins.map(normalizeOrigin));

app.use(
    cors({
        origin(origin, callback) {
            // allow non-browser requests (like curl/postman)
            if (!origin) return callback(null, true);

            const normalized = normalizeOrigin(origin);
            // Dev convenience: CRA/Vite may run on different ports; allow localhost/127.* origins.
            if (/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(normalized)) {
                return callback(null, true);
            }
            if (allowedOriginSet.has(normalized)) return callback(null, true);
            return callback(new Error(`CORS blocked for origin: ${origin}`));
        },
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        credentials: true,
    })
);
app.use(cookieParser());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/blogs', blogRoutes);
app.use('/subscribe', subscribeRoutes);
app.use('/con', contactRoutes);
// app.use('/comment', commentRoutes);
app.use('/profile', profileRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
