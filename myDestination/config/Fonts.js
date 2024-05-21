import { useFonts } from '@expo-google-fonts/kodchasan';

const [fontsLoaded] = useFonts({
  Kodchasan_400Regular,
  Kodchasan_700Bold,
});

if (!fontsLoaded) {
  return <AppLoading />;
}


