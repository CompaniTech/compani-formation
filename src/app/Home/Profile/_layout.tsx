import { Stack } from 'expo-router';

const ProfilePageLayout = () => (
  <Stack screenOptions={{ headerShown: false }}>
    <Stack.Screen name='index'/>
  </Stack>
);
export default ProfilePageLayout;
