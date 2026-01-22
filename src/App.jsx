import { useEffect, useState } from 'react';
import './App.css';
import { Routes, Route, useLocation } from 'react-router-dom';
import SignUp from './Page/Reg/SignUp';
import LogIn from './Page/Reg/LogIn';
import Home from './Page/Home';
import Social from './Page/Socialmedia';
import Profile from './Page/Profile';
import Header from './Page/Header';
import Loader from './GlobalLoader';
import NotFound from './Page/404';

const App = () => {
  const location = useLocation();
  const [routeLoading, setRouteLoading] = useState(false);
  const noLoaderRoutes = ['/signup', '/login'];

  const hideHeader = location.pathname === '/signup' || location.pathname === '/login';

  useEffect(() => {
    if (noLoaderRoutes.includes(location.pathname)) {
      setRouteLoading(false);
      return;
    }

    setRouteLoading(true);

    const timer = setTimeout(() => {
      setRouteLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (routeLoading) {
    return (
      <div
        style={{
          width: '100%',
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: '#1f1f1f'
        }}
      >
        <Loader />
      </div>
    );
  }

  return (
    <>
      {!hideHeader && <Header />}

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/login' element={<LogIn />} />
        <Route path='/social' element={<Social />} />
        <Route path="/users/:userId" element={<Profile />} />
        <Route path='/*' element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;