import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import jwt_decode from "jwt-decode";
import { Button } from '@mui/material';


export default function JobList({ navigation }: { navigation: any }) {

  // State holding all data.
  const [data, setData] = useState([]);

  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('userToken'));


  // Fetch job list once component is mounted
  useEffect(() => {
    async function fetchJobs() {
      const response = await fetch(`http://localhost:8080/api/bff/job`, {
        method: 'GET',
      });
      const json = await response.json();
      setData(json);
    }
    fetchJobs();
  }, []);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('userToken'));
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem('userToken');
      setIsLoggedIn(false);
      alert('You have been logged out');
      navigation.navigate('Login');
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateJob = async () => {
    try {
      navigation.navigate("CreateJob");
    } catch (e) {
      console.error(e);
    }
  };

  const handleMyPostedJobs = async () => {
    try {
      navigation.navigate("MyJobs");
    } catch (e) {
      console.error(e);
    }
  };

  const handleMyApplictions = async () => {
    try {
      navigation.navigate("MyApplications");
    } catch (e) {
      console.error(e);
    }
  };

  function isLoggedInAsCompany() {
    if (!localStorage.getItem('userToken')) {
      return false;
    }
    const decodedToken = jwt_decode(localStorage.getItem('userToken'));
    if (decodedToken.role === 'COMPANY') {
      return true;
    }
    return false;
  }

  function isLoggedInAsApplicant() {
    if (!localStorage.getItem('userToken')) {
      return false;
    }
    const decodedToken = jwt_decode(localStorage.getItem('userToken'));
    if (decodedToken.role === 'APPLICANT') {
      return true;
    }
    return false;
  }


  const renderJob = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.jobContainer} onPress={() => navigation.navigate("DetailedJob", { jobId: item.id })}>
      <Text style={styles.jobTitle}>{item.title}</Text>
      <Text style={styles.jobType}>{item.jobType}</Text>
      <Text style={styles.jobLocation}>{item.location}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {isLoggedInAsCompany() ? (
        <Button variant="contained" onClick={handleCreateJob}>Create job</Button>) : (<Text></Text>
      )}
      {isLoggedInAsCompany() ? (
        <Button variant="contained" onClick={handleMyPostedJobs}>My posted jobs</Button>) : (<Text></Text>
      )}

      {isLoggedInAsApplicant() ? (
        <Button variant="contained" onClick={handleMyApplictions}>My applications</Button>) : (<Text></Text>
      )}
      <FlatList
        data={data}
        renderItem={renderJob}
        keyExtractor={(job) => job.id}
      />
      {isLoggedIn ? (
        <Button variant="contained" onClick={handleLogout}>Logout</Button>) : (
        <Button variant="contained" onClick={() => navigation.navigate("Login")}>Login</Button>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20
  },
  jobContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    marginVertical: 10,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowRadius: 6,
    shadowOpacity: 0.26,
    elevation: 8
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5
  },
  jobType: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 5
  },
  jobLocation: {
    fontSize: 14,
    color: '#666666',
  }
});