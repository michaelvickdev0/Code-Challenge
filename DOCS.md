## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Create environment configuration

   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and add your required environment variables (API keys, etc.)

3. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Notes

This application uses AsyncStorage for local data persistence:

- **User Data**: User authentication information and profile data are stored locally using AsyncStorage  
- **Journal Entries**: All journal entries are persisted in AsyncStorage  

This application also uses the **OpenAI API** for mood detection:

- **Mood Detection**: When a user creates a journal entry, the app sends the title and content to the OpenAI API, which analyzes the emotional tone and returns a mood score (1–10) for each emotion (e.g., happiness, fear, anger, sadness).
