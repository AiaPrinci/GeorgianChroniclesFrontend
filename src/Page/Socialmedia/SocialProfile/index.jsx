import { useState, useEffect } from 'react';
import './style.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Posts } from '../Posts';
import { Link } from 'react-router-dom';
import searchIcon from '@/assets/svgs/searchicon.svg';

export const SocialProfile = () => {
    const [authStatus, setAuthStatus] = useState({});
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
        const fetchAuthStatus = async () => {
            try {
                const res = await axios.get(
                    'https://georgianchroniclesbackend.onrender.com/auth-status',
                    { withCredentials: true }
                );

                if (!res.data.logged_in) {
                    navigate('/login');
                    return;
                }

                setAuthStatus(res.data.user);
            } catch (error) {
                console.error('Error fetching auth status:', error);
            }
        };

        fetchAuthStatus();
    }, [navigate]);

    return (
        <div className='Social_profile'>
            <div className='Social_profile_container'>
                <div className='social_profile'>
                    <Link to={`/users/${authStatus.id}`}><img className='social_profile_pfp' src={`https://georgianchroniclesbackend.onrender.com/static/uploads/${authStatus.profile_image}`} alt="pfp" /></Link>
                    <Link to={`/users/${authStatus.id}`}><p className='social_profile_name'>{authStatus.username}</p></Link>
                </div>
            </div>
        </div>
    )
}