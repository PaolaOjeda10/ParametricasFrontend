import axios from 'axios';
import { MessageError } from '../redux/reducer';
import Storage from '../plugins/Storage';
import store from '../redux/store';
import router from '../plugins/history';
import { setLogin } from '../redux/userReducer';
const urlBase = process.env.REACT_APP_API_URL;
const authToken = process.env.REACT_APP_AUTH_TOKEN || 'Bearer';
axios.default.withCredentials = true;
const instance = axios.create({
  withCredentials: true,
});
// const responseBody = (response) => response.data;
const getUrl = (url) => urlBase + url;
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log('Reponse error', error);
    if (error.response) {
      if (error.response.status === 400) {
        store.dispatch(MessageError('x'));
      }
      if (error.response?.status === 401) {
        if (window.location.pathname !== '/login') {
          Storage.removeAll();
          store.dispatch(MessageError('Su sesión ha terminado.'));
          store.dispatch(setLogin(false));
          // router.push('/login');
          window.location.reload();
          return;
        }
      }
    }
    error.response.data.isOK = false;
    if (error?.response?.data?.datos?.errores.length > 0) {
      const { errores } = error.response.data.datos;
      let listErrors = '<ul>';
      for (const msjError of errores) {
        listErrors += `<li>${msjError}</li>`;
      }
      listErrors += '</ul>';
      error.response.data.mensaje += listErrors;
    }
    return error.response;
  },
);
const expiredToken = (ttl, t) => {
  const actualDate = Math.round(new Date().getTime() / 1000);
  return actualDate - t > ttl;
};
instance.interceptors.request.use(
  function (config) {
    if (expiredToken(Storage.get('ttl'), Storage.get('t'))) {
      console.info('El token expiró');
      router.push('/login');
    }
    return config;
  },
  function (error) {
    console.log('request error', error);
    return Promise.reject(error);
  },
);
const filterResponse = (response) => {
  if (!response.hasOwnProperty('isOK')) response.isOK = true;
  return response;
};
const _http = (method, url, data) => {
  url = getUrl(url, data);
  if (
    process.env.REACT_APP_DEBUG_MODE &&
    process.env.NODE_ENV === 'development'
  ) {
    console.info('URL:', method.toUpperCase(), url);
  }
  const setting = {
    method,
    url,
  };
  if (typeof data === 'object' && Object.keys(data).length) {
    setting.data = data;
  }
  if (Storage.exist('token')) {
    setting.headers = {
      Authorization: `${authToken} ${Storage.get('token')}`,
    };
  } else {
    router.push('/login');
  }

  return instance(setting)
    .then((response) => filterResponse(response.data))
    .catch((error) => handlingErrors(error));
};
const handlingErrors = (error) => {
  if (error.response) {
    const { data } = error.response;
    if (data?.datos?.errores?.length > 0) {
      let errores = '<ul>';
      for (const msjError of data.datos.errores) {
        errores += `<li>${msjError}</li>`;
      }
      errores += '</ul>';
      data.mensaje = `${data.mensaje} ${errores}`;
    }
    throw data;
  } else if (error.message) {
    if (error.message === 'Network Error') {
      console.error('Network Error');
    } else {
      console.error(error.message);
    }
  } else {
    console.error('Network Error');
  }
};
export const Services = {
  get(url, id) {
    return _http('get', url, id);
  },

  post(url, data) {
    return _http('post', url, data);
  },

  put(url, data) {
    return _http('put', url, data);
  },

  patch(url, data) {
    return _http('patch', url, data);
  },

  // delete(url, id) {
  //   return _http('delete', url, id);
  // },

  // remove(url, id) {
  //   return this.delete(url, id);
  // },

  // save(url, data) {
  //   return _http(data.id ? 'put' : 'post', url, data);
  // },
};
// const requests = {
//   get: (url) => instance.get(url).then(responseBody),
//   post: (url, body) => instance.post(url, body).then(responseBody),
//   put: (url, state) => instance.put(url, state).then(responseBody),
//   patch: (url, body) => instance.patch(url, body).then(responseBody),
// };

export const Api = {
  //login
  //  getAutenticar: () => requests.get('parametrica'),
  auth: (data) => Services.post('authentication/login', data),
  //Catalogo
  getCatalogo: () => Services.get('parametrica'),
  addCatalogo: (data) => Services.post('parametrica/add', data),
  updateCatalogo: (data) => Services.patch('parametrica/updateCatalogo', data),
  eliminarCatalogo: (id) => Services.post('parametrica/deleteCatalogo', id),
  // eliminarCatalogo: (data) => Services.post('parametrica/deleteCatalogo', data),
  getCatalogoId: (id) => Services.post('parametrica/getCatalogoId', id),
  //Catalogo Tramite
  getCatalogoTramite: () => Services.get('catalogo-tramites/catTramite'),
  addCatalogoTramite: (data) =>
    Services.post('catalogo-tramites/addCatTramite', data),
  updateCatalogoTramite: (data) =>
    Services.patch('catalogo-tramites/updateCatalogoTramite', data),
  eliminarCatalogoTramite: (id) =>
    Services.post('catalogo-tramites/deleteCatalogoTramite', id),
  getTramiteId: (id) => Services.post('catalogo-tramites/getTramiteId', id),
  //Aranceles
  getArancel: () => Services.get('aranceles/getArancel'),
  listarArancelCatalogoTramite: (data) =>
    Services.post('aranceles/listarArancelIdCatTramite', data),
  addArancel: (data) => Services.post('aranceles/addArancel', data),
  updateArancel: (data) => Services.patch('aranceles/updateArancel', data),
  eliminarArancel: (id) => Services.post('aranceles/deleteArancel', id),
  getArancelId: (id) => Services.post('aranceles/getArancelId', id),
  //Grupo
  getGrupo: () => Services.get('grupos/getGrupo'),
  addGrupo: (data) => Services.post('grupos/addGrupo', data),
  listarGrupo: (data) => Services.post('grupos/listarGrupo', data),
  updateGrupo: (data) => Services.patch('grupos/updateGrupo', data),
  eliminarGrupo: (id) => Services.post('grupos/deleteGrupo', id),
  getGrupoId: (id) => Services.post('grupos/getGrupoId', id),
  //Seccion
  getSeccion: () => Services.get('secciones/getSeccion'),
  addSeccion: (data) => Services.post('secciones/addSeccion', data),
  listarSecciones: (data) => Services.post('secciones/listarSecciones', data),
  updateSeccion: (data) => Services.patch('secciones/updateSeccion', data),
  elimnarSeccion: (id) => Services.post('secciones/deleteSeccion', id),
  getSeccionId: (id) => Services.post('secciones/getSeccionId', id),
  //Campos
  getCampo: () => Services.get('campos/getCampo'),
  addCampo: (data) => Services.post('campos/addCampo', data),
  listarCampo: (data) => Services.post('campos/listarCampo', data),
  updateCampo: (data) => Services.patch('campos/updateCampo', data),
  eliminarCampo: (id) => Services.post('campos/deleteCampo', id),
  getCampoId: (id) => Services.post('campos/getCampoId', id),
  //Documento Emitido
  getDocumento: () => Services.get('documentos-emitidos/getDocumentosEmitidos'),
  addDocumento: (data) =>
    Services.post('documentos-emitidos/addDocumentoEmitido', data),
  listarDocumentos: (data) =>
    Services.post('documentos-emitidos/listarDocumentos', data),
  updateDocumento: (data) =>
    Services.patch('documentos-emitidos/updateDocumentoEmitido', data),
  eliminarDocumento: (id) =>
    Services.post('documentos-emitidos/deleteDocumentoEmitido', id),
  getDocumentoId: (id) =>
    Services.post('documentos-emitidos/getDocumentoId', id),
  //Par Publicacion
  getParPublicacion: () =>
    Services.get('par-publicaciones/getParPublicaciones'),
  addParPublicacion: (data) =>
    Services.post('par-publicaciones/addPublicacion', data),
  listarPublicaciones: (data) =>
    Services.post('par-publicaciones/listarPublicaciones', data),
  updateParPublicacion: (data) =>
    Services.patch('par-publicaciones/updatePublicacion', data),
  eliminarParPublicacion: (id) =>
    Services.post('par-publicaciones/deletePublicacion', id),
  getParPublicacionId: (id) =>
    Services.post('par-publicaciones/getPublicacionId', id),
  //GET DATA
  getAllData: () => Services.get('catalogo-tramites/getDataCatalogoTramite'),
  //generar csv
  generarCsv: () => Services.get('parametrica/generarCSV'),
};
