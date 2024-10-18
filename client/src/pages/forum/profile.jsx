import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './profile.css'

const Profile = () => {
    const [firstname, setFirstName] = useState('');
    const [lastname, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [message, setMessage] = useState('');

    const getToken = () => {
        return localStorage.getItem('accessToken'); // Retrieve token from localStorage
    };

    const getUserIdFromLocalStorage = () => {
        return localStorage.getItem('userId'); // Retrieve userId from localStorage
    };

    useEffect(() => {
        const fetchUser = async () => {
            const userId = getUserIdFromLocalStorage(); // Get user ID from local storage
            if (!userId) {
                setMessage('User not authenticated. Please log in.');
                return; // Exit if there's no user ID
            }

            try {
                const token = getToken();
                console.log('Fetching user with token:', token); // Log token

                // Fetch user profile by userId
                const response = await axios.get(`http://backend-service:5000/users/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}` // Token in Authorization header
                    }
                });

                // Populate form fields with user data
                const userData = response.data;
                console.log('User data fetched:', userData); // Log fetched user data
                setFirstName(userData.firstname);
                setLastName(userData.lastname);
                setUsername(userData.username);
            } catch (error) {
                console.error('Error fetching user data:', error);
                setMessage('Error fetching user data');
            }
        };

        fetchUser();
    }, []); // No dependencies needed since we are fetching userId from local storage

    const handleUpdate = async () => {
        const userId = getUserIdFromLocalStorage(); // Get user ID from local storage
        if (!userId) {
            setMessage('User not authenticated. Please log in.');
            return; // Exit if there's no user ID
        }

        try {
            const token = getToken();
            console.log('Updating user with token:', token); // Log token

            // Log the data being sent in the update request
            console.log('Update data:', { firstname, lastname, username });

            const response = await axios.put(`http://backend-service:5000/users/${userId}`, {
                firstname,
                lastname,
                username
            }, {
                headers: {
                    Authorization: `Bearer ${token}`, // Include token in headers
                    'Content-Type': 'application/json'
                }
            });

            console.log('Profile updated response:', response.data); // Log response
            setMessage('Profile updated successfully');
        } catch (error) {
            console.error('Error updating profile:', error);
            setMessage('Error updating profile: ' + (error.response?.data?.message || 'Unknown error'));
        }
    };

    return (
        <div className="profile-update-container">
    <h2>Profile Update</h2>
    <form className="profile-form">
        <div className="form-group">
            <label htmlFor="firstName">First Name:</label>
            <input type="text" id="firstName" value={firstname} onChange={e => setFirstName(e.target.value)} />
        </div>
        <div className="form-group">
            <label htmlFor="lastName">Last Name:</label>
            <input type="text" id="lastName" value={lastname} onChange={e => setLastName(e.target.value)} />
        </div>
        <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input type="text" id="username" value={username} onChange={e => setUsername(e.target.value)} />
        </div>
        <button type="button" className="update-btn" onClick={handleUpdate}>Update Profile</button>
    </form>
    {message && <p className="message">{message}</p>}
</div>

    );
};

export default Profile;
