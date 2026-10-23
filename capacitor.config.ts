import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'fr.furrix.app',
  appName: 'Furrix',
  webDir: 'dist',
  server: { androidScheme: 'https' },
  plugins: {
    SplashScreen: { launchShowDuration: 1200, backgroundColor: '#1E2420' },
  },
};

export default config;
