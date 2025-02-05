const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const blogRoutes = require('./routes/blog');
const subscribeRoutes = require('./routes/subscribe');
const contactRoutes = require('./routes/contact');
// const profileRoutes = require('./routes/profile');
// const commentRoutes = require('./routes/comments');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
    origin: ["https://blogwebsitefrontend.vercel.app/"],
    methods : ["POST", "GET"],
    credentials: true
}));
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/blogs', blogRoutes);
app.use('/subscribe', subscribeRoutes);
app.use('/con', contactRoutes);
// app.use('/comment', commentRoutes);
// app.use('/profile', profileRoutes);

app.listen(4000, () => {
    console.log('Server is running on port http://localhost:4000');
});
