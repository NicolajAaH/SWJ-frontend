import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, TextField, Switch, CircularProgress } from '@mui/material';
import jwt_decode from 'jwt-decode';
import { validateEmail, validatePassword } from './Validator';

const UpdateInformation = ({ navigation }: { navigation: any }) => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [website, setWebsite] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phone, setPhone] = useState('');

    const [isLoading, setIsLoading] = useState(true);


    function getUserId() {
        const decodedToken = jwt_decode(localStorage.getItem('userToken'));
        return decodedToken.userId;
    }

    function getEmail() {
        const decodedToken = jwt_decode(localStorage.getItem('userToken'));
        return decodedToken.email;
    }

    useEffect(() => {
        console.warn('Not logged in')
        const token = localStorage.getItem('userToken');
        if (!token) { // if not logged in
            navigation.navigate('Home');
            return;
        }
        const fetchUser = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`/api/auth/user/${getUserId()}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem("userToken")}`
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setEmail(data.email);
                    setName(data.name);
                    setPhone(data.phone);
                } else {
                    throw new Error('Fetching user information failed');
                }
            } catch (e) {
                console.error(e);
                return false;
            }
        };

        const fetchCompany = async () => {
            try {
                const response = await fetch(`/api/company/${getEmail()}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem("userToken")}`
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setWebsite(data.website);
                } else {
                    throw new Error('Fetching company information failed');
                }
            } catch (e) {
                console.error(e);
                return false;
            }
            setIsLoading(false);
        };
        fetchUser();
        if (isLoggedInAsCompany()) { // If logged in as company, fetch company information
            fetchCompany();
        } else {
            setIsLoading(false);
        }
    }, []);


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

    const handleDeleteUser = async () => {
        let answer = window.confirm('Are you sure you want to delete your account?');
        if (answer === false) {
            return;
        }
        try {
            const response = await fetch(`/api/auth/user/${getUserId()}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                //Clear local storage
                localStorage.removeItem('userToken');
                alert('User deleted');
                navigation.navigate('Login');
            } else {
                throw new Error('Deleting user failed');
            }
        } catch (e) {
            console.error(e);
            return false;
        }
    };

    const handleSubmit = async () => {
        if (email === '' || name === '') {
            alert('Please fill in all fields');
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
        if (phone.length !== 8) {
            alert('Phone can only be 8 digits');
            return;
        }
        if (password !== confirmPassword || password === '') {
            alert('Passwords do not match or is empty');
            return;
        }
        if (name.trim.length === 0 || (isLoggedInAsCompany() && website.trim.length === 0)) {
            alert('Please enter a valid name and website');
            return;
        }

        try {
            const response = await fetch(`/api/auth/user/${getUserId()}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, name, password, phone }),
            });

            if (response.ok) {
                const companyResponse = await fetch(`/api/company/byEmail/${getEmail()}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ website, email, phone, name }),
                });
                if (companyResponse.ok) {
                    alert('User information updated');
                } else {
                    throw new Error('Updating company information failed');
                }
            } else {
                throw new Error('Updating user information failed');
            }
        } catch (e) {
            console.error(e);
            return false;
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>User Information</Text>
            {isLoading ? <CircularProgress /> : null}
            <TextField
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                label="Name"
            />
            <br />

            <TextField
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                label="Email"
            />
            <br />

            <TextField
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone"
                label="Phone"
            />
            <br />

            {isLoggedInAsCompany() ? (
                <TextField
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="Website"
                    label="Website"
                />) : (
                <Text></Text>
            )}
            <br />

            <TextField
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                type="password"
                label="Password"
            />
            <br />

            <TextField
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                type="password"
                label="Confirm Password"
            />
            <br />
            <Button variant="contained" onClick={handleSubmit}>Save</Button>
            <br />
            <br />
            <br />
            <Button variant="contained" color="error" onClick={handleDeleteUser}>Delete User</Button>
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

export default UpdateInformation;