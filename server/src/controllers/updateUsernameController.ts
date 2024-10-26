import { Request, Response } from "express";
import { updateUser, getUserByUsername, getUserDataByTelegram } from "../services/userServices";


export const updateUsername = async (req: Request, res: Response) => {
  const userId = req.session.userId; // Get userId from session
  const { username, firstname } = req.body;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized access" });
  }

  if (!username || !firstname) {
    return res.status(400).json({ error: "Username and First Name are required" });
  }

  try {
    // Check if the username already exists
    const existingUser = await getUserByUsername(username);

    if (existingUser) {
      return res.status(400).json({ error: "Username is taken" });
    }

    // Get user by telegram id.
    const user = await getUserDataByTelegram(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await updateUser(userId, { username, firstname });

    // Respond with a status to the frontend
    res.status(200).json({ status: "userupdated", userId });
  } catch (error) {
    console.error("Error updating username:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


