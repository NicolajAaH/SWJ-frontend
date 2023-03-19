import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, TextField, Switch } from '@mui/material';


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

    const validateEmail = (email:string) => { // Checks if email is valid using regex
        if(email === '' || email === undefined || email === null){
            return false;
        }
        return email.match(
          /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
      };
      



    const handleSubmit = async () => {
        if (email === '' || password === '' || confirmPassword === '' || name === '' || (isEnabled && website === '')) {
            alert('Please fill in all fields');
            return;
        }
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        if (!validateEmail(email)) {
            alert('Please enter a valid email');
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
                onChange={toggleSwitch}
                value={isEnabled}
            ></Switch>
            <TextField
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                label="Name"
            />
            <br/>

            <TextField
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                label="Email"
            />
                        <br/>

            <TextField
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                type="password"
                label="Password"
            />
                        <br/>

            <TextField
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                type="password"
                label="Confirm Password"
            />
                        <br/>

            {isEnabled ? (
                <TextField
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="Website"
                    label="Website"
                />) : (
                <Text></Text>
            )}
            <br/>
            <Button variant="contained" onClick={handleSubmit}>Submit</Button>
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
