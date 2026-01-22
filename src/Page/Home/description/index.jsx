import './style.css';
import text from './text.json';
import AutoFontText from '../../../isGeorgian';
import logo from '../../../assets/images/logoBGnone.png';

export const HowLSWorks = () => {
    return (
        <div className='HowLSWorks'>
            <div className='HowLSWorks_container'>
                <p className='HowLSWorks_header'>
                    <AutoFontText text={text[0].header} />
                    <div className='line'></div>
                </p>
                <div className='HowLSWorks_inner'>
                    <div>
                        <img className='HowLSWorks_logo' src={logo} alt="logo" />
                    </div>
                    <div className='HowLSWorks_text_container'>
                        {text[1].map((item, index) => (
                            <p key={index} className='HowLSWorks_text'>
                                <p>{index + 1}.</p>
                                {item.explanation}
                            </p>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};