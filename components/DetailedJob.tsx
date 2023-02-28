import { Button, CircularProgress } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from "react-native";
import { Job } from '../models/Job';
import jwt_decode from "jwt-decode";

export default function DetailedJob({ route, navigation }: { navigation: any, route: any }) {

    // State holding all data.
    const [data, setData] = useState<Job>(new Job());

    const [isLoading, setIsLoading] = useState(true);

    const { jobId } = route.params;

    const title = data.title;

    // Fetch job list once component is mounted
    useEffect(() => {
        async function fetchJobs() {
            const response = await fetch(`http://localhost:8080/api/bff/job/${jobId}`, {
                method: 'GET',
            });
            const json = await response.json();
            setData(json);
            setIsLoading(false);
        }
        fetchJobs();
    }, []);

    const handleApply = () => {
        navigation.navigate("Apply", {title, jobId})
    }

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

    return (
        <View style={styles.container}>
            {isLoading ? <CircularProgress /> : null}
            <Text style={styles.title}>{data.title}</Text>
            <Text style={styles.information}>Company: {data.company?.name} </Text>
            <Text style={styles.information}>Description: {data.description}</Text>
            <Text style={styles.information}>Location: {data.location}</Text>
            <Text style={styles.information}>Jobtype: {data.jobType}</Text>
            <Text style={styles.information}>Salary: {data.salary} DKK/year</Text>
            <Text style={styles.information}>Created At: {new Date(data.createdAt).toLocaleString()}</Text>
            <Text style={styles.information}>Updated At: {new Date(data.updatedAt).toLocaleString()}</Text>
            <Text style={styles.information}>Expires At: {new Date(data.expiresAt).toLocaleString()}</Text>
            {isLoggedInAsCompany() ? null : <Button variant="contained" onClick={handleApply}>Apply</Button>}
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
        backgroundColor: 'blue',
        padding: 10,
        marginTop: 20,
    },
    submitButtonText: {
        color: 'white',
        fontSize: 18,
        textAlign: 'center',
    }
});