import React from 'react';
import {
  Button,
  TextField,
  Grid,
  Paper,
  AppBar,
  Typography,
  Toolbar,
  Link,
} from '@material-ui/core';
 import { useNavigate } from 'react-router-dom';
import { Api } from '../../service/api';
import { useDispatch } from 'react-redux';

import './login.css';
import { closeMessage } from '../../redux/reducer';

const Logout = () => {
  // const dispatch = useDispatch();
  const navigate = useNavigate();

  React.useEffect(()=>{
    console.log('token new');
    const token=window.localStorage.removeItem('token');
    window.location.reload();
         console.log('logout');
  //  navigate('/Login');
   console.log(token)
    //setUser(token);
  }, [])

  return (                       
 <div></div>
  );
};
export default Logout;
