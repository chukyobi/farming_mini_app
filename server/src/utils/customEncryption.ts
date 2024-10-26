export const customEncryption = (telegramUserId: string): string => {
    const randomAlphanumeric = Math.random().toString(36).substring(7); // Generate a random alphanumeric string
    return `alpharand_user_${randomAlphanumeric}`;
  };
  
  
  
  export const customDecrypt = (encryptedId: string): string | null => {
    const parts = encryptedId.split('_');
    if (parts.length === 3 && parts[0] === 'alpharand' && parts[1] === 'user') {
      return parts[2]; // Extract and return the decrypted ID
    }
    return null; // Return null if decryption fails
  };
  