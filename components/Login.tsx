import { Button, TextField } from '@mui/material';
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
require('dotenv').config();

const Login = ({ navigation }: { navigation: any }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        if(!email || !password) return alert('Please enter your email and password');
        try {
            const response = await fetch(`${process.env.REACT_APP_BFFURL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if (data.token) {
                localStorage.setItem('userToken', data.token);
                navigation.navigate('Home');
            } else {
                throw new Error('Login failed');
            }
        } catch (e) {
            console.error(e);
            alert('Login failed');
        }
    };

    const handleRegister = () => {
        navigation.navigate('Register');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Login</Text>
            <TextField
                variant='outlined'
                placeholder="Username"
                label="Username"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <br/>
            <TextField
                variant='outlined'
                type="password"
                required
                label="Password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
                        <br/>
            <Button variant="contained" onClick={handleLogin}>Login</Button>
            <br/>
            <Button variant="contained" onClick={handleRegister}>Register</Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        margin: 20,
    },
    header: {
        fontSize: 24,
        marginBottom: 20,
    },
});

export default Login;
