# Voice to Task — React Native App

A voice-driven task management React Native application built with Expo. The app converts spoken commands (like *"Remind me to call John at 4:15 PM"*) into structured tasks, saves them locally, and sets up device notification reminders.

---

## 🔄 Current App Pipeline
[ 🎙️ Voice Input ]
│ (expo-speech-recognition)
▼
[ 📝 Live Speech-to-Text ]
│
▼
[ ⚙️ Local Date & Time Parsing ]  <-- On-device parsing engine
│
▼
[ ✏️ Editable Preview Form ]      <-- Review & adjust task details
│
▼
[ 💾 Local Persistence ]          <-- Saved via @react-native-async-storage
│
▼
[ 🔔 Scheduled Device Alert ]     <-- Alarm set via expo-notifications


1. **Voice Capture:** The user taps the microphone button to dictate a task using `expo-speech-recognition`.
2. **Local Parsing Engine:** The transcript is parsed locally on-device into a task title, target date, and time.
3. **Editable Preview Form:** The user reviews and corrects any details in `TaskForm.js` before saving.
4. **Local Persistence:** Tasks are stored securely on the device using `@react-native-async-storage/async-storage`.
---

## 🚀 Future Enhancements

- 🔮 **Google Gemini AI Integration (`src/services/aiExtractionService.js`):** Connecting external cloud LLM APIs (Gemini 1.5 Flash) to handle complex, multi-intent speech commands and relative date parsing.
- ☁️ **Cloud Backup & Sync:** Multi-device synchronization via backend database services.
- 📅 **Calendar Sync:** Exporting scheduled tasks directly to Google Calendar / device calendars.

---

## 🛠️ Project Structure
VoiceToTaskApp/
├── App.js                          # Root navigation & notification setup
├── app.json                        # Expo config, native permissions & launcher icons
├── eas.json                        # EAS build configuration
├── assets/                         # App launcher icons & screenshots
└── src/
├── components/
│   ├── VoiceButton.js          # Animated recording mic button
│   ├── TaskCard.js             # Task list item display
│   └── TaskForm.js             # Editable task extraction form
├── screens/
│   ├── HomeScreen.js           # Voice capture & task creation flow
│   └── TaskListScreen.js       # View, complete, & delete saved tasks
├── services/
│   ├── speechService.js        # On-device speech recognition wrapper
│   └── storageService.js       # AsyncStorage local CRUD helper
└── theme/
└── colors.js

---

## 💻 Commands to Connect & Run the App

This app uses a custom **Expo Dev Client** to support native speech and notification modules.

### 1. Install Dependencies
```cmd
npm install
2. Build the Development APK (One-time setup for Android phone)
DOS
eas build --profile development --platform android
After the cloud build completes, scan the QR code to install the .apk on your phone.

3. Connect Phone to Metro Development Server
Ensure your phone and laptop are on the same Wi-Fi network, then start the server:

DOS
npx expo start --dev-client
Open the Voice to Task app installed on your Android phone.

Scan the terminal QR code or select your local server from the Expo client menu to connect.

📦 Third-Party Libraries
expo, expo-dev-client, expo-speech-recognition, expo-notifications

@react-navigation/native, @react-navigation/native-stack

@react-native-async-storage/async-storage

react-native-gesture-handler, react-native-safe-area-context
