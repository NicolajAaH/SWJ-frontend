import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import jwt_decode from "jwt-decode";
import { Button, CircularProgress, TextField } from '@mui/material';


export default function JobList({ navigation }: { navigation: any }) {

  //TODO ADD FILTER FUNCTINOALITY

  // State holding all data.
  const [data, setData] = useState([]);

  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('userToken'));

  const [isLoading, setIsLoading] = useState(true);

  const [searchInput, setSearchInput] = useState('');




  // Fetch job list once component is mounted
  useEffect(() => {
    const subscribe = navigation.addListener('focus', () => { //TODO slet hvis det ikke virker
      async function fetchJobs() {
        const response = await fetch(`http://localhost:8080/api/bff/job`, {
          method: 'GET',
        });
        const json = await response.json();
        setData(json);
        setIsLoading(false);
      }
      fetchJobs();
    });
  }, []);

  useEffect(() => {
    const subscribe = navigation.addListener('focus', () => {
      setIsLoggedIn(!!localStorage.getItem('userToken'));
    });
  }, []);

  

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

  function handleSearch() {
    //Search
    if(searchInput === '') { //If search input is empty, fetch all jobs
      async function fetchJobs() {
        const response = await fetch(`http://localhost:8080/api/bff/job`, {
          method: 'GET',
        });
        const json = await response.json();
        setData(json);
        setIsLoading(false);
      }
      fetchJobs();
    }
    setIsLoading(true);
    
    console.log(searchInput);
    async function fetchJobs() {
      const response = await fetch(`http://localhost:8080/api/bff/job/search/${searchInput}`, {
        method: 'GET',
      });
      const json = await response.json();
      setData(json);
      setIsLoading(false);
    }
    fetchJobs();
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
      <h1 style={styles.title}>SoftwareJobs</h1>
      <View style={styles.inline}>
      {isLoggedInAsCompany() ? (
        <Button variant="contained" onClick={handleCreateJob}>Create job</Button>) : (null
      )}
      <View style={styles.search}>
      <TextField id="outlined-basic" label="Search" variant="outlined" value={searchInput} onChange={(text) => setSearchInput(text.target.value)} />
      <Text>&nbsp;&nbsp;</Text>
      <Button variant="contained" onClick={handleSearch}>Search</Button>
      </View>


      {isLoggedInAsCompany() ? (
        <Button variant="contained" onClick={handleMyPostedJobs}>My posted jobs</Button>) : (null
      )}

      {isLoggedInAsApplicant() ? (
        <Button variant="contained" onClick={handleMyApplictions}>My applications</Button>) : (null
      )}
      </View>
      {isLoading ? <CircularProgress /> : null}
      <FlatList
        data={data}
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
  title: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 20,
    textAlign: 'center'
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
  },
  inline: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  search: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',

  },
});