//authMiddleware
import jwt from 'jsonwebtoken';


export const isAuthenticated =(req, res, next) => {
    const cookies = req.cookies;
    if (!cookies  || !cookies.accessToken) {
      return res.status(401).send("Unauthenticated");
    }
    const accessToken = cookies.accessToken;
    if (!accessToken) {
      return res.send("Invalid Token");
    }
  
    try {
      const decoded = jwt.verify(accessToken, process.env.TOKEN_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      return res.json(error.message);
    }
  }
  