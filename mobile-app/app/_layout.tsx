import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import Colors from '../constants/Colors';
import BackButton from '../components/buttons/back-button';



export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {


  return (
      <Stack initialRouteName='(test)/test'
      screenOptions={{ gestureEnabled: false}}
      >
        <Stack.Screen name="(test)/test" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(add-medication)/add-medication" options={{
        title: 'Add Medication', headerStyle: { backgroundColor: Colors.brand.accent }, headerTintColor: 'white', headerLeft: () => { return <BackButton /> }}}/>
                <Stack.Screen name="(add-medication)/enter-dosage" options={{
        title: 'Enter dosage', headerStyle: { backgroundColor: Colors.brand.accent }, headerTintColor: 'white', headerLeft: () => { return <BackButton /> }}}
        />
      </Stack>
  );
}
