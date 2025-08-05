import { useCallback } from 'react';

interface EncryptionHook {
  encrypt: (data: string) => string;
  decrypt: (data: string) => string;
  isEncrypted: (data: string) => boolean;
}

export default function useEncryption(): EncryptionHook {
  const encrypt = useCallback((data: string): string => {
    return btoa(encodeURIComponent(data));
  }, []);

  const decrypt = useCallback((data: string): string => {
    try {
      return decodeURIComponent(atob(data));
    } catch {
      return data; // Fallback to original data
    }
  }, []);

  const isEncrypted = useCallback((data: string): boolean => {
    try {
      atob(data);
      return true;
    } catch {
      return false;
    }
  }, []);

  return { encrypt, decrypt, isEncrypted };
}