import React, { useEffect } from 'react';
import {
  Button,
  FormControl,
  Grid,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  FormHelperText,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useForm } from '../hooks/index';
import { Api } from '../service/api';
import { useState } from 'react';
import { Delete, Edit } from '@material-ui/icons';
import SearchIcon from '@material-ui/icons/Search';
import { useDispatch } from 'react-redux';
import { MessageSuccess } from '../redux/reducer';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: '100%',
    marginTop:4,
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#bfbfbf',
    },
    '& .MuiFormLabel-root': {
      color: '#747373',
    },
    '& .MuiPaper-root': {
      backgroundColor: '#fff0',
    },
    '& .MuiInputBase-input':{
      color:'#747373'
    },
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  root: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    listStyle: 'none',
    padding: theme.spacing(0.5),
    margin: 0,
  },
  chip: {
    margin: theme.spacing(0.5),
  },
  formLabel: {
    marginTop: 'auto',
  },
  container: {
    maxHeight: 440,
  },
  margin: {
    margin: theme.spacing(1),
    '& .MuiFormLabel-root': {
      color: '#747373',
    },
    '& .MuiTablePagination-root': {
      color: '#747373',
    },
    '& .MuiInputBase-root': {
      color: 'rgb(100 100 100 / 87%)',
    },
  },
  fixColumn: {
    position: 'sticky',
    right: 0,
    minWidth: '146px',
    backgroundColor:'#a39e9e',
    textAlign:'center',
    fontWeight: 'bold',
  },
  head:{
    textAlign:'center',
    fontWeight: 'bold',
    backgroundColor: '#bbbaba',
  }
}));
const ParPublicaciones = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const form = useForm({
    campo: null,
    tipo: null,
    codigoPublicacion: null,
    estado: null,
  });
  const [catal, setCatal] = useState([]);
  const [publicacion, setPublicacion] = useState([]);
  const getPublicaciones = async () => {
    await Api.getParPublicacion()
      .then((data) => {
        if (data) setPublicacion(data.datos);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getCatalogoTramite = async () => {
    try {
      await Api.getCatalogoTramite()
        .then((data) => {
          if (data) setCatal(data.datos);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  };
  const listarParPublicaciones = async () => {
    const d = JSON.parse(window.localStorage.getItem('tramite'));
    await Api.listarPublicaciones({ idCatalogoTramite: d.id })
      .then((resp) => {
        if (resp && resp.finalizado) {
          return setPublicacion(resp.datos);
        }
      })
      .catch((err) => console.log(err));
  };
  const [action, setAction] = useState('add');
  const [idc, setId] = useState(null);
  const handleCancel = () => {
    resetVariables();
  };
  const [catalogoT, setCatalogoT] = useState();
  const submitPublicacion = async (event) => {
    event.preventDefault();
    const d = JSON.parse(window.localStorage.getItem('tramite'));
    try {
      if (Object.values(form.errors).includes(true)) {
        form.setTouched();
      } else {
        const data = {
          campo: form.values.campo,
          tipo: form.values.tipo,
          codigoPublicacion: form.values.codigoPublicacion,
          estado: form.values.estado,
          idCatalogoTramite: catalogoT,
        };
        if (action === 'edit') {
          const valAct = {};
          const changes = {};
          const campos = Object.keys(data);
          await campos.forEach((campo) => {
            if (anterior[campo] !== data[campo]) {
              valAct[campo] = {
                valorAnterior: anterior[campo],
                valorActual: data[campo],
              };
              changes[campo] = data[campo];
            }
            delete valAct.idCatalogoTramite;
          });
          delete valAct.idCatalogoTramite;
          valAct.id = idc;
          const formulario = {
            tabla: 'par_publicaciones',
            matricula: '',
            idRegistro: idc,
            cambio: valAct,
            cambios: changes,
          };
          const body = {
            id: idc,
            publicacion: data,
            formulario: formulario,
          };
          await Api.updateParPublicacion(body)
            .then((resp) => {
              if (resp && resp.finalizado) {
                setCatalogoT('');
                return dispatch(MessageSuccess(resp.mensaje));
                // return getPublicaciones();
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
        if (action === 'add') {
          const formulario = {
            tabla: 'par_publicaciones',
            matricula: '',
            idRegistro: '',
            cambio: data,
            cambios: {},
          };
          const body = {
            publicacion: data,
            formulario: formulario,
          };
          await Api.addParPublicacion(body)
            .then((resp) => {
              if (resp && resp.finalizado) {
                return dispatch(MessageSuccess(resp.mensaje));
                // return getPublicaciones();
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
        if (d) {
          listarParPublicaciones();
        } else {
          getPublicaciones();
        }
        setAction('add');
        resetVariables();
      }
    } catch (error) {
      console.log(error);
    }
  };
  // PopUpconfirmDelete
  const [openD, setOpenD] = React.useState(false);
  const [dataPar, setdataPar] = React.useState({});
  const handleClickOpenD = (data) => {
    setOpenD(true);
    setdataPar({ ...data });
  };
  const handleCloseD = () => {
    setOpenD(false);
  };
  const deleteItem = async () => {
    const d = JSON.parse(window.localStorage.getItem('tramite'));
    const val = {
      estado: {
        valorAnterior: dataPar.estado,
        valorActual: 'INACTIVO',
      },
    };
    const cambio = {
      id: dataPar.id,
      estado: 'INACTIVO',
    };
    const data = {
      tabla: 'par_publicaciones',
      idRegistro: dataPar,
      cambio: val,
      cambios: cambio,
    };
    const req = { id: dataPar.id, formulario: data };
    await Api.eliminarParPublicacion(req)
      .then((resp) => {
        dispatch(MessageSuccess(resp.mensaje));
        // getPublicaciones();
        setOpenD(false);
      })
      .catch((err) => {
        console.log(err);
      });
    if (d) {
      listarParPublicaciones();
    } else {
      getPublicaciones();
    }
  };
  const [anterior, setAnterior] = useState({
    campo: null,
    tipo: null,
    codigoPublicacion: null,
    estado: null,
    idCatalogoTramite: null,
  });
  const editItem = (rows) => {
    const data = {
      campo: rows.campo,
      tipo: rows.tipo,
      codigoPublicacion: rows.codigoPublicacion,
      estado: rows.estado,
      catalogoTramite: rows.catalogoTramite,
    };
    const obj = catal.filter((f) => f.id === rows.idCatalogoTramite);
    // console.log(obj[0]);
    setAnterior({
      campo: rows.campo,
      tipo: rows.tipo,
      codigoPublicacion: rows.codigoPublicacion,
      estado: rows.estado,
      idCatalogoTramite: rows.idCatalogoTramite,
    });
    setValue(obj[0]);
    setCatalogoT(obj[0]);
    setId(rows.id);
    form.reset();
    form.setValues(data);
    setAction('edit');
    // handleOpen('edit');
  };
  const resetVariables = () => {
    form.reset();
    setValue('');
    setAction('add');
    const d = window.localStorage.getItem('tramite');
    if (!d) {
      setCatalogoT('');
    } else {
      setCatalogoT(JSON.parse(d));
    }
  };
  // eslint-disable-next-line
  const [value, setValue] = React.useState([]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  useEffect(() => {
    const d = window.localStorage.getItem('tramite');
    setCatalogoT(JSON.parse(d));
    getCatalogoTramite();
    // getPublicaciones();
    if (d) {
      listarParPublicaciones();
    } else {
      getPublicaciones();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [searchNombre, setSearchNombre] = React.useState('');
  const [searchId, setSearchId] = React.useState('');

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  return (
    <Grid style={{ height: '60%', width: '100%', marginBottom: '20px' }}>
      {catalogoT ? (
        <>
          <Typography variant="h5" style={{ textAlign: 'center' }}>
            {'Tramite: ' + catalogoT.nombre || ''}
          </Typography>
          <form onSubmit={submitPublicacion}>
            <Grid container spacing={1} alignItems="center">
              <Grid item md={6} xs={12} sm={6} lg={6} xl={6}>
                <TextField
                  className={classes.formControl}
                  value={form.values.campo}
                  onChange={form.addValue}
                  error={form.errors.campo && form.touched.campo}
                  helperText={
                    form.errors.campo && form.touched.campo
                      ? 'El campo no puede estar vacio'
                      : ''
                  }
                  fullWidth
                  autoFocus
                  label="Campo"
                  color="primary"
                  name="campo"
                  variant="outlined"
                  id="campo"
                />
              </Grid>
              <Grid item md={6} xs={12} sm={6} lg={6} xl={6}>
                <TextField
                  className={classes.formControl}
                  value={form.values.tipo}
                  onChange={form.addValue}
                  error={form.errors.tipo && form.touched.tipo}
                  helperText={
                    form.errors.tipo && form.touched.tipo
                      ? 'El campo no puede estar vacio'
                      : ''
                  }
                  fullWidth
                  label="Tipo"
                  color="primary"
                  name="tipo"
                  variant="outlined"
                  id="tipo"
                />
              </Grid>
              <Grid item md={6} xs={12} sm={6} lg={6} xl={6}>
                <TextField
                  className={classes.formControl}
                  value={form.values.codigoPublicacion}
                  onChange={form.addValue}
                  error={
                    form.errors.codigoPublicacion &&
                    form.touched.codigoPublicacion
                  }
                  helperText={
                    form.errors.codigoPublicacion &&
                    form.touched.codigoPublicacion
                      ? 'El campo no puede estar vacio'
                      : ''
                  }
                  fullWidth
                  label="Código Publicación"
                  color="primary"
                  name="codigoPublicacion"
                  variant="outlined"
                  id="codigoPublicacion"
                />
              </Grid>
              <Grid item md={6} xs={12} sm={6} lg={6} xl={6}>
                <FormControl
                  variant="outlined"
                  className={classes.formControl}
                  error={form.errors.estado && form.touched.estado}
                >
                  <InputLabel id="estado" style={{ marginTop: 'auto' }}>
                    Estado
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-outlined-label"
                    id="estado"
                    name="estado"
                    value={form.values.estado}
                    onChange={form.addValue}
                    variant="outlined"
                    fullWidth
                    label="Estado"
                  >
                    <MenuItem value={'ACTIVO'}>ACTIVO</MenuItem>
                    <MenuItem value={'INACTIVO'}>INACTIVO</MenuItem>
                    <MenuItem value={'CREADO'}>CREADO</MenuItem>
                    <MenuItem value={'PENDIENTE'}>PENDIENTE</MenuItem>
                    <MenuItem value={'CANCELADO'}>CANCELADO</MenuItem>
                  </Select>
                  <FormHelperText>
                    {form.errors.estado && form.touched.estado
                      ? 'El campo no puede estar vacio'
                      : ''}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={6} lg={6} xl={6}>
                <Button
                  color="primary"
                  variant="outlined"
                  className={classes.margin}
                  disableElevation
                  onClick={handleCancel}
                >
                  Cancelar
                </Button>
                <Button
                  className={classes.margin}
                  variant="contained"
                  color="primary"
                  type="submit"
                >
                  {action === 'add' ? 'Crear ' : 'Actualizar '}
                  PAR PUBLICACIÓN
                </Button>
              </Grid>
            </Grid>
          </form>{' '}
        </>
      ) : (
        <h5>Tramite no seleccionado</h5>
      )}
      <Typography variant="h5" style={{ textAlign: 'center' }}>
        Lista de Par_Publicaciones
      </Typography>
      <TextField
        onChange={(e) => setSearchId(e.target.value)}
        className={classes.margin}
        id="input-with-icon-textfield"
        label="Buscar po ID:"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
      <TextField
        onChange={(e) => setSearchNombre(e.target.value)}
        className={classes.margin}
        id="input-with-icon-textfield"
        label="Buscar por Documento:"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
      <Dialog
        open={openD}
        onClose={handleCloseD}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title"></DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            ¿Se encuentra seguro de eliminar este ítem?
          </DialogContentText>
        </DialogContent>
        <DialogContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell align="right">CAMPO</TableCell>
                <TableCell align="right">TIPO</TableCell>
                <TableCell align="right">ESTADO</TableCell>
                <TableCell align="right">CÓDIGO PUBLICACIÓN</TableCell>
                <TableCell align="right">CATÁLOGO TRÁMITE</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>{dataPar.id || ''}</TableCell>
                <TableCell>{dataPar.campo || ''}</TableCell>
                <TableCell>{dataPar.tipo || ''}</TableCell>
                <TableCell>{dataPar.codigoPublicacion || ''}</TableCell>
                <TableCell>{dataPar.estado || ''}</TableCell>
                <TableCell>{dataPar.idCatalogoTramite || ''}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseD} color="primary">
            Cancelar
          </Button>
          <Button onClick={deleteItem} color="primary" autoFocus>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
      <TableContainer component={Paper} className={classes.container}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell className={classes.head}>ID</TableCell>
              <TableCell className={classes.head}>CAMPO</TableCell>
              <TableCell className={classes.head}>TIPO</TableCell>
              <TableCell className={classes.head}>CÓDIGO PUBLICACIÓN</TableCell>
              <TableCell className={classes.head}>ESTADO</TableCell>
              <TableCell className={classes.head}>CATÁLOGO TRÁMITE</TableCell>
              <TableCell className={classes.fixColumn}>
                ACCIÓN
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {publicacion.length > 0 ? (
              publicacion
                .filter(
                  (row) =>
                    !searchId ||
                    row.id
                      .toString()
                      .toLowerCase()
                      .includes(searchId.toString().toLowerCase()),
                )
                .filter(
                  (row) =>
                    !searchNombre ||
                    row.documento
                      .toString()
                      .toLowerCase()
                      .includes(searchNombre.toString().toLowerCase()),
                )
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((pub) => {
                  const {
                    id,
                    campo,
                    tipo,
                    codigoPublicacion,
                    estado,
                    idCatalogoTramite,
                  } = pub;
                  return (
                    <TableRow
                      key={id}
                      sx={{ '&:last-child td, &:last-child th': { border: 1 } }}
                    >
                      <TableCell align="center">{id}</TableCell>
                      <TableCell align="center">{campo}</TableCell>
                      <TableCell align="center">{tipo}</TableCell>
                      <TableCell align="center">{codigoPublicacion}</TableCell>
                      <TableCell align="center">{estado}</TableCell>
                      <TableCell align="center">{idCatalogoTramite}</TableCell>
                      <TableCell
                        align="center"
                        style={{ width: 200 }}
                        className={classes.fixColumn}
                      >
                        <Tooltip placement="bottom" title="Editar registro">
                          <IconButton
                            className={classes.paddingButton}
                            onClick={() => editItem(pub)}
                          >
                            <Edit className={classes.success} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip placement="bottom" title="Eliminar registro">
                          <IconButton
                            className={classes.paddingButton}
                            onClick={() => handleClickOpenD(pub)}
                          >
                            <Delete className={classes.delete} />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })
            ) : (
              <TableRow>
                <TableCell colSpan={4}>No existen datos</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 100]}
        component="div"
        count={publicacion.length}
        style={{color:'#747373'}}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Grid>
  );
};

export default ParPublicaciones;
