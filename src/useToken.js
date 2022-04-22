import { useState } from 'react';

export default function useToken() {
  const getToken = () => {
    return JSON.parse(window.localStorage.getItem('token'));
  };

  const [token, setToken] = useState(getToken());

  const saveToken = userToken => {
    window.localStorage.setItem('token', JSON.stringify(userToken));
    setToken(userToken);

  };

  return {
    setToken: saveToken,
    token
  }
}