import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Button } from "react-native";
import jwt_decode from "jwt-decode";

export default function MyJobs({ navigation }: { navigation: any }) {

  // State holding all data.
  const [data, setData] = useState([]);

  // Fetch job list once component is mounted
  useEffect(() => {
    async function fetchJobs() {
      const response = await fetch(`http://localhost:8080/api/bff/company/${jwt_decode(localStorage.getItem('userToken')).email}`, {
        method: 'GET',
      });
      const json = await response.json();
      setData(json);
    }
    fetchJobs();
  }, []);

const handleLogout = async () => {
  try {
      localStorage.removeItem('userToken');
  } catch (e) {
    console.error(e);
  } 
};

  const renderJob = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.jobContainer} onPress={() => navigation.navigate("DetailedJob", { jobId: item.id })}>
      <Text style={styles.jobTitle}>{item.title}</Text>
      <Text style={styles.jobType}>{item.jobType}</Text>
      <Text style={styles.jobLocation}>{item.location}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={data.jobs}
        renderItem={renderJob}
        keyExtractor={(job) => job.id}
      />
      {localStorage.getItem('userToken') ? (
        <Button title='Logout' onPress={handleLogout}></Button>) : (
        <Text></Text>
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