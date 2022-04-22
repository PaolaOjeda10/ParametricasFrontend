const initialState = {
  Message: {
    show: false,
    message: null,
    theme: null,
    timeout: 5000,
  },
  Confirm: {
    show: false,
    text: null,
    width: null,
    textOk: null,
    textCancel: null,
    callbackOk: () => {},
    callbackCancel: () => {},
  },
};
const initialAuthState = {
  token : null,
  user: {
    idUsuario: null,
    nombre: null,
  },
};

const OPEN_MESSAGE_SUCCESS = "OPEN_MESSAGE_SUCCESS";
const OPEN_MESSAGE_INFO = "OPEN_MESSAGE_INFO";
const OPEN_MESSAGE_WARNING = "OPEN_MESSAGE_WARNING";
const OPEN_MESSAGE_ERROR = "OPEN_MESSAGE_ERROR";
const CLOSE_MESSAGE = "CLOSE_MESSAGE";

const OPEN_CONFIRM = "OPEN_CONFIRM";
const CLOSE_CONFIRM = "CLOSE_CONFIRM";

const OPEN_SESSION = "OPEN_SESSION";
const CLOSE_SESSION = "CLOSE_SESSION";

export const reducerAuth = (state = initialAuthState, action) => {
  switch (action.type) {
    case OPEN_SESSION:
      return {
        ...state,
        token:action.payload.token,
        user: action.payload.user,
      };
    case CLOSE_SESSION:
      return {
        ...state,
        token:action.payload.token,
        user: action.payload.user,
      };
    
    default:
      return state;
  }
};
export const reducerMessage = (state = initialState, action) => {
  switch (action.type) {
    case CLOSE_MESSAGE:
      return {
        ...state,
        Message: {
          ...state.Message,
          show: action.payload,
        },
      };
    case OPEN_MESSAGE_SUCCESS:
      return {
        ...state,
        Message: {
          ...state.Message,
          show: true,
          message: action.payload.message,
          theme: action.payload.theme,
        },
      };
    case OPEN_MESSAGE_INFO:
      return {
        ...state,
        Message: {
          ...state.Message,
          show: true,
          message: action.payload.message,
          theme: action.payload.theme,
        },
      };
    case OPEN_MESSAGE_WARNING:
      return {
        ...state,
        Message: {
          ...state.Message,
          show: true,
          message: action.payload.message,
          theme: action.payload.theme,
        },
      };
    case OPEN_MESSAGE_ERROR:
      return {
        ...state,
        Message: {
          ...state.Message,
          show: true,
          message: action.payload.message,
          theme: action.payload.theme,
        },
      };
    case OPEN_CONFIRM: {
      return {
        ...state,
        Confirm: {
          ...state.Confirm,
          show: true,
          text: action.payload.text,
          width: action.payload.width,
          textOk: action.payload.textOk,
          textCancel: action.payload.textCancel,
          callbackOk: action.payload.callbackOk,
          callbackCancel: action.payload.callbackCancel,
        },
      };
    }
    case CLOSE_CONFIRM: {
      return {
        ...state,
        Confirm: {
          ...state.Confirm,
          show: false,
        },
      };
    }
    default:
      return state;
  }
};
export const openConfirm = (
  text = "Mensaje...",
  callbackOk = null,
  callbackCancel = null,
  textOk = "Aceptar",
  textCancel = "Cancelar",
  width = 360
) => ({
  type: OPEN_CONFIRM,
  payload: {
    text,
    callbackOk: typeof callbackOk === "function" ? callbackOk : null,
    callbackCancel:
      typeof callbackCancel === "function" ? callbackCancel : null,
    textOk,
    textCancel,
    width,
  },
});

export const closeConfirm = () => ({
  type: CLOSE_CONFIRM,
});
export const AbrirSesion = (token, user) => ({
  type: OPEN_MESSAGE_SUCCESS,
  payload: {
    token,
    user,
  },
});
export const CerrarSesion = () => ({
  type: OPEN_MESSAGE_SUCCESS,
  payload: {
    token:null,
    user:null,
  },
});
export const MessageSuccess = (message, theme = "success") => ({
  type: OPEN_MESSAGE_SUCCESS,
  payload: {
    message,
    theme,
  },
});
export const MessageInfo = (message, theme = "info") => ({
  type: OPEN_MESSAGE_INFO,
  payload: {
    message,
    theme,
  },
});
export const MessageWarning = (message, theme = "warning") => ({
  type: OPEN_MESSAGE_WARNING,
  payload: {
    message,
    theme,
  },
});
export const MessageError = (message, theme = "error") => ({
  type: OPEN_MESSAGE_ERROR,
  payload: {
    message,
    theme,
  },
});
export const closeMessage = () => ({
  type: CLOSE_MESSAGE,
  payoad: false,
});
