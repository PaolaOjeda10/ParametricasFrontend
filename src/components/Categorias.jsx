import React, { Fragment, useEffect, useState } from 'react';
import SaveIcon from '@material-ui/icons/Save';
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
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
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Edit, Delete } from '@material-ui/icons';
import { useForm } from '../hooks';
import { Api } from '../service/api';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import SearchIcon from '@material-ui/icons/Search';
import { useDispatch } from 'react-redux';
import { Breadcrumbs } from '@material-ui/core';
import { MessageSuccess, MessageWarning } from '../redux/reducer';
import { DrawContext } from '../Context/drawer/DrawContext';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '80%',
      color: '',
    },
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: '100%',
  },
  container: {
    maxHeight: 440,
  },
  margin: {
    margin: theme.spacing(1),
  },

  link: {
    marginTop: 20,
  },
  fixColumn: {
    position: 'sticky',
    right: 0,
    backgroundColor: '#a39e9e',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  head: {
    textAlign: 'center',
    fontWeight: 'bold',
    // backgroundColor: '#bbbaba',
  },
}));
const Categorias = () => {
  const { draw } = React.useContext(DrawContext);
  const classes = useStyles();
  const dispatch = useDispatch();
  const form = useForm({
    id: null,
    nombre: null,
    estado: null,
    tipoCatalogo: null,
    orden: null,
  });
  const [codigo, setCodigo] = useState();
  const [action, setAction] = useState('add');
  const [idc, setId] = useState(null);
  const handleCancel = () => {
    form.reset();
    setAction('add');
  };
  const createOrUpdate = async (event) => {
    event.preventDefault();
    try {
      if (Object.values(form.errors).includes(true)) {
        form.setTouched();
      } else {
        const data = {
          id: form.values.id,
          nombre: form.values.nombre,
          codigo: codigo,
          estado: form.values.estado,
          tipoCatalogo: form.values.tipoCatalogo,
          orden: form.values.orden,
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
          });
          valAct.id = idc;
          const formulario = {
            tabla: 'categorias',
            matricula: '',
            idRegistro: data.id,
            cambio: valAct,
            cambios: changes,
          };
          const body = {
            id: idc,
            categoria: data,
            formulario: formulario,
          };
          await Api.updateCatalogo(body)
            .then((resp) => {
              if (resp && resp.finalizado) {
                dispatch(MessageSuccess(resp.mensaje));
                return getCatalogo();
              }
              dispatch(MessageWarning(resp.mensaje));
            })
            .catch((err) => {
              console.log(err);
            });
        }
        if (action === 'add') {
          const formulario = {
            tabla: 'categorias',
            matricula: '',
            idRegistro: data.id,
            cambio: data,
            cambios: {},
          };
          const body = {
            catalogo: data,
            formulario: formulario,
          };
          await Api.addCatalogo(body)
            .then((resp) => {
              if (resp.finalizado && resp) {
                getCatalogo();
                return dispatch(MessageSuccess(resp.mensaje));
              }
              dispatch(MessageWarning(resp.message));
            })
            .catch((err) => {
              console.log(err);
            });
        }
        setAction('add');
        setCodigo('');
        form.reset();
      }
    } catch (error) {
      console.log(error);
    }
  };
  // PopUpconfirmDelete
  const [open, setOpen] = React.useState(false);
  const [dataCatalogo, setDataCatalogo] = React.useState({});

  const handleClickOpen = (data) => {
    setOpen(true);
    setDataCatalogo({ ...data });
  };

  const handleClose = () => {
    setOpen(false);
  };
  const deleteItem = async () => {
    const val = {
      estado: {
        valorAnterior: dataCatalogo.estado,
        valorActual: 'INACTIVO',
      },
    };
    const cambio = {
      id: dataCatalogo.id,
      estado: 'INACTIVO',
    };
    const data = {
      tabla: 'categorias',
      idRegistro: dataCatalogo.id,
      cambio: val,
      cambios: cambio,
    };

    const req = { id: dataCatalogo.id, formulario: data };
    await Api.eliminarCatalogo(req)
      .then((resp) => {
        dispatch(MessageSuccess(resp.mensaje));
        getCatalogo();
        setOpen(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const [catal, setCatal] = useState([]);
  const getCatalogo = async () => {
    await Api.getCatalogo()
      .then((data) => {
        if (data && data.finalizado) {
          return setCatal(data.datos);
        }
        dispatch(MessageWarning(data.mensaje));
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const [anterior, setAnterior] = useState({
    id: null,
    nombre: null,
    estado: null,
    codigo: null,
    tipoCatalogo: null,
    orden: null,
  });
  const editItem = (rows) => {
    const data = {
      id: rows.id,
      nombre: rows.nombre,
      estado: rows.estado,
      tipoCatalogo: rows.tipoCatalogo,
      orden: rows.orden,
    };
    setAnterior({
      // ...anterior,
      id: rows.id,
      nombre: rows.nombre,
      estado: rows.estado,
      tipoCatalogo: rows.tipoCatalogo,
      orden: rows.orden,
      codigo: rows.codigo,
    });
    setId(rows.id);
    setCodigo(rows.codigo);
    form.reset();
    form.setValues(data);
    setAction('edit');
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  useEffect(() => {
    getCatalogo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [searchNombre, setSearchNombre] = React.useState('');
  const [searchId, setSearchId] = React.useState('');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  return (
    <>
      <div
        style={{
          height: '974px',
          marginRight: '200px',
          marginLeft: draw?.marginLeft || 200,
        }}
      >
        <Fragment>
          <Breadcrumbs aria-label="breadcrumb" className={classes.link}>
            <Typography>Paramétricas</Typography>
            <Typography>Categorias</Typography>
          </Breadcrumbs>

          <Typography variant="h4" style={{ textAlign: 'center' }}>
            Categorías
          </Typography>
          <form onSubmit={createOrUpdate}>
            <Box>
              <Grid container spacing={1}>
                <Grid item md={6} xs={12} sm={6} lg={6} xl={6}>
                  <TextField
                    className={classes.formControl}
                    // className={classes.root}
                    label="Id"
                    fullWidth
                    variant="outlined"
                    type="number"
                    name="id"
                    error={form.errors.id && form.touched.id}
                    value={form.values.id}
                    onChange={form.addValue}
                    helperText={
                      form.errors.id && form.touched.id
                        ? 'El campo no puede estar vacio'
                        : ''
                    }
                  />
                </Grid>
                <Grid item md={6} xs={12} smyyy={6} lg={6} xl={6}>
                  <TextField
                    className={classes.formControl}
                    id="codigo"
                    label="Código"
                    fullWidth
                    variant="outlined"
                    name="codigo"
                    value={codigo || ''}
                    onChange={(event) => setCodigo(event.target.value)}
                  />
                </Grid>
                <Grid item md={6} xs={12} sm={6} lg={6} xl={6}>
                  <TextField
                    className={classes.formControl}
                    id="nombre"
                    label="Nombre"
                    fullWidth
                    variant="outlined"
                    name="nombre"
                    error={form.errors.nombre && form.touched.nombre}
                    value={form.values.nombre}
                    onChange={form.addValue}
                    helperText={
                      form.errors.nombre && form.touched.nombre
                        ? 'El campo no puede estar vacio'
                        : ''
                    }
                  />
                </Grid>
                <Grid item md={6} xs={12} sm={6} lg={6} xl={6}>
                  <FormControl
                    variant="outlined"
                    className={classes.formControl}
                    error={form.errors.estado && form.touched.estado}
                  >
                    <InputLabel
                      id="demo-simple-select-outlined-label"
                      style={{ marginTop: 'auto' }}
                    >
                      Estado
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-outlined-label"
                      id="demo-simple-select-outlined"
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
              </Grid>
              <Grid container spacing={1} alignItems="center">
                <Grid item md={6} xs={12}>
                  <TextField
                    error={form.errors.orden && form.touched.orden}
                    name="orden"
                    value={form.values.orden}
                    onChange={form.addValue}
                    helperText={
                      form.errors.orden && form.touched.orden
                        ? 'El campo no puede estar vacio'
                        : ''
                    }
                    className={classes.formControl}
                    id="outlined-basic"
                    type="number"
                    fullWidth
                    label="Orden"
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={6} xs={12} sm={6} lg={6} xl={6}>
                  <FormControl
                    variant="outlined"
                    className={classes.formControl}
                    error={
                      form.errors.tipoCatalogo && form.touched.tipoCatalogo
                    }
                  >
                    <InputLabel id="demo-simple-select-outlined-label">
                      Tipo Catálogo
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-outlined-label"
                      id="demo-simple-select-outlined"
                      name="tipoCatalogo"
                      value={form.values.tipoCatalogo}
                      onChange={form.addValue}
                      variant="outlined"
                      fullWidth
                      label="Tipo Catalogo"
                    >
                      <MenuItem value={'TRAMITE'}>TRÁMITE</MenuItem>
                      <MenuItem value={'PUBLICACION'}>PUBLICACIÓN</MenuItem>
                    </Select>
                    <FormHelperText>
                      {form.errors.tipoCatalogo && form.touched.tipoCatalogo
                        ? 'El campo no puede estar vacio'
                        : ''}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} lg={6} xl={6}>
                  <Button
                    className={classes.margin}
                    onClick={handleCancel}
                    variant="contained"
                    color="secondary"
                    size="large"
                    style={{
                      marginTop: '20px',
                      width: '180px',
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    className={classes.margin}
                    variant="contained"
                    type="submit"
                    color="primary"
                    size="large"
                    style={{
                      marginLeft: '10px',
                      marginTop: '20px',
                      width: '42%',
                    }}
                    startIcon={<SaveIcon />}
                  >
                    {action === 'add' ? 'Agregar ' : 'Actualizar '}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </form>
          <Typography variant="h5" style={{ textAlign: 'center' }}>
            Lista de Categorías
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
            open={open}
            onClose={handleClose}
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
                    <TableCell align="right">CÓDIGO</TableCell>
                    <TableCell align="right">ESTADO</TableCell>
                    <TableCell align="right">ORDEN</TableCell>
                    <TableCell align="right">TIPO CATÁLOGO</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{dataCatalogo.id || ''}</TableCell>
                    <TableCell>{dataCatalogo.nombre || ''}</TableCell>
                    <TableCell>{dataCatalogo.codigo || ''}</TableCell>
                    <TableCell>{dataCatalogo.estado || ''}</TableCell>
                    <TableCell>{dataCatalogo.orden || ''}</TableCell>
                    <TableCell>{dataCatalogo.tipoCatalogo || ''}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Cancelar
              </Button>
              <Button onClick={deleteItem} color="primary" autoFocus>
                Confirmar
              </Button>
            </DialogActions>
          </Dialog>
          <TableContainer component={Paper} className={classes.container}>
            <Table
              sx={{ minWidth: 650, borderBottom: 'black' }}
              aria-label="simple table"
              stickyHeader
            >
              <TableHead>
                <TableRow>
                  <TableCell className={classes.head}>ID</TableCell>
                  <TableCell className={classes.head}>NOMBRE</TableCell>
                  <TableCell className={classes.head}>CÓDIGO</TableCell>
                  <TableCell className={classes.head}>ESTADO</TableCell>
                  <TableCell className={classes.head}>TIPO CATÁLOGO</TableCell>
                  <TableCell className={classes.head}>ORDEN</TableCell>
                  <TableCell className={classes.fixColumn}>ACCIÓN</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {catal.length > 0 ? (
                  catal
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
                    .map((catalogo) => {
                      const {
                        id,
                        nombre,
                        estado,
                        tipoCatalogo,
                        orden,
                        codigo,
                      } = catalogo;
                      return (
                        <TableRow
                          key={id}
                          sx={{
                            '&:last-child td, &:last-child th': { border: 1 },
                          }}
                        >
                          <TableCell align="center">{id}</TableCell>
                          <TableCell align="center">{nombre}</TableCell>
                          <TableCell align="center">{codigo}</TableCell>
                          <TableCell align="center">{estado}</TableCell>
                          <TableCell align="center">{tipoCatalogo}</TableCell>
                          <TableCell align="center">{orden}</TableCell>
                          <TableCell
                            align="center"
                            style={{ width: 200 }}
                            className={classes.fixColumn}
                          >
                            <Tooltip placement="bottom" title="Editar registro">
                              <IconButton
                                className={classes.paddingButton}
                                onClick={() => editItem(catalogo)}
                              >
                                <Edit className={classes.success} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip
                              placement="bottom"
                              title="Eliminar registro"
                            >
                              <IconButton
                                onClick={() => handleClickOpen(catalogo)}
                                className={classes.paddingButton}
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
            className={classes.margin}
            rowsPerPageOptions={[5, 10, 25, 100]}
            component="div"
            count={catal.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Fragment>
      </div>
    </>
  );
};

export default Categorias;
