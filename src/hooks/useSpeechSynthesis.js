import { useState, useEffect } from 'react';

const useSpeechSynthesis = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState([]);

  const browserSupportsSpeechSynthesis =
    typeof window !== 'undefined' && 'speechSynthesis' in window;

  useEffect(() => {
    if (!browserSupportsSpeechSynthesis) return;

    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.cancel();
    };
  }, [browserSupportsSpeechSynthesis]);

  const speak = (text, options = {}) => {
    if (!browserSupportsSpeechSynthesis) {
      console.warn('Speech synthesis not supported');
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set voice (prefer English voice)
    const englishVoice = voices.find(
      (voice) => voice.lang.startsWith('en') && voice.name.includes('Female')
    ) || voices.find(
      (voice) => voice.lang.startsWith('en')
    ) || voices[0];

    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    // Configure utterance
    utterance.rate = options.rate || 1.0;
    utterance.pitch = options.pitch || 1.0;
    utterance.volume = options.volume || 1.0;

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const cancel = () => {
    if (browserSupportsSpeechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const pause = () => {
    if (browserSupportsSpeechSynthesis) {
      window.speechSynthesis.pause();
    }
  };

  const resume = () => {
    if (browserSupportsSpeechSynthesis) {
      window.speechSynthesis.resume();
    }
  };

  return {
    speak,
    cancel,
    pause,
    resume,
    isSpeaking,
    voices,
    browserSupportsSpeechSynthesis,
  };
};

export default useSpeechSynthesis;
