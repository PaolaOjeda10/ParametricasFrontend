import React, { Fragment, useState, useEffect } from 'react';
import '../css/style.css';
import Checkbox from '@material-ui/core/Checkbox';
import {
  Box,
  Button,
  Chip,
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
import '../css/table.css';
import { makeStyles } from '@material-ui/core/styles';
import { Delete, Edit, ViewHeadline } from '@material-ui/icons';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Api } from '../service/api';
import { useForm } from '../hooks/useForm';
import DialogCampos from './DialogCampos';
import SearchIcon from '@material-ui/icons/Search';
import { useDispatch } from 'react-redux';
import { MessageSuccess, MessageWarning } from '../redux/reducer';
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: '100%',
    marginTop:4,
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    listStyle: 'none',
    padding: theme.spacing(0.5),
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
    boxShadow: 'none',
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
  },
  fixColumn: {
    position: 'sticky',
    right: 0,
    minWidth:'182px',
    backgroundColor:'#a39e9e',
    textAlign:'center',
    fontWeight: 'bold',
  },
  head:{
    textAlign:'center',
    fontWeight: 'bold',
    // backgroundColor: '#bbbaba',
  }
}));
const Navegacion = () => {
  const [tram, setTram] = useState(null);
  const [grup, setGrup] = useState(null);
  const [camps, setCamps] = useState(null);
  useEffect(() => {
    const t = JSON.parse(window.localStorage.getItem('tramite'));
    const g = JSON.parse(window.localStorage.getItem('grupo'));
    const s = JSON.parse(window.localStorage.getItem('seccion'));
    if (t) {
      setTram(t);
    }
    if (g) {
      setGrup(g);
    }
    if (s) {
      setCamps(s);
    }
  }, []);

  return (
    <>
      <h5>
        Tramite: {tram ? tram.id : 'Tramite no seleccionado'}{' '}
        <NavigateNextIcon fontSize="small" style={{ marginBottom: -5 }} />{' '}
        Grupo: {grup ? grup.nombre : 'Grupo no seleccionado'}{' '}
        <NavigateNextIcon fontSize="small" style={{ marginBottom: -5 }} />{' '}
        Seccion: {camps ? camps.nombre : 'Seccion no seleccionado'}
      </h5>
    </>
  );
};
const Camposs = () => {
  // ADD
  const classes = useStyles();
  const dispatch = useDispatch();
  const form = useForm({
    // id:null,
    campo: null,
    tipo: null,
    label: null,
    orden: null,
    size: null,
    tabla: null,
    cantidadMax: null,
    estado: null,
  });
  // obtener
  const [formnull, setFormnull] = useState({
    filtro: null,
    parametrica: null,
    kardex: null,
    tooltip: null,
    iop: null,
    valorDefecto: null,
    parametricaText: null,
    grupoParametrica: null,
    campoPadre: null,
    campoHijo: null,
    maxMinFecha: null,
    codigoTipoDocumento: null,
    criterioOpcional: null,
    codigoTipoPublicacion: null,
  });
  const [editorjson, setEditorjson] = useState({});

  const [catal, setCatal] = useState([]);

  // Secciones
  const getSeccion = async () => {
    try {
      await Api.getSeccion()
        .then((data) => {
          if (data) setCatal(data.datos);
        })
        .catch((err) => console.log(err));
    } catch (error) {
      console.log(error);
    }
  };
  const [campos, setCampos] = useState([]);
  const getCampos = async () => {
    try {
      await Api.getCampo()
        .then((data) => {
          if (data && data.finalizado) {
            return setCampos(data.datos);
          }
          dispatch(MessageWarning(data.mensaje));
        })
        .catch((err) => console.log(err));
    } catch (error) {
      console.log(error);
    }
  };
  const listarCampos = async () => {
    const d = JSON.parse(window.localStorage.getItem('seccion'));
    await Api.listarCampo({ idSeccion: d.id })
      .then((resp) => {
        if (resp && resp.finalizado) {
          return setCampos(resp.datos);
        }
      })
      .catch((err) => console.log(err));
  };
  const [state, setState] = React.useState({});
  const handleKeyDown = (event) => {
    if (['Enter', 'Tab', ','].includes(event.key)) {
      event.preventDefault();
      const value = state.value?.trim();

      if (value && isValid(value)) {
        setState({
          items: [...(state.items ?? []), state.value ?? ''],
          value: '',
        });
      }
    }
  };
  const [deshabilitado, setdeshabilitado] = useState(false);
  const hchangedeshabilitado = (event) => {
    setdeshabilitado(!deshabilitado);
  };
  const [documentoSoporte, setdocumentoSoporte] = useState(false);
  const hchangedocumentoSoporte = (event) => {
    setdocumentoSoporte(!documentoSoporte);
  };
  const [observable, setobservable] = useState(true);
  const hchangeobservable = (event) => {
    setobservable(!observable);
  };

  const handleChangeContact = (event) => {
    setState({
      items: state.items,
      value: event.target.value,
      error: null,
    });
  };

  const handleDelete = (item) => {
    setState({
      items: state.items?.filter((i) => i !== item),
    });
  };
  const handlePaste = (event) => {
    event.preventDefault();
    const paste = event.clipboardData?.getData('text');

    const data = paste?.split(/;|,|\n/);

    if (data) {
      const toBeAdded = data.filter((d) => !isInList(d));
      setState({
        items: [...(state.items ?? []), ...toBeAdded],
      });
    }
  };
  const isInList = (dato) => {
    return state.items?.includes(dato);
  };

  const isValid = (dato) => {
    let error = null;

    if (isInList(dato)) {
      error = `${dato} ya ha sido agregado.`;
    }

    if (error) {
      setState({
        items: state.items,
        error,
      });
      return false;
    }
    return true;
  };
  const [action, setAction] = useState('add');
  const [idc, setId] = useState(null);
  const handleCancel = () => {
    form.reset();
    resetVariables();
    setAction('add');
  };
  // eslint-disable-next-line no-unused-vars
  const [catalogoT, setCatalogoT] = useState();
  // eslint-disable-next-line no-unused-vars
  const [grupoS, setGrupoS] = useState();
  const [seccionS, setSeccionS] = useState();
  const arrayVacio = (arr) => !Array.isArray(arr) || arr.length === 0;
  const objetoVacio = (obj) => obj === null || Object.keys(obj).length === 0;
  // const isObject = (object) => object != null && (typeof object === 'object')
  const submitCampo = async (event) => {
    event.preventDefault();
    const d = JSON.parse(window.localStorage.getItem('seccion'));
    try {
      if (Object.values(form.errors).includes(true)) {
        form.setTouched();
      } else {
        const data = {
          campo: form.values.campo,
          tipo: form.values.tipo,
          label: form.values.label,
          tooltip: formnull.tooltip || null,
          orden: form.values.orden,
          iop: formnull.iop || null,
          valorDefecto: formnull.valorDefecto || null,
          validacion: !arrayVacio(state.items) ? state.items : null,
          parametrica: formnull.parametrica || null,
          parametricaText: formnull.parametricaText || null,
          grupoParametrica: formnull.grupoParametrica || null,
          campoPadre: formnull.campoPadre || null,
          campoHijo: formnull.campoHijo || null,
          observable: observable,
          filtro: formnull.filtro || null,
          maxMinFecha: !objetoVacio(maxmin || {}) ? maxmin : null,
          size: form.values.size,
          kardex: !objetoVacio(editorjson || {}) ? editorjson : null,
          tabla: form.values.tabla,
          cantidadMax: form.values.cantidadMax,
          codigoTipoDocumento: formnull.codigoTipoDocumento || null,
          criterioOpcional: formnull.criterioOpcional || null,
          estado: form.values.estado,
          documentoSoporte: documentoSoporte,
          desabilitado: deshabilitado,
          idSeccion: seccionS.id,
          codigoTipoPublicacion: formnull.codigoTipoPublicacion || null,
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
            delete valAct.idSeccion;
          });
          valAct.id = idc;
          const formulario = {
            tabla: 'campos',
            matricula: '',
            idRegistro: data.idc,
            cambio: valAct,
            cambios: changes,
          };
          const body = {
            id: idc,
            campo: data,
            formulario: formulario,
          };
          await Api.updateCampo(body)
            .then((resp) => {
              if (resp && resp.finalizado) {
                return dispatch(MessageSuccess(resp.mensaje));
                // return getCampos();
              }
            })
            .catch((err) => {
              console.log(err);
            });
          resetVariables();
        }
        if (action === 'add') {
          const formulario = {
            tabla: 'campos',
            matricula: '',
            idRegistro: '',
            cambio: data,
            cambios: {},
          };
          const body = {
            campo: data,
            formulario: formulario,
          };
          await Api.addCampo(body)
            .then((resp) => {
              if (resp && resp.finalizado) {
                return dispatch(MessageSuccess(resp.mensaje));
                // return getCampos();
              }
              dispatch(MessageWarning(resp.mensaje));
            })
            .catch((err) => {
              console.log(err);
            });
        }
        if (d) {
          listarCampos();
        } else {
          getCampos();
        }
        setAction('add');
        resetVariables();
        form.reset();
      }
    } catch (error) {
      console.log(error);
    }
  };
  // PopUpconfirmDelete
  const [openD, setOpenD] = React.useState(false);
  const [dataCampos, setdataCampos] = React.useState({});
  const handleClickOpenD = (data) => {
    const nuevo = { ...data };
    nuevo.kardex = JSON.stringify(nuevo.kardex);
    nuevo.maxMinFecha = JSON.stringify(nuevo.maxMinFecha);
    setdataCampos({ ...nuevo });
    setOpenD(true);
  };
  const handleCloseD = () => {
    setOpenD(false);
  };
  const deleteItem = async () => {
    const val = {
      estado: {
        valorAnterior: dataCampos.estado,
        valorActual: 'INACTIVO',
      },
    };
    const cambio = {
      id: dataCampos.id,
      estado: 'INACTIVO',
    };
    const data = {
      tabla: 'campos',
      idRegistro: dataCampos,
      cambio: val,
      cambios: cambio,
    };
    const req = { id: dataCampos.id, formulario: data };
    await Api.eliminarCampo(req)
      .then((resp) => {
        dispatch(MessageSuccess(resp.mensaje));
        getCampos();
        setOpenD(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const [anterior, setAnterior] = useState({
    campo: null,
    tipo: null,
    label: null,
    tooltip: null,
    orden: null,
    iop: null,
    valorDefecto: null,
    validacion: null,
    parametrica: null,
    parametricaText: null,
    grupoParametrica: null,
    campoPadre: null,
    campoHijo: null,
    observable: null,
    filtro: null,
    maxMinFecha: null,
    size: null,
    kardex: null,
    tabla: null,
    cantidadMax: null,
    codigoTipoDocumento: null,
    criterioOpcional: null,
    estado: null,
    documentoSoporte: null,
    desabilitado: null,
    codigoTipoPublicacion: null,
  });
  const editItem = (rows) => {
    const data = {
      // id:rows.id,
      campo: rows.campo,
      tipo: rows.tipo,
      label: rows.label,
      orden: rows.orden,
      validacion: rows.validacion,
      size: rows.size,
      tabla: rows.tabla,
      cantidadMax: rows.cantidadMax,
      estado: rows.estado,
    };
    setAnterior({
      // ...anterior,
      campo: rows.campo,
      tipo: rows.tipo,
      label: rows.label,
      tooltip: rows.tooltip,
      orden: rows.orden,
      iop: rows.iop,
      valorDefecto: rows.valorDefecto,
      validacion: rows.validacion,
      parametrica: rows.parametrica,
      parametricaText: rows.parametricaText,
      grupoParametrica: rows.grupoParametrica,
      campoPadre: rows.campoPadre,
      campoHijo: rows.campoHijo,
      observable: rows.observable,
      filtro: rows.filtro,
      maxMinFecha: rows.maxMinFecha,
      size: rows.size,
      kardex: rows.kardex,
      tabla: rows.tabla,
      cantidadMax: rows.cantidadMax,
      codigoTipoDocumento: rows.codigoTipoDocumento,
      criterioOpcional: rows.criterioOpcional,
      estado: rows.estado,
      documentoSoporte: rows.documentoSoporte,
      desabilitado: rows.desabilitado,
      codigoTipoPublicacion: rows.codigoTipoPublicacion,
    });
    setEditorjson(rows.kardex);
    setMaxmin(rows.maxMinFecha);
    setState({
      items: [...(rows.validacion ?? [])],
    });
    setFormnull({
      filtro: rows.filtro,
      parametrica: rows.parametrica,
      kardex: rows.kardex,
      tooltip: rows.tooltip,
      iop: rows.iop,
      valorDefecto: rows.valorDefecto,
      parametricaText: rows.parametricaText,
      grupoParametrica: rows.grupoParametrica,
      campoPadre: rows.campoPadre,
      campoHijo: rows.campoHijo,
      maxMinFecha: rows.maxMinFecha,
      documentoSoporte: rows.documentoSoporte,
      codigoTipoDocumento: rows.codigoTipoDocumento,
      criterioOpcional: rows.criterioOpcional,
      codigoTipoPublicacion: rows.codigoTipoPublicacion,
    });
    setdocumentoSoporte(rows.documentoSoporte);
    setdeshabilitado(rows.desabilitado);
    setobservable(rows.observable);
    setdocumentoSoporte(rows.documentoSoporte);

    const obj = catal.filter((f) => f.id === rows.idSeccion);
    setValue(obj[0]);
    setSeccionS(obj[0]);
    setId(rows.id);
    form.reset();
    form.setValues(data);
    setAction('edit');
  };
  const resetVariables = () => {
    setFormnull({
      ...formnull,
      filtro: null,
      parametrica: null,
      kardex: null,
      tooltip: null,
      iop: null,
      valorDefecto: null,
      parametricaText: null,
      grupoParametrica: null,
      campoPadre: null,
      campoHijo: null,
      maxMinFecha: null,
      codigoTipoDocumento: null,
      criterioOpcional: null,
      codigoTipoPublicacion: null,
    });
    setEditorjson({});
    setMaxmin({});
    setState({
      items: [],
      value: '',
      error: '',
    });
    setdeshabilitado(false);
    setdocumentoSoporte(false);
    setobservable(true);
    setValue('');
    const d = window.localStorage.getItem('seccion');
    if (!d) {
      setSeccionS('');
    } else {
      setSeccionS(JSON.parse(d));
    }
  };
  // fin edit
  const [open, setOpen] = useState(false);
  const [datos, setDatos] = useState({});
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  // viewDEtail
  const viewDetail = (data) => {
    const nuevo = { ...data };
    nuevo.kardex = JSON.stringify(nuevo.kardex);
    nuevo.maxMinFecha = JSON.stringify(nuevo.maxMinFecha);
    setDatos({ ...nuevo });
    handleOpen();
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
    const t = window.localStorage.getItem('tramite');
    setCatalogoT(JSON.parse(t));
    const g = window.localStorage.getItem('grupo');
    setGrupoS(JSON.parse(g));
    const d = window.localStorage.getItem('seccion');
    setSeccionS(JSON.parse(d));
    getSeccion();
    if (d) {
      listarCampos();
    } else {
      getCampos();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [searchNombre, setSearchNombre] = React.useState('');
  const [searchId, setSearchId] = React.useState('');

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [maxmin, setMaxmin] = useState({});
  const onChangeEditJson = (v) => {
    // console.log(v);
    if (!v.error) {
      if(v.jsObject === undefined){
        setEditorjson({})
      }
      setEditorjson(v.jsObject);
    }
  };
  const onChangeEditJsonMaxmin = (v) => {
    if (!v.error) {
      if(v.jsObject === undefined){
        setMaxmin({})
      }
      setMaxmin(v.jsObject);
    }
  };
  return (
    <Fragment>
      <Navegacion />
      {seccionS ? (
        <>
          <Typography style={{ textAlign: 'center' }}>
            {/* {'Sección: ' + seccionS.nombre || ''} */}
          </Typography>
          <form
            onSubmit={submitCampo}
            style={{ flexGrow: 1, width: '100%' }}
            noValidate
            autoComplete="off"
          >
            <Box>
              <Grid container spacing={1} alignItems="center">
                <Grid item sm={3} xs={12}>
                  <TextField
                    className={classes.formControl}
                    id="outlined-basic"
                    label="Campo"
                    fullWidth
                    variant="outlined"
                    name="campo"
                    error={form.errors.campo && form.touched.campo}
                    value={form.values.campo || ''}
                    onChange={form.addValue}
                    helperText={
                      form.errors.campo && form.touched.campo
                        ? 'El campo no puede estar vacio'
                        : ''
                    }
                  />
                </Grid>
                <Grid item sm={3} xs={12}>
                  <TextField
                    className={classes.formControl}
                    id="outlined-basic"
                    label="Tipo"
                    fullWidth
                    variant="outlined"
                    name="tipo"
                    error={form.errors.tipo && form.touched.tipo}
                    value={form.values.tipo || ''}
                    onChange={form.addValue}
                    helperText={
                      form.errors.tipo && form.touched.tipo
                        ? 'El campo no puede estar vacio'
                        : ''
                    }
                  />
                </Grid>
                <Grid item sm={3} xs={12}>
                  <TextField
                    className={classes.formControl}
                    id="codigoTipoPublicacion"
                    label="Código_Tipo_Publicación"
                    fullWidth
                    variant="outlined"
                    name="codigoTipoPublicacion"
                    onChange={(e) =>
                      setFormnull({
                        ...formnull,
                        codigoTipoPublicacion: e.target.value,
                      })
                    }
                    value={formnull.codigoTipoPublicacion || ''}
                  />
                </Grid>
                <Grid item sm={3} xs={12}>
                  <FormControl
                    className={classes.formControl}
                    variant="outlined"
                    style={{ width: '240px' }}
                    error={form.errors.estado && form.touched.estado}
                  >
                    <InputLabel
                      id="demo-simple-select-outlined-label"
                      style={{ marginTop: 'auto' }}
                    >
                      Estado
                    </InputLabel>
                    <Select
                      className="SelectWrap"
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
                <Grid item sm={3} xs={12}>
                  <TextField
                    className={classes.formControl}
                    id="outlined-basic"
                    label="Label"
                    type="text"
                    fullWidth
                    variant="outlined"
                    name="label"
                    error={form.errors.label && form.touched.label}
                    value={form.values.label || ''}
                    onChange={form.addValue}
                    helperText={
                      form.errors.label && form.touched.label
                        ? 'El campo no puede estar vacio'
                        : ''
                    }
                  />
                </Grid>
                <Grid item sm={3} xs={12}>
                  <TextField
                    className={classes.formControl}
                    id="tooltip"
                    label="Tooltip"
                    fullWidth
                    variant="outlined"
                    name="tooltip"
                    onChange={(e) =>
                      setFormnull({ ...formnull, tooltip: e.target.value })
                    }
                    value={formnull.tooltip || ''}
                  />
                </Grid>
                <Grid item sm={3} xs={12}>
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
                      form.errors.orden && form.touched.orden
                        ? 'El campo no puede estar vacio'
                        : ''
                    }
                  />
                </Grid>
                <Grid item sm={3} xs={12}>
                  <TextField
                    className={classes.formControl}
                    id="iop"
                    label="IOP"
                    fullWidth
                    variant="outlined"
                    name="iop"
                    onChange={(e) =>
                      setFormnull({ ...formnull, iop: e.target.value })
                    }
                    value={formnull.iop || ''}
                  />
                </Grid>
                <br />
              </Grid>

              <Grid container spacing={1} alignItems="center">
                <Grid item sm={3} xs={12}>
                  <FormControlLabel
                    className={classes.formControl}
                    labelPlacement="start"
                    style={{ flexDirection: 'initial' }}
                    control={
                      <Checkbox
                        checked={deshabilitado}
                        onChange={hchangedeshabilitado}
                        name="desabilitado"
                        color="primary"
                      />
                    }
                    label="Deshabilitado"
                  />
                </Grid>
                <Grid item sm={3} xs={12}>
                <FormControlLabel
                    className={classes.formControl}
                    labelPlacement="start"
                    style={{ flexDirection: 'initial' }}
                    control={
                      <Checkbox
                        checked={documentoSoporte}
                        onChange={hchangedocumentoSoporte}
                        name="documentoSoporte"
                        color="primary"
                      />
                    }
                    label="Documento Soporte"
                  />
                </Grid>
                <Grid item sm={3} xs={12}>
                  <FormControlLabel
                    className={classes.formControl}
                    labelPlacement="start"
                    style={{ flexDirection: 'initial' }}
                    control={
                      <Checkbox
                        checked={observable}
                        onChange={hchangeobservable}
                        name="observable"
                        color="primary"
                      />
                    }
                    label="Observable"
                  />
                </Grid>
                <br />
                <Grid item md={3} xs={12}>
                  <Paper component="ul"  style={{ backgroundColor: '#fff0' }} className={classes.formControl}>
                    {state.items?.map((data) => {
                      let icon;
                      return (
                        <li key={data}>
                          <Chip
                            icon={icon}
                            label={data}
                            onDelete={() => handleDelete(data)}
                            className={classes.chip}
                          />
                        </li>
                      );
                    })}
                  </Paper>
                  <TextField
                    error={state.error ? true : false}
                    className={classes.formControl}
                    id="validacion"
                    name="validacion"
                    label="Validación"
                    fullWidth
                    variant="outlined"
                    value={state.value || ''}
                    onChange={handleChangeContact}
                    onKeyDown={handleKeyDown}
                    onPaste={handlePaste}
                    helperText={state.error ? state.error : ''}
                  />
                </Grid>
                <br />
              </Grid>
              <Grid container spacing={1} alignItems="center">
                <Grid item sm={3} xs={12}>
                  <TextField
                    className={classes.formControl}
                    id="parametricaText"
                    label="Parametrica Text"
                    fullWidth
                    variant="outlined"
                    name="parametricaText"
                    onChange={(e) =>
                      setFormnull({
                        ...formnull,
                        parametricaText: e.target.value,
                      })
                    }
                    value={formnull.parametricaText || ''}
                  />
                </Grid>
                <br />
                <Grid item sm={3} xs={12}>
                  <TextField
                    className={classes.formControl}
                    id="campoPadre"
                    label="Campo Padre"
                    fullWidth
                    variant="outlined"
                    name="campoPadre"
                    onChange={(e) =>
                      setFormnull({ ...formnull, campoPadre: e.target.value })
                    }
                    value={formnull.campoPadre || ''}
                  />
                </Grid>
                <br />
                <Grid item sm={3} xs={12}>
                  <TextField
                    className={classes.formControl}
                    id="campoHijo"
                    label="Campo Hijo"
                    fullWidth
                    variant="outlined"
                    name="campoHijo"
                    onChange={(e) =>
                      setFormnull({ ...formnull, campoHijo: e.target.value })
                    }
                    value={formnull.campoHijo || ''}
                  />
                </Grid>
                <br />
                <Grid item sm={3} xs={12}>
                  <TextField
                    className={classes.formControl}
                    id="filtro"
                    label="Filtro"
                    fullWidth
                    variant="outlined"
                    name="filtro"
                    onChange={(e) =>
                      setFormnull({ ...formnull, filtro: e.target.value })
                    }
                    value={formnull.filtro || ''}
                  />
                </Grid>
                <br />
              </Grid>

              <Grid container spacing={1} alignItems="center">
              <Grid item sm={3} xs={12}>
                  <TextField
                    className={classes.formControl}
                    id="parametrica"
                    label="Paramétrica"
                    fullWidth
                    variant="outlined"
                    name="parametrica"
                    onChange={(e) =>
                      setFormnull({ ...formnull, parametrica: e.target.value })
                    }
                    value={formnull.parametrica || ''}
                  />
                </Grid>
                <Grid item sm={3} xs={12}>
                  <TextField
                    className={classes.formControl}
                    id="outlined-basic"
                    label="Size"
                    fullWidth
                    variant="outlined"
                    name="size"
                    type="number"
                    error={form.errors.size && form.touched.size}
                    value={form.values.size || ''}
                    onChange={form.addValue}
                    helperText={
                      form.errors.size && form.touched.size
                        ? 'El campo no puede estar vacio'
                        : ''
                    }
                  />
                </Grid>
                <Grid item sm={3} xs={12}>
                  <TextField
                    className={classes.formControl}
                    id="outlined-basic"
                    label="Tabla"
                    fullWidth
                    variant="outlined"
                    name="tabla"
                    error={form.errors.tabla && form.touched.tabla}
                    value={form.values.tabla || ''}
                    onChange={form.addValue}
                    helperText={
                      form.errors.tabla && form.touched.tabla
                        ? 'El campo no puede estar vacio'
                        : ''
                    }
                  />
                </Grid>
                <Grid item sm={3} xs={12}>
                  <TextField
                    className={classes.formControl}
                    id="outlined-basic"
                    label="Cantidad Maxima"
                    fullWidth
                    type="number"
                    variant="outlined"
                    name="cantidadMax"
                    error={form.errors.cantidadMax && form.touched.cantidadMax}
                    value={form.values.cantidadMax || ''}
                    onChange={form.addValue}
                    helperText={
                      form.errors.cantidadMax && form.touched.cantidadMax
                        ? 'El campo no puede estar vacio'
                        : ''
                    }
                  />
                </Grid>
              </Grid>
              <Grid container spacing={1} alignItems="center">
                <Grid item sm={3} xs={12}>
                <TextField
                    className={classes.formControl}
                    id="valorDefecto"
                    label="Valor Defecto"
                    fullWidth
                    variant="outlined"
                    name="valorDefecto"
                    onChange={(e) =>
                      setFormnull({ ...formnull, valorDefecto: e.target.value })
                    }
                    value={formnull.valorDefecto || ''}
                  />
                </Grid>
                <Grid item sm={3} xs={12}>
                  <TextField
                    className={classes.formControl}
                    id="codigoTipoDocumento"
                    label="Código Tipo Documento"
                    fullWidth
                    variant="outlined"
                    name="codigoTipoDocumento"
                    onChange={(e) =>
                      setFormnull({
                        ...formnull,
                        codigoTipoDocumento: e.target.value,
                      })
                    }
                    value={formnull.codigoTipoDocumento || ''}
                  />
                </Grid>
                <Grid item sm={3} xs={12}>
                  <TextField
                    className={classes.formControl}
                    id="criterioOpcional"
                    label="Criterio Opcional"
                    fullWidth
                    variant="outlined"
                    name="criterioOpcional"
                    onChange={(e) =>
                      setFormnull({
                        ...formnull,
                        criterioOpcional: e.target.value,
                      })
                    }
                    value={formnull.criterioOpcional || ''}
                  />
                </Grid>
                <Grid item sm={3} xs={12}>
                  <TextField
                    className={classes.formControl}
                    id="grupoParametrica"
                    label="Grupo Paramétrica"
                    fullWidth
                    variant="outlined"
                    name="grupoParametrica"
                    onChange={(e) =>
                      setFormnull({
                        ...formnull,
                        grupoParametrica: e.target.value,
                      })
                    }
                    value={formnull.grupoParametrica || ''}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={1} alignItems="center">
              <Grid item sm={6} xs={12}>
                  <label>MaxMinFecha</label>
                  <JSONInput
                    id="maxMinFecha"
                    name="maxMinFecha"
                    placeholder={maxmin}
                    locale={locale}
                    height="550px"
                    width="100%"
                    reset={false}
                    onChange={onChangeEditJsonMaxmin}
                    confirmGood={false}
                    onKeyPressUpdate={true}
                    theme={'dark_mitsuketa_tribute'}
                    style={{
                      outerBox: {
                        height: 'auto',
                        maxHeight: '400px',
                        width: '100%',
                      },
                      container: {
                        height: 'auto',
                        maxHeight: '400px',
                        width: '100%',
                        overflow: 'scroll',
                      },
                      body: { minHeight: '45px', width: '100%' },
                    }}
                  />
                </Grid>
                <Grid item md={6} xs={12} sm={6} lg={6} xl={6}>
                  <label>Kardex</label>
                  <JSONInput
                    id="kardex"
                    name="kardex"
                    placeholder={editorjson}
                    locale={locale}
                    height="550px"
                    width="100%"
                    reset={false}
                    onChange={onChangeEditJson}
                    confirmGood={false}
                    onKeyPressUpdate={true}
                    theme={'dark_mitsuketa_tribute'}
                    style={{
                      outerBox: {
                        height: 'auto',
                        maxHeight: '400px',
                        width: '100%',
                      },
                      container: {
                        height: 'auto',
                        maxHeight: '400px',
                        width: '100%',
                        overflow: 'scroll',
                      },
                      body: { minHeight: '45px', width: '100%' },
                    }}
                  />
                </Grid>
              </Grid>

              <Grid item md={12} xs={12} sm={6} lg={6} xl={6}>
                <Button
                  variant="contained"
                  color="secondary"
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
                  CAMPO
                </Button>
              </Grid>
            </Box>
          </form>{' '}
        </>
      ) : (
        <h5>{}</h5>
      )}

      <Typography variant="h5" style={{ textAlign: 'center' }}>
        Lista de Campos
      </Typography>
      <TextField
        onChange={(e) => setSearchId(e.target.value)}
        className={classes.margin}
        id="input-with-icon-textfield"
        label="Buscar por ID:"
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
            Esta seguro de eliminar este item?
          </DialogContentText>
        </DialogContent>
        <DialogContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell align="right">CAMPO</TableCell>
                <TableCell align="right">TIPO</TableCell>
                <TableCell align="right">LABEL</TableCell>
                <TableCell align="right">TOOLTIP</TableCell>
                <TableCell align="right">ESTADO</TableCell>
                <TableCell align="right">SECCION</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>{dataCampos.id || ''}</TableCell>
                <TableCell>{dataCampos.campo || ''}</TableCell>
                <TableCell>{dataCampos.tipo || ''}</TableCell>
                <TableCell>{dataCampos.label || ''}</TableCell>
                <TableCell>{dataCampos.tooltip || ''}</TableCell>
                <TableCell>{dataCampos.estado || ''}</TableCell>
                <TableCell>{dataCampos.idSeccion || ''}</TableCell>
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
        <Table aria-label="simple table" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell className={classes.head}>ID</TableCell>
              <TableCell className={classes.head}>CAMPOS</TableCell>
              <TableCell className={classes.head}>TIPO</TableCell>
              <TableCell className={classes.head}>LABEL</TableCell>
              <TableCell className={classes.head}>TOOLTIP</TableCell>
              <TableCell className={classes.head}>ESTADO</TableCell>
              <TableCell className={classes.head}>SECCION</TableCell>
              <TableCell className={classes.head}>ORDEN</TableCell>
              <TableCell className={classes.head}>IOP</TableCell>
              <TableCell className={classes.head}>DESHABILITADO</TableCell>
              <TableCell className={classes.head}>VALORDEFECTO</TableCell>
              <TableCell className={classes.head}>VALIDACION</TableCell>
              <TableCell className={classes.head}>PARAMETRICA</TableCell>
              <TableCell className={classes.head}>PARAMETRICATEXT</TableCell>
              <TableCell className={classes.head}>CAMPOPADRE</TableCell>
              <TableCell className={classes.head}>CAMPOHIJO</TableCell>
              <TableCell className={classes.head}>OBSERVABLE</TableCell>
              <TableCell className={classes.head}>FILTRO</TableCell>
              <TableCell className={classes.head}>MAXMINFECHA</TableCell>
              <TableCell className={classes.head}>SIZE</TableCell>
              <TableCell className={classes.head}>TABLA</TableCell>
              <TableCell className={classes.head}>CANTIDADMAX</TableCell>
              <TableCell className={classes.head}>DOCUMENTOSOPORTE</TableCell>
              <TableCell className={classes.head}>CODIGOTIPODOCUMENTO</TableCell>
              <TableCell className={classes.head}>CRITERIOOPCIONAL</TableCell>
              <TableCell className={classes.head}>CODIGOTIPOPUBLICACION</TableCell>
              <TableCell className={classes.head}>KARDEX</TableCell>
              <TableCell className={classes.head}>GRUPOPARAMETRICA</TableCell>
              <TableCell className={classes.head}>VALOR</TableCell>
              <TableCell className={classes.fixColumn}>
                ACCIONES
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {campos.length > 0 ? (
              campos
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
                    row.campo
                      .toString()
                      .toLowerCase()
                      .includes(searchNombre.toString().toLowerCase()),
                )
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((cam) => {
                  const {
                    id,
                    campo,
                    tipo,
                    label,
                    tooltip,
                    estado,
                    orden,
                    iop,
                    desabilitado,
                    valorDefecto,
                    validacion,
                    parametrica,
                    parametricaText,
                    campoPadre,
                    campoHijo,
                    observable,
                    filtro,
                    maxMinFecha,
                    size,
                    tabla,
                    cantidadMax,
                    documentoSoporte,
                    codigoTipoDocumento,
                    criterioOpcional,
                    codigoTipoPublicacion,
                    kardex,
                    grupoParametrica,
                    valor,
                    idSeccion,
                  } = cam;
                  return (
                    <TableRow
                      key={id}
                      sx={{ '&:last-child td, &:last-child th': { border: 1 } }}
                    >
                      <TableCell align="center">{id}</TableCell>
                      <TableCell align="center">{campo}</TableCell>
                      <TableCell align="center">{tipo}</TableCell>
                      <TableCell align="center">{label}</TableCell>
                      <TableCell align="center">{tooltip}</TableCell>
                      <TableCell align="center">{estado}</TableCell>
                      <TableCell align="center">{idSeccion}</TableCell>
                      <TableCell align="center">{orden}</TableCell>
                      <TableCell align="center">{iop}</TableCell>
                      <TableCell align="center">{desabilitado  ? 'SI':'NO'}</TableCell>
                      <TableCell align="center">{valorDefecto}</TableCell>
                      <TableCell align="center">{validacion+''}</TableCell>
                      <TableCell align="center">{parametrica}</TableCell>
                      <TableCell align="center">{parametricaText}</TableCell>
                      <TableCell align="center">{campoPadre}</TableCell>
                      <TableCell align="center">{campoHijo}</TableCell>
                      <TableCell align="center">{observable ? 'SI':'NO'}</TableCell>
                      <TableCell align="center">{filtro}</TableCell>
                      <TableCell align="center">{ maxMinFecha===null ? '' :  JSON.stringify(maxMinFecha) }</TableCell>
                      <TableCell align="center">{size}</TableCell>
                      <TableCell align="center">{tabla}</TableCell>
                      <TableCell align="center">{cantidadMax}</TableCell>
                      <TableCell align="center">{documentoSoporte ? 'SI':'NO'}</TableCell>
                      <TableCell align="center">{codigoTipoDocumento}</TableCell>
                      <TableCell align="center">{criterioOpcional}</TableCell>
                      <TableCell align="center">
                        {codigoTipoPublicacion}
                      </TableCell>
                      {/* <TableCell align="center">{kardex || ''}</TableCell> */}
                      <TableCell align="center">{ kardex===null ? '' : JSON.stringify(kardex)}</TableCell>
                      <TableCell align="center">{grupoParametrica}</TableCell>
                      <TableCell align="center">{valor}</TableCell>
                      <TableCell
                        align="center"
                        style={{ width: 200 }}
                        className={classes.fixColumn}
                      >
                        <Tooltip placement="bottom" title="Visualizar registro">
                          <IconButton
                            className={classes.paddingButton}
                            onClick={() => viewDetail(cam)}
                          >
                            <ViewHeadline className={classes.delete} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip placement="bottom" title="Editar registro">
                          <IconButton
                            className={classes.paddingButton}
                            onClick={() => editItem(cam)}
                          >
                            <Edit className={classes.success} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip placement="bottom" title="Eliminar registro">
                          <IconButton
                            className={classes.paddingButton}
                            onClick={() => handleClickOpenD(cam)}
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
        count={campos.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <DialogCampos open={open} close={handleClose} data={datos} />
    </Fragment>
  );
};

export default Camposs;
