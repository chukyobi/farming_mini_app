import { Request, Response } from "express";
import User from "../models/userModel";
import CryptoJS = require("crypto-js");

// Check if the "crypto" module is available
let crypto: any;

(async () => {
  try {
    crypto = await import("crypto");
  } catch (err) {
    console.error(
      "WARNING: crypto support is disabled and Math.random() will be used instead!"
    );
  }
})();

/*
 * API endpoint to fetch a scratchcard.
 *
 * Generates an array of values for the scratchcard.
 * Each value represents the reward amount for a specific scratch area.
 */
export const gameValues = async (req: Request, res: Response) => {
    
  // Array to store the generated values
  const values: (0 | 1 | 10 | 100 | 1000)[] = [];

  // Generate values for each position on the scratchcard
  for (let i = 0; i < 4; i++) {
    let randomNumber: number;

    // Use crypto library for random number generation if available
    if (crypto && crypto.randomBytes) {
      const randomBytes = crypto.randomBytes(4);
      randomNumber = randomBytes.readUInt32BE(0) / Math.pow(2, 32);
    } else {
      // Fallback to Math.random() if crypto support is disabled
      randomNumber = Math.random();
    }

    // Value  Probability
    // 0      50%   0.5
    // 1      30%   0.3
    // 10     15%   0.15
    // 100     4%   0.04
    // 1000    1%   0.01

    // Assign a reward value based on the generated random number
    if (randomNumber < 0.5) {
      values.push(0);
    } else if (randomNumber < 0.8) {
      values.push(1);
    } else if (randomNumber < 0.95) {
      values.push(10);
    } else if (randomNumber < 0.99) {
      values.push(100);
    } else {
      values.push(1000);
    }
  }

  res.json(values);
};

/**
 * Update the user's farmed points when hit.
 * @param req 
 * @param res 
 */
export const updatePointsFromGame = async (req: Request, res:Response) => {
  // update 
  // x= points, y=user_id
  const { x,y } = req.body;
  const secretKey = '48396a3831177b6d9d095d93'

  const decryptData = (encryptedData : string) => {
    const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
    return Number(bytes.toString(CryptoJS.enc.Utf8));
  };

  try{
    const user_id = decryptData(y);
    const points = decryptData(x);

    const user = await User.findOne({where: {usertelegramId: user_id}})

    if (!user) {
      return res.status(404).send('User not found');
    }

    const updatedPoints = user.farmedPoints + points;
    console.log("updated points: "+updatedPoints);
    

    await User.update(
      {farmedPoints: updatedPoints},
      {where: {usertelegramId: user_id} }
    )
    res.json(true);
  }
  catch(error){
    console.error("error updating points from game: ",error)
    res.status(500).send("Internal server error")
  }

  
}