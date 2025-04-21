import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import path from 'path';

import authRoutes from './routes/authRoutes.js'; 
import userRoutes from './routes/userRoutes.js';
import { isAuthenticated } from './middlewares/authMiddleware.js'; 
import dotenv from 'dotenv'; 
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();



app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); 
app.use(express.static('public'));
app.set('view engine', 'ejs'); 
app.set('views', path.join(__dirname, 'views'));

app.use( authRoutes); 

app.use( isAuthenticated, userRoutes);


const PORT =3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});