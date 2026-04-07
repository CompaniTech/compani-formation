import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';
import mockSafeAreaContext from 'react-native-safe-area-context/jest/mock';

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);
jest.mock('react-native-reanimated', () => {});
jest.mock('react-native-safe-area-context', () => mockSafeAreaContext);
jest.mock('react-native-webview', () => {});
jest.mock('react-native-gesture-handler', () => ({
  ...jest.requireActual('react-native-gesture-handler'),
  GestureHandlerRootView: ({ children }) => <>{children}</>,
}));
jest.mock('expo-audio', () => {});
jest.mock('expo-video', () => {});
