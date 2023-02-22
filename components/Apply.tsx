import { Button, TextField } from '@mui/material';
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';


const ApplyForJobPage = ({ route, navigation }: { navigation: any, route: any }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [application, setApplication] = useState('');

    const { title, jobId } = route.params;

    const handleSubmit = async () => {
        if (name === '' || email === '' || application === '') {
            alert('Please fill in all fields');
            return;
        }
        try {
            const response = await fetch(`http://localhost:8080/api/bff/job/${jobId}/apply`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ jobId, userId: localStorage.getItem('userToken'), "status": "PENDING", application }),
            });
            if (response.ok) {
                navigation.navigate('Home');
                // Clear the form fields
                setName('');
                setEmail('');
                setApplication('');
            } else {
                throw new Error('Application failed');
            }
        } catch (e) {
            console.error(e);
            return false;
        }
    };

    if (localStorage.getItem('userToken') === null) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.information}>You must be logged in to apply for a job.</Text>
                <Button onClick={() => navigation.navigate('Login')}>Login</Button>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>

            <Text style={styles.label}>Apply for job</Text>
            <br/>
            <TextField
                value={name}
                label="Name"
                placeholder='Name'
                onChange={(text) => setName(text.target.value)}
            />
            <br/>
            <TextField
                value={email}
                label="Email"
                placeholder='Email'
                onChange={(text) => setEmail(text.target.value)}
            />
            <br/>
            <TextField
                value={application}
                label="Application"
                placeholder='Write your application here'
                onChange={(text) => setApplication(text.target.value)}
                multiline
                rows={10}
            />
            <br/>
            <Button variant="contained" onClick={handleSubmit}>Submit</Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    label: {
        fontSize: 18,
        marginTop: 20,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginTop: 10,
        padding: 10,
    },
    inputBigText: {
        height: 100,
        borderColor: 'gray',
        borderWidth: 1,
        marginTop: 10,
        padding: 10,
    },
    submitButton: {
        backgroundColor: 'blue',
        padding: 10,
        marginTop: 20,
    },
    submitButtonText: {
        color: 'white',
        fontSize: 18,
        textAlign: 'center',
    },
    information: {
        fontSize: 18,
        color: '#666',
        marginBottom: 5
    },
    title: {
        fontSize: 30,
        color: '#666',
        marginBottom: 5
    }
});

export default ApplyForJobPage;
