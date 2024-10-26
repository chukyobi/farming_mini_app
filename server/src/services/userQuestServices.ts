import UserQuests, { UserQuestsAttributes } from '../models/userQuests';


/**
 * Fetch tasks from users completed Quests.
 * @param QuestData - Must include `id` and optionally other quest attributes.
 * @returns Array of task values.
 */
export const getUserQuests = async (UserQuestData: { id: number; [key: string]: any }): Promise<number[]> => {
    try {
      // Fetch only the `task` column values
      const quests = await UserQuests.findAll({
        where: UserQuestData,
        attributes: ['quest'], // Only fetch the `task` column
      });
      
      // Extract the `task` values from the result
      const tasks = quests.map(quest => quest.getDataValue('quest'));
      
      return tasks;
    } catch (error) {
      console.error("User Quest error: ", error);
      return [];
    }
  };


