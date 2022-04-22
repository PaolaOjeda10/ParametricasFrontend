const initialState = {
  loggedIn: false,
};
const LOGIN = 'LOGIN';

export const reducerUser = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        loggedIn: action.payload.loggedIn,
      };

    default:
      return state;
  }
};

export const setLogin = (loggedIn) => ({
  type: LOGIN,
  payload: {
    loggedIn,
  },
});
