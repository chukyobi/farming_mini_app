import Quests, { QuestAttributes } from '../models/Quests';


/**
 * Fetch all Quests.
 * @param QuestData 
 * @returns 
 */
export const getQuests = async (QuestData: Partial<QuestAttributes> = {}): Promise<Quests[]> => {
  try {
    const quests = await Quests.findAll({
      where: QuestData,
    });
    return quests;
  } catch (error) {
    console.error("Quest error: ", error);
    return [];
  }
}


