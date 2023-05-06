import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import jwtDecode from 'jwt-decode';
import dayjs from 'dayjs';
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';


const CreateJobPage = ({ route, navigation }: { navigation: any, route: any }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('');
  const [salary, setSalary] = useState('');
  const [expiresAt, setExpiresAt] = useState(dayjs());

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
      if (salary < 0) {
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
        setExpiresAt(dayjs());
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
      <View style={styles.center}>
        <h1>Create Job</h1>
        <View style={styles.columns}>
          <View>
            <TextField
              value={title}
              placeholder="Title"
              label="Title"
              onChange={(text) => setTitle(text.target.value)}
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
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker format='DD/MM/YYYY' onChange={(newDate) => setExpiresAt(newDate)} value={expiresAt} minDate={dayjs()} />
            </LocalizationProvider>
            <br />
          </View>
          <View style={styles.description}>
            <TextField
              multiline
              rows={7}
              value={description}
              placeholder="Description"
              label="Description"
              onChange={(text) => setDescription(text.target.value)}
            />
          </View>
        </View>
      </View>
      <Button variant="contained" onClick={handleCreateJob}>Create Job</Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
    marginVertical: 10,
    alignItems: 'center',
  },
  description: {
    width: '60%',
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
  },
  columns: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    width: '70%',
  },
});
export default CreateJobPage;

