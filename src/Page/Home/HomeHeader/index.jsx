import './style.css';
import { useState } from 'react';
import HeadingText from './HomeHeader.json';
import MinecraftRoom from '@/assets/images/pc-desk-steve-figure.svg';

export const HomeHeader = () => {
    const ip = "georgianchronicles.com";
    const [copyBtn, setCopyBtn] = useState("Copy IP");
    
    const copy = async () => {
        try {
            await navigator.clipboard.writeText(ip);
            setCopyBtn("Copied");
            setTimeout(() => {setCopyBtn("Copy IP")}, 1000);
        } catch (err) {
            console.error("Failed to copy", err);
        };
    };

    return (
        <div className='Home_Header'>
            <div className='Home_Header_inner'>
                <div className='home_header'>
                    <div className='home_header_text_container'>
                        <p className='heading_header'>{HeadingText.headingHeader}</p>
                        <h1 className='heading'>{HeadingText.heading}</h1>
                        <p className='heading_description'>{HeadingText.headingDescription}</p>
                        <p className='heading_description_res'>{HeadingText.headingResDescription}</p>
                        <div className='server_ip_container'>
                            <p className='server_ip'>{ip}</p>
                            <div className='home_header_server_join_btn' onClick={copy}>
                                {copyBtn}
                            </div>
                        </div>
                    </div>
                    <div className='home_header_image_container'>
                        <div className='home_header_image'>
                            <object type="image/svg+xml" data={MinecraftRoom} width="100%" title="MINECRAFT SERVER HOSTING" alt="PC desk with a steve figure"></object>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};