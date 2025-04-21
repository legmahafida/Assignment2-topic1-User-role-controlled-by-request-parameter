import express from "express";
import path from 'path';
import bodyParser from "body-parser"; // استيراد body-parser لتحليل بيانات الطلب
import cookieParser from "cookie-parser"; // استيراد cookie-parser لإدارة الكوكيز
import { fileURLToPath } from 'url';
const app = express();
const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// إعداد body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser()); // استخدام cookie-parser
app.set('view engine', 'ejs'); // إذا كنت تستخدم EJS
app.set('views', path.join(__dirname, 'views'));
const users = {
    abir: { password: "123", role: "user" },
    hafida: { password: "456", role: "admin" },
};
// صفحة تسجيل الدخول
router.get('/', (req, res) => {
    res.render("home");
});
// صفحة تسجيل الدخول
router.get('/login', (req, res) => {
    res.render("login");
});

// معالجة تسجيل الدخول
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    // التحقق من اسم المستخدم وكلمة المرور
    if (users[username] && users[username].password === password) {
        // تعيين الكوكي مع دور المستخدم
        res.cookie('role', users[username].role, { httpOnly: true });
        return res.send(`Welcome ${username}! Your role is ${users[username].role}. <a href="/dashboard">Go to Dashboard</a>`);
    } else {
        return res.status(401).send('Invalid username or password.');
    }
});

// صفحة لوحة التحكم
router.get('/dashboard', (req, res) => {
    const role = req.cookies.role; // قراءة الكوكي
    
    if (role === 'admin') {
        return res.send('<h1>Welcome to the Admin Dashboard</h1>');
    } else if (role === 'user') {
        return res.send('<h1>Welcome to the User Dashboard</h1>');
    } else {
        return res.status(403).send('Access Denied. Please log in.');
    }
});

// إضافة المسار إلى التطبيق
app.use('/', router);

// بدء تشغيل الخادم
const PORT = 2000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});