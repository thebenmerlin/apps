# Daily Planner - Mobile-First PWA

A production-ready, mobile-first Daily Planner web application with offline support, built with React, TypeScript, Tailwind CSS, and Capacitor for native Android deployment.

## 📋 Features

### Core Features
- ✅ **Task Management**: Add, edit, delete, and complete tasks
- 📅 **Multi-Day Navigation**: View tasks by day, week, or all tasks
- 🔔 **Local Notifications**: Reminder system using Capacitor Local Notifications
- 🔍 **Search & Filter**: Search tasks and filter by status
- 💾 **Offline-First**: Full offline functionality with IndexedDB (localForage)
- 🎨 **Dark Mode**: Toggle between light and dark themes
- 📊 **Statistics**: Track daily completion rates
- 📤 **Export/Import**: Backup and restore data as JSON
- 📱 **PWA Support**: Installable as a Progressive Web App
- 📱 **Mobile Gestures**: Swipe actions for task completion/deletion

### Technical Features
- TypeScript for type safety
- TailwindCSS for responsive, mobile-first styling
- Framer Motion for smooth animations
- Vitest for unit testing
- ESLint + Prettier for code quality
- Workbox for service worker and caching
- AdMob placeholder integration
- Capacitor for native Android build

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Android Studio (for Android builds)
- Git

### Installation

1. **Extract the project**
   ```bash
   unzip daily-planner.zip
   cd daily-planner
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```
   Open http://localhost:5173 in your browser

## 📦 Build & Deploy

### Web Deployment (Vercel)

1. **Build for production**
   ```bash
   npm run build
   ```

2. **Preview build locally**
   ```bash
   npm run preview
   ```

3. **Deploy to Vercel**
   - Install Vercel CLI: `npm i -g vercel`
   - Run: `vercel`
   - Or connect your GitHub repo to Vercel Dashboard

   **Vercel Settings:**
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Root Directory: `/`

### Android Build with Capacitor

1. **Build web assets**
   ```bash
   npm run build
   ```

2. **Sync with Capacitor**
   ```bash
   npm run cap:sync
   ```

   If this is your first time, add Android platform:
   ```bash
   npx cap add android
   npm run cap:sync
   ```

3. **Open in Android Studio**
   ```bash
   npm run cap:open
   ```
   Or manually: `npx cap open android`

4. **Build APK in Android Studio**
   - Wait for Gradle sync to complete
   - Navigate to: **Build → Build Bundle(s) / APK(s) → Build APK(s)**
   - Find APK at: `android/app/build/outputs/apk/debug/app-debug.apk`

5. **Build Signed APK for Production**
   - **Build → Generate Signed Bundle / APK**
   - Select **APK**
   - Create or select keystore
   - Fill in keystore details
   - Choose release build variant
   - APK location: `android/app/release/app-release.apk`

6. **Command-line APK build**
   ```bash
   cd android
   ./gradlew assembleDebug  # For debug APK
   ./gradlew assembleRelease  # For release (requires signing)
   ```

### Capacitor Configuration

Edit `capacitor.config.ts` to customize:
- `appId`: Your unique app identifier (e.g., `com.yourcompany.dailyplanner`)
- `appName`: Display name of your app
- `webDir`: Build output directory (default: `dist`)

## 🔧 Environment Variables

Create a `.env` file (use `.env.example` as template):

```env
# AdMob IDs (Replace with real IDs for production)
VITE_ADMOB_BANNER_ID=ca-app-pub-3940256099942544/6300978111
VITE_ADMOB_INTERSTITIAL_ID=ca-app-pub-3940256099942544/1033173712

# App Name
VITE_APP_NAME=Daily Planner
```

**Note**: Test IDs provided are Google's demo IDs. Replace with your AdMob IDs for production.

## 🧪 Testing

Run tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm test -- --watch
```

## 📱 PWA Installation

### Desktop
1. Visit the deployed URL
2. Look for install prompt or click install icon in address bar
3. Click "Install"

### Mobile
1. Visit the deployed URL in Chrome/Safari
2. Tap browser menu (⋮ or share icon)
3. Select "Add to Home Screen"
4. App will install as standalone application

## 🎯 Project Structure

```
daily-planner/
├── public/
│   ├── manifest.json          # PWA manifest
│   ├── icons/                 # App icons (all sizes)
│   └── screenshots/           # App screenshots
├── src/
│   ├── main.tsx              # Entry point
│   ├── App.tsx               # Main app component
│   ├── index.css             # Global styles
│   ├── pages/
│   │   ├── TodayView.tsx     # Today's tasks view
│   │   ├── WeekView.tsx      # Week view
│   │   └── Settings.tsx      # Settings page
│   ├── components/
│   │   ├── Header.tsx        # App header
│   │   ├── TaskCard.tsx      # Individual task card
│   │   ├── FAB.tsx           # Floating action button
│   │   ├── Modal.tsx         # Modal component
│   │   ├── BannerAdPlaceholder.tsx
│   │   └── InterstitialAdPlaceholder.tsx
│   ├── hooks/
│   │   ├── useTasks.ts       # Task management hook
│   │   └── useNotifications.ts # Notifications hook
│   ├── utils/
│   │   ├── storage.ts        # localForage wrapper
│   │   ├── date.ts           # Date helpers (dayjs)
│   │   └── ads.ts            # Ad utilities
│   ├── assets/
│   │   └── sample-data.json  # Sample task data
│   └── tests/
│       ├── setup.ts          # Test setup
│       └── useTasks.test.ts  # Unit tests
├── android/                   # Capacitor Android project (generated)
├── capacitor.config.ts        # Capacitor configuration
├── vite.config.ts            # Vite + Vitest config
├── tailwind.config.js        # Tailwind configuration
├── tsconfig.json             # TypeScript config
├── package.json              # Dependencies & scripts
├── vercel.json               # Vercel deployment config
└── README.md                 # This file
```

## 🔑 Key Technologies

- **React 18**: UI framework
- **TypeScript**: Type safety
- **Vite**: Build tool & dev server
- **TailwindCSS**: Utility-first CSS
- **Capacitor**: Native mobile runtime
- **localForage**: IndexedDB wrapper for offline storage
- **dayjs**: Lightweight date library
- **Framer Motion**: Animation library
- **Vitest**: Unit testing
- **Workbox**: Service worker & PWA
- **ESLint + Prettier**: Code quality

## ✅ QA Acceptance Criteria Checklist

- [ ] App loads in <2s on mobile network emulation
- [ ] Add/edit/delete tasks work offline
- [ ] Data persists across browser reloads
- [ ] Local notifications fire at scheduled times
- [ ] Search returns correct results
- [ ] Export/import JSON functionality works
- [ ] Ad placeholders render and are toggleable
- [ ] PWA install prompt appears on supported browsers
- [ ] All inputs are keyboard navigable
- [ ] Screen reader accessible (ARIA labels)
- [ ] Dark mode toggle works
- [ ] Swipe gestures work on mobile

## 🎨 UI/UX Features

### Mobile-First Design
- Single-column layout on mobile
- Two-column layout on tablets (>768px)
- Touch-optimized tap targets (min 44x44px)
- Swipe gestures for task actions

### Accessibility
- ARIA labels on interactive elements
- Keyboard navigation support
- High contrast ratios (WCAG AA)
- Focus indicators
- Screen reader friendly

### Animations
- Smooth micro-animations (Framer Motion)
- 60fps performance target
- Reduced motion support

## 🔐 Security & Privacy

- All data stored locally (IndexedDB)
- No external tracking
- User input sanitization
- Secure environment variable handling

## 📊 Performance Optimization

- Code splitting with React.lazy()
- Service worker caching
- Asset optimization
- Tree shaking
- Minimal dependencies

## 🐛 Troubleshooting

### Build Issues
**Problem**: Module not found errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Problem**: Vite dev server not starting
```bash
# Try different port
npm run dev -- --port 3000
```

### Capacitor Issues
**Problem**: Android build fails
```bash
# Ensure Android SDK is properly installed
# Check ANDROID_HOME environment variable
# Sync Capacitor again
npm run cap:sync
```

**Problem**: Notifications not working on Android
- Check AndroidManifest.xml has notification permissions
- Request permissions at runtime in app
- Test on physical device (not emulator)

### PWA Issues
**Problem**: Service worker not updating
```bash
# Clear browser cache
# Hard refresh (Ctrl+Shift+R)
# Check Application tab in DevTools
```

## 📝 Development Scripts

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm test             # Run tests
npm run cap:sync     # Sync Capacitor
npm run cap:open     # Open in Android Studio
```

## 🔄 Data Management

### Export Data
1. Open Settings
2. Tap "Export Data"
3. JSON file downloads to device

### Import Data
1. Open Settings
2. Tap "Import Data"
3. Select JSON file
4. Confirm import

## 📈 Future Enhancements

- [ ] Recurring tasks
- [ ] Task categories/tags
- [ ] Cloud sync (Firebase/Supabase)
- [ ] Collaboration features
- [ ] Calendar integration
- [ ] Voice input
- [ ] Widgets
- [ ] Analytics dashboard
- [ ] Real AdMob integration
- [ ] iOS build

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React Team
- Vite Team
- Tailwind CSS
- Capacitor Team
- Day.js
- Framer Motion
- localForage

## 📞 Support

For issues and questions:
- Create an issue on GitHub
- Check existing documentation
- Review troubleshooting section

---

**Built with ❤️ for productivity enthusiasts**

Last Updated: 2025-01-13
Version: 1.0.0
