import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import jwt_decode from "jwt-decode";
import { Button, CircularProgress, FormControl, InputLabel, MenuItem, Select, Tab, TextField } from '@mui/material';


export default function JobList({ navigation }: { navigation: any }) {

  //TODO ADD FILTER FUNCTINOALITY

  // State holding all data.
  const [data, setData] = useState([]);

  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('userToken'));

  const [isLoading, setIsLoading] = useState(true);

  const [searchInput, setSearchInput] = useState('');

  const [showFilter, setShowFilter] = useState(false);

  const [jobTypeFilter, setJobTypeFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [salaryFilter, setSalaryFilter] = useState("");




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
    setIsLoading(true);
    if (!searchInput) { //If search input is empty, fetch all jobs
      async function fetchJobs() {
        const response = await fetch(`http://localhost:8080/api/bff/job`, {
          method: 'GET',
        });
        const json = await response.json();
        setData(json);
        setIsLoading(false);
      }
      fetchJobs();
      return;
    }

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

  function handleFilter() {
    //Filter opens popup with filter options
    setShowFilter(!showFilter);
  }

  function handleFilterClose() {
    //Filter closes popup with filter options
    setShowFilter(false);
  }

  function handleFilterSubmit() {
    //Filter submits filter options
    setIsLoading(true);
    async function fetchJobs() {
      const response = await fetch(`http://localhost:8080/api/bff/job/filter?jobType=${jobTypeFilter}&salary=${salaryFilter}&location=${locationFilter}`, {
        method: 'GET',
      });
      if(response.status === 204){
        console.log("No jobs found");
        setData([]);
      }else{
      const json = await response.json();
      setData(json);
      }
      setIsLoading(false);
    }
    fetchJobs();
  }

  function handleReset(){
    //Reset filter options
    setJobTypeFilter("");
    setSearchInput("");
    setLocationFilter("");
    setSalaryFilter("");
    handleSearch();
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
          <Button variant="contained" onClick={handleCreateJob}>Create job</Button>) : (<Tab></Tab> //Tab is used to center the button
        )}
        <View style={styles.search}>
          <Button variant="outlined" onClick={handleFilter}>Filter</Button>
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
      {showFilter ? (
        <div className="filter-popup" >
          <h2>Filter Options</h2>
          <div className="filter-content" style={styles.inline}>
            <FormControl>
              <InputLabel id="job-type-label">Job Type</InputLabel>
              <Select
                labelId="job-type-label"
                id="job-type-select"
                value={jobTypeFilter}
                label="JobType"
                style={{ width: 200 }}
                onChange={(text) => setJobTypeFilter(text.target.value)}
              >
                <MenuItem value={'FRONTEND'}>Frontend</MenuItem>
                <MenuItem value={'BACKEND'}>Backend</MenuItem>
                <MenuItem value={'ARCHITECT'}>Architect</MenuItem>
                <MenuItem value={'DEVOPS'}>DevOps</MenuItem>
                <MenuItem value={'FULLSTACK'}>Fullstack</MenuItem>
                <MenuItem value={'QA'}>QA</MenuItem>
                <MenuItem value={'MANAGER'}>Manager</MenuItem>
                <MenuItem value={'OTHER'}>Other</MenuItem>
              </Select>
            </FormControl>
            <TextField
              value={locationFilter}
              placeholder="Location"
              label="Location"
              onChange={(text) => setLocationFilter(text.target.value)}
            />
            <TextField
              value={salaryFilter}
              placeholder="Salary (DKK/year)"
              label="Salary (DKK/year)"
              type="number"
              onChange={(text) => setSalaryFilter(text.target.value)}
            />
            <Button variant='outlined' onClick={handleFilterClose}>Close</Button>
            <Button variant="outlined" onClick={handleReset}>Reset</Button>
            <Button variant="contained" onClick={handleFilterSubmit}>Filter</Button>
          </div>
        </div>
      ) : null}
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