import Notification from "../models/Notification.js";

export const getNotifications = async (req, res) => {
  try {
    const notification = await Notification.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      notification,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const markNotificationRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found",
      });
    }

    notification.read = true;

    await notification.save();

    res.json({
      message: "Notification marked as read",
      notification,

    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
