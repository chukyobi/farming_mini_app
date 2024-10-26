import EarnedPoints from '../models/earnedPointsModel';
import { EarnedPointsAttributes } from '../models/earnedPointsModel';

// Function to create earned points for a user
export const createEarnedPoints = async (userPoints: Partial<EarnedPointsAttributes>): Promise<EarnedPoints | null> => {
  try {
    const { username, earnedFarmPoints = 0, earnedQuestPoints = 0 } = userPoints;

    const earnedPointsData: Partial<EarnedPointsAttributes> = {
      username: username || '',
      earnedFarmPoints: earnedFarmPoints,
      earnedQuestPoints: earnedQuestPoints,
    };

    const earnedPoints = await EarnedPoints.create(earnedPointsData as EarnedPointsAttributes);
    return earnedPoints;
  } catch (error) {
    console.error("Error creating earned points:", error);
    return null;
  }
};
