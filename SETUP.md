# 🚀 HealthMate AI - Complete Setup Guide

## Step-by-Step Setup

### 1. Generate PWA Icons

You need to create app icons for the PWA. Here are your options:

#### Option A: Use an Online Tool (Easiest)
1. Visit [https://realfavicongenerator.net/](https://realfavicongenerator.net/)
2. Upload a square logo/image (at least 512x512 px)
3. Download the generated icons
4. Replace the empty icon files in `public/` folder:
   - `icon-192x192.png`
   - `icon-512x512.png`
   - `apple-touch-icon.png`

#### Option B: Create Simple Icons with Node.js
Run this script to create basic placeholder icons:

```bash
npm install --save-dev sharp
```

Create `generate-icons.js`:
```javascript
const sharp = require('sharp');
const fs = require('fs');

const createIcon = async (size, outputPath) => {
  const svg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#16a085;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#27ae60;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="${size}" height="${size}" fill="url(#grad)" rx="20%"/>
      <text x="50%" y="50%" font-family="Arial" font-size="${size * 0.5}" 
            fill="white" text-anchor="middle" dominant-baseline="middle" 
            font-weight="bold">H</text>
    </svg>
  `;
  
  await sharp(Buffer.from(svg))
    .png()
    .toFile(outputPath);
  console.log(`✓ Created ${outputPath}`);
};

(async () => {
  await createIcon(192, 'public/icon-192x192.png');
  await createIcon(512, 'public/icon-512x512.png');
  await createIcon(180, 'public/apple-touch-icon.png');
  console.log('✓ All icons generated!');
})();
```

Run: `node generate-icons.js`

#### Option C: Manual Creation
Use any design tool (Figma, Canva, Photoshop) to create:
- 192x192 px icon
- 512x512 px icon
- 180x180 px icon (for Apple devices)

### 2. Install Dependencies

```bash
npm install
```

This installs:
- React and React DOM
- Vite (build tool)
- Tailwind CSS
- Lucide React (icons)
- Axios (HTTP client)
- PWA plugin

### 3. Configure Backend API

Create `.env` file:
```bash
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_URL=http://localhost:8000
```

Update `src/components/ChatInterface.jsx` (line ~77):
```javascript
const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/query`, {
  prompt: inputText,
});
```

### 4. Test Backend Connection

Your backend should have an endpoint like:

**Python (FastAPI) Example:**
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueryRequest(BaseModel):
    prompt: str

@app.post("/api/query")
async def query(request: QueryRequest):
    # Your AI logic here
    response = f"You asked: {request.prompt}"
    return {"response": response}
```

**Python (Flask) Example:**
```python
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/query', methods=['POST'])
def query():
    data = request.json
    prompt = data.get('prompt', '')
    # Your AI logic here
    response = f"You asked: {prompt}"
    return jsonify({"response": response})

if __name__ == '__main__':
    app.run(port=8000)
```

### 5. Run Development Server

```bash
npm run dev
```

Open: http://localhost:3000

### 6. Test Features

#### Test Text Chat:
1. Type a message in the input box
2. Click send or press Enter
3. Should receive a response from backend

#### Test Voice Input:
1. Click the microphone icon
2. Allow microphone permissions
3. Speak your question
4. Text should appear in input box

#### Test Voice Output:
1. Send a message and get a response
2. Click the speaker icon next to AI message
3. Should hear the response read aloud

#### Test Dark Mode:
1. Click sun/moon icon in header
2. Theme should switch
3. Preference saved in localStorage

### 7. Build for Production

```bash
npm run build
```

Output: `dist/` folder

Preview production build:
```bash
npm run preview
```

### 8. Deploy Options

#### Netlify (Recommended for PWA):
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

#### Vercel:
```bash
npm install -g vercel
vercel --prod
```

#### GitHub Pages:
Add to `vite.config.js`:
```javascript
export default defineConfig({
  base: '/your-repo-name/',
  // ... rest of config
});
```

Build and deploy:
```bash
npm run build
# Push dist/ folder to gh-pages branch
```

### 9. Test PWA Installation

#### On Mobile:
1. Open app in mobile browser
2. Should see "Add to Home Screen" banner
3. Tap to install
4. App appears on home screen

#### On Desktop:
1. Open app in Chrome/Edge
2. Look for install icon in address bar (⊕)
3. Click to install
4. App opens in standalone window

### 10. Enable HTTPS (Required for Voice + PWA)

Voice APIs require HTTPS. Options:

#### Local Development:
```bash
npm install -D @vitejs/plugin-basic-ssl
```

Update `vite.config.js`:
```javascript
import basicSsl from '@vitejs/plugin-basic-ssl'

export default defineConfig({
  plugins: [
    basicSsl(),
    // ... other plugins
  ]
})
```

#### Production:
Most hosting platforms provide automatic HTTPS.

## 🎯 Verification Checklist

- [ ] Icons generated and visible
- [ ] Dependencies installed
- [ ] Backend API running and responding
- [ ] Frontend connects to backend
- [ ] Text input/output works
- [ ] Voice input works (microphone access)
- [ ] Voice output works (text-to-speech)
- [ ] Dark mode toggles
- [ ] Chat history persists
- [ ] PWA installs on mobile
- [ ] Offline mode works after install

## 🐛 Common Issues

### CORS Errors
**Problem:** Backend rejects frontend requests

**Solution:** Add CORS headers to backend
```python
# FastAPI
from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(CORSMiddleware, allow_origins=["*"])

# Flask
from flask_cors import CORS
CORS(app)
```

### Voice Input Not Working
**Problem:** Microphone not activating

**Solutions:**
- Use HTTPS (required for production)
- Grant microphone permissions
- Use Chrome/Safari/Edge (Firefox doesn't support Web Speech API)
- Check browser console for errors

### PWA Not Installing
**Problem:** No install prompt appears

**Solutions:**
- Serve over HTTPS
- Check icons are loading (DevTools → Application → Manifest)
- Verify service worker is registered (DevTools → Application → Service Workers)
- Meet PWA criteria (manifest.json + service worker + HTTPS)

### Build Errors
**Problem:** npm run build fails

**Solutions:**
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Check Node.js version (needs v16+)
- Clear npm cache: `npm cache clean --force`

## 📞 Need Help?

Check the console logs:
- Browser DevTools → Console (frontend errors)
- Terminal running backend (backend errors)
- Network tab (API request/response)

## 🎉 You're Ready!

Your HealthMate AI PWA is now set up and ready for the hackathon demo!
