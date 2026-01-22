import './style.css';
import logo from '@/assets/images/logoBGnone.png';
import tbc from '@/assets/images/tbc.png';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer>
            <div className='Footer'>
                <div className='footer_text_container'>
                    <p className='footer_heading'>Georgian <img className='footer_logo' src={logo} alt="" /> Chronicles</p>
                    <p className='footer_text'>Website made by: <Link to='https://davitjimsheleishvili.netlify.app' target='_blank'><span>Davit Jimsheleishvili</span></Link></p>
                </div>
                <Link to="https://www.tbceducation.ge/" target='_blank'>
                    <img className='tbc' src={tbc} alt="" />
                </Link>
            </div>
        </footer>
    )
};

export default Footer;