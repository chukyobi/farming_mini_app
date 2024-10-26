import { Request, Response } from "express";
//import axios from "axios";
import dotenv from "dotenv";
import AES from "crypto-js/aes";
import Utf8 from "crypto-js/enc-utf8";
import { createUser, getUserDataByTelegram } from "../services/userServices";
import User from "../models/userModel";
dotenv.config();

//const TELEGRAM_BOT_TOKEN = process.env.BOT_TOKEN_TELEGRAM;
const ENCRYPTION_SECRET = process.env.ENCRYPTION_SECRET;

if (!ENCRYPTION_SECRET) {
  console.error("Encryption secret is not defined.");
  process.exit(1);
}

/** This does the first authentication using telegram, and checks if the user exists or not and does the neccesary action */
export const authUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Telegram user ID is required" });
    }

    const telegramUserId = id;

    const existingUser = await getUserDataByTelegram(telegramUserId.toString());

    if (existingUser) {
      req.session.userId = telegramUserId;
      return res.json({ status: "existing_user", userId: req.session.userId });
    }

    const encryptedUserId = AES.encrypt(
      telegramUserId.toString(),
      ENCRYPTION_SECRET
    ).toString();

    return res.json({
      status: "new_user",
      token: encodeURIComponent(encryptedUserId),
    });

  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};




/** This takes care of when a new user succefully follows the twitter account.
 *  It creates the user and a session as well */
export const authTwitter = async (req: Request, res: Response) => {
  const { token, followed } = req.query;

  if (!token) {
    return res.status(400).json({ error: "Token is required" });
  }

  try {
    const decryptedUserId = AES.decrypt(
      token.toString(),
      ENCRYPTION_SECRET
    ).toString(Utf8);

    if (!decryptedUserId) {
      return res.status(400).json({ error: "Invalid token" });
    }

    const followedInt = followed === "true" ? 10 : 0;
    const telegramUserId = decryptedUserId;

    if (followed === "true") {
      const userData: Partial<User> = {
        id: undefined,
        usertelegramId: telegramUserId,
        firstname: null,
        username: null,
        farmedPoints: followedInt,
        walletAddress: null,
        profileImage: "/assets/default.jpg",
        referralLink: `https://t.me/jchukwudi_bot?start=${telegramUserId}`,
        completedTasks: null, 
        numberofReferrals: null,
        dateCreated: new Date(),
        lastLogin: undefined,
        mintedNft: null,
        migrationCode: null,
        email: null
      };

      try {
        // Create a new user
        const newUser = await createUser(userData);

        if (!newUser) {
          throw new Error("User creation failed");
        }

        req.session.userId = telegramUserId; // Set session for the user

        res.json({ status: "new_user", userId: telegramUserId });
        console.log(
          `New user created with Telegram user ID: ${telegramUserId}`
        );
      } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    } else if (followed === "false") {
      res.redirect(
        `/auth/authTwitter?token=${encodeURIComponent(
          token as string
        )}&error=follow`
      );
    } else {
      res.status(400).json({ error: "Invalid followed parameter" });
    }
  } catch (error) {
    console.error("Error decrypting token or handling Twitter follow:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
