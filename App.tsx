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
import { StyleSheet, View } from 'react-native';
import UserInformation from "./components/UserInformation";
import CompanyDetails from "./components/CompanyDetails";
import jwt_decode from "jwt-decode";

const Stack = createNativeStackNavigator();

const linking = {
  config: {
    screens: {
      Home: "",
      DetailedJob: 'detailedJob',
      Apply: 'apply',
      Login: 'login',
      Register: 'register',
      CreateJob: 'createJob',
      MyJobs: 'myJobs',
      Applications: 'applications',
      DetailedApplication: 'detailedApplication',
      MyApplications: 'myApplications',
      UserInformation: 'userInformation',
      CompanyDetails: 'companyDetails',
    },
  },
};

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <NavigationContainer linking={linking}>
        <Stack.Navigator initialRouteName='Home'>
          <Stack.Screen name="Home" component={JobList} options={({ navigation }) => ({
            title: 'Jobs',
            headerRight: () => headerButtons({ navigation }),
          })} />
          <Stack.Screen name="DetailedJob" component={DetailedJob} options={({ navigation }) => ({
            title: 'Detailed Job',
            headerRight: () => headerButtons({ navigation }),
          })} />
          <Stack.Screen name="Applications" component={Applications} options={({ navigation }) => ({
            headerRight: () => headerButtons({ navigation }),
          })} />
          <Stack.Screen name="DetailedApplication" component={DetailedApplication} options={({ navigation }) => ({
            title: 'Detailed Application',
            headerRight: () => headerButtons({ navigation }),
          })} />
          <Stack.Screen name="CompanyDetails" component={CompanyDetails} options={({ navigation }) => ({
            title: 'Company Details',
            headerRight: () => headerButtons({ navigation }),
          })} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} options={({ navigation }) => ({
            headerRight: () => headerButtons({ navigation }),
          })} />
          <Stack.Screen name="UserInformation" component={UserInformation} options={({ navigation }) => ({
            title: 'User Information',
            headerRight: () => headerButtons({ navigation }),
          })} />
          <Stack.Screen name="MyApplications" component={MyApplications} options={({ navigation }) => ({
            title: 'My Applications',
            headerRight: () => headerButtons({ navigation }),
          })} />
          <Stack.Screen name="Apply" component={Apply} options={({ navigation }) => ({
            headerRight: () => headerButtons({ navigation }),
          })} />
          <Stack.Screen name="MyJobs" component={MyJobs} options={({ navigation }) => ({
            title: 'My Jobs',
            headerRight: () => headerButtons({ navigation }),
          })} />
          <Stack.Screen name="CreateJob" component={CreateJob} options={({ navigation }) => ({
            title: 'Create Job',
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
      const token = localStorage.getItem('userToken');
      if (token) {
        const decodedToken = jwt_decode(token);
        const currentTime = Date.now() / 1000; // convert to seconds
        if (decodedToken.exp < currentTime) {
          // JWT has expired, prompt user to log in again
          localStorage.removeItem('userToken');
        } else{
          setIsLoggedIn(true);
        }
      } else {
        setIsLoggedIn(false);
      }
    });
  }, []);

  return (
    <View style={styles.inline}>
      <Button style={styles.button} variant="contained" onClick={() => navigation.navigate("Home")}>Home</Button>
      {isLoggedIn ? (
        <Button style={styles.button} variant="contained" onClick={handleLogout}>Logout</Button>) : (
        <Button style={styles.button} variant="contained" onClick={() => navigation.navigate("Login")}>Login</Button>
      )}
      {isLoggedIn === true && (<Button style={styles.button} variant="contained" onClick={() => navigation.navigate("UserInformation")}>My information</Button>)}
    </View>
  )
}

const styles = StyleSheet.create({
  button: {
    marginRight: 20,
  },
  inline: {
    flexDirection: 'row',
  }
})