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
import { Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

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
      <NavigationContainer >
        <Stack.Navigator initialRouteName='Home'>
          <Stack.Screen name="Home" component={JobList} options={({ navigation }) => ({
            title: 'Jobs',
            headerRight: () => headerButtons({ navigation }),
          })}/>
          <Stack.Screen name="DetailedJob" component={DetailedJob} options={({ navigation }) => ({
            title: 'Detailed Job',
            headerRight: () => headerButtons({ navigation }),
          })} />
          <Stack.Screen name="Apply" component={Apply} options={({ navigation }) => ({
            headerRight: () => headerButtons({ navigation }),
          })}/>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} options={({ navigation }) => ({
            headerRight: () => headerButtons({ navigation }),
          })}/>
          <Stack.Screen name="CreateJob" component={CreateJob} options={({ navigation }) => ({
            title: 'Create Job',
            headerRight: () => headerButtons({ navigation }),
          })} />
          <Stack.Screen name="MyJobs" component={MyJobs} options={({ navigation }) => ({
            title: 'My Jobs',
            headerRight: () => headerButtons({ navigation }),
          })}/>
          <Stack.Screen name="Applications" component={Applications} options={({ navigation }) => ({
            headerRight: () => headerButtons({ navigation }),
          })}/>
          <Stack.Screen name="DetailedApplication" component={DetailedApplication} options={({ navigation }) => ({
            title: 'Detailed Application',
            headerRight: () => headerButtons({ navigation }),
          })} />
          <Stack.Screen name="MyApplications" component={MyApplications} options={({ navigation }) => ({
            title: 'My Applications',
            headerRight: () => headerButtons({ navigation }),
          })} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}


function headerButtons({ navigation }: { navigation: any }) {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('userToken'));

  const handleLogout = () => {
    try {
      localStorage.removeItem('userToken');
      setIsLoggedIn(false);
      navigation.navigate('Login');
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const subscribe = navigation.addListener('focus', () => {
      setIsLoggedIn(!!localStorage.getItem('userToken'));
    });
  }, []);

  return (
    <View>
      {isLoggedIn ? (
        <Button variant="contained" onClick={handleLogout}>Logout</Button>) : (
        <Button variant="contained" onClick={() => navigation.navigate("Login")}>Login</Button>
      )}
    </View>
  )
}