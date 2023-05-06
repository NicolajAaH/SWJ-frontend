import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import '../styles/DatePicker.css'
import '../styles/Calendar.css'
import DatePicker from 'react-date-picker';
import jwtDecode from 'jwt-decode';
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';


const CreateJobPage = ({ route, navigation }: { navigation: any, route: any }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('');
  const [salary, setSalary] = useState('');
  const [expiresAt, setExpiresAt] = useState(new Date());

  useEffect(() => {
    const decodedToken = jwtDecode(localStorage.getItem('userToken'));
    if (decodedToken.role !== 'COMPANY') {
        navigation.navigate('Home');
        return;
    }
  }, []);

  const handleCreateJob = async () => {
    try {
      if (!title || !description || !location || !jobType || !salary || !expiresAt) {
        alert('Please fill in all fields');
        return;
      }
      if(salary < 0) {
        alert('Salary must be a positive number');
        return;
      }

      const decodedToken = jwtDecode(localStorage.getItem('userToken'));
      const email = decodedToken.email;

      const response = await fetch(`/api/job/${email}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("userToken")}`
        },
        body: JSON.stringify({ title, location, description, jobType, salary, expiresAt }),
      });
      if (response.ok) {
        navigation.navigate('Home');
        // Clear the form fields
        setTitle('');
        setDescription('');
        setLocation('');
        setJobType('');
        setSalary('');
        setExpiresAt(new Date());
        navigation.navigate('Home');
      } else {
        throw new Error('Application failed');
      }
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  return (
    <View style={styles.container}>
      <h1>Create Job</h1>
      <TextField
        value={title}
        placeholder="Title"
        label="Title"
        onChange={(text) => setTitle(text.target.value)}
      />
      <br />
      <TextField
        value={description}
        placeholder="Description"
        label="Description"
        onChange={(text) => setDescription(text.target.value)}
      />
      <br />
      <TextField
        value={location}
        placeholder="Location"
        label="Location"
        onChange={(text) => setLocation(text.target.value)}
      />
      <br />
      <FormControl>
      <InputLabel id="job-type-label">Job Type</InputLabel>
      <Select
    labelId="job-type-label"
    id="job-type-select"
    value={jobType}
    label="JobType"
    style={{ width: 200 }}
    onChange={(text) => setJobType(text.target.value)}
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
      <br />
      <TextField
        value={salary}
        placeholder="Salary (DKK/year)"
        label="Salary (DKK/year)"
        type="number"
        onChange={(text) => setSalary(text.target.value)}
      />
      <br />
      <Text style={styles.label}>Expires At</Text>
      <DatePicker onChange={setExpiresAt} value={expiresAt} minDate={new Date()}/>
      <br />
      <Button variant="contained" onClick={handleCreateJob}>Create Job</Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontWeight: 'bold',
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    width: '100%',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  }
});
export default CreateJobPage;

