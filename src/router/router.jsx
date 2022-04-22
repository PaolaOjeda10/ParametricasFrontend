import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Fade } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import Storage from '../plugins/Storage';
import AppRoutes from './routes';
import AppNavbar from '../layout/AppNavbar';
import { setLogin } from '../redux/userReducer';
import { useLocation, useParams } from 'react-router-dom';
import '../index.css';

const AppRouter = () => {
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
      <AppNavbar />
      <Fade>
        <AppRoutes />
      </Fade>
    </>
  );
};

export default AppRouter;
