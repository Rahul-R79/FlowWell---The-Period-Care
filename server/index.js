import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors'
import dotenv from 'dotenv';
import { ConnectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import userRoutes from './routes/userRoutes.js'
import passport from './config/passport.js';

dotenv.config();
const app = express();
ConnectDB();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.use(cors({
    origin: [
        'http://localhost:5173',           
        'https://your-ngrok-url.ngrok-free.app' 
    ],
    credentials: true
}));

app.use(passport.initialize());

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);

app.listen(3000, ()=>{
    console.log('http://localhost:3000');
});