import { Request, Response } from 'express';
import { getUserDataByMigrationCode, updateUserById } from '../services/userServices';


export const handleMigration = async (req: Request, res: Response) => {
  const { migrationCode,telegram } = req.body;

  if (!migrationCode) {
    return res.status(400).json({ error: 'Migration code is required' });
  }
  if(!telegram){
    return res.status(400).json({error : "Telegram Id is required"});
  }

  try {
    const user = await getUserDataByMigrationCode(migrationCode);

    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    //update user's telegram id and start session.
    await updateUserById(user.id, {
        usertelegramId : telegram
    });

    // Respond with a status to the frontend
    req.session.userId = telegram;
    return res.json({ status: "existing_user", userId: req.session.userId });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
