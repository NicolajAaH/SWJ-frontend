import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import JobList from './components/JobList';
import DetailedJob from './components/DetailedJob';
import Apply from './components/Apply';
import Login from './components/Login';
import Register from './components/Register';
import CreateJob from './components/CreateJob';
import MyJobs from './components/MyJobs';

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
            <Stack.Screen name="Apply" component={Apply} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="CreateJob" component={CreateJob} />
            <Stack.Screen name="MyJobs" component={MyJobs} />
          </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
