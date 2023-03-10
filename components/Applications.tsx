import { Button, CircularProgress } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { Application } from '../models/Application';

export default function Applications({ route, navigation }: { navigation: any, route: any }) {

    // State holding all data.
    const [data, setData] = useState<Application[]>([]);

    const [isLoading, setIsLoading] = useState(true);

    const { job } = route.params;

    const handleMarkAsFinished = async () => {
        setIsLoading(true);
        job.status = "FINISHED";
        try {
            const response = await fetch(`http://localhost:8080/api/bff/job/${job.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(job)
            });
            if (!response.ok) {
                alert('Failed to mark job as finished');
                return;
            }
            setIsLoading(false);
            navigation.navigate("MyJobs");
        } catch (e) {
            console.error(e);
            job.status = "PENDING";
        }
    };

    // Fetch job list once component is mounted
    useEffect(() => {
        async function fetchJobs() {
            const response = await fetch(`http://localhost:8080/api/bff/job/${job.id}/applications`, {
                method: 'GET',
            });
            const json = await response.json();
            setData(json);
            setIsLoading(false);
        }
        fetchJobs();
    }, []);

    const renderApplication = ({ item }: { item: Application }) => (
        <TouchableOpacity style={styles.applicationContainer} onPress={() => {
            navigation.navigate("DetailedApplication", { application: item, job: job })
            }}>
          <Text style={styles.applicationProperty}>Status: {item.status}</Text>
          <Text style={styles.applicationProperty}>Applicant name: {item.user.name}</Text>
          <Text style={styles.applicationProperty}>Created at: {new Date(item.createdAt).toLocaleString()}</Text>
        </TouchableOpacity>
      );

    return (
        <View style={styles.container}>
            <Text style={{ fontSize: 30, fontWeight: 'bold', marginBottom: 20 }}>Applications</Text>
            <Text>For job: {job.title}</Text>
            {isLoading ? <CircularProgress /> : null}
            <FlatList
                data={data}
                renderItem={({ item }) => (renderApplication({ item }))}
                keyExtractor={(application) => application.id}
            />
            <br/>
            {data.length === 0 && <Text style={styles.information}>No applications yet</Text>}
            {job.status !== "FINISHED" && <Button variant="contained" title="Mark as finished" onClick={handleMarkAsFinished}>Mark as finished</Button>}
            {job.status === "FINISHED" && <Text style={styles.information}>Job is finished</Text>}
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
    },
    applicationContainer: {
        backgroundColor: '#ffffff',
        borderRadius: 10,
        padding: 20,
        marginVertical: 10,
        shadowColor: '#000000',
        shadowOffset: {
          width: 1,
          height: 1
        },
        shadowRadius: 6,
        shadowOpacity: 1,
        elevation: 8
      },
      applicationProperty: {
        fontSize: 14,
        color: '#666666',
        marginBottom: 5
      },
});