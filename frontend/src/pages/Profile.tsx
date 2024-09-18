import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProfile, updateProfile } from '../slices/profileSlice';
import { RootState } from '../store/store';
import Loader from '../components/Loader';
import Message from '../components/Message';

const Profile: React.FC = () => {
    const dispatch = useDispatch();
    const { userInfo, loading, error } = useSelector((state: RootState) => state.profile);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            dispatch(getProfile(token));
        }
    }, [dispatch]);

    useEffect(() => {
        if (userInfo) {
            setName(userInfo.name);
            setEmail(userInfo.email);
        }
    }, [userInfo]);

    const submitHandler = (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (token) {
            dispatch(updateProfile({ token, profileData: { name, email, password } }));
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold">User Profile</h1>
            {loading && <Loader />}
            {error && <Message variant="danger">{error}</Message>}
            <form onSubmit={submitHandler}>
                <div>
                    <label>Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div>
                    <label>Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                    <label>Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button type="submit">Update Profile</button>
            </form>
        </div>
    );
};

export default Profile;
