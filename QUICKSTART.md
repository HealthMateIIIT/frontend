# 🚀 HealthMate AI - Quick Start (5 Minutes)

## Prerequisites
- Node.js (v16+) - [Download](https://nodejs.org/)
- Python 3.8+ - [Download](https://python.org/)

## Fast Setup

### Option 1: Automated (Recommended)

**Linux/Mac:**
```bash
chmod +x start-dev.sh
./start-dev.sh
```

**Windows:**
```bash
start-dev.bat
```

This will:
1. Install all dependencies
2. Start backend (http://localhost:8000)
3. Start frontend (http://localhost:3000)

### Option 2: Manual

**Terminal 1 - Backend:**
```bash
cd backend-example
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

**Terminal 2 - Frontend:**
```bash
npm install
npm run dev
```

## First Steps

1. **Open** http://localhost:3000
2. **Type** a health question (e.g., "I have a headache")
3. **Click** the microphone to try voice input
4. **Click** the speaker icon to hear responses
5. **Toggle** dark mode with the moon/sun icon

## Generate Icons

The app needs icons for PWA installation:

```bash
npm install --save-dev sharp
node generate-icons.js
```

Or use online tool: https://realfavicongenerator.net/

## Test PWA Installation

### Mobile:
1. Open app in Chrome/Safari
2. Tap "Add to Home Screen"
3. App installs on home screen

### Desktop:
1. Open app in Chrome/Edge
2. Click install icon in address bar
3. App opens in standalone window

## Next Steps

- **Replace Demo Backend:** Edit `backend-example/app.py` with real AI logic
- **Customize UI:** Edit colors in `tailwind.config.js`
- **Deploy:** Run `npm run build` and deploy `dist/` folder

## Need Help?

- Check browser console for errors
- Verify both servers are running
- Read [SETUP.md](SETUP.md) for detailed guide
- Check [README.md](README.md) for full documentation

## Common Issues

**CORS Error?**
- Backend CORS is configured for localhost:3000
- If using different port, update `backend-example/app.py`

**Voice not working?**
- Use Chrome, Safari, or Edge (Firefox doesn't support Web Speech API)
- Grant microphone permissions
- Use HTTPS in production

**PWA not installing?**
- Generate icons first: `node generate-icons.js`
- Requires HTTPS (localhost is OK for testing)

---

**⚠️ Medical Disclaimer:** For informational purposes only. Always consult healthcare professionals.
