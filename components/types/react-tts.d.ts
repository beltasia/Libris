declare module 'react-tts' {
  import * as React from 'react';

  export interface ReactTTSProps {
    text: string;
    voice?: string;
    rate?: number;
    pitch?: number;
    volume?: number;
    lang?: string;
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (error: Error) => void;
  }

  const ReactTTS: React.FC<ReactTTSProps>;
  export default ReactTTS;
}