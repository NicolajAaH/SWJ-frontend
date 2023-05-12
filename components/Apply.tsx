import { Button, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import jwt_decode from 'jwt-decode';


const ApplyForJobPage = ({ route, navigation }: { navigation: any, route: any }) => {
    const decodedToken = jwt_decode(localStorage.getItem('userToken'));
    const [name, setName] = useState(decodedToken.name);
    const [email, setEmail] = useState(decodedToken.email);
    const [application, setApplication] = useState('');
    const [phone, setPhone] = useState(decodedToken.phone);

    const { title, jobId } = route.params;

    const handleSubmit = async () => {
        if (name === '' || email === '' || application === '') {
            alert('Please fill in all fields');
            return;
        }
        try {
            const response = await fetch(`/api/job/${jobId}/apply`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("userToken")}`
                },
                body: JSON.stringify({ jobId, userId: localStorage.getItem('userToken'), "status": "PENDING", application }),
            });
            if (response.ok) {
                navigation.navigate('MyApplications');
                // Clear the form fields
                setName('');
                setEmail('');
                setApplication('');
                setPhone('');
            } else {
                throw new Error('Application failed - are you applying for an expired job?');
            }
        } catch (e) {
            console.error(e);
            return false;
        }
    };

    useEffect(() => {
        if (localStorage.getItem('userToken') === null) {
            navigation.navigate('Login');
            return;
        }
        if (decodedToken.role === 'COMPANY') {
            alert('You cannot apply for a job as a company.')
            navigation.navigate('Home');
            return;
        }
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>

            <Text style={styles.label}>Apply for job</Text>
            <br />
            <TextField
                value={name}
                label="Name"
                placeholder='Name'
                disabled
                onChange={(text) => setName(text.target.value)}
            />
            <br />
            <TextField
                value={email}
                label="Email"
                placeholder='Email'
                disabled
                onChange={(text) => setEmail(text.target.value)}
            />
            <br />
            <TextField
                value={phone}
                label="Phone"
                placeholder='Phone'
                disabled
                onChange={(text) => setPhone(text.target.value)}
            />
            <br />
            <TextField
                value={application}
                label="Application"
                placeholder='Write your application here'
                onChange={(text) => setApplication(text.target.value)}
                multiline
                rows={10}
            />
            <br />
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
