import './style.css';
import { HomeHeader } from './HomeHeader';
import { HowLSWorks } from './description';
import { Admins } from './admins';
import { AboutSocialMedia } from './aboutSocialMedia';
import Footer from './Footer';

const Home = () => {
    return (
        <div className='Home'>
            <HomeHeader />
            <HowLSWorks />
            <AboutSocialMedia />
            <Admins />
            <Footer />
        </div>
    )
};

export default Home;