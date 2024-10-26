import validator from 'validator';

/**
 * Validates if a string is a valid numeric userId
 * @param userId - The userId to validate
 * @returns true if valid, false otherwise
 */
export const validateQueryUserId = (userId: string): boolean => {
  return validator.isNumeric(userId);
};
