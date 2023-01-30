import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import DatePicker from 'react-date-picker';
import jwtDecode from 'jwt-decode';


const CreateJobPage = ({ route, navigation }: { navigation: any, route: any }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('');
  const [salary, setSalary] = useState('');
  const [expiresAt, setExpiresAt] = useState(new Date());


  const handleCreateJob = async () => {
    try {
        if(!title || !description || !location || !jobType || !salary || !expiresAt) {
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
      <Text style={styles.label}>Title</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={(text) => setTitle(text)}
      />
      <Text style={styles.label}>Description</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={(text) => setDescription(text)}
      />
      <Text style={styles.label}>Location</Text>
      <TextInput
        style={styles.input}
        value={location}
        onChangeText={(text) => setLocation(text)}
      />
      <Text style={styles.label}>Job Type</Text>
      <TextInput
        style={styles.input}
        value={jobType}
        onChangeText={(text) => setJobType(text)}
      />
      <Text style={styles.label}>Salary</Text>
      <TextInput
        style={styles.input}
        value={salary}
        onChangeText={(text) => setSalary(text)}
      />
        <Text style={styles.label}>Expires At</Text>
        <DatePicker onChange={setExpiresAt} value={expiresAt} />
      <TouchableOpacity
        style={styles.button}
        onPress={handleCreateJob}
      >
        <Text style={styles.buttonText}>Create Job</Text>
      </TouchableOpacity>
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

