import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import jwt_decode from "jwt-decode";
import { Button, CircularProgress, FormControl, InputLabel, MenuItem, Pagination, Select, Tab, TextField } from '@mui/material';
import { Job } from '../models/Job';

export default function JobList({ navigation }: { navigation: any }) {

  // State holding all data.
  const [data, setData] = useState([]);

  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('userToken'));

  const [isLoading, setIsLoading] = useState(true);

  const [searchInput, setSearchInput] = useState('');

  const [showFilter, setShowFilter] = useState(false);

  const [jobTypeFilter, setJobTypeFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [salaryFilter, setSalaryFilter] = useState("");

  const [numberOfPages, setNumberOfPages] = useState(0);

  // Define default page number and size
  const defaultPage = 1;
  const defaultSize = 10;

  // Define state variables for page number, size
  const [page, setPage] = useState(defaultPage);
  const [size, setSize] = useState(defaultSize);

  const prefixUrl = "/api/";

  const [filterActive, setFilterActive] = useState(false);

  const [searchActive, setSearchActive] = useState(false);

  useEffect(() => {
    if (locationFilter.length !== 0 || jobTypeFilter.length !== 0 || salaryFilter.length !== 0) {
      setFilterActive(true);
    } else {
      setFilterActive(false);
    }
  }, [locationFilter, jobTypeFilter, salaryFilter]);

  useEffect(() => {
    if (searchInput.length !== 0) {
      setSearchActive(true);
    } else {
      setSearchActive(false);
    }
  }, [searchInput]);

  async function fetchJobs(url : string) {
    setIsLoading(true);
    console.log("Fetching jobs");
    const response = await fetch(url, {
      method: 'GET',
    });
    if (!response.ok){
      console.log("No content");
      setData([]);
      setNumberOfPages(0);
      setIsLoading(false);
      return;
    }
    const json = await response.json();
    setData(json.content);
    setNumberOfPages(json.totalPages);
    setIsLoading(false);
  }

  // Fetch job list based on current page and size
  useEffect(() => {
    if (filterActive){
      handleFilterSubmit(page);
      return;
    }
    if (searchActive) {
      handleSearch(page);
      return;
    }
    fetchJobs(`${prefixUrl}job?page=${page-1}&size=${size}`);
  }, [page]);

  useEffect(() => {
    const subscribe = navigation.addListener('focus', () => {
      setIsLoggedIn(!!localStorage.getItem('userToken'));
    });
  }, []);


  function isLoggedInAsCompany() {
    if (loginType() === 'COMPANY') {
      return true;
    }
    return false;
  }

  function isLoggedInAsApplicant() {
    if (loginType() === 'APPLICANT') {
      return true;
    }
    return false;
  }

  function loginType(){
    if (!localStorage.getItem('userToken')) {
      return "";
    }
    const decodedToken = jwt_decode(localStorage.getItem('userToken'));
    return decodedToken.role;
  }

  function handleSearch(pageNo : number = 1) {
    //Search
    setPage(pageNo);
    setIsLoading(true);
    if (!searchInput) { //If search input is empty, fetch all jobs
      fetchJobs(`${prefixUrl}job?page=${page-1}&size=${size}`);
      return;
    }
    fetchJobs(`${prefixUrl}job/search/${searchInput}?page=${page-1}&size=${size}`);
  }

  function handleFilterSubmit(pageNo : number = 1) {
    console.log("Filter submit");
    //Filter submits filter options
    setPage(pageNo);
    fetchJobs(`${prefixUrl}job/filter?jobType=${jobTypeFilter}&salary=${salaryFilter}&location=${locationFilter}&page=${page-1}&size=${size}`);
  }

  function handleReset() {
    //Reset filter options
    setJobTypeFilter("");
    setSearchInput("");
    setLocationFilter("");
    setSalaryFilter("");
    setFilterActive(false);
    handleSearch();
  }


  const renderJob = ({ item }: { item: Job }) => (
    <TouchableOpacity style={styles.jobContainer} onPress={() => navigation.navigate("DetailedJob", { jobId: item.id })}>
      <Text style={styles.jobTitle}>{item.title}</Text>
      <Text style={styles.jobType}>{item.jobType}</Text>
      <Text style={styles.jobLocation}>{item.location}</Text>
      {item.expiresAt < new Date().toISOString() && <Text style={styles.expired}>EXPIRED</Text>}
    </TouchableOpacity>
  );

  function isNotSignedIn() {
    if(!localStorage.getItem('userToken')) {
      return true;
    }
  }

  return (
    <View style={styles.container}>
      <h1 style={styles.title}>SoftwareJobs</h1>
      <View style={styles.inline}>
        {isLoggedInAsCompany() ? (
          <Button variant="contained" onClick={() => navigation.navigate('CreateJob')}>Create job</Button>) : (<Tab></Tab> //Tab is used to center the button
        )}
        <View style={styles.search}>
          <Button variant="outlined" onClick={() => setShowFilter(!showFilter)}>Filter</Button>
          <TextField style={styles.searchField} id="outlined-basic" label="Search" variant="outlined" value={searchInput} onChange={(text) => setSearchInput(text.target.value)} />
          <Text>&nbsp;&nbsp;</Text>
          <Button variant="contained" onClick={() => {
              if (page === 1) {
                handleSearch();
              }else{
                setPage(1);
              }
              setSearchActive(true);
            }}>Search</Button>
        </View>


        {isLoggedInAsCompany() ? (
          <Button variant="contained" onClick={() => navigation.navigate("MyJobs")}>My posted jobs</Button>) : (null)
        }

        {isNotSignedIn() ? (
          <Tab></Tab>) : (null)}

        {isLoggedInAsApplicant() ? (
          <Button variant="contained" onClick={() => navigation.navigate("MyApplications")}>My applications</Button>) : (null
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
            <Button variant='outlined' onClick={() => setShowFilter(false)}>Close</Button>
            <Button variant="outlined" onClick={() => handleReset()}>Reset</Button>
            <Button variant="contained" onClick={() => {
              if (page === 1) {
                  handleFilterSubmit();
              } else{
                setPage(1);
              }
              setFilterActive(true);
              }}>Apply Filter</Button>
          </div>
        </div>
      ) : null}
      {isLoading ? <CircularProgress /> : null}
      <FlatList
        data={data}
        renderItem={renderJob}
        keyExtractor={(job) => job.id}
      />
      <Pagination page={page} count={numberOfPages} variant="outlined" showFirstButton showLastButton color="primary" onChange={(e, value) => setPage(value)} />
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
    marginHorizontal: 10,
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
  expired: {
    fontSize: 14,
    color: '#ff0000',
    fontWeight: 'bold',
    position: 'absolute',
    right: 20,
    top: 20
  },
  searchField: {
    width: 300
  }
});