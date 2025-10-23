# 📁 HealthMate AI - Project Structure

```
healthmate/
│
├── 📱 Frontend (React PWA)
│   ├── public/                      # Static assets
│   │   ├── icon-192x192.png         # PWA icon (small)
│   │   ├── icon-512x512.png         # PWA icon (large)
│   │   ├── apple-touch-icon.png     # iOS icon
│   │   └── robots.txt               # SEO configuration
│   │
│   ├── src/                         # Source code
│   │   ├── components/              # React components
│   │   │   └── ChatInterface.jsx    # Main chat UI component
│   │   │
│   │   ├── hooks/                   # Custom React hooks
│   │   │   ├── useSpeechRecognition.js  # Voice input logic
│   │   │   └── useSpeechSynthesis.js    # Voice output logic
│   │   │
│   │   ├── App.jsx                  # Root component with header/footer
│   │   ├── main.jsx                 # React entry point
│   │   └── index.css                # Global styles with Tailwind
│   │
│   ├── index.html                   # HTML template
│   ├── vite.config.js              # Vite build config + PWA plugin
│   ├── tailwind.config.js          # Tailwind CSS configuration
│   ├── postcss.config.js           # PostCSS configuration
│   └── package.json                # Frontend dependencies
│
├── 🔧 Backend (Sample Python API)
│   └── backend-example/
│       ├── app.py                  # FastAPI backend with sample responses
│       ├── requirements.txt        # Python dependencies
│       └── README.md               # Backend documentation
│
├── 📚 Documentation
│   ├── README.md                   # Main documentation
│   ├── QUICKSTART.md              # 5-minute setup guide
│   ├── SETUP.md                   # Detailed setup instructions
│   ├── PROJECT_STRUCTURE.md       # This file
│   ├── frontend.md                # Original requirements (reference)
│   └── HealthMate AI — Privacy-Preserving Assistant.md  # Project overview
│
├── 🛠️ Utilities
│   ├── generate-icons.js          # Icon generator script
│   ├── start-dev.sh              # Linux/Mac startup script
│   └── start-dev.bat             # Windows startup script
│
└── ⚙️ Configuration
    ├── .gitignore                # Git ignore rules
    ├── .env.example              # Environment variables template
    └── package.json              # Project metadata

```

## 🎯 Key Files Explained

### Frontend Core Files

| File | Purpose |
|------|---------|
| `src/App.jsx` | Main app with header, dark mode toggle, footer |
| `src/components/ChatInterface.jsx` | Chat UI, message handling, API integration |
| `src/hooks/useSpeechRecognition.js` | Web Speech API wrapper for voice input |
| `src/hooks/useSpeechSynthesis.js` | Speech Synthesis API wrapper for TTS |
| `src/index.css` | Custom CSS with Tailwind utilities |

### Configuration Files

| File | Purpose |
|------|---------|
| `vite.config.js` | Vite bundler + PWA plugin configuration |
| `tailwind.config.js` | Custom colors, theme, animations |
| `package.json` | Dependencies and npm scripts |

### Backend Files

| File | Purpose |
|------|---------|
| `backend-example/app.py` | FastAPI server with demo responses |
| `backend-example/requirements.txt` | Python packages (FastAPI, uvicorn) |

### Documentation

| File | Purpose |
|------|---------|
| `README.md` | Complete project documentation |
| `QUICKSTART.md` | Fast 5-minute setup guide |
| `SETUP.md` | Detailed step-by-step instructions |
| `PROJECT_STRUCTURE.md` | This file - project organization |

## 🔄 Data Flow

```
User Input (Text/Voice)
    ↓
ChatInterface Component
    ↓
API Request (axios)
    ↓
Backend API (/api/query)
    ↓
AI Processing (LLM/ML)
    ↓
Response
    ↓
ChatInterface (Display)
    ↓
Optional: Text-to-Speech
```

## 🎨 Component Hierarchy

```
App
├── Header
│   ├── Logo
│   └── Dark Mode Toggle
├── ChatInterface (Main)
│   ├── Message List
│   │   ├── User Messages
│   │   └── AI Messages
│   │       ├── Speaker Icon (TTS)
│   │       └── Copy Button
│   ├── Loading Indicator
│   └── Input Area
│       ├── Microphone Button (Voice Input)
│       ├── Text Input
│       └── Send Button
└── Footer
    └── Disclaimer
```

## 📦 Dependencies Overview

### Frontend Dependencies
- **react** - UI framework
- **react-dom** - React DOM renderer
- **lucide-react** - Icon library
- **axios** - HTTP client

### Frontend Dev Dependencies
- **vite** - Build tool
- **@vitejs/plugin-react** - React plugin for Vite
- **vite-plugin-pwa** - PWA support
- **tailwindcss** - Utility-first CSS
- **autoprefixer** - CSS vendor prefixing
- **postcss** - CSS processing

### Backend Dependencies
- **fastapi** - Modern Python web framework
- **uvicorn** - ASGI server
- **pydantic** - Data validation

## 🚀 Build Process

### Development
```bash
npm run dev
# Vite dev server with hot reload
# URL: http://localhost:3000
```

### Production
```bash
npm run build
# Output: dist/ folder
# - Minified JS/CSS
# - Optimized assets
# - Service worker for PWA
# - Static HTML
```

### Preview Production Build
```bash
npm run preview
# Test production build locally
```

## 🔐 Security Features

- ✅ CORS configured for localhost
- ✅ Local storage for chat history (no external tracking)
- ✅ HTTPS required for production (voice APIs)
- ✅ No hardcoded API keys
- ✅ Environment variables for sensitive data

## 📱 PWA Features

### Manifest (`vite.config.js`)
- App name and short name
- Icons (192x192, 512x512)
- Theme color (#16a085)
- Display mode (standalone)
- Start URL

### Service Worker
- Caches static assets
- Offline functionality
- Network-first strategy for API calls
- Auto-updates when new version available

## 🎨 Styling Architecture

### Tailwind CSS
- Utility classes for rapid development
- Dark mode support (class-based)
- Custom colors in config
- Responsive breakpoints

### Custom CSS
- Chat bubble styles
- Animations (typing indicator, recording pulse)
- Scrollbar styling
- Smooth transitions

## 📊 State Management

Uses React hooks (no external state library):
- `useState` - Local component state
- `useEffect` - Side effects and lifecycle
- `useRef` - DOM references and speech APIs
- Custom hooks for speech features

## 🔄 API Integration

### Expected Backend Format

**Request:**
```json
POST /api/query
{
  "prompt": "user message"
}
```

**Response:**
```json
{
  "response": "AI response text"
}
```

## 📝 Next Steps for Production

1. Replace demo backend with actual AI logic
2. Add authentication if needed
3. Implement rate limiting
4. Add analytics (privacy-preserving)
5. Set up CI/CD pipeline
6. Configure custom domain
7. Enable HTTPS
8. Test on multiple devices
9. Optimize bundle size
10. Add error tracking (Sentry, etc.)

---

**Built for VGI CodeRift Hackathon** 🏆
