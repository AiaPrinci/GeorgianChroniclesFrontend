import './style.css';
import logo from '@/assets/images/logoBGnone.png';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Alert from '../../../alert';

const SignUp = () => {
    const [regData, setRegData] = useState({
        email: '',
        username: '',
        password: '',
    });
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
            const response = await axios.post('https://georgianchroniclesbackend.onrender.com/register', regData);

            console.log(response.data);
            showCustomAlert("თქვენ წარმატებით დარეგისტრირდით, გთხოვთ გაიაროთ Log In", "success", 5000);
        } catch (error) {
            if (error.response) {
                console.log(error.response.data);
                showCustomAlert(`${error.response.data.error}`, "error", 5000)
            } else {
                console.log(error);
                showCustomAlert("წარმოიშვა შეცდომა", "error", 5000);
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
                <p className='signup_heading'>Georgian <img className='signup_logo'  src={logo} alt="logo" /> Chronicles</p>
                <div className='signup_title_container'>
                    <p className='signup_title'>შექმენი შენი SMP-ის ანგარიში</p>
                    <p className='signup_email_label'>შეიყვანე შენი ნამდვილი მონაცემები</p>
                </div>
                <form className='reg_form' method='post' action='' onSubmit={handleSubmit}>
                    <input
                        className='reg_input'
                        placeholder='სახელი'
                        type="text"
                        required
                        value={regData.username}
                        onChange={(e) => setRegData({...regData, username: e.target.value})}
                        
                    />
                    <input
                        className='reg_input'
                        placeholder='ელ-ფოსტა'
                        type="email"
                        required
                        value={regData.email}
                        onChange={(e) => setRegData({...regData, email: e.target.value})}
                    />
                    <input
                        className='reg_input'
                        placeholder='პაროლი'
                        type="password"
                        required
                        value={regData.password}
                        onChange={(e) => setRegData({...regData, password: e.target.value})}
                    />
                    <button className='reg_btn'>რეგისტრაცია</button>
                </form>
                <p className='signup_footer'>უკვე გაქვს ანგარიში? <Link to="/login"><span>შესვლა</span></Link></p>
            </div>
        </div>
    );
};

export default SignUp;