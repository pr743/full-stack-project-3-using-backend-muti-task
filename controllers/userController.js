import User from "../models/User.js"
import bcrypt from "bcryptjs";



export const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);


        user.name = req.body.name || user.name;

        await user.save();

        res.json({
            message: "Profile updated",
            user,
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });

    }
};


export const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        const user = await User.findById(req.user._id);

        const isMath = await bcrypt.compare(oldPassword, user.password);

        if (!isMath) {
            return res.status(400).json({
                message: "Old password incorrect",
            });
        }
        user.password = await bcrypt.hash(newPassword, 10);

        res.json({
            message: "Password updated",
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });


    }
}