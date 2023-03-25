import { Button, CircularProgress } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
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
        navigation.navigate("Apply", { title, jobId })
    }

    const handleClickCompany = () => {
        navigation.navigate("CompanyDetails", { companyId: data.company?.id })
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

    function isExpired(date: Date) {
        if (date < new Date().toISOString()) {
            return <Text style={styles.information}>Expired</Text>
        }
        else {
            return <Button variant="contained" onClick={handleApply}>Apply</Button>
        }
    }

    return (
        <View style={styles.container}>
            {isLoading ? <CircularProgress style={styles.center} /> : (
                <View style={styles.center}>
                    <Text style={styles.title}>{data.title}</Text>
                    <TouchableOpacity onPress={() => handleClickCompany()}>
                    <Text style={styles.information}>Company: {data.company?.name} </Text>
                    </TouchableOpacity>
                    <Text style={styles.information}>Description: {data.description}</Text>
                    <Text style={styles.information}>Location: {data.location}</Text>
                    <Text style={styles.information}>Jobtype: {data.jobType}</Text>
                    <Text style={styles.information}>Salary: {data.salary} DKK/year</Text>
                    <Text style={styles.information}>Created At: {new Date(data.createdAt).toLocaleString()}</Text>
                    <Text style={styles.information}>Updated At: {new Date(data.updatedAt).toLocaleString()}</Text>
                    <Text style={styles.information}>Expires At: {new Date(data.expiresAt).toLocaleString()}</Text>
                    {isLoggedInAsCompany() ? null : isExpired(data.expiresAt)}
                </View>
            )}
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
    center: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
        lineHeight: 40
    },
    information: {
        fontSize: 18,
        color: '#666',
        marginBottom: 5,
        lineHeight: 26
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