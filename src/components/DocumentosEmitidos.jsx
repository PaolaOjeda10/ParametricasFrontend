import React, { useEffect, useState } from 'react';
import {
  Button,
  FormControl,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
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
import { Delete, Edit } from '@material-ui/icons';
import { useForm } from '../hooks/index';
import { Api } from '../service/api';
import SearchIcon from '@material-ui/icons/Search';
import { useDispatch } from 'react-redux';
import { MessageSuccess, MessageWarning } from '../redux/reducer';
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: '100%',
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
  },
  fixColumn: {
    position: 'sticky',
    right: 0,
    minWidth: '146px',
    textAlign:'center',
    backgroundColor:'#a39e9e',
    fontWeight: 'bold',
  },
  head:{
    textAlign:'center',
    fontWeight: 'bold',
    // backgroundColor: '#bbbaba',
  }
}));
const DocumentosEmitidos = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const form = useForm({
    nombre: null,
    plantilla: null,
    estado: null,
  });
  const [formnull, setFormnull] = useState({
    tipo: null,
    usoQr: null,
  });
  const [editorjson, setEditorjson] = useState({});
  const [catal, setCatal] = useState([]);
  const [documentos, setDocumentos] = useState([]);
  const getDocumentos = async () => {
    await Api.getDocumento()
      .then((data) => {
        if (data && data.finalizado) {
          return setDocumentos(data.datos);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getCatalogoTramite = async () => {
    try {
      await Api.getCatalogoTramite()
        .then((data) => {
          if (data && data.finalizado) {
            return setCatal(data.datos);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  };
  const listarDocumentosEmitidos = async () => {
    const d = JSON.parse(window.localStorage.getItem('tramite'));
    await Api.listarDocumentos({ idCatalogoTramite: d.id })
      .then((resp) => {
        if (resp && resp.finalizado) {
          return setDocumentos(resp.datos);
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
  const [catalogoT, setCatalogoT] = useState();
  const submitDocumento = async (event) => {
    event.preventDefault();
    if (!editorjson) {
      return dispatch(MessageWarning('Debe ingresar usoQr'));
    }
    const d = JSON.parse(window.localStorage.getItem('tramite'));
    try {
      if (Object.values(form.errors).includes(true)) {
        form.setTouched();
      } else {
        const data = {
          nombre: form.values.nombre,
          tipo: formnull.tipo,
          plantilla: form.values.plantilla,
          usoQr: await editorjson,
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
          });
          valAct.id = idc;
          const al = valAct['idCatalogoTramite'];
          if (al.valorActual.id === al.valorAnterior) {
            delete valAct.idCatalogoTramite;
          } else {
            valAct['idCatalogoTramite'].valorActual = al.valorActual.id;
          }
          const formulario = {
            tabla: 'documentos_emitidos',
            matricula: '',
            idRegistro: idc,
            cambio: valAct,
            cambios: changes,
          };
          const body = {
            id: idc,
            documento: data,
            formulario: formulario,
          };
          await Api.updateDocumento(body)
            .then((resp) => {
              if (resp && resp.finalizado) {
                setCatalogoT('');
                return dispatch(MessageSuccess(resp.mensaje));
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
        if (action === 'add') {
          const formulario = {
            tabla: 'documentos_emitidos',
            matricula: '',
            idRegistro: '',
            cambio: data,
            cambios: {},
          };
          const body = {
            documento: data,
            formulario: formulario,
          };
          await Api.addDocumento(body)
            .then((resp) => {
              if (resp && resp.finalizado) {
                return dispatch(MessageSuccess(resp.mensaje));
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
        if (d) {
          listarDocumentosEmitidos();
        } else {
          getDocumentos();
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
  const [dataDoc, setdataDoc] = React.useState({});
  const handleClickOpenD = (data) => {
    const nuevo = { ...data };
    nuevo.usoQr = JSON.stringify(nuevo.usoQr);
    setdataDoc({ ...nuevo });
    setOpenD(true);
  };
  const handleCloseD = () => {
    setOpenD(false);
  };
  const deleteItem = async () => {
    const d = JSON.parse(window.localStorage.getItem('tramite'));
    const val = {
      estado: {
        valorAnterior: dataDoc.estado,
        valorActual: 'INACTIVO',
      },
    };
    const cambio = {
      id: dataDoc.id,
      estado: 'INACTIVO',
    };
    const data = {
      tabla: 'documentos_emitidos',
      idRegistro: dataDoc,
      cambio: val,
      cambios: cambio,
    };
    const req = { id: dataDoc.id, formulario: data };
    await Api.eliminarDocumento(req)
      .then((resp) => {
        dispatch(MessageSuccess(resp.mensaje));
        setOpenD(false);
      })
      .catch((err) => {
        console.log(err);
      });
    if (d) {
      listarDocumentosEmitidos();
    } else {
      getDocumentos();
    }
  };
  const [anterior, setAnterior] = useState({
    nombre: null,
    tipo: null,
    plantilla: null,
    usoQr: null,
    estado: null,
    idCatalogoTramite: null,
  });
  const editItem = (rows) => {
    const data = {
      nombre: rows.nombre,
      plantilla: rows.plantilla,
      estado: rows.estado,
      catalogoTramite: rows.catalogoTramite,
    };
    setAnterior({
      nombre: rows.nombre,
      tipo: rows.tipo,
      plantilla: rows.plantilla,
      usoQr: rows.usoQr,
      estado: rows.estado,
      idCatalogoTramite: rows.idCatalogoTramite,
    });
    const obj = catal.filter((f) => f.id === rows.idCatalogoTramite);
    setEditorjson(rows.usoQr);
    setValue(obj[0]);
    setCatalogoT(obj[0]);
    setId(rows.id);
    setFormnull({
      tipo: rows.tipo,
      usoQr: rows.usoQr,
    });
    form.reset();
    form.setValues(data);
    setAction('edit');
  };
  const resetVariables = () => {
    setEditorjson({});
    form.reset();
    setAction('add');
    setValue('');
    setFormnull({
      tipo: '',
    });
    const d = window.localStorage.getItem('tramite');
    if (!d) {
      setCatalogoT('');
    } else {
      setCatalogoT(JSON.parse(d));
    }
  };
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
    // getDocumentos();
    if (d) {
      listarDocumentosEmitidos();
    } else {
      getDocumentos();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [searchNombre, setSearchNombre] = React.useState('');
  const [searchId, setSearchId] = React.useState('');

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  // eslint-disable-next-line
  const [value, setValue] = React.useState([]);
  const onChangeEditJson = (v) => {
    if (!v.error) {
      setEditorjson(v.jsObject);
    }
  };
  return (
    <Grid style={{ height: '60%', width: '100%', marginBottom: '20px' }}>
      {catalogoT ? (
        <>
          <Typography variant="h5" style={{ textAlign: 'center' }}>
            {'Tramite: ' + catalogoT.nombre || ''}
          </Typography>
          <form action="" onSubmit={submitDocumento}>
            <Grid container spacing={1} alignItems="center">
              <Grid item md={6} xs={12} sm={6} lg={6} xl={6}>
                <TextField
                  fullWidth
                  className={classes.formControl}
                  value={form.values.nombre}
                  onChange={form.addValue}
                  error={form.errors.nombre && form.touched.nombre}
                  helperText={
                    form.errors.nombre && form.touched.nombre
                      ? 'El campo no puede estar vacio'
                      : ''
                  }
                  autoFocus
                  label="Nombre"
                  color="primary"
                  name="nombre"
                  variant="outlined"
                  id="nombre"
                />
              </Grid>
              <Grid item md={6} xs={12} sm={6} lg={6} xl={6}>
                <TextField
                  fullWidth
                  className={classes.formControl}
                  value={formnull.tipo || ''}
                  onChange={(e) =>
                    setFormnull({ ...formnull, tipo: e.target.value })
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
                  value={form.values.plantilla}
                  onChange={form.addValue}
                  error={form.errors.plantilla && form.touched.plantilla}
                  helperText={
                    form.errors.plantilla && form.touched.plantilla
                      ? 'El campo no puede estar vacio'
                      : ''
                  }
                  fullWidth
                  label="Plantilla"
                  color="primary"
                  name="plantilla"
                  variant="outlined"
                  id="plantilla"
                />
              </Grid>
              <Grid style={{marginTop:'4px', paddingRight:'10px'}} item md={6} xs={12} sm={6} lg={6} xl={6}>
              <FormControl
                  variant="outlined"
                  className={classes.formControl}
                  error={form.errors.estado && form.touched.estado}
                >
                  <InputLabel id="demo-simple-select-outlined-label" style={{ marginTop: 'auto' }}>
                    Estado
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined-label"
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
              <label>UsoQr</label>
                <JSONInput
                  id="usoQr"
                  name="usoQr"
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
              <Grid item md={6} xs={12} sm={6} lg={6} xl={6}>
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
                  DOCUMENTO
                </Button>
              </Grid>
            </Grid>
          </form>{' '}
        </>
      ) : (
        <h5>Trámite no seleccionado</h5>
      )}
      <Typography variant="h5" style={{ textAlign: 'center' }}>
        Lista de Documentos emitidos
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
        style={{ maxwidth: '100%' }}
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
                <TableCell >ID</TableCell>
                <TableCell align="right">NOMBRE</TableCell>
                <TableCell align="right">TIPO</TableCell>
                <TableCell align="right">PLANTILLA</TableCell>
                <TableCell align="right">USO QR</TableCell>
                <TableCell align="right">ESTADO</TableCell>
                <TableCell align="right">CATÁLOGO TRÁMITE</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>{dataDoc.id || ''}</TableCell>
                <TableCell>{dataDoc.nombre || ''}</TableCell>
                <TableCell>{dataDoc.tipo || ''}</TableCell>
                <TableCell>{dataDoc.plantilla || ''}</TableCell>
                <TableCell>{dataDoc.usoQr || ''}</TableCell>
                <TableCell>{dataDoc.estado || ''}</TableCell>
                <TableCell>{dataDoc.idCatalogoTramite || ''}</TableCell>
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
              <TableCell className={classes.head}>TIPO</TableCell>
              <TableCell className={classes.head}>PLANTILLA</TableCell>
              <TableCell className={classes.head}>USO QR</TableCell>
              <TableCell className={classes.head}>ESTADO</TableCell>
              <TableCell className={classes.head}>CATÁLOGO TRÁMITE</TableCell>
              <TableCell className={classes.fixColumn}>
                ACCIÓN
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {documentos.length > 0 ? (
              documentos
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
                .map((documento) => {
                  const {
                    id,
                    nombre,
                    tipo,
                    plantilla,
                    usoQr,
                    estado,
                    idCatalogoTramite,
                  } = documento;
                  return (
                    <TableRow
                      key={id}
                      sx={{ '&:last-child td, &:last-child th': { border: 1 } }}
                    >
                      <TableCell align="center">{id}</TableCell>
                      <TableCell align="center">{nombre}</TableCell>
                      <TableCell align="center">{tipo}</TableCell>
                      <TableCell align="center">{plantilla}</TableCell>
                      <TableCell align="center">
                        {JSON.stringify(usoQr)}
                      </TableCell>
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
                            onClick={() => editItem(documento)}
                          >
                            <Edit className={classes.success} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip placement="bottom" title="Eliminar registro">
                          <IconButton
                            className={classes.paddingButton}
                            onClick={() => handleClickOpenD(documento)}
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
        count={documentos.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Grid>
  );
};

export default DocumentosEmitidos;
