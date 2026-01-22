import './style.css';
import { Posts } from './Posts';
import { SocialAbout } from './SocialAbout';
import { SocialProfile } from './SocialProfile';

const Social = () => {
    return (
        <div className="Social">
            <SocialAbout />
            <Posts />
            <SocialProfile />
        </div>
    );
};

export default Social;