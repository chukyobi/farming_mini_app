import { Request, Response } from "express";
import { getUserDataByTelegram, updateUserLastLogin } from "../services/userServices";
import User from "../models/userModel";

export const welcomeUser = async (req: Request, res: Response) => {
  try {
    const userId = req.session.userId as string;
    

    if (!userId) {
      return res.status(400).json({ error: "User session not found" });
    }

    const user: User | null = await getUserDataByTelegram(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the user is new
    const isNewUser = user.lastLogin === null || user.dateCreated.getTime() === user.lastLogin.getTime();


    // Update last login time
    await updateUserLastLogin(userId);

    // Extract relevant user data for response
    const { firstname, username, farmedPoints, profileImage, referralLink, dateCreated, lastLogin } = user;

    // Prepare response data
    const userData = {
      userId,
      firstname,
      username,
      farmedPoints,
      profileImage,
      referralLink,
      dateCreated,
      lastLogin,
      isNewUser,
    };

    // Return response with user data
    return res.json({ userData });

  } catch (error) {
    console.error("Error fetching user data:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

