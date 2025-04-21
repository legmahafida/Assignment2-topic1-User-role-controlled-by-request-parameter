//authController
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../config.js';


export const login = async (req, res) => {
    try {
        const check = await User.findOne({ name: req.body.username });
        console.log(check);
        if (!check) {
            return res.status(404).send("Invalid username or password"); 
        }
        
        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
        if (!isPasswordMatch) {
            return res.status(404).send("Invalid username or password"); 
        } else {
           
            const payload = { 
                userId: check._id,
                role: check.role,    
            };
  
            
            const accessToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
                expiresIn: "3m",
            });
          
            
            const refreshToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
                expiresIn: "7d",
            });
          
            
            res.cookie("accessToken", accessToken, {
                httpOnly: true,
                secure: false,
                sameSite: "Strict",
                maxAge: 3 * 60 * 1000, 
            });
          
           
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: "Strict",
                maxAge: 7 * 24 * 60 * 60 * 1000, 
            });

            console.log(`accessToken: ${accessToken}`);
            console.log(`refreshToken: ${refreshToken}`);
     
            // توجيه المستخدم بناءً على الدور
    if (check.role === 'admin') {
        return res.render('admin'); // توجيه إلى صفحة المسؤول
    } else {
        return res.render('user'); // توجيه إلى صفحة المستخدم
    }
            
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send("An error occurred during login"); 
    }
}


export const register = async (req, res) => {
    try {
        const data = {
            name: req.body.username,
            role: req.body.role,
            password: req.body.password
        };

        // Check if the email already exists in the database
        const existingUser  = await User.findOne({ name: data.name });

        if (existingUser ) {
            return res.send('name already exists. Please choose a different name.'); 
        }else{
        
            
            // Hash the password using bcrypt
            const saltRounds = 10; 
            const hashedPassword = await bcrypt.hash(data.password, saltRounds);
            data.password = hashedPassword; 
             
            const userdata = await User.create(data);
            console.log(userdata);
           
            return res.send('User  created successfully!'); 
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send("An error occurred while creating the user."); 
    }
    
   
};


export const refresh = (req, res) => {

const cookies = req.cookies;

  // تحقق من وجود الكوكيز
  if (!cookies || !cookies.refreshToken) {
      return res.status(401).send("Unauthenticated");
  }

  const refreshToken = cookies.refreshToken;

  try {
      // تحقق من صحة refreshToken
      const decoded = jwt.verify(refreshToken, process.env.TOKEN_SECRET);

      // إعداد الحمولة (payload) للـ Access Token الجديد
      const payload = { userId: decoded.userId, role: decoded.role };

      // إنشاء Access Token جديد
      const accessToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
          expiresIn: "3m",
      });

      // تخزين Access Token في كوكيز
      res.cookie("accessToken", accessToken, {
          httpOnly: true,
          secure: false, // تأكد من تغييرها إلى true في بيئة الإنتاج
          sameSite: "Strict",
          maxAge: 3 * 60 * 1000, // 3 دقائق
      });

      res.send("Access token refreshed successfully");
  } catch (error) {
      console.error("Error refreshing token:", error);
      return res.status(403).send("Invalid refresh token");
  }

};

export const logout = (req, res) => {
    try {
        // Clear the cookies for accessToken and refreshToken
        res.clearCookie("accessToken", {
            httpOnly: true,
            secure: false,
            sameSite: "Strict",
        });
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: false,
            sameSite: "Strict",
        });

    
    } catch (error) {
        console.error(error);
        return res.status(500).send("An error occurred during logout.");
    }
};