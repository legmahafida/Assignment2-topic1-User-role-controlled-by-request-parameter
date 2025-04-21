import express from "express";
import path from 'path';
import bodyParser from "body-parser"; 
import cookieParser from "cookie-parser"; 
import { fileURLToPath } from 'url';
const app = express();
const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser()); 
app.set('view engine', 'ejs'); 
app.set('views', path.join(__dirname, 'views'));
const users = {
    abir: { password: "123", role: "user" },
    hafida: { password: "456", role: "admin" },
};

router.get('/', (req, res) => {
    res.render("home");
});

router.get('/login', (req, res) => {
    res.render("login");
});


router.post('/login', (req, res) => {
    const { username, password } = req.body;

    
    if (users[username] && users[username].password === password) {
        
        res.cookie('role', users[username].role, { httpOnly: true });
        return res.send(`Welcome ${username}! Your role is ${users[username].role}. <a href="/dashboard">Go to Dashboard</a>`);
    } else {
        return res.status(401).send('Invalid username or password.');
    }
});


router.get('/dashboard', (req, res) => {
    const role = req.cookies.role; 
    
    if (role === 'admin') {
        return res.send('<h1>Welcome to the Admin Dashboard</h1>');
    } else if (role === 'user') {
        return res.send('<h1>Welcome to the User Dashboard</h1>');
    } else {
        return res.status(403).send('Access Denied. Please log in.');
    }
});


app.use('/', router);


const PORT = 2000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});