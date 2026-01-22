import './style.css';
import { Link, resolvePath } from 'react-router-dom';
import princiImage from '../../../assets/images/princi.png';
import lukaImage from '../../../assets/images/luka.png';
import mishkaImage from '../../../assets/images/mishka.png';

export const Admins = () => {

    const admins = [
        {
            name: "princi",
            image: princiImage,
            link: "",
            role: "Founder"
        },
        {
            name: "Luka",
            image: lukaImage,
            link: "",
            role: "Admin"
        }
    ];

    return (
        <div className="Admins">
            <div className='Admins_container'>
                <p className='Admins_heading'>ადმინები<div className='line'></div></p>
                <div className='admins_container'>
                    {admins.map((admin, index) => (
                        <div key={index} className='admin'>
                            <img className='admin_image' src={admin.image} alt={admin.name} />
                            <Link to={admin.link}>
                                <p className='admin_name'>{admin.name}</p>
                            </Link>
                            <p className='admin_role'>{admin.role}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
};