import React from 'react';
import { useRoutes } from 'react-router-dom';
import Login from '../components/Login/Login';
import Categorias from '../components/Categorias';
import Inicio from '../components/Inicio';
import CatalogoTInicio from '../components/CatalogoTInicio';
import ErrorPage from "../components/ErrorPage";

const App = () => {
  const routes = useRoutes([
    {
      path: '/login',
      element: <Login />,
    },
    {
      path: '/',
      element: <Inicio />,
    },
    {
      path: '/Inicio',
      element: <Inicio />,
    },
    {
      path: '/Categorias',
      element: <Categorias />,
    },
    {
      path: '/CatalogoTInicio',
      element: <CatalogoTInicio />,
    },
    {
      path:'/*',
      element: <ErrorPage />,
    }
  ]);
  return routes;
};

export default App;
