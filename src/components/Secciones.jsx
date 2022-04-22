import React, { Fragment, useEffect, useState } from 'react';
import {
  Button,
  FormControl,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TablePagination,
  TextField,
  Tooltip,
  Typography,
  FormHelperText,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { Delete, Edit } from '@material-ui/icons';
import { useForm } from '../hooks';
import { Api } from '../service/api';
import '../css/table.css';
import SearchIcon from '@material-ui/icons/Search';
import { useDispatch } from 'react-redux';
import { MessageError, MessageSuccess, MessageWarning } from '../redux/reducer';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: '100%',
    marginTop: 4,
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
  checkbox: {
    flexDirection: 'initial',
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
    backgroundColor: '#a39e9e',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  head: {
    textAlign: 'center',
    fontWeight: 'bold',
    backgroundColor: '#bbbaba',
  },
}));
const Navegacion = () => {
  const [tram, setTram] = useState(null);
  const [grup, setGrup] = useState(null);
  useEffect(() => {
    const t = JSON.parse(window.localStorage.getItem('tramite'));
    const g = JSON.parse(window.localStorage.getItem('grupo'));
    if (t) {
      setTram(t);
    }
    if (g) {
      setGrup(g);
    }
  }, []);

  return (
    <>
      <h5>
        Tramite: {tram ? tram.id : 'Tramite no seleccionado'}{' '}
        <NavigateNextIcon fontSize="small" style={{ marginBottom: -5 }} />{' '}
        Grupo: {grup ? grup.nombre : 'Grupo no seleccionado'}
      </h5>
    </>
  );
};
const Secciones = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const form = useForm({
    // id:null,
    nombre: null,
    descripcion: null,
    orden: null,
    estado: null,
  });
  const [catal, setCatal] = useState([]);
  const [secciones, setSecciones] = useState([]);

  const getSecciones = async () => {
    await Api.getSeccion()
      .then((data) => {
        if (data.finalizado && data) {
          setSecciones(data.datos);
          return dispatch(MessageSuccess(data.mensaje));
        }
      })
      .catch((err) => dispatch(MessageError(err)));
  };
  // Grupos
  const getGrupo = async () => {
    await Api.getGrupo()
      .then((data) => {
        if (data && data.finalizado) {
          return setCatal(data.datos);
        }
      })
      .catch((err) => dispatch(MessageError(err)));
  };
  const listarSecciones = async () => {
    const d = JSON.parse(window.localStorage.getItem('grupo'));
    await Api.listarSecciones({ idGrupo: d.id })
      .then((resp) => {
        if (resp && resp.finalizado) {
          return setSecciones(resp.datos);
        }
      })
      .catch((err) => console.log(err));
  };
  const [action, setAction] = useState('add');
  const [idc, setId] = useState(null);
  const handleCancel = () => {
    form.reset();
    resetVariables();
  };
  // eslint-disable-next-line no-unused-vars
  const [catalogoT, setCatalogoT] = useState();
  const [grupoS, setGrupoS] = useState();
  const submitSeccion = async (event) => {
    event.preventDefault();
    const d = JSON.parse(window.localStorage.getItem('grupo'));
    try {
      if (Object.values(form.errors).includes(true)) {
        form.setTouched();
      } else {
        const data = {
          // id:form.values.id,
          nombre: form.values.nombre,
          descripcion: form.values.descripcion,
          orden: form.values.orden,
          estado: form.values.estado,
          idGrupo: grupoS.id,
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
            delete valAct.idGrupo;
          });
          valAct.id = idc;
          const formulario = {
            tabla: 'secciones',
            matricula: '',
            idRegistro: idc,
            cambio: valAct,
            cambios: changes,
          };
          const body = {
            id: idc,
            seccion: data,
            formulario: formulario,
          };
          // console.log(body);
          await Api.updateSeccion(body)
            .then((resp) => {
              if (resp && resp.finalizado) {
                return dispatch(MessageSuccess(resp.mensaje));
                // getSecciones();
              }
            })
            .catch((err) => {
              console.log(err);
            });
          resetVariables();
        }
        if (action === 'add') {
          const formulario = {
            tabla: 'secciones',
            matricula: '',
            idRegistro: '',
            cambio: data,
            cambios: {},
          };
          const body = {
            seccion: data,
            formulario: formulario,
          };
          await Api.addSeccion(body)
            .then((resp) => {
              if (resp && resp.finalizado) {
                return dispatch(MessageSuccess(resp.mensaje));
                // return getSecciones();
              }
              dispatch(MessageWarning(resp.mensaje));
            })
            .catch((err) => console.log(err));
        }
        if (d) {
          listarSecciones();
        } else {
          getSecciones();
        }
        setAction('add');
        resetVariables();
        form.reset();
      }
    } catch (error) {}
  };
  const resetVariables = () => {
    form.reset();
    setValue('');
    setAction('add');
    const d = window.localStorage.getItem('grupo');
    if (!d) {
      setGrupoS('');
    } else {
      setGrupoS(JSON.parse(d));
    }
  };
  // PopUpconfirmDelete
  const [openD, setOpenD] = React.useState(false);
  const [dataSec, setdataSec] = React.useState({});
  const handleClickOpenD = (data) => {
    setOpenD(true);
    setdataSec({ ...data });
  };
  const handleCloseD = () => {
    setOpenD(false);
  };
  const deleteItem = async () => {
    const val = {
      estado: {
        valorAnterior: dataSec.estado,
        valorActual: 'INACTIVO',
      },
    };
    const cambio = {
      id: dataSec.id,
      estado: 'INACTIVO',
    };
    const data = {
      tabla: 'secciones',
      idRegistro: dataSec,
      cambio: val,
      cambios: cambio,
    };
    const req = { id: dataSec.id, formulario: data };
    await Api.elimnarSeccion(req)
      .then((resp) => {
        dispatch(MessageSuccess(resp.mensaje));
        getSecciones();
        setOpenD(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const [anterior, setAnterior] = useState({
    nombre: null,
    descripcion: null,
    orden: null,
    estado: null,
  });
  const editItem = (rows) => {
    const data = {
      // id:rows.id,
      nombre: rows.nombre,
      descripcion: rows.descripcion,
      orden: rows.orden,
      estado: rows.estado,
    };
    setAnterior({
      // ...anterior,
      nombre: rows.nombre,
      descripcion: rows.descripcion,
      orden: rows.orden,
      estado: rows.estado,
    });
    const obj = catal.filter((f) => f.id === rows.idGrupo);
    setValue(obj[0]);
    setGrupoS(obj[0]);
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
  const [selected, setSelected] = useState({
    data: [],
    tableRef: React.createRef(),
    selected: false,
    selectedRowId: null,
    c: 'blue',
    currentRow: {},
  });
  const handleSelect = (event, rowData) => {
    event.preventDefault();
    window.localStorage.setItem('seccion', JSON.stringify(rowData));
    setSelected({ currentRow: rowData });
    if (rowData.id === selected.selectedRowId) {
      setSelected({ selected: false });
      setSelected({ selectedRowId: null });
      window.localStorage.removeItem('seccion');
    } else {
      setSelected({ selected: true });
      setSelected({
        selectedRowId: rowData.id,
      });
    }
  };
  useEffect(() => {
    const c = window.localStorage.getItem('tramite');
    setCatalogoT(JSON.parse(c));
    const d = window.localStorage.getItem('grupo');
    setGrupoS(JSON.parse(d));
    getGrupo();
    const t = window.localStorage.getItem('seccion');
    if (t) {
      setSelected({ currentRow: JSON.parse(t) });
      setSelected({ selected: true });
      setSelected({ selectedRowId: JSON.parse(t).id });
    }
    if (d) {
      listarSecciones();
    } else {
      getSecciones();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [searchNombre, setSearchNombre] = React.useState('');
  const [searchId, setSearchId] = React.useState('');

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  return (
    <Fragment>
      <Navegacion />
      {grupoS ? (
        <>
          <Typography style={{ marginLeft: 100 }}>
            {/* {'Grupo: ' + grupoS.nombre || ''} */}
          </Typography>
          <form onSubmit={submitSeccion}>
            <Grid container spacing={1} alignItems="center">
              <Grid item md={6} xs={12}>
                <TextField
                  className={classes.formControl}
                  value={form.values.nombre}
                  onChange={form.addValue}
                  error={form.errors.nombre && form.touched.nombre}
                  helperText={
                    form.errors.nombre && form.touched.nombre
                      ? 'El campo no puede estar vacio'
                      : ''
                  }
                  // fullWidth
                  autoFocus
                  label="Nombre"
                  color="primary"
                  name="nombre"
                  variant="outlined"
                  id="nombre"
                  type="text"
                />
              </Grid>
              <Grid item md={6} xs={12} sm={6} lg={6} xl={6}>
                <TextField
                  className={classes.formControl}
                  value={form.values.descripcion}
                  onChange={form.addValue}
                  error={form.errors.descripcion && form.touched.descripcion}
                  helperText={
                    form.errors.descripcion && form.touched.descripcion
                      ? 'El campo no puede estar vacio'
                      : ''
                  }
                  // fullWidth
                  autoFocus
                  label="Descripcion"
                  color="primary"
                  name="descripcion"
                  variant="outlined"
                  id="descripcion"
                />
              </Grid>
              <Grid item md={6} xs={12} sm={6} lg={6} xl={6}>
                <TextField
                  className={classes.formControl}
                  value={form.values.orden}
                  onChange={form.addValue}
                  error={form.errors.orden && form.touched.orden}
                  helperText={
                    form.errors.orden && form.touched.orden
                      ? 'El campo no puede estar vacio'
                      : ''
                  }
                  // fullWidth
                  autoFocus
                  label="Orden"
                  color="primary"
                  name="orden"
                  variant="outlined"
                  id="orden"
                  type="number"
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
                  SECCIÓN
                </Button>
              </Grid>
            </Grid>
          </form>{' '}
        </>
      ) : (
        <h5>{}</h5>
      )}

      <Typography variant="h5" style={{ textAlign: 'center' }}>
        Lista de Secciones
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
        label="Buscar por Nombre:"
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
                <TableCell align="right">NOMBRE</TableCell>
                <TableCell align="right">DESCRIPCIÓN</TableCell>
                <TableCell align="right">ORDEN</TableCell>
                <TableCell align="right">ESTADO</TableCell>
                <TableCell align="right">GRUPO</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>{dataSec.id || ''}</TableCell>
                <TableCell>{dataSec.nombre || ''}</TableCell>
                <TableCell>{dataSec.descripcion || ''}</TableCell>
                <TableCell>{dataSec.orden || ''}</TableCell>
                <TableCell>{dataSec.estado || ''}</TableCell>
                <TableCell>{dataSec.idgrupo || ''}</TableCell>
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
              <TableCell className={classes.head}>NOMBRE</TableCell>
              <TableCell className={classes.head}>DESCRIPCIÓN</TableCell>
              <TableCell className={classes.head}>ORDEN</TableCell>
              <TableCell className={classes.head}>ESTADO</TableCell>
              <TableCell className={classes.head}>GRUPO</TableCell>
              <TableCell className={classes.fixColumn}>ACCIÓN</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {secciones.length > 0 ? (
              secciones
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
                    row.nombre
                      .toString()
                      .toLowerCase()
                      .includes(searchNombre.toString().toLowerCase()),
                )
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((seccion) => {
                  const { id, nombre, descripcion, orden, estado, idGrupo } =
                    seccion;
                  return (
                    <TableRow
                      key={id}
                      sx={{ '&:last-child td, &:last-child th': { border: 1 } }}
                      onClick={(event) => handleSelect(event, seccion)}
                      classes={{
                        selected: selected.c,
                      }}
                      selected={selected.selectedRowId === seccion.id}
                    >
                      <TableCell align="center">{id}</TableCell>
                      <TableCell align="center">{nombre}</TableCell>
                      <TableCell align="center">{descripcion}</TableCell>
                      <TableCell align="center">{orden}</TableCell>
                      <TableCell align="center">{estado}</TableCell>
                      <TableCell align="center">{idGrupo}</TableCell>

                      <TableCell
                        align="center"
                        style={{ width: 200 }}
                        className={classes.fixColumn}
                      >
                        <Tooltip placement="bottom" title="Editar registro">
                          <IconButton
                            className={classes.paddingButton}
                            onClick={() => editItem(seccion)}
                          >
                            <Edit className={classes.success} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip placement="bottom" title="Eliminar registro">
                          <IconButton
                            className={classes.paddingButton}
                            onClick={() => handleClickOpenD(seccion)}
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
        count={secciones.length}
        rowsPerPage={rowsPerPage}
        style={{ color: '#747373' }}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Fragment>
  );
};

export default Secciones;
