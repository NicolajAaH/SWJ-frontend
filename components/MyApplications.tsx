import { CircularProgress } from '@mui/material';
import jwtDecode from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { Application } from '../models/Application';
import jwt_decode from "jwt-decode";


export default function MyApplications({ route, navigation }: { navigation: any, route: any }) {

    // State holding all data.
    const [data, setData] = useState<Application[]>([]);

    const [isLoading, setIsLoading] = useState(true);


    // Fetch job list once component is mounted
    useEffect(() => {
        const decodedToken = jwtDecode(localStorage.getItem('userToken'));
        if (decodedToken.role !== 'APPLICANT') { // Only applicants can see their applications
            navigation.navigate('Home');
            return;
        }
        const userId = decodedToken.userId;
        async function fetchJobs() {
            const response = await fetch(`/api/applications/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("userToken")}`
                },
            });
            if (response.status === 204){
                // No applications found
                setData([]);
                setIsLoading(false);
                return;
            }
            const json = await response.json();
            setData(json);
            setIsLoading(false);
        }
        fetchJobs();
    }, []);

    const renderApplication = ({ item }: { item: Application }) => (
        <TouchableOpacity style={styles.applicationContainer} onPress={() => navigation.navigate("DetailedApplication", { application: item, job: item.job })}>
            <Text style={styles.applicationProperty}>Job: {item.job?.title}</Text>
            <Text style={styles.applicationProperty}>Status: {item.status}</Text>
            <Text style={styles.applicationProperty}>Created at: {new Date(item.createdAt).toLocaleString()}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={{ fontSize: 30, fontWeight: 'bold', marginBottom: 20 }}>Applications</Text>
            {isLoading ? <CircularProgress /> : null}

            <FlatList
                data={data}
                renderItem={({ item }) => (renderApplication({ item }))}
                keyExtractor={(application) => application.id}
            />
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
        marginHorizontal: 10,
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