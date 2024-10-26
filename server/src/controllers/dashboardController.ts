import { Request, Response } from "express";
import { getAllUsersSortedByPoints, claimPointsService, updateUserWalletAddress, deleteWalletAddress, getUserDataByTelegram } from "../services/userServices";
import User from "../models/userModel";
import Quests from "../models/Quests";
import { getQuests } from "../services/questServices";
import UserQuests from "../models/userQuests";
import { getUserQuests } from "../services/userQuestServices";

export const dashboardUser = async (req: Request, res: Response) => {
  const userId = req.query.userId as string;

  if (!userId) {
    return res.status(400).json({ error: "User session not found" });
  }

  try {
    // Fetch the logged-in user's data
    const loggedInUser: User | null = await getUserDataByTelegram(userId);

    if (!loggedInUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Prepare response data for the logged-in user
    const userData = {
      userId: loggedInUser.usertelegramId,
      firstname: loggedInUser.firstname,
      username: loggedInUser.username,
      farmedPoints: loggedInUser.farmedPoints,
      walletAddress: loggedInUser.walletAddress,
      profileImage: loggedInUser.profileImage,
      numberOfReferrals: loggedInUser.numberofReferrals
    };

    // Fetch all users sorted by farmedPoints in descending order
    const topUsers: User[] = await getAllUsersSortedByPoints();

    // Prepare response data for dashboard (all users)
    const leaderboardData = topUsers.slice(0, 10).map((user) => ({
      userId: user.usertelegramId,
      firstname: user.firstname,
      username: user.username,
      farmedPoints: user.farmedPoints,
      profileImage: user.profileImage,
    }));

    //get quests data.
    const quests : Quests[] = await getQuests();

    //get user quests.
    const user_quests : number[] = await getUserQuests({id: loggedInUser.id});

    // Return response with both user data and dashboard data
    return res.json({ userData, leaderboardData,quests,user_quests });

  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Claims points for a user
export const claimPoints = async (req: Request, res: Response) => {
  const { userId, points } = req.body;

  if (!userId || typeof points !== 'number') {
    return res.status(400).json({ error: "User ID or points missing" });
  }

  try {
    const user: User | null = await claimPointsService(userId, points);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({ message: "Points claimed successfully", user });

  } catch (error) {
    console.error("Error claiming points:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Updates a user's wallet address
export const updateWallet = async (req: Request, res: Response) => {
  const { userId, walletAddress } = req.body;

  if (!userId || !walletAddress) {
    return res.status(400).json({ error: "User ID or wallet address missing" });
  }

  try {
    const updatedUser: User | null = await updateUserWalletAddress(userId, walletAddress);

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found or failed to update wallet address" });
    }

    return res.json({ message: "Wallet address updated successfully", user: updatedUser });

  } catch (error) {
    console.error("Error updating wallet address:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};


// Delete wallet address
export const deleteWallet = async (req: Request, res: Response) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "User ID missing" });
  }

  try {
    const user = await deleteWalletAddress(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({ message: "Wallet address deleted successfully", user });
  } catch (error) {
    console.error("Error deleting wallet address:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
