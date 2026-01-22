import { useEffect, useState } from 'react';
import axios from 'axios';
import './style.css';
import logo from '@/assets/images/logoBGnone.png';
import searchIcon from '@/assets/svgs/searchicon.svg';
import { Link } from 'react-router-dom';
import pfp from '@/assets/images/Steve.png';
import about from './socialAbout.json';
// import gclogo from '@/assets/images/gclogo.png';

export const SocialAbout = () => {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
        axios.get('https://georgianchroniclesbackend.onrender.com/users')
            .then(res => {setUsers(res.data), console.log(res.data)})
            .catch(err => console.error(err));
    }, []);

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(search.toLowerCase())
    );

    const filterAdminUsers = users.filter(user => {
        return user.role === "admin";
    });

    return (
        <div className='Social_about'>
            <div className='Social_About_Inner'>
                <div className='Social_header'>
                    {/* <h1 className='Social_about_title'>Georgian<img className='social_title_logo' src={logo} alt="logo" />Chronicles</h1> */}
                    <div className='social_input_container'>
                        <img className='social_input_search_icon' src={searchIcon} alt="searchIcon" />
                        <input
                            className="user_search_input"
                            type="text"
                            placeholder="მოძებნე მოთამაშე"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onFocus={() => setIsFocused(true)}
                        />
                        <div className={`social_search_users_list ${isFocused && search ?'active' : 'inactive'}`}>
                            {filteredUsers.length ? (filteredUsers.map(user => (
                                <Link to={`/users/${user.id}`}>
                                    <div key={user.id} className="user_item">
                                        <img className='search_user_pfp'  src={(user.profile_image && `https://georgianchroniclesbackend.onrender.com/static/uploads/${user.profile_image}`) || `${pfp}`} alt="" />
                                        <p className='search_user_name'>{user.username}</p>
                                    </div>
                                </Link>
                            ))
                            ) : (
                                <p className='user_not_found'>მოთამაშე ვერ მოიძებნა</p>
                            )}
                        </div>
                    </div>
                </div>
                <div className='social_about_container'>
                    <p className='social_about'>
                        {about.social_about_first}
                    </p>
                    <img className='social_about_img' src="https://georgianchroniclesbackend.onrender.com/static/uploads/gclogo.png" alt="" />
                    <p className='social_about'>
                        {about.social_about_second}
                    </p>
                    <div className='social_about_admins'>
                        <p className='social_about_admin_title'>ადმინისტრატორები</p>
                        <div className='social_about_admin_inner'>
                            {filterAdminUsers.map(admin => (
                                <div key={admin.id} className="admin_item">
                                    <img
                                        src={admin.profile_image ? `https://georgianchroniclesbackend.onrender.com/static/uploads/${admin.profile_image}` : pfp}
                                        alt="admin_pfp"
                                        className="social_about_admin_pfp"
                                    />
                                    <Link to={`/users/${admin.id}`}><p className="social_about_admin_name">{admin.username}</p></Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className='Social_about_footer'>
                <p className='social_footer_text'>Website Made by <Link to='https://davitjimsheleishvili.netlify.app/' target='_blank'>Davit Jimsheleishvili</Link></p>
            </div>
        </div>
    )
};