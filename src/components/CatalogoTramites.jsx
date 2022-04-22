import React, { Fragment, useEffect, useState } from 'react';
import { Api } from '../service/api';
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
import Checkbox from '@material-ui/core/Checkbox';
import { makeStyles } from '@material-ui/core/styles';
import { useForm } from '../hooks';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import SearchIcon from '@material-ui/icons/Search';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Delete, Edit, ViewHeadline } from '@material-ui/icons';
import DialogCatalogoTramite from './DialogCatalogoTramite';
import { useDispatch } from 'react-redux';
import { MessageSuccess, MessageWarning } from '../redux/reducer';
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';
import SaveIcon from '@material-ui/icons/Save';

const useStyles = makeStyles((theme) => ({
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
  formControl: {
    margin: theme.spacing(1),
    minWidth: '100%',
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
  txt: {
    maxWidth: '100%',
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
  tab: {
    width: '100%',
  },
  container: {
    maxHeight: 440,
  },
  tableRow: {
    '&$selected, &$selected:hover': {
      backgroundColor: 'purple',
    },
  },
  tableCell: {
    '$selected &': {
      color: 'yellow',
    },
  },

  hover: {
    color: 'red ',
  },
  selected: {},
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

const CatalogoTramites = () => {
  const classes = useStyles();
  // const navigate = useNavigate();
  const dispatch = useDispatch();
  const form = useForm({
    id: null,
    nombre: null,
    codigo: null,
    estado: null,
    tipo: null,
    tipoCatalogo: null,
    version: null,
    duracion: null,
  });
  const [formnull, setFormnull] = useState({
    api: null, //
    rutaFront: null, //
    rutaInicioFront: null, //
    preRutaFront: null, //
    kardex: null, //
    metodoObtenerInformacion: null, //
    metodoValidarDatos: null, //
    metodoDespuesDelPago: null, //
    metodoVolcarDatos: null, //
    metodoPublicar: null, //
    metodoGenerarCertificado: null, //
  });
  const [editorjson, setEditorjson] = useState({});
  const [catal, setCatal] = useState([]);
  const getCatalogo = async () => {
    await Api.getCatalogo()
      .then((data) => {
        if (data.finalizado && data) {
          setCatal(data.datos);
          return;
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const [categoriaTramite, setCategoriaTramite] = useState([]);
  const getCatalogoTramite = async () => {
    await Api.getCatalogoTramite()
      .then((data) => {
        if (data && data.finalizado) {
          return setCategoriaTramite(data.datos);
        }
        dispatch(MessageWarning(data.mensaje));
      })
      .catch((err) => {
        console.log(err);
      });
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
  const [tramite, setTramite] = useState({});
  const handleKeyDownTramite = (event) => {
    if (['Enter', 'Tab', ','].includes(event.key)) {
      event.preventDefault();
      const value = tramite.value?.trim();
      if (value && isValidTramite(value)) {
        setTramite({
          items: [...(tramite.items ?? []), tramite.value ?? ''],
          value: '',
        });
      }
    }
  };

  const handleChangeContactTramite = (event) => {
    setTramite({
      items: tramite.items,
      value: event.target.value,
      error: null,
    });
  };

  const handleDeleteTramite = (item) => {
    setTramite({
      items: tramite.items?.filter((i) => i !== item),
    });
  };
  const handlePasteTramite = (event) => {
    event.preventDefault();
    const paste = event.clipboardData?.getData('text');

    const data = paste?.split(/;|,|\n/);

    if (data) {
      const toBeAdded = data.filter((d) => !isInListTramite(d));
      setTramite({
        items: [...(tramite.items ?? []), ...toBeAdded],
      });
    }
  };
  const isInListTramite = (dato) => {
    return tramite.items?.includes(dato);
  };
  const isValidTramite = (dato) => {
    let error = null;

    if (isInListTramite(dato)) {
      error = `${dato} ya ha sido agregado.`;
    }
    if (error) {
      setTramite({
        items: tramite.items,
        error,
      });
      return false;
    }
    return true;
  };
  const [seccion, setSeccion] = useState(false);
  const [pago, setPago] = useState(false);
  const [presentacion, setPresentacion] = useState(true);
  const [revision, setRevision] = useState(true);
  const [matricula, setMatricula] = useState(false);

  const hchangeSeccion = (event) => {
    setSeccion(!seccion);
  };
  const hchangePago = (event) => {
    setPago(!pago);
  };
  const hchangePresentacion = (event) => {
    setPresentacion(!presentacion);
  };
  const hchangeRevision = (event) => {
    setRevision(!revision);
  };
  const hchangeMatricula = (event) => {
    setMatricula(!matricula);
  };
  const [action, setAction] = useState('add');
  const [idc, setId] = useState(null);
  const handleCancel = () => {
    form.reset();
    resetVariables();
    setAction('add');
  };
  const getResult = function (a1, a2) {
    let i = a1.length;
    if (i !== a2.length) return false;

    while (i--) {
      if (a1[i] !== a2[i]) return false;
    }
    return true;
  };
  const arrayVacio = (arr) => !Array.isArray(arr) || arr.length === 0;
  const objetoVacio = (obj) => obj === null || Object.keys(obj).length === 0;
  const isObject = (object) => object != null && typeof object === 'object';
  const sub = async (event) => {
    event.preventDefault();
    try {
      if (Object.values(form.errors).includes(true)) {
        form.setTouched();
      } else {
        const data = {
          id: form.values.id,
          nombre: form.values.nombre,
          codigo: form.values.codigo,
          tipo: form.values.tipo,
          tipoCatalogo: form.values.tipoCatalogo,
          estado: form.values.estado,
          tipoSocietarioHabilitado: !arrayVacio(state.items)
            ? state.items
            : null,
          tipoTramiteHabilitado: !arrayVacio(tramite.items)
            ? tramite.items
            : null,
          version: form.values.version,
          requiereRegistrarEditarSeccion: seccion,
          requierePago: pago,
          requierePresentacion: presentacion,
          requiereRevision: revision,
          requiereMatriculaVigente: matricula,
          duracion: form.values.duracion,
          api: formnull.api || null,
          rutaFront: formnull.rutaFront || null,
          rutaInicioFront: formnull.rutaInicioFront || null,
          preRutaFront: formnull.preRutaFront || null,
          kardex: !objetoVacio(editorjson || {}) ? editorjson : null,
          metodoObtenerInformacion: formnull.metodoObtenerInformacion || null,
          metodoValidarDatos: formnull.metodoValidarDatos || null,
          metodoPublicar: formnull.metodoPublicar || null,
          metodoGenerarCertificado: formnull.metodoGenerarCertificado || null,
          metodoDespuesDelPago: formnull.metodoDespuesDelPago || null,
          metodoVolcarDatos: formnull.metodoVolcarDatos || null,
          idParametricaCategoria: value,
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
              // console.log('valact',valAct);
              changes[campo] = data[campo];
            }
          });
          valAct.id = idc;
          const sh = valAct['tipoSocietarioHabilitado'];
          const th = valAct['tipoTramiteHabilitado'];
          // console.log(valAct);
          if (!(sh === null) && isObject(sh)) {
            if (getResult(sh['valorActual'] || [], sh['valorAnterior'] || [])) {
              delete valAct.tipoSocietarioHabilitado;
              delete changes.tipoSocietarioHabilitado;
            }
          }
          if (!(th === null) && isObject(th)) {
            if (getResult(th['valorActual'] || [], th['valorAnterior'] || [])) {
              delete valAct.tipoTramiteHabilitado;
              delete changes.tipoTramiteHabilitado;
            }
          }
          const al = valAct['idParametricaCategoria'];
          if (al.valorActual.id === al.valorAnterior) {
            delete valAct.idParametricaCategoria;
          } else {
            valAct['idParametricaCategoria'].valorActual = al.valorActual.id;
          }
          const formulario = {
            tabla: 'catalogo_tramites',
            matricula: '',
            idRegistro: idc,
            cambio: valAct,
            cambios: changes,
          };
          const body = {
            id: idc,
            catTramite: data,
            formulario: formulario,
          };
          console.log(body);
          await Api.updateCatalogoTramite(body)
            .then((resp) => {
              if (resp && resp.finalizado) {
                dispatch(MessageSuccess(resp.mensaje));
                return getCatalogoTramite();
              }
            })
            .catch((err) => {
              console.log('err', err);
            });
          resetVariables();
        }
        if (action === 'add') {
          const formulario = {
            tabla: 'catalogo_tramites',
            matricula: '',
            idRegistro: data.id,
            cambio: data,
            cambios: {},
          };
          const body = {
            catalogoTramite: data,
            formulario: formulario,
          };
          await Api.addCatalogoTramite(body)
            .then((resp) => {
              if (resp && resp.finalizado) {
                dispatch(MessageSuccess(resp.mensaje));
                return getCatalogoTramite();
              }
              dispatch(MessageWarning(resp.mensaje));
            })
            .catch((err) => {
              console.log(err, 'err');
            });
        }
        setAction('add');
        resetVariables();
        form.reset();
      }
    } catch (error) {
      // dispatch(MessageError(error));
      console.log('error', error);
    }
  };
  // PopUpconfirmDelete
  const [openD, setOpenD] = React.useState(false);
  const [dataCatalogoT, setDataCatalogoT] = React.useState({});
  const handleClickOpenD = (data) => {
    const nuevo = { ...data };
    nuevo.kardex = JSON.stringify(nuevo.kardex);
    setDataCatalogoT({ ...nuevo });
    setOpenD(true);
  };
  const handleCloseD = () => {
    setOpenD(false);
  };
  const deleteItem = async () => {
    const val = {
      estado: {
        valorAnterior: dataCatalogoT.estado,
        valorActual: 'INACTIVO',
      },
    };
    const cambio = {
      id: dataCatalogoT.id,
      estado: 'INACTIVO',
    };
    const data = {
      tabla: 'catalogos_tramites',
      idRegistro: dataCatalogoT.id,
      cambio: val,
      cambios: cambio,
    };
    const req = { id: dataCatalogoT.id, formulario: data };
    await Api.eliminarCatalogoTramite(req)
      .then((resp) => {
        dispatch(MessageSuccess(resp.mensaje));
        getCatalogoTramite();
        setOpenD(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const [anterior, setAnterior] = useState({
    id: null,
    nombre: null,
    codigo: null,
    tipo: null,
    tipoCatalogo: null,
    estado: null,
    tipoSocietarioHabilitado: null,
    tipoTramiteHabilitado: null,
    version: null,
    requiereRegistrarEditarSeccion: null,
    requierePago: null,
    requierePresentacion: null,
    requiereRevision: null,
    requiereMatriculaVigente: null,
    duracion: null,
    api: null,
    rutaFront: null,
    rutaInicioFront: null,
    preRutaFront: null,
    kardex: null,
    metodoObtenerInformacion: null,
    metodoValidarDatos: null,
    metodoPublicar: null,
    metodoGenerarCertificado: null,
    metodoDespuesDelPago: null,
    metodoVolcarDatos: null,
    idParametricaCategoria: null,
  });
  const editItem = (rows) => {
    const data = {
      id: rows.id,
      nombre: rows.nombre,
      codigo: rows.codigo,
      estado: rows.estado,
      tipo: rows.tipo,
      tipoCatalogo: rows.tipoCatalogo,
      version: rows.version,
      duracion: rows.duracion,
    };
    setEditorjson(rows.kardex);
    setFormnull({
      api: rows.api,
      rutaFront: rows.rutaFront,
      rutaInicioFront: rows.rutaInicioFront,
      preRutaFront: rows.preRutaFront,
      kardex: rows.kardex,
      metodoObtenerInformacion: rows.metodoObtenerInformacion,
      metodoValidarDatos: rows.metodoValidarDatos,
      metodoDespuesDelPago: rows.metodoDespuesDelPago,
      metodoVolcarDatos: rows.metodoVolcarDatos,
      metodoPublicar: rows.metodoPublicar,
      metodoGenerarCertificado: rows.metodoGenerarCertificado,
    });
    setTramite({
      items: [...(rows.tipoTramiteHabilitado ?? [])],
    });
    setState({
      items: [...(rows.tipoSocietarioHabilitado ?? [])],
    });
    setSeccion(rows.requiereRegistrarEditarSeccion);
    setPago(rows.requierePago);
    setPresentacion(rows.requierePresentacion);
    setRevision(rows.requiereRevision);
    setMatricula(rows.requiereMatriculaVigente);
    setAnterior({
      id: rows.id,
      nombre: rows.nombre,
      codigo: rows.codigo,
      tipo: rows.tipo,
      tipoCatalogo: rows.tipoCatalogo,
      estado: rows.estado,
      tipoSocietarioHabilitado: rows.tipoSocietarioHabilitado,
      tipoTramiteHabilitado: rows.tipoTramiteHabilitado,
      version: rows.version,
      requiereRegistrarEditarSeccion: rows.requiereRegistrarEditarSeccion,
      requierePago: rows.requierePago,
      requierePresentacion: rows.requierePresentacion,
      requiereRevision: rows.requiereRevision,
      requiereMatriculaVigente: rows.requiereMatriculaVigente,
      duracion: rows.duracion,
      api: rows.api,
      rutaFront: rows.rutaFront,
      rutaInicioFront: rows.rutaInicioFront,
      preRutaFront: rows.preRutaFront,
      kardex: rows.kardex,
      metodoObtenerInformacion: rows.metodoObtenerInformacion,
      metodoValidarDatos: rows.metodoValidarDatos,
      metodoPublicar: rows.metodoPublicar,
      metodoGenerarCertificado: rows.metodoGenerarCertificado,
      metodoDespuesDelPago: rows.metodoDespuesDelPago,
      metodoVolcarDatos: rows.metodoVolcarDatos,
      idParametricaCategoria: rows.idParametricaCategoria,
    });
    const obj = catal.filter((f) => f.id === rows.idParametricaCategoria);
    setValue(obj[0]);
    setId(rows.id);
    form.reset();
    form.setValues(data);
    setAction('edit');
  };
  const resetVariables = () => {
    setFormnull({
      ...formnull,
      api: null,
      rutaFront: null,
      rutaInicioFront: null,
      preRutaFront: null,
      kardex: null,
      metodoObtenerInformacion: null,
      metodoValidarDatos: null,
      metodoDespuesDelPago: null,
      metodoVolcarDatos: null,
      metodoPublicar: null,
      metodoGenerarCertificado: null,
    });
    setEditorjson({});
    setState({
      items: [],
      value: '',
      error: '',
    });
    setTramite({
      items: [],
      value: '',
      error: '',
    });
    setSeccion(false);
    setPago(false);
    setPresentacion(true);
    setRevision(true);
    setMatricula(false);
    setValue('');
    setInputValue('');
  };
  const [value, setValue] = React.useState(catal[0]);
  const [inputValue, setInputValue] = React.useState('');
  const [open, setOpen] = useState(false);
  const [datos, setDatos] = useState({});
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const viewDetail = (data) => {
    const nuevo = { ...data };
    nuevo.kardex = JSON.stringify(nuevo.kardex);
    setDatos({ ...nuevo });
    handleOpen();
  };
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
    window.localStorage.setItem('tramite', JSON.stringify(rowData));
    setSelected({ currentRow: rowData });
    if (rowData.id === selected.selectedRowId) {
      setSelected({ selected: false });
      setSelected({ selectedRowId: null });
      window.localStorage.removeItem('tramite');
    } else {
      setSelected({ selected: true });
      setSelected({
        selectedRowId: rowData.id,
      });
    }
  };
  useEffect(() => {
    getCatalogo();
    getCatalogoTramite();
    const t = window.localStorage.getItem('tramite');
    if (t) {
      setSelected({ currentRow: JSON.parse(t) });
      setSelected({ selected: true });
      setSelected({ selectedRowId: JSON.parse(t).id });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [searchNombre, setSearchNombre] = React.useState('');
  const [searchId, setSearchId] = React.useState('');
  const [searchCodigo, setSearchCodigo] = React.useState('');
  const [SearchIdParam, setSearchIdParam] = React.useState('');

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const onChangeEditJson = (v) => {
    if (!v.error) {
      if (v.jsObject === undefined) {
        setEditorjson({});
      }
      setEditorjson(v.jsObject);
    }
  };

  return (
    <Fragment>
      <form onSubmit={sub}>
        <Box>
          <Grid container spacing={1}>
            <Grid
              style={{ display: 'flex' }}
              item
              md={6}
              xs={12}
              sm={6}
              lg={6}
              xl={6}
            >
              <Grid
                style={{
                  marginTop: '7px',
                  maxWidth: '100%',
                  flexBasis: '100%',
                }}
                item
                sm={3}
                xs={6}
              >
                <Autocomplete
                  value={value || {}}
                  onChange={(event, newValue) => {
                    setValue(newValue);
                  }}
                  inputValue={inputValue}
                  onInputChange={(event, newInputValue) => {
                    setInputValue(newInputValue);
                  }}
                  getOptionLabel={(option) => option.nombre || ''}
                  getOptionSelected={(option, value) =>
                    option.nombre || '' === value.nombre || ''
                  }
                  id="controllable-states-demo"
                  options={catal}
                  // style={{ width: 350 }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      className={classes.formControl}
                      fullWidth
                      label="Catálogo"
                      variant="outlined"
                      error={params.inputProps.value ? false : true}
                      helperText={
                        params.inputProps.value
                          ? ''
                          : 'El campo no puede estar vacio'
                      }
                    />
                  )}
                />
              </Grid>
              <Grid
                style={{
                  marginTop: '7px',
                  maxWidth: '100%',
                  flexBasis: '100%',
                  marginLeft: '4px',
                }}
                item
                sm={3}
                xs={6}
              >
                <TextField
                  className={classes.formControl}
                  fullWidth
                  // style={{ marginTop: 0, paddingLeft:'10px'}}
                  value={form.values.id}
                  onChange={form.addValue}
                  error={form.errors.id && form.touched.id}
                  helperText={
                    form.errors.id && form.touched.id
                      ? 'El campo no puede estar vacio'
                      : ''
                  }
                  label="Id"
                  color="primary"
                  name="id"
                  variant="outlined"
                  // inputProps={{ className: classes.formLabel }}
                  margin="normal"
                />
              </Grid>
            </Grid>
            <Grid
              style={{ marginTop: '7px' }}
              item
              md={6}
              xs={12}
              sm={6}
              lg={6}
              xl={6}
            >
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
                fullWidth
                label="Nombre"
                color="primary"
                name="nombre"
                variant="outlined"
                id="outlined-basic"
                inputProps={{ className: classes.formLabel }}
                margin="normal"
              />
            </Grid>
            <Grid item md={6} xs={12} sm={6} lg={6} xl={6}>
              <TextField
                error={form.errors.codigo && form.touched.codigo}
                value={form.values.codigo}
                onChange={form.addValue}
                helperText={
                  form.errors.codigo && form.touched.codigo
                    ? 'El campo no puede estar vacio'
                    : ''
                }
                fullWidth
                margin="normal"
                label="Código"
                color="primary"
                name="codigo"
                variant="outlined"
                id="Codigo"
                inputProps={{}}
                className={classes.formControl}
              />
            </Grid>
            <Grid item md={6} xs={12} sm={6} lg={6} xl={6}>
              <FormControl
                variant="outlined"
                className={classes.formControl}
                error={form.errors.tipo && form.touched.tipo}
              >
                <InputLabel
                  id="demo-simple-select-outlined-label"
                  // style={{ marginTop: 'auto' }}
                >
                  Tipo
                </InputLabel>
                <Select
                  labelId="demo-simple-select-outlined-label"
                  id="demo-simple-select-outlined"
                  name="tipo"
                  value={form.values.tipo}
                  onChange={form.addValue}
                  variant="outlined"
                  fullWidth
                  label="Tipo"
                >
                  <MenuItem value={'EN_LINEA'}>EN_LINEA</MenuItem>
                  <MenuItem value={'SEMI_LINEA'}>SEMI_LINEA</MenuItem>
                  <MenuItem value={'PRESENCIAL'}>PRESENCIAL</MenuItem>
                </Select>
                <FormHelperText>
                  {form.errors.tipo && form.touched.tipo
                    ? 'El campo no puede estar vacio'
                    : ''}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid
              style={{ marginTop: '4px', paddingRight: '10px' }}
              item
              md={6}
              xs={12}
              sm={6}
              lg={6}
              xl={6}
            >
              <FormControl
                variant="outlined"
                className={classes.formControl}
                error={form.errors.tipoCatalogo && form.touched.tipoCatalogo}
              >
                <InputLabel id="demo-simple-select-outlined-label">
                  Tipo Catálogo
                </InputLabel>
                <Select
                  labelId="demo-simple-select-outlined-label"
                  id="tipoCatalogo"
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
            <Grid item md={6} xs={12} sm={6} lg={6} xl={6}>
              <TextField
                error={form.errors.version && form.touched.version}
                value={form.values.version}
                onChange={form.addValue}
                helperText={
                  form.errors.version && form.touched.version
                    ? 'El campo no puede estar vacio'
                    : ''
                }
                fullWidth
                margin="normal"
                label="Versión"
                color="primary"
                name="version"
                variant="outlined"
                id="version"
                inputProps={{}}
                className={classes.formControl}
              />
            </Grid>
            <Grid item md={6} xs={12} sm={6} lg={6} xl={6}>
              <Paper
                component="ul"
                style={{ backgroundColor: '#fff0' }}
                className={classes.formControl}
              >
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
                id="tipoSocietarioHabilitado"
                name="TipoSocietarioHabilitado"
                label="Tipo Societario Habilitado"
                fullWidth
                variant="outlined"
                value={state.value || ''}
                onChange={handleChangeContact}
                onKeyDown={handleKeyDown}
                onPaste={handlePaste}
                helperText={state.error ? state.error : ''}
              />
            </Grid>
            <Grid item md={6} xs={12} sm={6} lg={6} xl={6}>
              <Paper
                component="ul"
                style={{ backgroundColor: '#fff0' }}
                className={classes.formControl}
              >
                {tramite.items?.map((data) => {
                  let icon;
                  return (
                    <li key={data}>
                      <Chip
                        icon={icon}
                        label={data}
                        onDelete={() => handleDeleteTramite(data)}
                        className={classes.chip}
                      />
                    </li>
                  );
                })}
              </Paper>
              <TextField
                error={tramite.error ? true : false}
                className={classes.formControl}
                id="tipoTramiteHabilitado"
                name="tipoTramiteHabilitado"
                label="Tipo Trámite Habilitado"
                fullWidth
                variant="outlined"
                value={tramite.value || ''}
                onChange={handleChangeContactTramite}
                onKeyDown={handleKeyDownTramite}
                onPaste={handlePasteTramite}
                helperText={tramite.error ? tramite.error : ''}
              />
            </Grid>
            <Grid item md={6} xs={12} sm={6} lg={6} xl={6}>
              <TextField
                error={form.errors.duracion && form.touched.duracion}
                value={form.values.duracion}
                onChange={form.addValue}
                helperText={
                  form.errors.duracion && form.touched.duracion
                    ? 'El campo no puede estar vacio'
                    : ''
                }
                fullWidth
                margin="normal"
                label="Duración"
                color="primary"
                name="duracion"
                variant="outlined"
                id="duracion"
                inputProps={{}}
                className={classes.formControl}
                type="number"
              />
            </Grid>
            <Grid item md={6} xs={12} sm={6} lg={6} xl={6}>
              <TextField
                onChange={(e) =>
                  setFormnull({ ...formnull, api: e.target.value })
                }
                value={formnull.api || ''}
                fullWidth
                margin="normal"
                label="Api"
                color="primary"
                name="api"
                variant="outlined"
                id="api"
                inputProps={{}}
                className={classes.formControl}
              />
            </Grid>
            <Grid item md={6} xs={12} sm={6} lg={6} xl={6}>
              <TextField
                onChange={(e) =>
                  setFormnull({ ...formnull, rutaFront: e.target.value })
                }
                value={formnull.rutaFront || ''}
                fullWidth
                margin="normal"
                label="Ruta Front"
                color="primary"
                name="rutaFront"
                variant="outlined"
                id="rutaFront"
                inputProps={{}}
                className={classes.formControl}
              />
            </Grid>
            <Grid item md={6} xs={12} sm={6} lg={6} xl={6}>
              <TextField
                onChange={(e) =>
                  setFormnull({ ...formnull, rutaInicioFront: e.target.value })
                }
                value={formnull.rutaInicioFront || ''}
                fullWidth
                margin="normal"
                label="Ruta Inicio Front"
                color="primary"
                name="rutaInicioFront"
                variant="outlined"
                id="rutaInicioFront"
                inputProps={{}}
                className={classes.formControl}
              />
            </Grid>
            <Grid item md={6} xs={12} sm={6} lg={6} xl={6}>
              <TextField
                onChange={(e) =>
                  setFormnull({ ...formnull, preRutaFront: e.target.value })
                }
                value={formnull.preRutaFront || ''}
                fullWidth
                margin="normal"
                label="Pre Ruta Front"
                color="primary"
                name="preRutaFront"
                variant="outlined"
                id="preRutaFront"
                inputProps={{}}
                className={classes.formControl}
              />
            </Grid>
            <Grid item md={6} xs={12} sm={6} lg={6} xl={6}>
              <TextField
                onChange={(e) =>
                  setFormnull({
                    ...formnull,
                    metodoObtenerInformacion: e.target.value,
                  })
                }
                value={formnull.metodoObtenerInformacion || ''}
                fullWidth
                margin="normal"
                label="Método Obtener Información"
                color="primary"
                name="metodoObtenerInformacion"
                variant="outlined"
                id="metodoObtenerInformacion"
                inputProps={{}}
                className={classes.formControl}
              />
            </Grid>
            <Grid item md={6} xs={12} sm={6} lg={6} xl={6}>
              <TextField
                onChange={(e) =>
                  setFormnull({
                    ...formnull,
                    metodoValidarDatos: e.target.value,
                  })
                }
                value={formnull.metodoValidarDatos || ''}
                fullWidth
                margin="normal"
                label="Método Validar Datos"
                color="primary"
                name="metodoValidarDatos"
                variant="outlined"
                id="metodoValidarDatos"
                inputProps={{}}
                className={classes.formControl}
              />
            </Grid>
            <Grid item md={6} xs={12} sm={6} lg={6} xl={6}>
              <TextField
                onChange={(e) =>
                  setFormnull({
                    ...formnull,
                    metodoDespuesDelPago: e.target.value,
                  })
                }
                value={formnull.metodoDespuesDelPago || ''}
                fullWidth
                margin="normal"
                label="Método Después Del Pago"
                color="primary"
                name="metodoDespuesDelPago"
                variant="outlined"
                id="metodoDespuesDelPago"
                inputProps={{}}
                className={classes.formControl}
              />
            </Grid>
            <Grid item md={6} xs={12} sm={6} lg={6} xl={6}>
              <TextField
                onChange={(e) =>
                  setFormnull({
                    ...formnull,
                    metodoVolcarDatos: e.target.value,
                  })
                }
                value={formnull.metodoVolcarDatos || ''}
                fullWidth
                margin="normal"
                label="Método Volcar Datos"
                color="primary"
                name="metodoVolcarDatos"
                variant="outlined"
                id="metodoVolcarDatos"
                inputProps={{}}
                className={classes.formControl}
              />
            </Grid>
            <Grid item md={6} xs={12} sm={6} lg={6} xl={6}>
              <TextField
                onChange={(e) =>
                  setFormnull({ ...formnull, metodoPublicar: e.target.value })
                }
                value={formnull.metodoPublicar || ''}
                fullWidth
                margin="normal"
                label="Método Publicar"
                color="primary"
                name="metodoPublicar"
                variant="outlined"
                id="metodoPublicar"
                inputProps={{}}
                className={classes.formControl}
              />
            </Grid>
            <Grid item md={6} xs={12} sm={6} lg={6} xl={6}>
              <TextField
                onChange={(e) =>
                  setFormnull({
                    ...formnull,
                    metodoGenerarCertificado: e.target.value,
                  })
                }
                value={formnull.metodoGenerarCertificado || ''}
                fullWidth
                margin="normal"
                label="Método Generar Certificado"
                color="primary"
                name="metodoGenerarCertificado"
                variant="outlined"
                id="metodoGenerarCertificado"
                inputProps={{}}
                className={classes.formControl}
              />
            </Grid>
            <Grid style={{ marginTop: '4px' }} item sm={6} xs={12}>
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
            <Grid container spacing={1} alignItems="center">
              <Grid
                style={{ paddingLeft: '10px' }}
                item
                md={6}
                xs={12}
                sm={6}
                lg={6}
                xl={6}
              >
                <label style={{marginLeft:'-20px'}}>Kardex</label>
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
              <Grid item md={3} xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={matricula}
                      onChange={hchangeMatricula}
                      name="requiereMatriculaVigente"
                      color="primary"
                    />
                  }
                  label="Requiere Matricula Vigente"
                />
              </Grid>
              <Grid item md={3} xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={revision}
                      onChange={hchangeRevision}
                      name="requiereRevision"
                      color="primary"
                    />
                  }
                  label="Requiere Revision"
                />
              </Grid>
            </Grid>
            <Grid container spacing={1} alignItems="center">
              <Grid item md={4} xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={seccion}
                      onChange={hchangeSeccion}
                      name="requiereRegistrarEditarSeccion"
                      color="primary"
                    />
                  }
                  label="Requiere Registrar Editar Seccion"
                />
              </Grid>
              <Grid item md={4} xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={pago}
                      onChange={hchangePago}
                      name="requierePago"
                      color="primary"
                    />
                  }
                  label="Requiere Pago"
                />
              </Grid>
              <Grid item md={4} xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={presentacion}
                      onChange={hchangePresentacion}
                      name="requierePresentacion"
                      color="primary"
                    />
                  }
                  label="Requiere Presentacion"
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
                startIcon={<SaveIcon />}
              >
                {action === 'add' ? 'Agregar ' : 'Actualizar '}
                TRÁMITE
              </Button>
            </Grid>
          </Grid>
        </Box>
      </form>
      <Typography variant="h5" style={{ textAlign: 'center' }}>
        Lista de Catálogos Trámites
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
        onChange={(e) => setSearchCodigo(e.target.value)}
        className={classes.margin}
        id="input-with-icon-textfield"
        style={{ width: '150px' }}
        label="Buscar por Código:"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
      <TextField
        onChange={(e) => setSearchIdParam(e.target.value)}
        className={classes.margin}
        id="input-with-icon-textfield"
        style={{ width: '180px' }}
        label="Buscar por Categoria:"
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
                <TableCell align="right">TIPO</TableCell>
                <TableCell align="right">ESTADO</TableCell>
                <TableCell align="right">TIPO CATÁLOGO</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>{dataCatalogoT.id || ''}</TableCell>
                <TableCell>{dataCatalogoT.nombre || ''}</TableCell>
                <TableCell>{dataCatalogoT.codigo || ''}</TableCell>
                <TableCell>{dataCatalogoT.tipo || ''}</TableCell>
                <TableCell>{dataCatalogoT.estado || ''}</TableCell>
                <TableCell>{dataCatalogoT.tipoCatalogo || ''}</TableCell>
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
        <Table
          id="myTable"
          sx={{ minWidth: 650 }}
          aria-label="simple table"
          stickyHeader
        >
          <TableHead>
            <TableRow>
              <TableCell className={classes.head}>ID</TableCell>
              <TableCell className={classes.head}>NOMBRE</TableCell>
              <TableCell className={classes.head}>CÓDIGO</TableCell>
              <TableCell className={classes.head}>TIPO</TableCell>
              <TableCell className={classes.head}>ESTADO</TableCell>
              <TableCell className={classes.head}>TIPO CATÁLOGO</TableCell>
              <TableCell className={classes.head}>
                TIPO SOCIETARIO HABILITADO
              </TableCell>
              <TableCell className={classes.head}>
                TIPO TIPO TRAMITE HABILITADO
              </TableCell>
              <TableCell className={classes.head}>VERSIÓN</TableCell>
              <TableCell className={classes.head}>
                REQUIERE REGISTRAR EDITAR SECCION
              </TableCell>
              <TableCell className={classes.head}>REQUIERE PAGO</TableCell>
              <TableCell className={classes.head}>
                REQUIERE PRESENTACION
              </TableCell>
              <TableCell className={classes.head}>REQUIERE REVSION</TableCell>
              <TableCell className={classes.head}>DURACION</TableCell>
              <TableCell className={classes.head}>API</TableCell>
              <TableCell className={classes.head}>RUTA FRONT</TableCell>
              <TableCell className={classes.head}>PRE RUTA FRONT</TableCell>
              <TableCell className={classes.head}>RUTA INICIO FRONT</TableCell>
              <TableCell className={classes.head}>
                REQUIERE MATRICULA VIGENTE
              </TableCell>
              <TableCell className={classes.head}>KARDEX</TableCell>
              <TableCell className={classes.head}>
                METODO OBTENER INFORMACION
              </TableCell>
              <TableCell className={classes.head}>
                METODO VALIDAR DATOS
              </TableCell>
              <TableCell className={classes.head}>
                METODO DESPUES DEL PAGO
              </TableCell>
              <TableCell className={classes.head}>METODO PUBLICAR</TableCell>
              <TableCell className={classes.head}>
                METODO VOLCAR DATOS
              </TableCell>
              <TableCell className={classes.head}>
                METODO GENERAR CERTIFICADO
              </TableCell>
              <TableCell className={classes.head}>CATEGORIA</TableCell>
              <TableCell className={classes.fixColumn}>ACCIÓN</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categoriaTramite.length > 0 ? (
              categoriaTramite
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
                    !searchCodigo ||
                    row.codigo
                      .toString()
                      .toLowerCase()
                      .includes(searchCodigo.toString().toLowerCase()),
                )
                .filter(
                  (row) =>
                    !SearchIdParam ||
                    row.idParametricaCategoria
                      .toString()
                      .toLowerCase()
                      .includes(SearchIdParam.toString().toLowerCase()),
                )
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((caTramite, index) => {
                  const {
                    id,
                    nombre,
                    codigo,
                    estado,
                    tipo,
                    tipoCatalogo,
                    tipoSocietarioHabilitado,
                    tipoTramiteHabilitado,
                    version,
                    requiereRegistrarEditarSeccion,
                    requierePago,
                    requierePresentacion,
                    requiereRevision,
                    duracion,
                    api,
                    rutaFront,
                    preRutaFront,
                    rutaInicioFront,
                    requiereMatriculaVigente,
                    kardex,
                    metodoObtenerInformacion,
                    metodoValidarDatos,
                    metodoDespuesDelPago,
                    metodoVolcarDatos,
                    metodoPublicar,
                    metodoGenerarCertificado,
                    idParametricaCategoria,
                  } = caTramite;
                  return (
                    <TableRow
                      key={id}
                      sx={{ '&:last-child td, &:last-child th': { border: 1 } }}
                      onClick={(event) => handleSelect(event, caTramite)}
                      classes={{
                        selected: selected.c,
                      }}
                      selected={selected.selectedRowId === caTramite.id}
                      // style = {{backgroundColor:selected.selectedRowIs === caTramite.id? 'blue': '#fff'}}
                    >
                      <TableCell align="center">{caTramite.id}</TableCell>
                      <TableCell align="center" style={{ maxHeight: 50 }}>
                        {nombre}
                      </TableCell>
                      <TableCell align="center">{codigo}</TableCell>
                      <TableCell align="center">{tipo}</TableCell>
                      <TableCell align="center">{estado}</TableCell>
                      <TableCell align="center">{tipoCatalogo}</TableCell>
                      <TableCell align="center">
                        {tipoSocietarioHabilitado + ''}
                      </TableCell>
                      <TableCell align="center">
                        {tipoTramiteHabilitado + ''}
                      </TableCell>
                      <TableCell align="center">{version}</TableCell>
                      <TableCell align="center">
                        {requiereRegistrarEditarSeccion ? 'SI' : 'NO'}
                      </TableCell>
                      <TableCell align="center">
                        {requierePago ? 'SI' : 'NO'}
                      </TableCell>
                      <TableCell align="center">
                        {requierePresentacion ? 'SI' : 'NO'}
                      </TableCell>
                      <TableCell align="center">
                        {requiereRevision ? 'SI' : 'NO'}
                      </TableCell>
                      <TableCell align="center">{duracion}</TableCell>
                      <TableCell align="center">{api}</TableCell>
                      <TableCell align="center">{rutaFront}</TableCell>
                      <TableCell align="center">{preRutaFront}</TableCell>
                      <TableCell align="center">{rutaInicioFront}</TableCell>
                      <TableCell align="center">
                        {requiereMatriculaVigente ? 'SI' : 'NO'}
                      </TableCell>
                      <TableCell align="center">
                        {JSON.stringify(kardex)}
                      </TableCell>
                      <TableCell align="center">
                        {metodoObtenerInformacion}
                      </TableCell>
                      <TableCell align="center">{metodoValidarDatos}</TableCell>
                      <TableCell align="center">
                        {metodoDespuesDelPago}
                      </TableCell>
                      <TableCell align="center">{metodoPublicar}</TableCell>
                      <TableCell align="center">{metodoVolcarDatos}</TableCell>
                      <TableCell align="center">
                        {metodoGenerarCertificado}
                      </TableCell>
                      <TableCell align="center">
                        {idParametricaCategoria}
                      </TableCell>
                      <TableCell align="center" className={classes.fixColumn}>
                        <Tooltip placement="bottom" title="Visualizar registro">
                          <IconButton
                            className={classes.paddingButton}
                            onClick={() => viewDetail(caTramite)}
                          >
                            <ViewHeadline className={classes.delete} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip placement="bottom" title="Editar registro">
                          <IconButton
                            className={classes.paddingButton}
                            onClick={() => editItem(caTramite)}
                          >
                            <Edit className={classes.success} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip placement="bottom" title="Eliminar registro">
                          <IconButton
                            className={classes.paddingButton}
                            onClick={() => handleClickOpenD(caTramite)}
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
        count={categoriaTramite.length}
        rowsPerPage={rowsPerPage}
        style={{ color: '#747373' }}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage={<b>Filas por página</b>}
      />
      <DialogCatalogoTramite open={open} close={handleClose} data={datos} />
    </Fragment>
  );
};

export default CatalogoTramites;
