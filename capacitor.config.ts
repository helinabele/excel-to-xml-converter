import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.converter.app',
  appName: 'excel-to-xml-converter',
  webDir: 'build',
  server: {
    androidScheme: 'https'
  }
};

export default config;
