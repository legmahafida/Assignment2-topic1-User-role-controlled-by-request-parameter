
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
     
            
    if (check.role === 'admin') {
        return res.render('admin'); 
    } else {
        return res.render('user'); 
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

        
        const existingUser  = await User.findOne({ name: data.name });

        if (existingUser ) {
            return res.send('name already exists. Please choose a different name.'); 
        }else{
        
            
            
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

  
  if (!cookies || !cookies.refreshToken) {
      return res.status(401).send("Unauthenticated");
  }

  const refreshToken = cookies.refreshToken;

  try {
      
      const decoded = jwt.verify(refreshToken, process.env.TOKEN_SECRET);

      
      const payload = { userId: decoded.userId, role: decoded.role };

      
      const accessToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
          expiresIn: "3m",
      });

      
      res.cookie("accessToken", accessToken, {
          httpOnly: true,
          secure: false, 
          sameSite: "Strict",
          maxAge: 3 * 60 * 1000, 
      });

      res.send("Access token refreshed successfully");
  } catch (error) {
      console.error("Error refreshing token:", error);
      return res.status(403).send("Invalid refresh token");
  }

};

export const logout = (req, res) => {
    try {
        
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