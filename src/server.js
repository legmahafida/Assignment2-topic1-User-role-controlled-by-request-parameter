import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import path from 'path';

import authRoutes from './routes/authRoutes.js'; // تأكد من المسار الصحيح
import userRoutes from './routes/userRoutes.js'; // تأكد من أن الاسم مطابق
import { isAuthenticated } from './middlewares/authMiddleware.js'; // تأكد من المسار الصحيح
import dotenv from 'dotenv'; 
import { fileURLToPath } from 'url';

// الحصول على مسار الدليل الحالي
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// تحميل المتغيرات البيئية من ملف .env في مجلد src
dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();


// Middleware
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); // لتحليل بيانات النماذج
app.use(cookieParser()); // لتحليل الكوكيز
app.use(express.static('public'));
app.set('view engine', 'ejs'); // إذا كنت تستخدم EJS
app.set('views', path.join(__dirname, 'views'));
// مسارات المستخدم مع Middleware للتحقق من المصادقة
app.use( authRoutes); // مسارات المصادقةa

app.use( isAuthenticated, userRoutes);

// بدء الخادم
const PORT =3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});