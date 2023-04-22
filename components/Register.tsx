import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, TextField, Switch } from '@mui/material';

const UserRegistration = ({ navigation }: { navigation: any }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isEnabled, setIsEnabled] = useState(false);
    const [name, setName] = useState('');
    const [website, setWebsite] = useState('');
    const [phone, setPhone] = useState('');

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

      const validatePassword = (password:string) => { // Checks if password is valid using regex
        if(password === '' || password === undefined || password === null){
            return false;
        }
        return password.match(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/ // Minimum eight characters, at least one uppercase letter, one lowercase letter and one number
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
        if (!validatePassword(password)) {
            alert('Please enter a valid password');
            return;
        }
        const role = isEnabled ? 'COMPANY' : 'APPLICANT';
        if (isEnabled) {
            const responseCompany = await fetch(`/api/companies/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, website, phone }),
            });
            if (!responseCompany.ok) {
                throw new Error('Creation of company failed');
            }
        }
        try {
            const response = await fetch(`/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password, role, name, phone }),
            });

            if (response.ok) {
                // Reset form fields after successful submission
                setEmail('');
                setPassword('');
                setConfirmPassword('');
                setIsEnabled(false);
                setName('');
                setWebsite('');
                setPhone('');
                navigation.navigate('Login');
            } else {
                throw new Error('Creation of user failed');
            }
        } catch (e) {
            console.error(e);
            return false;
        }
    };

    useEffect(() => {
        console.warn('Already logged in')
        const token = localStorage.getItem('userToken');
        if (token) {
            navigation.navigate('Home');
            return;
        }
    }, []);

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
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone"
                label="Phone"
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
