import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";

export default function DetailedJob({ route, navigation }: { navigation: any, route: any }) {

    // State holding all data.
    const [data, setData] = useState({});

    const { jobId } = route.params;

    // Fetch job list once component is mounted
    useEffect(() => {
        async function fetchJobs() {
            const response = await fetch(`http://localhost:8081/api/bff/job/${jobId}`, {
                method: 'GET',
            });
            const json = await response.json();
            setData(json);
            console.log(json)
        }
        fetchJobs();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{data.title}</Text>
            <Text style={styles.description}>Description: {data.description}</Text>
            <Text style={styles.location}>Location: {data.location}</Text>
            <Text style={styles.jobType}>Jobtype: {data.jobType}</Text>
            <Text style={styles.salary}>Salary: {data.salary} DKK/year</Text>
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
    description: {
        fontSize: 18,
        color: '#666',
        marginBottom: 5
    },
    location: {
        fontSize: 18,
        color: '#666',
        marginBottom: 5
    },
    jobType: {
        fontSize: 18,
        color: '#666',
        marginBottom: 5
    },
    salary: {
        fontSize: 18,
        color: '#666',
        marginBottom: 5
    }
});