import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors'
import dotenv from 'dotenv';
import { ConnectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js'

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.use(cors({
    origin: 'hppt://localhost:5173',
    credentials: true
}));

app.use('/api/auth', authRoutes);

ConnectDB();


app.listen(3000, ()=>{
    console.log('http://localhost:3000');
});