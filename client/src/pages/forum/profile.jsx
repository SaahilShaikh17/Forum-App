import React, { useState } from 'react';
import axios from 'axios';

const Profile = ({ userId }) => {
    const [fname, setFirstName] = useState('');
    const [lname, setLastName] = useState('');
    const [user, setUsername] = useState('');
    
    const handleUpdate = async () => {
        try {
            await axios.put(`http://localhost:1337/users/${userId}`, {
                firstname: fname,
                lastname: lname,
                username: user
            });
            // Handle success, maybe show a success message or redirect
        } catch (error) {
            console.error('Error updating profile:', error);
            // Handle error
        }
    };
  
    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:1337/users/${userId}`);
            // Handle success, maybe show a success message or redirect
        } catch (error) {
            console.error('Error deleting profile:', error);
            // Handle error
        }
    };
  
    return (
        <div>
            <h2>Profile Update/Delete</h2>
            <form>
                <div>
                    <label htmlFor="firstName">First Name:</label>
                    <input type="text" id="firstName" value={fname} onChange={e => setFirstName(e.target.value)} />
                </div>
                <div>
                    <label htmlFor="lastName">Last Name:</label>
                    <input type="text" id="lastName" value={lname} onChange={e => setLastName(e.target.value)} />
                </div>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input type="text" id="username" value={user} onChange={e => setUsername(e.target.value)} />
                </div>
                <button type="button" onClick={handleUpdate}>Update</button>
                <button type="button" onClick={handleDelete}>Delete Profile</button>
            </form>
        </div>
    );
};

export default Profile;