import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Switch } from 'react-native-paper';


const UserRegistration = ({ navigation }: { navigation: any }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isEnabled, setIsEnabled] = useState(false);
    const [name, setName] = useState('');
    const [website, setWebsite] = useState('');

    const toggleSwitch = () => {
        setIsEnabled(previousState => !previousState);
        setWebsite('');
    }


    const handleSubmit = async () => {
        if (email === '' || password === '' || confirmPassword === '' || name === '' || (isEnabled && website === '')) {
            alert('Please fill in all fields');
            return;
        }
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        const role = isEnabled ? 'COMPANY' : 'APPLICANT';
        if (isEnabled) {
            const responseCompany = await fetch(`http://localhost:8080/api/bff/companies/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, website }),
            });
            if (!responseCompany.ok) {
                throw new Error('Creation of company failed');
            }
        }
        try {
            const response = await fetch(`http://localhost:8080/api/bff/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password, role, name }),
            });

            if (response.ok) {
                // Reset form fields after successful submission
                setEmail('');
                setPassword('');
                setConfirmPassword('');
                setIsEnabled(false);
                setName('');
                setWebsite('');
                navigation.navigate('Login');
            } else {
                throw new Error('Creation of user failed');
            }
        } catch (e) {
            console.error(e);
            return false;
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>User Registration</Text>
            <Text>Company?</Text>
            <Switch
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
                onValueChange={toggleSwitch}
                value={isEnabled}
            ></Switch>
            <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Name"

            />
            <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Email"
            />
            <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                secureTextEntry
            />
            <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm Password"
                secureTextEntry
            />
            {isEnabled ? (
                <TextInput
                    style={styles.input}
                    value={website}
                    onChangeText={setWebsite}
                    placeholder="Website"
                />) : (
                <Text></Text>
            )}
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        marginBottom: 16,
    },
    input: {
        width: '80%',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginVertical: 8,
        paddingHorizontal: 8,
    },
    button: {
        width: '80%',
        height: 40,
        backgroundColor: 'blue',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 16,
    },
    buttonText: {
        color: 'white',
    },
});

export default UserRegistration;
