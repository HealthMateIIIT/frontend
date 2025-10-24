import React, { useState, useEffect, useRef } from 'react';
import { Send, Mic, MicOff, Volume2, Loader2, Copy, CheckCheck } from 'lucide-react';
import useSpeechRecognition from '../hooks/useSpeechRecognition';
import useSpeechSynthesis from '../hooks/useSpeechSynthesis';
import axios from 'axios';

const ChatInterface = () => {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('chatHistory');
    return saved ? JSON.parse(saved) : [
      {
        id: 1,
        text: "Hello! I'm HealthMate, your privacy-preserving health assistant. How can I help you today?",
        sender: 'ai',
        timestamp: new Date().toISOString(),
      },
    ];
  });
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const chatContainerRef = useRef(null);
  
  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();
  
  const { speak, isSpeaking, cancel } = useSpeechSynthesis();

  // Update input text when transcript changes
  useEffect(() => {
    if (transcript) {
      setInputText(transcript);
    }
  }, [transcript]);

  // Save chat history to localStorage
  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(messages));
  }, [messages]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: inputText,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // Use environment variable for API URL, fallback to relative path
      const apiUrl = import.meta.env.VITE_API_URL 
        ? `${import.meta.env.VITE_API_URL}/query`
        : '/query';
      
      const response = await axios.post(apiUrl, {
        query: inputText,
      });

      const aiMessage = {
        id: Date.now() + 1,
        text: response.data.response || "I'm here to help! Please try asking your question again.",
        sender: 'ai',
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Fallback response for demo purposes
      const aiMessage = {
        id: Date.now() + 1,
        text: "I apologize, but I'm currently unable to connect to the server. This is a demo interface. Please ensure your backend API is running at the configured endpoint.",
        sender: 'ai',
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleVoiceInput = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleSpeak = (text) => {
    if (isSpeaking) {
      cancel();
    } else {
      speak(text);
    }
  };

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="h-full flex flex-col max-w-4xl mx-auto w-full">
      {/* Chat Messages Area */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 chat-container"
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
          >
            <div className={`flex flex-col ${message.sender === 'user' ? 'items-end' : 'items-start'} max-w-[85%]`}>
              <div className={`chat-bubble ${message.sender === 'user' ? 'user-bubble' : 'ai-bubble'}`}>
                {message.sender === 'ai' && (
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-primary to-green-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      H
                    </div>
                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                      HealthMate
                    </span>
                  </div>
                )}
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                
                {/* Message actions */}
                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-300 dark:border-gray-600">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatTime(message.timestamp)}
                  </span>
                  
                  {message.sender === 'ai' && (
                    <>
                      <button
                        onClick={() => handleSpeak(message.text)}
                        className="text-gray-500 hover:text-primary transition-colors"
                        title="Read aloud"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleCopy(message.text, message.id)}
                        className="text-gray-500 hover:text-primary transition-colors"
                        title="Copy text"
                      >
                        {copiedId === message.id ? (
                          <CheckCheck className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="chat-bubble ai-bubble flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-primary to-green-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                H
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-300">HealthMate is thinking</span>
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Voice Recording Indicator */}
      {isListening && (
        <div className="px-4 py-2 bg-red-50 dark:bg-red-900/20 border-t border-red-200 dark:border-red-800">
          <div className="flex items-center justify-center gap-2 text-red-600 dark:text-red-400">
            <div className="w-3 h-3 bg-red-500 rounded-full recording-indicator"></div>
            <span className="text-sm font-medium">Recording... Speak now</span>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="input-area">
        {/* Voice Input Button */}
        {browserSupportsSpeechRecognition && (
          <button
            onClick={toggleVoiceInput}
            className={`btn-icon ${isListening ? 'bg-red-100 dark:bg-red-900/30' : ''}`}
            title={isListening ? 'Stop recording' : 'Start voice input'}
          >
            {isListening ? (
              <MicOff className="w-5 h-5 text-red-600" />
            ) : (
              <Mic className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            )}
          </button>
        )}

        {/* Text Input */}
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your health question here..."
          className="flex-1 resize-none bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary min-h-[48px] max-h-[120px]"
          rows={1}
        />

        {/* Send Button */}
        <button
          onClick={handleSendMessage}
          disabled={!inputText.trim() || isLoading}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          title="Send message"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
};

export default ChatInterface;
