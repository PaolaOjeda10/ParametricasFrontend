import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Fade } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import Storage from '../plugins/Storage';
import AppRoutes from './routes';
import AppNavbar from '../layout/AppNavbar';
import { setLogin } from '../redux/userReducer';
import { useLocation, useParams } from 'react-router-dom';
import DarkModeToggle from 'react-dark-mode-toggle';
import { DarkThemeContext } from '../DarkThemeContext';
import '../index.css';

const AppRouter = () => {
  const { turnOn, setTurnOn, mainColor } = useContext(DarkThemeContext);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const params = useParams();
  const getRoutePath = (location, params) => {
    const { pathname } = location;
    if (!Object.keys(params).length) {
      return pathname;
    }
    let path = pathname;
    Object.entries(params).forEach(([paramName, paramValue]) => {
      if (paramValue) {
        path = path.replace(paramValue, `:${paramName}`);
      }
    });
    return path;
  };
  useEffect(() => {
    const token = Storage.get('token');
    const path = getRoutePath(location, params);
    if (token) {
      dispatch(setLogin(true));
      if (path === '/Inicio') {
        navigate('/Inicio');
      } else {
        navigate(path);
      }
    } else {
      dispatch(setLogin(false));
      navigate('/login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  return (
    <>
      <div
        className="App"
        style={{
          backgroundColor: mainColor.bg,
          color:mainColor.color,
          height: '100%',
        }}
      >
        <AppNavbar />
        <div style={{float:'right'}}>
        <DarkModeToggle onChange={setTurnOn} checked={turnOn} size={45} />
        </div>
        <Fade>
          <AppRoutes />
        </Fade>
      </div>
    </>
  );
};

export default AppRouter;
