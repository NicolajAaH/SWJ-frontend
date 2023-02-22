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
import Applications from './components/Applications';
import DetailedApplication from './components/DetailedApplication';
import MyApplications from './components/MyApplications';

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
            <Stack.Screen name="DetailedJob" component={DetailedJob} options={{ title: 'Detailed Job' }}/>
            <Stack.Screen name="Apply" component={Apply} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="CreateJob" component={CreateJob}  options={{ title: 'Create Job' }}/>
            <Stack.Screen name="MyJobs" component={MyJobs}  options={{ title: 'My Jobs' }}/>
            <Stack.Screen name="Applications" component={Applications} />
            <Stack.Screen name="DetailedApplication" component={DetailedApplication}  options={{ title: 'Detailed Application' }}/>
            <Stack.Screen name="MyApplications" component={MyApplications} options={{ title: 'My Applications' }}/>
          </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
