import React, { Fragment, useState, useEffect } from 'react';
import '../css/style.css';
import Checkbox from '@material-ui/core/Checkbox';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
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
import { Delete, Edit } from '@material-ui/icons';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Api } from '../service/api';
import { useForm } from '../hooks/useForm';
import SearchIcon from '@material-ui/icons/Search';
import '../css/table.css';
import { useDispatch } from 'react-redux';
import { MessageSuccess, MessageWarning } from '../redux/reducer';

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
    '& .MuiInputBase-input':{
      color:'#747373'
    },
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  root: {
    justifyContent: 'center',
    flexWrap: 'wrap',
    listStyle: 'none',
    padding: theme.spacing(0.5),
  },
  chip: {
    margin: theme.spacing(0.5),
  },
  formLabel: {
    marginTop: 'auto',
  },
  container: {
    maxHeight: 440,
    width: '100%',
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
  st: {
    position: 'sticky',
    right: 0,
    background: 'white',
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
  useEffect(() => {
    const t = JSON.parse(window.localStorage.getItem('tramite'));
    if (t) {
      setTram(t);
    }
  }, []);

  return (
    <>
      <h5>Tramite: {tram ? tram.id : 'Tramite no seleccionado'}</h5>
    </>
  );
};
const Grupos = () => {
  // ADD
  const classes = useStyles();
  const dispatch = useDispatch();
  const form = useForm({
    // id: null,
    nombre: null,
    descripcion: null,
    orden: null,
    flujo: null,
    estado: null,
  });
  // obtener catalogotramite
  const [catal, setCatal] = useState([]);
  const [grupo, setGrupos] = useState([]);
  const [codigo, setCodigo] = useState();
  const getGrupos = async () => {
    await Api.getGrupo()
      .then((data) => {
        if (data.finalizado && data) {
          return setGrupos(data.datos);
          // return dispatch(MessageSuccess(data.mensaje));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getCatalogoTramite = async () => {
    await Api.getCatalogoTramite()
      .then((data) => {
        if (data && data.finalizado) {
          // dispatch(MessageSuccess(data.mensaje));
          return setCatal(data.datos);
        }
        // dispatch(MessageWarning(data.mensaje));
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const listarGrupo = async () => {
    const d = JSON.parse(window.localStorage.getItem('tramite'));
    // console.log(d);
    await Api.listarGrupo({ idCatalogoTramite: d.id })
      .then((resp) => {
        if (resp && resp.finalizado) {
          return setGrupos(resp.datos);
        }
      })
      .catch((err) => console.log(err));
  };
  const [documentoSoporte, setdocumentoSoporte] = useState(false);
  const [aprobacionDocumentos, setaprobracionDocumentos] = useState(false);
  const [pago, setPago] = useState(false);

  const hchangedocumentoSoporte = (event) => {
    setdocumentoSoporte(!documentoSoporte);
  };
  const hchangeaprobracionDocumentos = (event) => {
    setaprobracionDocumentos(!aprobacionDocumentos);
  };
  const hchangepago = (event) => {
    setPago(!pago);
  };
  const [action, setAction] = useState('add');
  const [idc, setId] = useState(null);
  const handleCancel = () => {
    form.reset();
    resetVariables();
    setAction('add');
  };
  const [catalogoT, setCatalogoT] = useState();
  const submitGrupo = async (event) => {
    event.preventDefault();
    const d = window.localStorage.getItem('tramite');
    try {
      if (Object.values(form.errors).includes(true)) {
        form.setTouched();
      } else {
        const data = {
          nombre: form.values.nombre,
          codigo: codigo || null,
          descripcion: form.values.descripcion,
          orden: form.values.orden,
          flujo: form.values.flujo,
          estado: form.values.estado,
          documentoSoporte: documentoSoporte,
          aprobacionDocumentos: aprobacionDocumentos,
          pago: pago,
          idCatalogoTramite: catalogoT.id,
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
          valAct.id = idc;
          const formulario = {
            tabla: 'grupos',
            matricula: '',
            idRegistro: idc,
            cambio: valAct,
            cambios: changes,
          };
          const body = {
            id: idc,
            grupo: data,
            formulario: formulario,
          };
          //console.log(body);
          await Api.updateGrupo(body)
            .then((resp) => {
              if (resp && resp.finalizado) {
                return dispatch(MessageSuccess(resp.mensaje));
                // getGrupos();
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
        if (action === 'add') {
          const formulario = {
            tabla: 'grupos',
            matricula: '',
            idRegistro: '',
            cambio: data,
            cambios: {},
          };
          const body = {
            grupo: data,
            formulario: formulario,
          };
          await Api.addGrupo(body)
            .then((resp) => {
              if (resp && resp.finalizado) {
                return dispatch(MessageSuccess(resp.mensaje));
                // return getGrupos();
              }
              dispatch(MessageWarning(resp.mensaje));
            })
            .catch((err) => console.log(err));
          // console.log(data);
        }
        if (d) {
          listarGrupo();
        } else {
          getGrupos();
        }
        setAction('add');
        setCodigo(null);
        resetVariables();
        form.reset();
      }
    } catch (error) {}
  };
  const resetVariables = () => {
    form.reset();
    // setValue('');
    setdocumentoSoporte(false);
    setaprobracionDocumentos(false);
    setPago(false);
    setAction('add');
    const d = window.localStorage.getItem('tramite');
    if (!d) {
      setCatalogoT('');
    } else {
      setCatalogoT(JSON.parse(d));
    }
  };
  // delete
  // PopUpconfirmDelete
  const [openD, setOpenD] = React.useState(false);
  const [dataGrupos, setdataGrupos] = React.useState({});
  const handleClickOpenD = (data) => {
    setOpenD(true);
    setdataGrupos({ ...data });
  };
  const handleCloseD = () => {
    setOpenD(false);
  };
  const deleteItem = async () => {
    const d = JSON.parse(window.localStorage.getItem('tramite'));
    const val = {
      estado: {
        valorAnterior: dataGrupos.estado,
        valorActual: 'INACTIVO',
      },
    };
    const cambio = {
      id: dataGrupos.id,
      estado: 'INACTIVO',
    };
    const data = {
      tabla: 'grupos',
      idRegistro: dataGrupos,
      cambio: val,
      cambios: cambio,
    };
    const req = { id: dataGrupos.id, formulario: data };
    await Api.eliminarGrupo(req)
      .then((resp) => {
        dispatch(MessageSuccess(resp.mensaje));
        setOpenD(false);
      })
      .catch((err) => {
        console.log(err);
      });
    if (d) {
      listarGrupo();
    } else {
      getGrupos();
    }
  };
  const [anterior, setAnterior] = useState({
    nombre: null,
    codigo: null,
    descripcion: null,
    orden: null,
    flujo: null,
    estado: null,
    documentoSoporte: null,
    aprobacionDocumentos: null,
    pago: null,
  });
  const editItem = (rows) => {
    const data = {
      // id:rows.id,
      nombre: rows.nombre,
      descripcion: rows.descripcion,
      orden: rows.orden,
      tipoCatalogo: rows.tipoCatalogo,
      flujo: rows.flujo,
      estado: rows.estado,
      catalogoTramite: rows.catalogoTramite,
    };
    setAnterior({
      // ...anterior,
      nombre: rows.nombre,
      codigo: rows.codigo,
      descripcion: rows.descripcion,
      orden: rows.orden,
      flujo: rows.flujo,
      estado: rows.estado,
      documentoSoporte: rows.documentoSoporte,
      aprobacionDocumentos: rows.aprobacionDocumentos,
      pago: rows.pago,
    });
    // console.log(rows);
    setdocumentoSoporte(rows.documentoSoporte || false);
    setaprobracionDocumentos(rows.aprobacionDocumentos || false);
    setPago(rows.pago || false);
    setCodigo(rows.codigo || '');
    const obj = catal.filter((f) => f.id === rows.idCatalogoTramite);
    setCatalogoT(obj[0]);
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
    window.localStorage.setItem('grupo', JSON.stringify(rowData));
    setSelected({ currentRow: rowData });
    if (rowData.id === selected.selectedRowId) {
      setSelected({ selected: false });
      setSelected({ selectedRowId: null });
      window.localStorage.removeItem('grupo');
    } else {
      setSelected({ selected: true });
      setSelected({
        selectedRowId: rowData.id,
      });
    }
    // console.log(selected);
  };
  useEffect(() => {
    const d = window.localStorage.getItem('tramite');
    setCatalogoT(JSON.parse(d));
    const t = window.localStorage.getItem('grupo');
    if (t) {
      setSelected({ currentRow: JSON.parse(t) });
      setSelected({ selected: true });
      setSelected({ selectedRowId: JSON.parse(t).id });
    }
    getCatalogoTramite();
    if (d) {
      listarGrupo();
    } else {
      getGrupos();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [searchNombre, setSearchNombre] = React.useState('');
  const [searchId, setSearchId] = React.useState('');
  const [searchIdTramite, setSearchIdTramite] = React.useState('');

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  return (
    <Fragment>
      <Navegacion />
      {catalogoT ? (
        <>
          <Typography variant="h5" style={{ textAlign: 'center' }}>
            {'Tramite: ' + catalogoT.nombre}
          </Typography>
          <form
            onSubmit={submitGrupo}
            style={{ flexGrow: 1, width: '100%' }}
            noValidate
            autoComplete="off"
          >
            <Box>
              <Grid container spacing={1} alignItems="center">
                <Grid item sm={4} xs={12}>
                  <TextField
                    className={classes.formControl}
                    id="outlined-basic"
                    label="Nombre"
                    fullWidth
                    variant="outlined"
                    name="nombre"
                    error={form.errors.nombre && form.touched.nombre}
                    value={form.values.nombre || ''}
                    onChange={form.addValue}
                    helperText={
                      form.errors.nombre && form.touched.nombre
                        ? 'El campo no puede estar vacio'
                        : ''
                    }
                  />
                </Grid>
                <Grid item sm={4} xs={12}>
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
                <Grid item sm={4} xs={12}>
                  <TextField
                    className={classes.formControl}
                    id="outlined-basic"
                    label="Descripción"
                    fullWidth
                    variant="outlined"
                    name="descripcion"
                    error={form.errors.descripcion && form.touched.descripcion}
                    value={form.values.descripcion || ''}
                    onChange={form.addValue}
                    helperText={
                      form.errors.descripcion && form.touched.descripcion
                        ? 'El campo no puede estar vacio'
                        : ''
                    }
                  />
                </Grid>
              </Grid>
              <Grid container spacing={1} alignItems="center">
                <Grid item sm={4} xs={12}>
                  <TextField
                    className={classes.formControl}
                    id="outlined-basic"
                    label="Orden"
                    type="number"
                    fullWidth
                    variant="outlined"
                    name="orden"
                    error={form.errors.orden && form.touched.orden}
                    value={form.values.orden || ''}
                    onChange={form.addValue}
                    helperText={
                      form.errors.orden && form.touched.orden ? 'Requerido' : ''
                    }
                  />
                </Grid>
                <Grid item sm={4} xs={12}>
                  <TextField
                    className={classes.formControl}
                    id="outlined-basic"
                    label="Flujo"
                    fullWidth
                    variant="outlined"
                    name="flujo"
                    error={form.errors.flujo && form.touched.flujo}
                    value={form.values.flujo || ''}
                    onChange={form.addValue}
                    helperText={
                      form.errors.flujo && form.touched.flujo
                        ? 'El campo no puede estar vacio'
                        : ''
                    }
                  />
                </Grid>
                <Grid item sm={4} xs={12}>
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
                <Grid item sm={4} xs={12}>
                  <FormControlLabel
                    className={classes.formControl}
                    labelPlacement="start"
                    style={{ flexDirection: 'initial' }}
                    control={
                      <Checkbox
                        checked={documentoSoporte}
                        onChange={hchangedocumentoSoporte}
                        name="requiereDocumentoSoporte"
                        color="primary"
                      />
                    }
                    label="Requiere Documento Soporte"
                  />
                </Grid>
                <Grid item sm={4} xs={12}>
                  <FormControlLabel
                    className={classes.formControl}
                    labelPlacement="start"
                    style={{ flexDirection: 'initial' }}
                    control={
                      <Checkbox
                        checked={aprobacionDocumentos}
                        onChange={hchangeaprobracionDocumentos}
                        name="requiereAprobacionDocumentos"
                        color="primary"
                      />
                    }
                    label="Requiere Aprobacion Documentos"
                  />
                </Grid>
                <Grid item sm={4} xs={12}>
                  <FormControlLabel
                    className={classes.formControl}
                    labelPlacement="start"
                    style={{ flexDirection: 'initial' }}
                    control={
                      <Checkbox
                        checked={pago}
                        onChange={hchangepago}
                        name="requierePago"
                        color="primary"
                      />
                    }
                    label="Requiere Pago"
                  />
                </Grid>
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
                  Grupo
                </Button>
              </Grid>
            </Box>
          </form>
        </>
      ) : (
        <h5>{}</h5>
      )}
      <Typography variant="h5" style={{ textAlign: 'center' }}>
        Lista de Grupos
      </Typography>
      <TextField
        onChange={(e) => setSearchId(e.target.value)}
        className={classes.margin}
        id="input-with-icon-textfield"
        style={{ width: '100px' }}
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
        style={{ width: '150px' }}
        label="Buscar por Nombre:"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
      <TextField
        onChange={(e) => setSearchIdTramite(e.target.value)}
        className={classes.margin}
        id="input-with-icon-textfield"
        style={{ width: '150px' }}
        label="Buscar por Tramite:"
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
                <TableCell align="right">CÓDIGO</TableCell>
                <TableCell align="right">DESCRIPCIÓN</TableCell>
                <TableCell align="right">ORDEN</TableCell>
                <TableCell align="right">FLUJO</TableCell>
                <TableCell align="right">ESTADO</TableCell>
                <TableCell align="right">DOC. SOPORTE</TableCell>
                <TableCell align="right">APROBACIÓN DOCUMENTOS</TableCell>
                <TableCell align="right">PAGO</TableCell>
                <TableCell align="right">CATÁLOGO TRÁMITE</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>{dataGrupos.id || ''}</TableCell>
                <TableCell>{dataGrupos.nombre || ''}</TableCell>
                <TableCell>{dataGrupos.codigo || ''}</TableCell>
                <TableCell>{dataGrupos.descripcion || ''}</TableCell>
                <TableCell>{dataGrupos.orden || ''}</TableCell>
                <TableCell>{dataGrupos.flujo || ''}</TableCell>
                <TableCell>{dataGrupos.estado || ''}</TableCell>
                <TableCell>{dataGrupos.documentoSoporte || ''}</TableCell>
                <TableCell>{dataGrupos.aprobacionDocumentos || ''}</TableCell>
                <TableCell>{dataGrupos.pago || ''}</TableCell>
                <TableCell>{dataGrupos.idCatalogoTramite || ''}</TableCell>
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
              <TableCell className={classes.head}>CÓDIGO</TableCell>
              <TableCell className={classes.head}>DESCRIPCIÓN</TableCell>
              <TableCell className={classes.head}>ORDEN</TableCell>
              <TableCell className={classes.head}>FLUJO</TableCell>
              <TableCell className={classes.head}>ESTADO</TableCell>
              <TableCell className={classes.head}>DOC. SOPORTE</TableCell>
              <TableCell className={classes.head}>APROB. DOC.</TableCell>
              <TableCell className={classes.head}>PAGO</TableCell>
              <TableCell className={classes.head}>CATÁLOGO TRÁMITE</TableCell>
              <TableCell className={classes.fixColumn}>ACCIÓN</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {grupo.length > 0 ? (
              grupo
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
                .filter(
                  (row) =>
                    !searchIdTramite ||
                    row.idCatalogoTramite
                      .toString()
                      .toLowerCase()
                      .includes(searchIdTramite.toString().toLowerCase()),
                )
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((grupo) => {
                  const {
                    id,
                    nombre,
                    codigo,
                    descripcion,
                    orden,
                    flujo,
                    estado,
                    documentoSoporte,
                    aprobacionDocumentos,
                    pago,
                    idCatalogoTramite,
                  } = grupo;
                  return (
                    <TableRow
                      key={id}
                      sx={{ '&:last-child td, &:last-child th': { border: 1 } }}
                      onClick={(event) => handleSelect(event, grupo)}
                      classes={{
                        selected: selected.c,
                      }}
                      selected={selected.selectedRowId === grupo.id}
                    >
                      <TableCell align="center">{id}</TableCell>
                      <TableCell align="center">{nombre}</TableCell>
                      <TableCell align="center">{codigo}</TableCell>
                      <TableCell align="center">{descripcion}</TableCell>
                      <TableCell align="center">{orden}</TableCell>
                      <TableCell align="center">{flujo}</TableCell>
                      <TableCell align="center">{estado}</TableCell>
                      <TableCell align="center">
                        {documentoSoporte ? 'SI' : 'NO'}
                      </TableCell>
                      <TableCell align="center">
                        {aprobacionDocumentos ? 'SI' : 'NO'}
                      </TableCell>
                      <TableCell align="center">{pago ? 'SI' : 'NO'}</TableCell>
                      <TableCell align="center">{idCatalogoTramite}</TableCell>
                      <TableCell
                        align="center"
                        style={{ width: 300 }}
                        className={classes.fixColumn}
                      >
                        <Tooltip placement="bottom" title="Editar registro">
                          <IconButton
                            className={classes.paddingButton}
                            onClick={() => editItem(grupo)}
                          >
                            <Edit className={classes.success} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip placement="bottom" title="Eliminar registro">
                          <IconButton
                            className={classes.paddingButton}
                            onClick={() => handleClickOpenD(grupo)}
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
        count={grupo.length}
        style={{color: '#747373'}}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Fragment>
  );
};

export default Grupos;
