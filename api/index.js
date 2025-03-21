import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.routes.js';
import authRoutes from './routes/auth.route.js';
import cookieParser from 'cookie-parser';
import postRoutes from  './routes/post.route.js';
import commentRoutes from './routes/comment.route.js';
import cors from 'cors';
import uploadRoutes from './routes/upload.js';
import path from 'path';
dotenv.config();

// Correctly format the MongoDB connection string and call mongoose.connect
mongoose.connect(process.env.MONGO)
    .then(() => {
        console.log('Connected to MongoDB successfully');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error.message);
    });

const app = express();
const __dirname=path.resolve();
app.use(express.json());
app.use(cookieParser());
app.use(express.json({ limit: "50mb" })); // Increase JSON payload limit
app.use(express.urlencoded({ limit: "50mb", extended: true })); // Increase form data limit
app.use(
  cors({
      origin: ["http://localhost:5173", "https://mern-blog-2-w88t.onrender.com"],
      credentials: true,
  })
);




  
  app.use((req, res, next) => {
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
    res.setHeader("Cross-Origin-Embedder-Policy", "unsafe-none");
    next();
  });

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/post',postRoutes);
app.use('/api/comment',commentRoutes);
app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
  });
  
app.use('/api/upload', uploadRoutes);
// Corrected error-handling middleware syntax
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    });
});
