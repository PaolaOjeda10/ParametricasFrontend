import React, { useEffect, useState } from 'react';
import {
  Button,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputLabel,
  MenuItem,
  Select,
  TablePagination,
  TextField,
  Tooltip,
  Typography,
  FormHelperText,
} from '@material-ui/core';
import '../css/table.css';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Delete, Edit } from '@material-ui/icons';
import { useForm } from '../hooks';
import { Api } from '../service/api';
import { useDispatch } from 'react-redux';
import { MessageError, MessageSuccess, MessageWarning } from '../redux/reducer';
import SearchIcon from '@material-ui/icons/Search';

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
const Aranceles = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const form = useForm({
    monto: null,
    tipo: null,
    estado: null,
  });
  const [formnull, setFormnull] = useState({
    funcionDependiente: null,
    codTipoSocietario: null,
  });
  const [catal, setCatal] = useState([]);
  const [aranceles, setAranceles] = useState([]);
  const getAranceles = async () => {
    await Api.getArancel()
      .then((data) => {
        if (data) {
          return setAranceles(data.datos);
        }
        dispatch(MessageWarning(data.mensaje));
      })
      .catch((err) => console.log(err));
  };
  const listarArancelesCatalTramite = async () => {
    const d = JSON.parse(window.localStorage.getItem('tramite'));
    await Api.listarArancelCatalogoTramite({ idCatalogoTramite: d.id })
      .then((resp) => {
        if (resp && resp.finalizado) {
          return setAranceles(resp.datos);
        }
      })
      .catch((err) => console.log(err));
  };
  const getCatalogoTramite = async () => {
    try {
      await Api.getCatalogoTramite()
        .then((data) => {
          if (data && data.finalizado) {
            return setCatal(data.datos);
          }
          dispatch(MessageWarning(data.mensaje));
        })
        .catch((err) => dispatch(MessageError(err)));
    } catch (error) {
      console.log(error);
    }
  };
  const [action, setAction] = useState('add');
  const [idc, setId] = useState(null);
  const handleCancel = () => {
    form.reset();
    resetVariables();
  };
  const [catalogoT, setCatalogoT] = useState();
  const submitArancel = async (event) => {
    event.preventDefault();
    try {
      if (Object.values(form.errors).includes(true)) {
        form.setTouched();
      } else {
        const data = {
          monto: form.values.monto,
          tipo: form.values.tipo,
          funcionDependiente: formnull.funcionDependiente,
          codTipoSocietario: formnull.codTipoSocietario,
          estado: form.values.estado,
          idCatalogoTramite: catalogoT.id,
          // catalogoTramite: catalogoT,
        };
        const d = JSON.parse(window.localStorage.getItem('tramite'));
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
          });
          valAct.id = idc;
          const formulario = {
            tabla: 'aranceles',
            matricula: '',
            idRegistro: idc,
            cambio: valAct,
            cambios: changes,
          };
          const body = {
            id: idc,
            arancel: data,
            formulario: formulario,
          };
          // console.log(body);
          await Api.updateArancel(body)
            .then((resp) => {
              // console.log('resp', resp);
              if (resp && resp.finalizado) {
                dispatch(MessageSuccess(resp.mensaje));
                setCatalogoT('');
                if (d) {
                  return listarArancelesCatalTramite();
                }
                return getAranceles();
              }
              dispatch(MessageWarning(resp.message));
            })
            .catch((err) => {
              console.log('err', err);
            });
          resetVariables();
        }
        if (action === 'add') {
          const formulario = {
            tabla: 'aranceles',
            matricula: '',
            idRegistro: '',
            cambio: data,
            cambios: {},
          };
          const body = {
            arancel: data,
            formulario: formulario,
          };
          await Api.addArancel(body)
            .then((resp) => {
              if (resp.finalizado && resp) {
                dispatch(MessageSuccess(resp.mensaje));
                if (d) {
                  return listarArancelesCatalTramite();
                }
                return getAranceles();
              }
              dispatch(MessageWarning(resp.message));
            })
            .catch((err) => {
              console.log(err);
            });
          // console.log(data);
        }
        setAction('add');
        resetVariables();
      }
    } catch (error) {
      console.log('ERROR', error);
    }
  };
  const resetVariables = () => {
    setAction('add');
    form.reset();
    setValue('');
    setFormnull({
      funcionDependiente: '',
      codTipoSocietario: '',
    });
    const d = window.localStorage.getItem('tramite');
    if (!d) {
      setCatalogoT('');
    } else {
      setCatalogoT(JSON.parse(d));
    }
  };
  // PopUpconfirmDelete
  const [openD, setOpenD] = React.useState(false);
  const [dataAr, setdataAr] = React.useState({});
  const handleClickOpenD = (data) => {
    setOpenD(true);
    setdataAr({ ...data });
  };
  const handleCloseD = () => {
    setOpenD(false);
  };
  const deleteItem = async () => {
    const d = JSON.parse(window.localStorage.getItem('tramite'));
    const val = {
      estado: {
        valorAnterior: dataAr.estado,
        valorActual: 'INACTIVO',
      },
    };
    const cambio = {
      id: dataAr.id,
      estado: 'INACTIVO',
    };
    const data = {
      tabla: 'aranceles',
      idRegistro: dataAr.id,
      cambio: val,
      cambios: cambio,
    };
    const req = { id: dataAr.id, formulario: data };
    await Api.eliminarArancel(req)
      .then((resp) => {
        dispatch(MessageSuccess(resp.mensaje));
        getAranceles();
        setOpenD(false);
      })
      .catch((err) => {
        console.log(err);
      });
    if (d) {
      listarArancelesCatalTramite();
    } else {
      getAranceles();
    }
  };
  const [anterior, setAnterior] = useState({
    monto: null,
    tipo: null,
    funcionDependiente: null,
    codTipoSocietario: null,
    estado: null,
    idCatalogoTramite: null,
  });
  const editItem = (rows) => {
    const data = {
      monto: rows.monto,
      tipo: rows.tipo,
      estado: rows.estado,
      idCatalogoTramite: rows.idCatalogoTramite,
      catalogoTramite: rows.catalogoTramite,
    };
    setAnterior({
      monto: rows.monto,
      tipo: rows.tipo,
      funcionDependiente: rows.funcionDependiente,
      codTipoSocietario: rows.codTipoSocietario,
      estado: rows.estado,
      idCatalogoTramite: rows.idCatalogoTramite,
    });
    const obj = catal.filter((f) => f.id === rows.idCatalogoTramite);
    setFormnull({
      funcionDependiente: rows.funcionDependiente,
      codTipoSocietario: rows.codTipoSocietario,
    });
    setCatalogoT(obj[0]);
    setValue(obj[0]);
    setId(rows.id);
    form.reset();
    form.setValues(data);
    setAction('edit');
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
    if (!d) {
      getAranceles();
    } else {
      listarArancelesCatalTramite();
    }
    getCatalogoTramite();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [searchEstado, setSearchEstado] = React.useState('');
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
          <form onSubmit={submitArancel}>
            <Grid container spacing={1} alignItems="center">
              <Grid item md={6} xs={12} sm={6} lg={6} xl={6}>
                <TextField
                  className={classes.formControl}
                  value={form.values.monto}
                  onChange={form.addValue}
                  error={form.errors.monto && form.touched.monto}
                  helperText={
                    form.errors.monto && form.touched.monto
                      ? 'El campo no puede estar vacio'
                      : ''
                  }
                  autoFocus
                  label="Monto"
                  color="primary"
                  name="monto"
                  variant="outlined"
                  id="monto"
                  type="number"
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
                  value={formnull.funcionDependiente || ''}
                  onChange={(e) =>
                    setFormnull({
                      ...formnull,
                      funcionDependiente: e.target.value,
                    })
                  }
                  label="Función Dependiente"
                  color="primary"
                  name="funcionDependiente"
                  variant="outlined"
                  id="funcionDependiente"
                />
              </Grid>
              <Grid item md={6} xs={12} sm={6} lg={6} xl={6}>
                <TextField
                  type="number"
                  className={classes.formControl}
                  value={formnull.codTipoSocietario || ''}
                  onChange={(e) =>
                    setFormnull({
                      ...formnull,
                      codTipoSocietario: e.target.value,
                    })
                  }
                  label="Cod Tipo Societario"
                  color="primary"
                  name="codTipoSocietario"
                  variant="outlined"
                  id="codTipoSocietario"
                />
              </Grid>
              <Grid item md={6} xs={12} lg={6} xl={6}>
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
                  className={classes.margin}
                  color="primary"
                  variant="outlined"
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
                  ARANCEL
                </Button>
              </Grid>
            </Grid>
          </form>{' '}
        </>
      ) : (
        <h5>Trámite no seleccionado</h5>
      )}
      <Typography variant="h5" style={{ textAlign: 'center' }}>
        Lista de Aranceles
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
        onChange={(e) => setSearchEstado(e.target.value)}
        className={classes.margin}
        id="input-with-icon-textfield"
        label="Buscar por Estado:"
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
                <TableCell align="right">MONTO</TableCell>
                <TableCell align="right">TIPO</TableCell>
                <TableCell align="right">FUNCIÓN DEPENDIENTE</TableCell>
                <TableCell align="right">COD TIPO SOCIETARIO</TableCell>
                <TableCell align="right">ESTADO</TableCell>
                <TableCell align="right">CATÁLOGO TRÁMITE</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>{dataAr.id || ''}</TableCell>
                <TableCell>{dataAr.monto || ''}</TableCell>
                <TableCell>{dataAr.tipo || ''}</TableCell>
                <TableCell>{dataAr.funcionDependiente || ''}</TableCell>
                <TableCell>{dataAr.codTipoSocietario || ''}</TableCell>
                <TableCell>{dataAr.estado || ''}</TableCell>
                <TableCell>{dataAr.idCatalogoTramite || ''}</TableCell>
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
              <TableCell className={classes.head}>MONTO</TableCell>
              <TableCell className={classes.head}>TIPO</TableCell>
              <TableCell className={classes.head}>FUNCIÓN DEPENDIENTE</TableCell>
              <TableCell className={classes.head}>COD TIPO SOCIETARIO</TableCell>
              <TableCell className={classes.head}>ESTADO</TableCell>
              <TableCell className={classes.head}>CATÁLOGO TRÁMITE</TableCell>
              <TableCell className={classes.fixColumn}>
                ACCIÓN
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {aranceles.length > 0 ? (
              aranceles
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
                    !searchEstado ||
                    row.estado
                      .toString()
                      .toLowerCase()
                      .includes(searchEstado.toString().toLowerCase()),
                )
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((arancel) => {
                  const {
                    id,
                    monto,
                    tipo,
                    funcionDependiente,
                    codTipoSocietario,
                    estado,
                    idCatalogoTramite,
                  } = arancel;
                  return (
                    <TableRow
                      key={id}
                      sx={{ '&:last-child td, &:last-child th': { border: 1 } }}
                    >
                      <TableCell align="center">{id}</TableCell>
                      <TableCell align="center">{monto}</TableCell>
                      <TableCell align="center">{tipo}</TableCell>
                      <TableCell align="center">{funcionDependiente}</TableCell>
                      <TableCell align="center">{codTipoSocietario}</TableCell>
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
                            onClick={() => editItem(arancel)}
                          >
                            <Edit className={classes.success} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip placement="bottom" title="Eliminar registro">
                          <IconButton
                            className={classes.paddingButton}
                            onClick={() => handleClickOpenD(arancel)}
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
        count={aranceles.length}
        style={{color: '#747373'}}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Grid>
  );
};

export default Aranceles;
