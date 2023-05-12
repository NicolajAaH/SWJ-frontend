import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Button } from "react-native";
import jwt_decode from "jwt-decode";
import { CircularProgress } from '@mui/material';
import jwtDecode from 'jwt-decode';


export default function MyJobs({ navigation }: { navigation: any }) {

  // State holding all data.
  const [data, setData] = useState([]);

  const [isLoading, setIsLoading] = useState(true);


  // Fetch job list once component is mounted
  useEffect(() => {
    const decodedToken = jwtDecode(localStorage.getItem('userToken'));
    if (decodedToken.role !== 'COMPANY') { // Only companies can see their jobs
      navigation.navigate('Home');
      return;
    }

    async function fetchJobs() {
      const response = await fetch(`/api/company/${jwt_decode(localStorage.getItem('userToken')).email}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("userToken")}`
        }
      });
      const json = await response.json();
      setData(json);
      setIsLoading(false);
    }
    fetchJobs();
  }, []);


  const renderJob = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.jobContainer} onPress={() => navigation.navigate("Applications", { job: item })}>
      <Text style={styles.jobTitle}>{item.title}</Text>
      <Text style={styles.jobType}>{item.jobType}</Text>
      <Text style={styles.jobLocation}>{item.location}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 30, fontWeight: 'bold', marginBottom: 20 }}>My Jobs</Text>
      <Text>Click on a job to see applications for the job</Text>
      {isLoading ? <CircularProgress /> : null}
      <FlatList
        data={data.jobs}
        renderItem={renderJob}
        keyExtractor={(job) => job.id}
      />
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
    marginHorizontal: 10,
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