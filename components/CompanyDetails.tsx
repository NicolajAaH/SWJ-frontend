import { Button, CircularProgress } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { Company } from '../models/Company';

export default function CompanyDetails({ route, navigation }: { navigation: any, route: any }) {
    // State holding all data.
    const [data, setData] = useState<Company>(new Company());


    const [isLoading, setIsLoading] = useState(true);

    const { companyId } = route.params;

    // Fetch company details once component is mounted
    useEffect(() => {
        async function fetchCompany() {
            const response = await fetch(`/api/company/byId/${companyId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("userToken")}`
                }
            });
            const json = await response.json();
            setData(json);
            setIsLoading(false);
        }
        fetchCompany();
    }, []);

    return (
        <View style={styles.container}>
            {isLoading ? <CircularProgress style={styles.center} /> : (
                <View style={styles.center}>
                    <Text style={styles.title}>{data.name}</Text>
                    <Text style={styles.information}>Email: {data.email} </Text>
                    <Text style={styles.information}>Phone: {data.phone} </Text>
                    <Text style={styles.information}>Website: {data.website} </Text>
                    <Text style={styles.information}>Jobs: </Text>
                    <FlatList
                        data={data.jobs}
                        renderItem={({ item }) => (
                            <TouchableOpacity style={styles.jobContainer} onPress={() => navigation.navigate("DetailedJob", { jobId: item.id })}>
                                <Text style={styles.jobTitle}>{item.title}</Text>
                                <Text style={styles.information}>{item.jobType}</Text>
                                <Text style={styles.information}>{item.location}</Text>
                            </TouchableOpacity>
                        )}
                        numColumns={5}
                        keyExtractor={item => item.id.toString()}
                    />
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
    jobContainer: {
        backgroundColor: '#ffffff',
        borderRadius: 10,
        padding: 20,
        marginHorizontal: 10,
        marginVertical: 10,
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowRadius: 6,
        shadowOpacity: 0.26,
        elevation: 8
    },
    jobTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        lineHeight: 40
    },
});