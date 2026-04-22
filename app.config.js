export default ({ config }) => {
  const isDevelopment = process.env.APP_VARIANT === 'development';

  return {
    ...config,
    expo: {
      name: "Rested",
      slug: "rested-fitness",
      version: "1.0.0",
      orientation: "portrait",
      icon: "./app/assets/icon.png",
      userInterfaceStyle: "light",
      splash: {
        image: "./app/assets/splash.png",
        resizeMode: "contain",
        backgroundColor: "#ffffff"
      },
      ios: {
        supportsTablet: true,
        bundleIdentifier: isDevelopment
          ? "com.mhassan0600.rested.dev"
          : "com.mhassan0600.rested",
        infoPlist: {
          ITSAppUsesNonExemptEncryption: false,
          UIBackgroundModes: ["remote-notification"]
        },
        entitlements: {
          "aps-environment": isDevelopment ? "development" : "production"
        }
      },
      android: {
        adaptiveIcon: {
          foregroundImage: "./app/assets/icon.png",
          backgroundColor: "#ffffff"
        }
      },
      web: {
        favicon: "./app/assets/icon.png",
        bundler: "metro"
      },
      plugins: [
        [
          "expo-notifications",
          {
            icon: "./app/assets/icon.png",
            color: "#ffffff",
            sounds: []
          }
        ]
      ],
      owner: "mhassan0600",
      runtimeVersion: {
        policy: "appVersion"
      },
      updates: {
        url: "https://u.expo.dev/0d9abf74-03e7-49a0-9f3c-b119c6694fde"
      },
      extra: {
        eas: {
          projectId: "0d9abf74-03e7-49a0-9f3c-b119c6694fde"
        }
      }
    }
  };
};
