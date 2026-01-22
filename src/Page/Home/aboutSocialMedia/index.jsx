import './style.css';
import text from './text.json';
import logo from '../../../assets/images/logoBGnone.png';

export const AboutSocialMedia = () => {

    return (
        <div className="AboutSocialMedia">
            <div className='AboutSocialMedia_container'>
                <div className='AboutSocialMedia_content'>
                    <p className='AboutSocialMedia_heading'>{text[0].heading}<div className='line'></div></p>
                    <div className='AboutSocialMedia_inner'>
                        <div className='AboutSocialMedia_text_container'>
                            {text[1].map((item, index) => (
                                <p key={index} className='AboutSocialMedia_text'>
                                    <p>{index + 1}.</p>
                                    {item.text}
                                </p>
                            ))}
                        </div>
                        <div>
                            <img className='AboutSocialMedia_logo' src={logo} alt="" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};