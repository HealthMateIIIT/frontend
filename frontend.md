

## 🧩 Functional Features for the Frontend

### 1. **User Input Section**

* **Text Input Box**

  * A textarea where users can type their health-related queries (e.g. “I have a headache, what should I do?”).
  * A **“Send”** button that sends the text to your backend API endpoint (e.g. `/api/query`).
* **Voice Input Option 🎤**

  * A **microphone icon** that starts speech recognition when clicked.
  * The speech should be converted to text (using **Web Speech API** or something like **SpeechRecognition in JavaScript**).
  * After conversion, the recognized text should appear in the same input box automatically, ready to be sent.
  * Optional: Show a small **recording indicator (red dot / pulsating circle)** when recording is on.

---

### 2. **Chat Display Section**

* Display the **conversation between the user and HealthMate (AI)** in a chat format:

  * Left-aligned bubbles for HealthMate’s responses 🩺
  * Right-aligned bubbles for the user’s messages 🙋‍♂️
* Each message bubble can have:

  * Timestamp
  * Optional reaction buttons (like copy text, replay audio, etc.)
* Scrollable chat area with smooth animation when new messages come in.

---

### 3. **Response Playback (Text-to-Speech 🔊)**

* For each response from HealthMate:

  * Include a small **speaker icon** 🎧 beside the AI’s message.
  * When clicked, it should read out the response aloud (using **Web Speech Synthesis API** or a library like `responsivevoice.js`).
* You can also have a **“Listen”** button appear right after receiving a response.

---

### 4. **Loading / Thinking State**

* Show a loading animation or dots (…) when the backend is processing the query.
* Example:
  “HealthMate is thinking 🤔…”
  with a typing animation or small animated heartbeat icon.

---

### 5. **Optional but Cool Additions**

* **Theme toggle:** Light / Dark mode (hackathon judges love polish ✨)
* **Avatar for HealthMate:** Show a small friendly doctor icon or a health logo beside AI messages.
* **Responsive Design:** Should work well on both mobile and laptop.
* **History or Session Save (optional):** Store recent chats locally (using localStorage).

---

## 🎨 UI / UX Design Ideas

Here are a few layout inspirations you can consider:

### 💬 Chat-Like Layout (Recommended)

```
 --------------------------------------
|          HealthMate (Header)          |
 --------------------------------------
|   [Chat area: Scrollable messages]    |
|                                       |
|                                   Hi  |
|  Hello! How can I help?               |
|                                       |
 --------------------------------------
| 🎤  [ Type your message here... ]  ➤  |
 --------------------------------------
```

### 🧠 Modern Card-Based Design

* Use a central card with shadow and rounded corners.
* Inside the card:

  * Chat messages displayed in stacked cards.
  * Bottom input bar with microphone and send icons.

### 🎨 Color Palette

* **Primary color:** #16a085 (greenish-teal for health)
* **Accent color:** #f4f6f7 or #ecf0f1 (light background)
* **Chat bubbles:**

  * User: `#2ecc71` (grey)
  * AI: `#e5e5ea` (green)

---

## ⚙️ Tech Stack Suggestions

Since you’re doing a hackathon (speed + simplicity matter):

| Task               | Recommended Tool                                        |
| ------------------ | ------------------------------------------------------- |
| Frontend Framework | **Streamlit (for quick prototype)**                     |
| Voice Input        | **Web Speech API** (`window.SpeechRecognition`)         |
| Voice Output       | **SpeechSynthesis API** (`window.speechSynthesis`)      |
| Styling            | **Tailwind CSS** (for quick, beautiful UI)              |
| Animations         | **Framer Motion** or simple CSS animations              |

---

## ✅ Summary Checklist

| Feature                       | Implemented? |
| ----------------------------- | ------------ |
| Text Input                    | ☐            |
| Send Button                   | ☐            |
| Voice Input (Speech-to-Text)  | ☐            |
| Display Chat History          | ☐            |
| Voice Output (Text-to-Speech) | ☐            |
| Loading Animation             | ☐            |
| Basic Styling / Theme         | ☐            |

---
