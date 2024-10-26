import { Request, Response } from "express";
import Twitter from "twitter-lite";
import dotenv from "dotenv";
import crypto from "crypto-js";

dotenv.config();

const client = new Twitter({
  consumer_key: process.env.TWITTER_API_KEY as string,
  consumer_secret: process.env.TWITTER_API_SECRET as string,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN as string,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET as string,
});

const TWITTER_USERNAME = process.env.TWITTER_USERNAME;
const ENCRYPTION_SECRET = process.env.ENCRYPTION_SECRET as string;

// Function to decrypt data
const decryptData = (encryptedData: string) => {
  const bytes = crypto.AES.decrypt(encryptedData, ENCRYPTION_SECRET);
  return bytes.toString(crypto.enc.Utf8);
};

// Function to handle Twitter follow action
export const followTwitter = async (req: Request, res: Response) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ error: "Token is required" });
    }

    // Decrypt token to get telegramUserId
    const decryptedTelegramUserId = decryptData(token as string);

    // Make a request to Twitter API to initiate follow
    const response = await client.post("friendships/create", {
      screen_name: TWITTER_USERNAME,
      follow: true,
    });

    // Handle Twitter API response
    if (response && response.screen_name === TWITTER_USERNAME) {
      console.log(
        `User ${decryptedTelegramUserId} successfully followed Twitter account ${TWITTER_USERNAME}`
      );

      return res.status(200).json({
        redirectUrl: `http://localhost:4000/auth/authTwitter?token=${encodeURIComponent(
          token as string
        )}&followed=true`,
      });
    } else {
      console.log(
        `User ${decryptedTelegramUserId} failed to follow Twitter account ${TWITTER_USERNAME}`
      );

      return res.status(200).json({
        redirectUrl: `http://localhost:4000/auth/authTwitter?token=${encodeURIComponent(
          token as string
        )}&followed=false`,
      });
    }
  } catch (error) {
    console.error("Error following on Twitter:", error);
    return res.status(500).json({
      error: "Internal server error",
      redirectUrl: `http://localhost:4000/auth/authTwitter?token=${encodeURIComponent(
        req.query.token as string
      )}&followed=false`,
    });
  }
};
