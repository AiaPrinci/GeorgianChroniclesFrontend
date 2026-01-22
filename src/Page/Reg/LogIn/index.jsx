import React, { useState } from 'react';
import './style.css';
import axios from 'axios';
import logo from '@/assets/images/logoBGnone.png';
import { Link, useNavigate } from 'react-router-dom';
import Alert from '../../../alert';

const LogIn = () => {
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [authStatus, setAuthStatus] = useState(null);
    const navigate = useNavigate();
    const [alertMessage, setAlertMessage] = useState("");
    const [alertType, setAlertType] = useState("success");
    const [showAlert, setShowAlert] = useState(false);

    const showCustomAlert = (msg, type = "success", duration = 3000) => {
        setAlertMessage(msg);
        setAlertType(type);
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), duration);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Force JSON content type
            await axios.post(
                'https://georgianchroniclesbackend.onrender.com/login',
                loginData,
                {
                    withCredentials: true,
                    headers: { "Content-Type": "application/json" }
                }
            );

            const statusResponse = await axios.get(
                'https://georgianchroniclesbackend.onrender.com/auth-status',
                { withCredentials: true }
            );

            setAuthStatus(statusResponse.data);

            if (statusResponse.data.logged_in) {
                navigate('/social');
                localStorage.setItem("userId", statusResponse.data.user.id);
                showCustomAlert(`მოგესალმებით ${statusResponse.data.user.username} ჩვენს სერვერზე!`, "success", 3000);
            } else {
                showCustomAlert(`შესვლა ვერ მოხერხდა სცადეთ თავიდან`, "error", 3000);
            }

        } catch (error) {
            if (error.response) {
                console.log(error.response.data);
                showCustomAlert(`${error.response.data.error}`, "error", 3000);
            } else {
                console.log(error);
                showCustomAlert("წარმოიშვა შეცდომა სცადეთ თავიდან", "error", 3000);
            }
        }
    };

    return (
        <div className='SignUp'>
            <Alert
                message={alertMessage}
                type={alertType}
                visible={showAlert}
                onClose={() => setShowAlert(false)}
            />
            <div className='SignUp_container'>
                <p className='signup_heading'>
                    Georgian <img className='signup_logo' src={logo} alt="logo" /> Chronicles
                </p>
                <div className='signup_title_container'>
                    <p className='signup_title'>კეთილი იყოს თქვენი დაბრუნება</p>
                    <p className='signup_email_label'>შეიყვანე შენი ნამდვილი მონაცემები</p>
                </div>
                <form className='reg_form' onSubmit={handleSubmit}>
                    <input
                        className='reg_input'
                        placeholder='ელ-ფოსტა'
                        type="email"
                        required
                        autoCapitalize="none"
                        autoCorrect="off"
                        spellCheck={false}
                        value={loginData.email}
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value.trim() })}
                    />
                    <input
                        className='reg_input'
                        placeholder='პაროლი'
                        type="password"
                        required
                        autoCapitalize="none"
                        autoCorrect="off"
                        spellCheck={false}
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    />
                    <button className='reg_btn'>შესვლა</button>
                </form>
                <p className='signup_footer'>
                    არ გაქვთ ანგარიში? <Link to="/signup"><span>რეგისტრაცია</span></Link>
                </p>
            </div>
        </div>
    );
};

export default LogIn;