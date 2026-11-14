# MIC SMART CAMPUS — ANDROID DEBUG APK BUILD SPECIFICATION

## 1. Build Metadata
- **Application Name**: MIC Smart Campus
- **Package Name (Application ID)**: `com.mic.campus.mic_campus`
- **Build Variant**: `debug`
- **Target SDK**: 34+
- **Min SDK**: 21
- **Flutter Version**: 3.50.0 (Channel stable)
- **Dart SDK**: 3.14.0
- **Java Virtual Machine**: OpenJDK 17.0.13 (Temurin / Adoptium)
- **Gradle Version**: 9.5.0
- **Android Gradle Plugin (AGP)**: 9.3.1
- **Kotlin Target**: JVM 17

---

## 2. Mandatory Build Command
```bash
cd apps/mobile
flutter build apk --debug
```

### Verified Output Artifacts:
1. `apps/mobile/build/app/outputs/flutter-apk/app-debug.apk` (158,960,402 bytes)
2. `dist/android/MIC-Smart-Campus-debug.apk` (158,960,402 bytes — Verified Non-Empty, Functional)

### AAPT Manifest Badging Verification:
```
package: name='com.mic.campus.mic_campus' versionCode='1' versionName='1.0.0' platformBuildVersionName='16' platformBuildVersionCode='36' compileSdkVersion='36' compileSdkVersionCodename='16'
application-label:'MIC Smart Campus'
launchable-activity: name='com.mic.campus.mic_campus.MainActivity'  label='' icon=''
```

---

## 3. Permissions Declared in AndroidManifest.xml
- `android.permission.INTERNET`: Required for Supabase realtime synchronization, authentication, and REST queries.
- `android.permission.ACCESS_NETWORK_STATE`: Network availability detection and offline-friendly cached data fallback.
- `android.permission.POST_NOTIFICATIONS`: Android 13+ push notification permission for notices, fee dues, and results alerts.

---

## 4. Verification Checkpoints
- [x] Flutter SDK installed and functional.
- [x] Java JDK 17 configured.
- [x] Android SDK Platforms 34/35 and cmdline-tools linked.
- [x] Dependencies resolved via `flutter pub get`.
- [x] Static analysis passed with zero errors (`flutter analyze`).
- [x] Automated widget and unit tests passed (`flutter test`).
- [x] Android application ID and launcher label verified as `MIC Smart Campus`.
- [x] Debug APK binary compiled, verified non-empty, and copied to `dist/android/MIC-Smart-Campus-debug.apk`.
