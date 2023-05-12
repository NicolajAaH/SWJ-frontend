import { Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from "react-native";
import jwt_decode from "jwt-decode";

export default function DetailedApplication({ route, navigation }: { navigation: any, route: any }) {

    const { application, job } = route.params;

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

    const handleAccept = async () => {
        try {
            if (isAccepted()) {
                alert("Application already accepted");
                return;
            }
            application.status = "ACCEPTED";
            const response = await fetch(`/api/application/${application.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("userToken")}`
                },
                body: JSON.stringify(application),
            });
            if (response.ok) {
                alert('Application accepted');
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
            if (isRejected()) {
                alert("Application already rejected");
                return;
            }
            application.status = "REJECTED";
            const response = await fetch(`/api/application/${application.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("userToken")}`
                },
                body: JSON.stringify(application),
            });
            if (response.ok) {
                alert('Application rejected');
                navigation.navigate('Home');
            } else {
                alert('Failed to reject application');
            }
        } catch (e) {
            console.error(e);
            return false;
        }
    };

    function isRejected() {
        if (application.status === "REJECTED") {
            return true;
        }
        return false;
    }

    function isAccepted() { //Two function are created as application can be PENDING, ACCEPTED, or REJECTED
        if (application.status === "ACCEPTED") {
            return true;
        }
        return false;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Application</Text>
            <Text style={styles.information}>Job title: {job.title}</Text>
            <Text style={styles.information}>Job location: {job.location}</Text>
            <Text style={styles.information}>Applicant name: {application.user.name}</Text>
            <Text style={styles.information}>Applicant email: {application.user.email}</Text>
            <Text style={styles.information}>Applicant phone: {application.user.phone}</Text>
            <Text style={styles.information}>Status: {application.status}</Text>
            <Text style={styles.information}>Created at: {new Date(application.createdAt).toLocaleString()}</Text>
            <Text style={styles.information}>Application:</Text>
            <View style={styles.outlinedContainer}>
                <Text style={styles.application}>{application.application}</Text>
            </View>

            {isLoggedInAsCompany() ? (<View style={styles.inlineContainer}>
                <Button variant='contained' onClick={handleAccept} color="success" disabled={isAccepted()}>Accept</Button>
                <Text>&nbsp;&nbsp;</Text>
                <Button variant='contained' onClick={handleReject} color="error" disabled={isRejected()}>Reject</Button>
            </View>) : (null)}
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