
import User from '../config.js'; 


export const getUser  = async (req, res) => {
    try {
        const userId = req.user.userId; 
        const user = await User.findById(userId).select('-password'); 

        if (!user) {
            return res.status(404).send("User  not found");
        }

        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred while fetching user");
    }
};


export const getAdmin = async (req, res) => {
    try {
        const userId = req.user.userId; 
        const user = await User.findById(userId).select('-password'); 

        if (!user || user.role !== 'admin') {
            return res.status(403).send("Access denied. You are not an admin.");
        }

        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred while fetching admin data");
    }
};

export const getHome = (req, res) => {
    res.status(200).send("Welcome to the home page!");
};