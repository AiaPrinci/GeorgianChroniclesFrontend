import { useEffect, useState } from 'react';
import './style.css';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../assets/images/logoBGnone.png';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import arrow from '@/assets/svgs/arrow.svg';
import userArrow from '@/assets/svgs/userArrow.svg';
import searchIcon from '@/assets/svgs/searchicon.svg';

const Header = () => {
    const [authStatus, setAuthStatus] = useState(false);
    const navigate = useNavigate();
    const [user, setUser] = useState([]);
    const [isSocial, setIsSocial] = useState(true);
    const location = useLocation();
    const [isBurgerMenu, setIsBurgerMenu] = useState(false);
    const [burgerAuth, setBurgerAuth] = useState(false);
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [isFocused, setIsFocused] = useState(false);

    const toggleBurger = () => {
        setIsBurgerMenu(prev => !prev);
    };

    useEffect(() => {
        const fetchAuthStatus = async () => {
            try {
                const res = await axios.get(
                    'https://georgianchroniclesbackend.onrender.com/auth-status',
                    { withCredentials: true }
                );

                if (!res.data.logged_in) {
                    navigate('/');
                    return;
                }

                setAuthStatus(true);
                setBurgerAuth(true);
                console.log(res.data.user.id);
                setUser(res.data.user);

            } catch (error) {
                console.error('Error fetching auth status:', error);
            }
        };

        fetchAuthStatus();
    }, [navigate]);

    useEffect(() => {
        setIsSocial(location.pathname !== '/social');
    }, [location.pathname]);

    const handleLogout = async () => {
        try {
            await axios.post("https://georgianchroniclesbackend.onrender.com/logout", {}, { withCredentials: true });
            localStorage.removeItem("userId");
            navigate('/');
            setAuthStatus(false);
            setBurgerAuth(false);
        } catch (error) {
            console.error(error);
            showCustomAlert("ანგარიშიდან გამოსვლა ჩაიშალა", "error", 3000);
        }
    };

    useEffect(() => {
        axios.get('https://georgianchroniclesbackend.onrender.com/users')
            .then(res => {setUsers(res.data), console.log(res.data)})
            .catch(err => console.error(err));
    }, []);

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <header>
            <div className='header'>
                <Link to='/'>
                    <p className='header_heading'>Georgian <img className='header_logo' src={logo} alt="" /> Chronicles</p>
                </Link>
                <div className='header_list_container'>
                    <div className='registration_container'>
                        {authStatus ? (
                            <div className='logged_in'>
                                {isSocial && (
                                    <Link to='/social'>
                                        <div className='back_to_social'>
                                            <p>Social</p>
                                            <img className='arrow' src={arrow} alt="" />
                                        </div>
                                    </Link>
                                )}
                                <div className='header_user_container' onClick={toggleBurger}>
                                    <img className='header_user_pfp' src={`https://georgianchroniclesbackend.onrender.com/static/uploads/${user.profile_image}`} alt="" />
                                    <div className='header_user_arrow'>
                                        <svg viewBox="0 0 16 16" width="12" height="12" fill="#fff" class="x14rh7hd x1lliihq x1tzjh5l x1k90msu x2h7rmj x1qfuztq"><g fill-rule="evenodd" transform="translate(-448 -544)"><path fill-rule="nonzero" d="M452.707 549.293a1 1 0 0 0-1.414 1.414l4 4a1 1 0 0 0 1.414 0l4-4a1 1 0 0 0-1.414-1.414L456 552.586l-3.293-3.293z"></path></g></svg>
                                    </div>
                                </div>
                                <div onClick={toggleBurger}  className={`header_drop_down_menu ${isBurgerMenu ? 'active' : 'inactive'}`}>
                                    <Link to={`/users/${user.id}`}>
                                        <div className='header_user'>
                                            <img className='header_user_pfp' src={`https://georgianchroniclesbackend.onrender.com/static/uploads/${user.profile_image}`} alt="" />
                                            <p className='header_user_name'>{user.username}</p>
                                        </div>
                                    </Link>
                                    <div className='log_out' onClick={handleLogout}>
                                        გამოსვლა
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <Link to='/signup'>
                                <div className='signupbtn'>
                                    <p>SignUp</p>
                                </div>
                            </Link>
                        )}
                    </div>
                    <div className={`burger_menu_btn_container ${isBurgerMenu ? 'active' : ''}`} onClick={toggleBurger}>
                        <div className='burger_menu_btn'></div>
                    </div>
                    <div className={`burger_menu ${isBurgerMenu ? 'active' : ''}`}>
                        {burgerAuth ? (
                            <div className='logged_in'>
                                <div className='burger_menu_list'>
                                    <div className='social_input_container header_search'>
                                        <img className='social_input_search_icon' src={searchIcon} alt="searchIcon" />
                                        <input
                                            className="user_search_input header_input"
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
                                        ))) : (
                                            <p className='user_not_found'>მოთამაშე ვერ მოიძებნა</p>
                                        )}
                                    </div>
                                </div>
                                <Link to={`/users/${user.id}`}>
                                    <div className='header_user'>
                                        <img className='header_user_pfp' src={`https://georgianchroniclesbackend.onrender.com/static/uploads/${user.profile_image}`} alt="" />
                                        <p className='header_user_name'>{user.username}</p>
                                    </div>
                                </Link>
                                <div className='log_out' onClick={handleLogout}>
                                    გამოსვლა
                                </div>
                            </div>
                            {isSocial && (
                                <Link to='/social'>
                                    <div className='back_to_social'>
                                        <p>Social</p>
                                        <img className='arrow' src={arrow} alt="" />
                                    </div>
                                </Link>
                            )}
                        </div>
                        ) : (
                            <div className='burger_reg_container'>
                                <Link to='/signup'>
                                    <div className='signupbtn'>
                                        <p>SignUp</p>
                                    </div>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
};

export default Header;