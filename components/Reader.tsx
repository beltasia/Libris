import React from 'react';
import ReactTTS from 'react-tts';

interface ReaderProps {
  encryptedContent: string;
  onDecrypt?: (content: string) => string;
}

const Reader: React.FC<ReaderProps> = ({ encryptedContent, onDecrypt }) => {
  const decryptContent = (content: string): string => {
    return onDecrypt ? onDecrypt(content) : atob(content); // Default to base64 if no decrypt function provided
  };

  return (
    <div className="reader-container">
      <ReactTTS
        text={decryptContent(encryptedContent)}
        voice="Google UK English Female"
        rate={1}
      />
      <div className="content">
        {decryptContent(encryptedContent)}
      </div>
    </div>
  );
};

export default Reader;