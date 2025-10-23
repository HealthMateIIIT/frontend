# 🩺 HealthMate AI - Privacy-Preserving Health Assistant

A Progressive Web App (PWA) for accessible, privacy-first health information with voice capabilities and offline support.

## ✨ Features

### Core Features
- ✅ **Text Input** - Type your health questions
- ✅ **Voice Input** - Speak your queries using Web Speech API
- ✅ **Voice Output** - Hear AI responses with text-to-speech
- ✅ **Chat Interface** - Beautiful, responsive chat UI
- ✅ **Dark/Light Mode** - Theme toggle for user preference
- ✅ **Loading States** - Smooth animations while AI thinks
- ✅ **Chat History** - Persistent local storage of conversations
- ✅ **PWA Support** - Install on mobile/desktop, works offline
- ✅ **Responsive Design** - Works on all devices

### Additional Features
- 🎨 Modern UI with Tailwind CSS
- 📱 Mobile-first responsive design
- 🔊 Text-to-speech for AI responses
- 🎤 Speech-to-text for voice input
- 📋 Copy message functionality
- ⏰ Message timestamps
- 🎯 Smooth animations and transitions
- 💾 Automatic chat history saving

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone or navigate to the project directory:**
   ```bash
   cd /home/doraemon/Documents/SEM-7/HACKATHONS/VGI-Coderift/healthmate
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment (optional):**
   ```bash
   cp .env.example .env
   # Edit .env to add your backend API URL
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open in browser:**
   Navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
npm run preview
```

The built files will be in the `dist/` directory.

## 📂 Project Structure

```
healthmate/
├── public/               # Static assets
│   ├── icon-192x192.png  # PWA icon (192x192)
│   ├── icon-512x512.png  # PWA icon (512x512)
│   └── robots.txt        # SEO configuration
├── src/
│   ├── components/       # React components
│   │   └── ChatInterface.jsx  # Main chat interface
│   ├── hooks/            # Custom React hooks
│   │   ├── useSpeechRecognition.js  # Voice input hook
│   │   └── useSpeechSynthesis.js    # Voice output hook
│   ├── App.jsx           # Main app component
│   ├── main.jsx          # Entry point
│   └── index.css         # Global styles
├── index.html            # HTML template
├── vite.config.js        # Vite + PWA configuration
├── tailwind.config.js    # Tailwind CSS configuration
└── package.json          # Dependencies

```

## 🔧 Configuration

### Backend API Integration

The app expects a backend API endpoint at `/api/query` that accepts POST requests:

```javascript
// Request format
{
  "prompt": "I have a headache, what should I do?"
}

// Response format
{
  "response": "Based on your symptoms..."
}
```

To configure the backend URL, edit `src/components/ChatInterface.jsx`:

```javascript
const response = await axios.post('YOUR_BACKEND_URL/api/query', {
  prompt: inputText,
});
```

Or use environment variables in `.env`:
```
VITE_API_URL=http://localhost:8000
```

Then in your code:
```javascript
const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/query`, {
  prompt: inputText,
});
```

## 🎨 Customization

### Theme Colors
Edit `tailwind.config.js` to change colors:
```javascript
colors: {
  primary: '#16a085',    // Main theme color
  accent: '#ecf0f1',     // Background accent
  userBubble: '#2ecc71', // User message color
  aiBubble: '#e5e5ea',   // AI message color
}
```

### App Name and Description
Edit `vite.config.js` PWA manifest:
```javascript
manifest: {
  name: 'HealthMate AI',
  short_name: 'HealthMate',
  description: 'Your description here',
  // ...
}
```

## 📱 PWA Installation

### On Mobile (Android/iOS)
1. Open the app in browser
2. Look for "Add to Home Screen" prompt
3. Tap "Add" to install
4. App icon will appear on home screen

### On Desktop (Chrome/Edge)
1. Open the app in browser
2. Look for install icon in address bar
3. Click to install
4. App will open in standalone window

## 🎤 Voice Features

### Speech Recognition (Voice Input)
- Click the microphone icon to start recording
- Speak your question clearly
- The text will appear in the input box automatically
- Supports English by default (can be configured)

### Speech Synthesis (Voice Output)
- Click the speaker icon next to AI messages
- The message will be read aloud
- Click again to stop playback
- Uses browser's native text-to-speech

**Note:** Voice features require browser support and may need microphone permissions.

## 🔒 Privacy Features

- ✅ All chat history stored locally (localStorage)
- ✅ No data sent to external servers (except your backend API)
- ✅ Voice processing happens in browser
- ✅ No tracking or analytics by default
- ✅ Works completely offline (after PWA installation)

## 🌐 Browser Support

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| PWA | ✅ | ✅ | ✅ | ✅ |
| Voice Input | ✅ | ❌ | ✅ | ✅ |
| Voice Output | ✅ | ✅ | ✅ | ✅ |
| Offline Mode | ✅ | ✅ | ✅ | ✅ |

## 🐛 Troubleshooting

### Voice input not working
- Check browser compatibility (Chrome/Safari/Edge recommended)
- Grant microphone permissions when prompted
- Ensure you're on HTTPS (required for Web Speech API)

### App not installing as PWA
- Must be served over HTTPS (except localhost)
- Check browser console for service worker errors
- Ensure manifest.json is accessible

### Backend connection issues
- Verify backend API is running
- Check API URL in code/environment variables
- Look for CORS issues in browser console

## 📦 Dependencies

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **Axios** - HTTP client
- **vite-plugin-pwa** - PWA support

## 🎯 Future Enhancements

- [ ] Offline hospital cache with GPS
- [ ] Multiple language support
- [ ] Voice language selection
- [ ] Export chat history
- [ ] Symptom checker with ML
- [ ] Emergency contact quick dial
- [ ] Medication reminders

## 📝 License

This project is for educational/hackathon purposes.

## 🤝 Contributing

This is a hackathon project. Feel free to fork and enhance!

## 📞 Support

For issues or questions, create an issue in the repository.

---

**⚠️ Medical Disclaimer:** This app is for informational purposes only. Always consult a qualified healthcare professional for medical advice.
