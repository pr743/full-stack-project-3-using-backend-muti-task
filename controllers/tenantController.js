import Tenant from "../models/Tenant.js";
import User from "../models/User.js";

export const createTenant = async (req, res) => {
  try {

    const { name,description } = req.body;

    const userId = req.user._id;

    
    const tenant = await Tenant.create({
      name,
      description,
      owner: userId,
      members: [userId]
    });

    const user = await User.findById(userId);

    user.role = "admin";
    user.tenant = tenant._id;

    await user.save();

    res.status(201).json({
      message: "tenant created successfully",
      tenant
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};