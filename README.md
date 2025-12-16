# Device Inventory Client

A React Native mobile application for managing device inventory using the RESTful API at `https://api.restful-api.dev`. Built with Redux Toolkit for state management, TypeScript for type safety, and comprehensive offline support using AsyncStorage.

## 📦 Downloads

The release APK is available in the following locations:

* **Attatchments Folder:** `Attatchments/app-release.apk` (Ready to use)
* **Build Output:** `android/app/build/outputs/apk/release/app-release.apk`
* **Installation:** Download and install directly on Android devices
* **Build Command:** `cd android && ./gradlew assembleRelease`

## 📱 Features

### ✅ Add Object Screen

* **Form Creation** - Create objects with the following fields:
  * `name` - Object name
  * `year` - Manufacturing year
  * `price` - Object price
  * `CPU model` - CPU model specification
  * `Hard disk size` - Hard disk capacity
* **Online Submission:**
  * Validates input before submission
  * Makes POST call to `https://api.restful-api.dev/objects`
  * Shows loading state during API call
  * Displays returned object ID on success
  * Stores created object in Redux
  * Handles errors with readable messages
* **Offline Submission:**
  * Saves form data to AsyncStorage when offline
  * Generates simple sequential IDs (offline-1, offline-2, etc.) for offline objects
  * Shows message: "Data saved locally (ID: offline-X). Sync when online."
  * Automatically navigates to Get Objects screen with the generated offline ID
  * No API call is made when device is offline
  * Auto-syncs to API when device comes online

### ✅ Get Objects by ID Screen

* **ID Input** - Enter comma-separated IDs (e.g., `3,5,10`)
* **Query Conversion** - Automatically converts to API format (`id=3&id=5&id=10`)
* **Online Fetching:**
  * Calls API only when device is online
  * Displays list of returned objects
  * Stores fetched objects in Redux
  * Caches results in AsyncStorage for offline use
* **Offline Mode:**
  * Shows appropriate offline message
  * Displays last fetched results from Redux
  * Falls back to AsyncStorage if Redux is empty
  * Supports searching by offline IDs (e.g., offline-1, offline-2)
  * Displays offline objects in search results

### ✅ Technical Features

* **State Management** - Redux Toolkit with async thunks
* **Offline Awareness** - Network status checking before API calls
* **Error Handling** - Comprehensive error handling with user-friendly messages
* **Type Safety** - Full TypeScript implementation
* **Form Validation** - Client-side validation for all inputs
* **Loading States** - Visual feedback during API operations
* **Responsive UI** - Clean, modern design with proper keyboard handling
* **Auto-Dismiss Messages** - All error and success messages auto-dismiss after 2 seconds
* **Bottom Toast Messages** - Error and success messages displayed at bottom of screen
* **Offline ID Generation** - Simple sequential IDs (offline-1, offline-2) for offline objects
* **Auto-Sync** - Automatic synchronization of offline data when device comes online
* **Centralized String Management** - All UI strings managed in a single `strings.ts` file for easy maintenance and localization
* **Test Coverage** - Comprehensive test suite with 80%+ coverage

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

* **Node.js** (v20 or higher)
* **npm** or **yarn**
* **React Native CLI**
* **Android Studio** (for Android development)
* **Xcode** (for iOS development - macOS only)
* **Java Development Kit (JDK)** (for Android)

### Installation

1. **Clone or navigate to the project directory:**
   ```bash
   cd DeviceInventoryClient
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Install iOS dependencies (macOS only):**
   ```bash
   cd ios
   pod install
   cd ..
   ```

### Running the App

#### Android

1. **Start Metro Bundler:**
   ```bash
npm start
   # or
yarn start
```

2. **Run on Android (in a new terminal):**
   ```bash
npm run android
   # or
yarn android
```
   Or build and run:
   ```bash
   npx react-native run-android
   ```

#### iOS (macOS only)

1. **Start Metro Bundler:**
   ```bash
   npm start
   # or
   yarn start
   ```

2. **Run on iOS (in a new terminal):**
   ```bash
   npm run ios
   # or
   yarn ios
   ```
   Or build and run:
   ```bash
   npx react-native run-ios
   ```

### Building Release APK (Android)

1. **Navigate to Android directory:**
   ```bash
   cd android
   ```

2. **Clean previous builds:**
   ```bash
   ./gradlew clean
   ```

3. **Build release APK:**
   ```bash
   ./gradlew assembleRelease
   ```

4. **Find the APK:**
   ```
   android/app/build/outputs/apk/release/app-release.apk
   ```

## 📁 Project Structure

```
DeviceInventoryClient/
├── src/
│   ├── api/                  # API configuration and services
│   │   ├── axios.ts          # Axios instance with interceptors
│   │   └── objects.ts        # Object API service functions
│   ├── components/           # Reusable UI components
│   │   ├── shared/           # Shared components
│   │   │   ├── ErrorMessage.tsx
│   │   │   └── LoadingOverlay.tsx
│   │   ├── AddObjectForm.tsx
│   │   └── ObjectDetailsCard.tsx
│   ├── constants/            # Global constants
│   │   ├── index.ts          # API URLs, storage keys, status messages
│   │   └── strings.ts        # Centralized UI strings and messages
│   ├── features/             # Feature modules (Domain-Driven)
│   │   └── objects/          # Objects domain
│   │       ├── objectsTypes.ts    # TypeScript types
│   │       ├── objectsSlice.ts   # Redux slice
│   │       └── objectsThunks.ts  # Async thunks
│   ├── hooks/                # Custom React hooks
│   │   └── useNetworkStatus.ts   # Network status monitoring
│   ├── navigation/           # Navigation setup
│   │   ├── AppNavigator.tsx
│   │   └── navigationTypes.ts
│   ├── screens/              # Screen components
│   │   ├── AddObjectScreen.tsx
│   │   └── GetObjectsByIdScreen.tsx
│   ├── shared/               # Shared utilities
│   │   └── hooks/            # Typed Redux hooks
│   │       ├── useAppDispatch.ts
│   │       └── useAppSelector.ts
│   ├── store/                # Redux store configuration
│   │   └── store.ts
│   ├── utils/                # Utility functions
│   │   └── validation.ts     # Form validation and ID parsing
│   └── App.tsx               # App entry point
├── android/                  # Android native code
├── ios/                      # iOS native code
├── __mocks__/                # Test mocks
├── docs/                     # Documentation
│   ├── IMPLEMENTATION_VERIFICATION.md
│   ├── TEST_CASES.md
│   └── PROJECT_EXPLANATION_GUJARATI.md
└── package.json              # Dependencies
```

## 🔧 Key Technologies

* **React Native** - Mobile app framework
* **Redux Toolkit** - State management with async thunks
* **TypeScript** - Type safety and better developer experience
* **React Navigation** - Navigation library
* **Axios** - HTTP client for API communication
* **AsyncStorage** - Local data persistence
* **@react-native-community/netinfo** - Network status monitoring
* **Jest & React Native Testing Library** - Testing framework

## 📖 Usage Guide

### Adding a New Object

1. Open the app (starts on **Add Object** screen)
2. Fill in the form fields:
   * **Name** - Enter object name
   * **Year** - Enter manufacturing year (e.g., 2024)
   * **Price** - Enter price (e.g., 1200)
   * **CPU Model** - Enter CPU model
   * **Hard Disk Size** - Enter hard disk size (e.g., 512GB)
3. Click **Submit Object**
4. **If Online:**
   * Loading indicator appears
   * On success: "Object successfully created. ID: [id]" message displays
   * Object is stored in Redux
5. **If Offline:**
   * "Data saved locally. Will sync when online." message displays
   * Data is saved to AsyncStorage

### Fetching Objects by ID

1. Navigate to **Get Objects by ID** screen
2. Enter comma-separated IDs (e.g., `3,5,10`)
3. Click **Fetch Objects**
4. **If Online:**
   * Loading indicator appears
   * Objects are fetched from API
   * List of objects displays with all details
   * Objects are stored in Redux and AsyncStorage
5. **If Offline:**
   * "Offline mode. Fetching is disabled; showing last successful results." message displays
   * Last fetched objects from Redux/AsyncStorage are displayed

### Navigation

* App starts on **Get Objects by ID** screen
* **Get Objects Screen** → "+" button (top right) → **Add Object Screen**
* **Add Object Screen** → Back arrow (header) → **Get Objects Screen**
* Navigation is intuitive with clear visual indicators

## 🎨 Features Explained

### Form Validation

The app validates all form inputs:

* ✅ **Name** - Required field
* ✅ **Year** - Must be valid year (1900 to current year + 1)
* ✅ **Price** - Must be positive number
* ✅ **CPU Model** - Required field
* ✅ **Hard Disk Size** - Required field

### Network Status Awareness

* App checks network status before every API call
* Shows offline banner when device is offline
* Automatically saves data locally when offline
* Displays cached data when offline

### Error Handling

* **API Errors** - Mapped to user-friendly messages
* **Network Errors** - Clear messages about connectivity
* **Validation Errors** - Field-specific error messages
* **Storage Errors** - Handled gracefully
* **Message Display** - All error and success messages appear at bottom of screen
* **Auto-Dismiss** - Messages automatically disappear after 2 seconds
* **Toast-Style UI** - Clean, non-intrusive message display

### Offline Data Management

* **Add Object (Offline):**
  * Data saved to AsyncStorage queue
  * Generates simple sequential ID (offline-1, offline-2, etc.)
  * Message shows generated offline ID
  * Data ready for sync when online
  * Automatically syncs when device comes online
  * Offline IDs replaced with real API IDs after sync

* **Get Objects (Offline):**
  * Shows last fetched results from Redux
  * Falls back to AsyncStorage if needed
  * Supports searching by offline IDs
  * Displays offline objects in search results
  * Clear offline message displayed

* **Auto-Sync:**
  * Automatically syncs queued offline data when device comes online
  * Replaces temporary offline IDs with real API IDs
  * Removes synced items from local storage
  * Keeps failed items in queue for retry

## 🛠️ Development

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Test Coverage

* **Total Test Suites:** 12
* **Total Tests:** 88+
* **Coverage:** 80%+ for all critical files
* **Test Files:**
  * Component tests
  * Redux slice tests
  * Redux thunk tests
  * API service tests
  * Utility function tests

### Code Style

* **TypeScript** for type safety
* **Functional Components** with Hooks
* **Clean Architecture** principles
* **Modular Structure** - Domain-driven design
* **Centralized Constants** - Colors, strings, API URLs
* **Centralized String Management** - All UI strings in `src/constants/strings.ts` for easy maintenance
* **Reusable Components** - Shared UI components
* **Comment-Free Code** - Clean, production-ready codebase
* **Consistent Styling** - Unified UI components and styles

## 📝 Dependencies

### Core Dependencies

* `react` - React library
* `react-native` - React Native framework
* `@reduxjs/toolkit` - Redux Toolkit for state management
* `react-redux` - React bindings for Redux
* `@react-navigation/native` - Navigation library
* `@react-navigation/native-stack` - Stack navigator
* `axios` - HTTP client for API calls
* `@react-native-async-storage/async-storage` - Local storage
* `@react-native-community/netinfo` - Network status
* `react-native-safe-area-context` - Safe area handling
* `react-native-screens` - Native screen components

### Dev Dependencies

* `@testing-library/react-native` - Component testing
* `@testing-library/jest-native` - Jest matchers
* `jest` - Testing framework
* `typescript` - TypeScript compiler
* `@types/jest` - Jest type definitions

## 🐛 Troubleshooting

### Metro Bundler Issues

If you encounter Metro bundler issues:

```bash
# Clear cache and restart
npm start -- --reset-cache
# or
yarn start -- --reset-cache
```

### Android Build Issues

```bash
# Clean Android build
cd android
./gradlew clean
cd ..
```

### iOS Build Issues

```bash
# Clean iOS build
cd ios
pod deintegrate
pod install
cd ..
```

### Network/API Issues

* Ensure device has internet connection for API calls
* Check API endpoint: `https://api.restful-api.dev`
* Verify network permissions in AndroidManifest.xml

## 📱 Testing

### Manual Testing Checklist

* ✅ Add object with valid data (online)
* ✅ Add object with invalid data (validation errors)
* ✅ Add object when offline (local save)
* ✅ Fetch objects by IDs (online)
* ✅ Fetch objects when offline (cached results)
* ✅ Invalid ID format handling
* ✅ Network status changes
* ✅ Error handling (API errors)
* ✅ Navigation between screens
* ✅ Form validation
* ✅ Loading states
* ✅ Empty states

### Test Coverage

✅ **Comprehensive Test Suite** - 88+ test cases covering:
* Component rendering and interactions
* Redux state management
* API calls and error handling
* Form validation
* Offline/online scenarios
* Navigation flows

## 📊 API Endpoints

### Base URL
```
https://api.restful-api.dev
```

### Endpoints

* **POST /objects** - Create a new object
  * Payload: `{ name: string, data: { year: number, price: number, CPU model: string, Hard disk size: string } }`
  * Response: `{ id: string, name: string, data: {...} }`

* **GET /objects?id=X&id=Y** - Fetch objects by IDs
  * Query: Comma-separated IDs converted to `id=3&id=5&id=10`
  * Response: `[{ id: string, name: string, data: {...} }, ...]`

## 🎯 Project Status

✅ **All Requirements Implemented:**
* ✅ Two screens (Add Object, Get Objects by ID)
* ✅ Form validation
* ✅ Online/Offline handling
* ✅ Redux Toolkit with async thunks
* ✅ Error handling
* ✅ Loading states
* ✅ AsyncStorage integration
* ✅ Network status awareness
* ✅ Test coverage (80%+)
* ✅ TypeScript implementation
* ✅ Clean architecture

## 📄 License

This project is for educational purposes.

## 👨‍💻 Author

Developed as a React Native Device Inventory Client application with complete CRUD operations and offline support.

---

**Note:** This app uses the public API at `https://api.restful-api.dev` for demonstration purposes. For production use, integrate with a secure backend API.
