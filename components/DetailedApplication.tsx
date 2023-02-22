import { Button } from '@mui/material';
import React from 'react';
import { View, Text, StyleSheet } from "react-native";

export default function DetailedApplication({ route, navigation }: { navigation: any, route: any }) {

    const {application}= route.params;

    const handleAccept = async () => {
        try {
            application.status = "ACCEPTED";
            const response = await fetch(`http://localhost:8080/api/bff/application/${application.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(application),
            });
            if (response.ok) {
                navigation.navigate('Home');
            } else {
                alert('Failed to accept application');
            }
        } catch (e) {
            console.error(e);
            return false;
        }
    };

    const handleReject = async () => {
        try {
            application.status = "REJECTED";
            const response = await fetch(`http://localhost:8080/api/bff/application/${application.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(application),
            });
            if (response.ok) {
                navigation.navigate('Home');
            } else {
                alert('Failed to reject application');
            }
        } catch (e) {
            console.error(e);
            return false;
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Application</Text>
            <Text style={styles.information}>Applicant name: {application.user.name}</Text>
            <Text style={styles.information}>Applicant email: {application.user.email}</Text>
            <Text style={styles.information}>Status: {application.status}</Text>
            <Text style={styles.information}>Created at: {application.createdAt}</Text>
            <Text style={styles.information}>Application:</Text>
            <View style={styles.outlinedContainer}>
                <Text style={styles.application}>{application.application}</Text>
            </View>

            <View style={styles.inlineContainer}>
                <Button variant='contained' onClick={handleAccept} color="success">Accept</Button>
                &nbsp;&nbsp;
                <Button variant='contained' onClick={handleReject} color="error">Reject</Button>
            </View>
        </View>
    );
}

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
        alignItems: 'center'
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333'
    },
    information: {
        fontSize: 18,
        color: '#666',
        marginBottom: 5
    },
    submitButton: {
        backgroundColor: 'green',
        padding: 10,
        margin: 20,
    },
    rejectButton: {
        backgroundColor: 'red',
        padding: 10,
        margin: 20,
    
    },
    submitButtonText: {
        color: 'white',
        fontSize: 18,
        textAlign: 'center',
    },
    application: {
        fontSize: 18,
        color: '#666',
        marginBottom: 5
    },
    outlinedContainer: {
        borderWidth: 1,
        borderColor: 'black',
        padding: 10,
        marginVertical: 10,
        width: '100%'
    },
    inlineContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',

    }
});