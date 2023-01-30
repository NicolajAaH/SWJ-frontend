import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const Login = ({ navigation }: { navigation: any }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/bff/auth/login`, {
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
            return false;
        }
    };

    const handleRegister = () => {
        navigation.navigate('Register');
    };



    return (
        <View style={styles.container}>
            <Text style={styles.header}>Login</Text>
            <TextInput
                style={styles.input}
                placeholder="Username"
                value={email}
                onChangeText={(text) => setEmail(text)}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={(text) => setPassword(text)}
            />
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    header: {
        fontSize: 24,
        marginBottom: 20,
    },
    input: {
        width: 200,
        height: 44,
        padding: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: 'gray',
    },
    button: {
        backgroundColor: 'blue',
        padding: 10,
        marginTop: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
    },
});

export default Login;
