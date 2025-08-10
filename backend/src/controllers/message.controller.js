import User from "../models/user.model.js";
import Message from "../models/message.model.js";

import cloudinary from "../lib/cloudinary.js";
import { io } from "../lib/socket.js";
import { getReceiverSocketId } from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id; // Assuming req.user is populated by protectRoute middleware
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsersForSidebar:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { userId: userToChatId } = req.params; // Get the user ID from the request parameters
    const myId = req.user._id; // Get the sender ID from the authenticated user

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });
    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages: controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { userId: receiverId } = req.params; // Get the user ID from the request parameters
    const senderId = req.user._id;

    console.log("sendMessage called with:", {
      text,
      image,
      receiverId,
      senderId,
    });

    // Validate that we have either text or image
    if (!text && !image) {
      return res
        .status(400)
        .json({ error: "Message must contain text or image" });
    }

    // Check if receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ error: "Receiver not found" });
    }

    let imageUrl;

    if (image) {
      //Upload base64 image to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text: text || "",
      image: imageUrl,
    });

    console.log("Saving message:", newMessage);
    await newMessage.save();

    // Real-time functionality with socket.io
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      // Emit to the receiver
      io.to(receiverSocketId).emit("newMessage", { newMessage });

      // Also emit to the sender for immediate UI update
      const senderSocketId = getReceiverSocketId(senderId);
      if (senderSocketId) {
        io.to(senderSocketId).emit("newMessage", { newMessage });
      }
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage: controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
