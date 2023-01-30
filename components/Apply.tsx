import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Button } from 'react-native';


const ApplyForJobPage = ({ route, navigation }: { navigation: any, route: any }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [coverLetter, setCoverLetter] = useState('');
    const [resume, setResume] = useState('');

    const { title, jobId } = route.params;

    const handleSubmit = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/bff/job/${jobId}/apply`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ jobId, userId: localStorage.getItem('userToken'), "status": "PENDING" }),
            });
            if (response.ok) {
                navigation.navigate('Home');
                // Clear the form fields
                setName('');
                setEmail('');
                setCoverLetter('');
                setResume('');
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
                <Button title="Login" onPress={() => navigation.navigate('Login')} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>

            <Text style={styles.label}>Apply for job:</Text>
            <Text style={styles.label}>Name:</Text>
            <TextInput
                style={styles.input}
                value={name}
                onChangeText={(text) => setName(text)}
            />
            <Text style={styles.label}>Email:</Text>
            <TextInput
                style={styles.input}
                value={email}
                onChangeText={(text) => setEmail(text)}
            />
            <Text style={styles.label}>Cover Letter:</Text>
            <TextInput
                style={styles.inputBigText}
                value={coverLetter}
                onChangeText={(text) => setCoverLetter(text)}
                multiline
                numberOfLines={10}
            />
            <Text style={styles.label}>Resume:</Text>
            <TextInput
                style={styles.inputBigText}
                value={resume}
                onChangeText={(text) => setResume(text)}
                multiline
                numberOfLines={10}
            />
            <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
                <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
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
