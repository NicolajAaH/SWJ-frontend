import { Button, CircularProgress, Link, TextField } from '@mui/material';
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
            const response = await fetch(`${process.env.BFFURL}/job/${jobId}`, {
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
            return <Text style={styles.expired}>Expired</Text>
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
                    <View style={styles.columns}>
                        <View>
                            <TouchableOpacity onPress={() => handleClickCompany()}>
                                <Text style={styles.information}><Text style={styles.bold}>Company:</Text> <Link>{data.company?.name}</Link></Text>
                            </TouchableOpacity>
                            <Text style={styles.information}><Text style={styles.bold}>Location:</Text> {data.location}</Text>
                            <Text style={styles.information}><Text style={styles.bold}>Job type:</Text> {data.jobType}</Text>
                            <Text style={styles.information}><Text style={styles.bold}>Salary:</Text> {data.salary} DKK/year</Text>
                            <Text style={styles.information}><Text style={styles.bold}>Created At:</Text> {new Date(data.createdAt).toLocaleString()}</Text>
                            <Text style={styles.information}><Text style={styles.bold}>Updated At:</Text> {new Date(data.updatedAt).toLocaleString()}</Text>
                            <Text style={styles.information}><Text style={styles.bold}>Expires At:</Text> {new Date(data.expiresAt).toLocaleString()}</Text>
                        </View>
                        <View style={styles.description}>
                            <Text style={styles.information}><Text style={styles.bold}>Description:</Text></Text>
                            <TextField style={styles.information} multiline rows={7} value={data.description} />
                        </View>
                    </View>
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
        alignItems: 'center',
    },
    description: {
        width: '60%',
    },
    columns: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
    },
    bold: {
        fontWeight: 'bold',
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        width: '70%',
    },
    title: {
        fontSize: 34,
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
    },
    expired: {
        color: 'red',
        fontSize: 18,
        textAlign: 'center',
    }

});