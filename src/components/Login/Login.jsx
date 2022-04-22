import React from 'react';
import {
  Button,
  TextField,
  Grid,
  Paper,
  AppBar,
  Typography,
  Toolbar,
  InputAdornment,
  IconButton,
  OutlinedInput,
  Avatar,
} from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import { Api } from '../../service/api';
import { useDispatch } from 'react-redux';
import { useForm } from '../../hooks/useForm';
import { MessageSuccess, MessageWarning } from '../../redux/reducer';
import { setLogin } from '../../redux/userReducer';
import './login.css';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import Storage from '../../plugins/Storage';
import { makeStyles } from '@material-ui/core/styles';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '967px',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
    marginLeft:'auto',
    marginRight:'auto'
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#bfbfbf',
    },
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    backgroundColor:'#2196f3'
  },
}));

const Login = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [shown, setShown] = React.useState(false);
  const switchShown = () => setShown(!shown);
  const form = useForm({
    usuario: '',
    contrasena: '',
  });
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (Object.values(form.errors).includes(true)) {
        form.setTouched();
      } else {
        const data = {
          usuario: form.values.usuario,
          contrasena: btoa(encodeURI(form.values.contrasena)),
        };
        await Api.auth(data)
          .then((resp) => {
            if (resp && resp.finalizado) {
              // console.log(resp);
              Storage.set('token', resp.datos.access_token);
              const jwtStr = resp.datos.access_token.split('.')[1];
              const actualDate = Math.round(new Date().getTime() / 1000);
              const payload = JSON.parse(atob(jwtStr));
              Storage.set('ttl', payload.exp - payload.iat);
              Storage.set('t', actualDate);
              dispatch(MessageSuccess('Acceso exitosamente correcto'));
              dispatch(setLogin(true));
              return navigate('/Inicio');
            }
            dispatch(MessageWarning('Error en usuario y contraseña'));
            // console.log('resp', resp);
          })
          .catch((err) => console.log(err));
      }
    } catch (error) {
      console.log('error catch', error);
    }
  };
  return (
    <div>
      <AppBar
        position="static"
        alignitems="center"
        style={{ backgroundColor: '#2196f3', display: 'block' }}
      >
        <Toolbar>
          <Grid container wrap="wrap">
          </Grid>
        </Toolbar>
      </AppBar>
      <Grid className="gridC" container spacing={0} direction="row">
        <Grid item>
          <Grid container direction="column" spacing={2} className="login-form">
            <Paper
              variant="elevation"
              elevation={2}
              className="login-background"
            >
              <Grid item>
                <Avatar className={classes.avatar}>
                  <LockOutlinedIcon />
                </Avatar>
                <Typography className="Tittle" component="h1" variant="h5">
                  Iniciar Sesión
                </Typography>
              </Grid>
              <Grid item>
                <form onSubmit={handleSubmit}>
                  <Grid container direction="column" spacing={2}>
                    <Grid item>
                      <TextField
                        type="text"
                        placeholder="Usuario"
                        fullWidth
                        name="usuario"
                        onChange={form.addValue}
                        variant="outlined"
                        required
                        autoFocus
                      />
                    </Grid>
                    <Grid item>
                      <OutlinedInput
                        // id="outlined-adornment-password"
                        type={shown ? 'text' : 'password'}
                        placeholder="Contraseña"
                        fullWidth
                        name="contrasena"
                        onChange={form.addValue}
                        required
                        variant="outlined"
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={switchShown}
                              edge="end"
                            >
                              {shown ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                          </InputAdornment>
                        }
                        // labelWidth={70}
                      />
                    </Grid>
                    <Grid item>
                      <Button
                        style={{
                          backgroundColor: 'rgb(21 128 213)',
                          color: 'white',
                        }}
                        variant="contained"
                        type="submit"
                        className="button-block"
                      >
                        Ingresar
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};
export default Login;
