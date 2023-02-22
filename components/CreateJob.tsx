import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import DatePicker from 'react-date-picker';
import jwtDecode from 'jwt-decode';
import { Button, TextField } from '@mui/material';


const CreateJobPage = ({ route, navigation }: { navigation: any, route: any }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('');
  const [salary, setSalary] = useState('');
  const [expiresAt, setExpiresAt] = useState(new Date());


  const handleCreateJob = async () => {
    try {
      if (!title || !description || !location || !jobType || !salary || !expiresAt) {
        alert('Please fill in all fields');
        return;
      }

      const decodedToken = jwtDecode(localStorage.getItem('userToken'));
      const email = decodedToken.email;

      const response = await fetch(`http://localhost:8080/api/bff/job/${email}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
      <TextField
        value={jobType}
        placeholder="Job Type"
        label="Job Type"
        onChange={(text) => setJobType(text.target.value)}
      />
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
      <DatePicker onChange={setExpiresAt} value={expiresAt} />
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
function jwt_decode(arg0: string | null) {
  throw new Error('Function not implemented.');
}

