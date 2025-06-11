# Habit Quest

Habit Quest is a gamified habit-tracking web application built with **React Native Web**, **Expo**, and **TypeScript**. It allows users to track their daily habits, earn points, and stay motivated through friendly competition.

This project is **web-first**, with the option to run it on **mobile via the Expo Go app**.

---

## Requirements

- Node.js v18 or newer
- npm v9 or newer
- Git (for cloning)
- Expo Go app (optional for mobile testing)

---

## Dependencies

- `expo`
- `expo-router`
- `react-native`
- `react-native-web`
- `typescript`

---

## Getting started 

### Clone the repository

```bash
git clone https://github.com/jessewashburn/HabitQuest.git
cd HabitQuest
```

---

## Installation & Setup

### Mac / Linux (Command Line)

```bash
# Use Node 18+
node -v   # if not installed:
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install dependencies
npm install

# Start the app (web)
npx expo start --web
```

### Windows (PowerShell or CMD)

1. [Install Node.js 18+](https://nodejs.org/)
2. Open PowerShell or CMD:

```powershell
cd habit-quest
npm install
npx expo start --web
```

---
## Testing It Works

After running:

```bash
npx expo start --web
```

Visit:

```
http://localhost:8081/
```

You should see a landing page that says:

> Welcome to Habit Quest  
> Track your habits. Level up your life.

---
## Run on Mobile (Optional)

To test on **physical iOS/Android** devices:

1. Install the **Expo Go** app from the App Store or Google Play
2. Start the Expo dev server:

```bash
npx expo start
```

3. Scan the QR code with Expo Go on your device

---

## Group Members (CTRL+ALT+ELITE)

- Harrison Kunkel  
- Mohamed Bundu  
- Samuel Kleanthous  
- Jesse Washburn

---

## Known Warnings

You may see the following warning in the console when running the app on web:

```
"shadow*" style props are deprecated. Use "boxShadow".
```

This warning does not come from our code. It is triggered internally by the `expo-router` library when used with `react-native-web`. We are not using any `shadow*` props in the app.

You can safely ignore it.

