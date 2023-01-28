import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import JobList from './components/JobList';
import DetailedJob from './components/DetailedJob';

const Stack = createNativeStackNavigator();
const MyTheme = {
  colors: {
    background: 'rgb(48, 81, 119)',
  },
};

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <NavigationContainer>
          <Stack.Navigator initialRouteName='Home'>
            <Stack.Screen name="Home" component={JobList} />
            <Stack.Screen name="DetailedJob" component={DetailedJob} />
          </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
