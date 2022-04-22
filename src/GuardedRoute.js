import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Categorias from './components/Categorias';
import Inicio from './components/Inicio';
import CatalogoTInicio from './components/CatalogoTInicio';
import ParPublicaciones from './components/ParPublicaciones';
import Camposs from './components/Camposs';
import Secciones from './components/Secciones';
import Grupos from './components/Grupos';
import DocumentosEmitidos from './components/DocumentosEmitidos';
import Aranceles from './components/Aranceles';
import CatalogoTramites from './components/CatalogoTramites';
import GrupoTabs from './components/GrupoTabs';
import Login from './components/Login/Login';
import AppNavbar from '../src/layout/AppNavbar';
import useToken from './useToken';

// const ProtectedRoute = ({
//     user,
//     redirectPath = '/',
//     children,
//   }) => {
//     if (!user) {
//       return <Navigate to={redirectPath} replace />;
//     }

//     return children;
//   };

const GuardedRoute = () => {
  const { token, setToken } = useToken();

  if (!token) {
    return <Login setToken={setToken} token={token} />;
  }

  return (
    <>      
      <AppNavbar />
      <Routes>
        <Route exact path="/" element={<Inicio />} />
        <Route exact path="/Inicio" element={<Inicio />} />
        <Route exact path="/Categorias" element={<Categorias />} />
        <Route exact path="/CatalogoTInicio" element={<CatalogoTInicio />} />
        <Route exact path="/CatalogoTramites" element={<CatalogoTramites />} />
        <Route exact path="/ParPublicaciones" element={<ParPublicaciones />} />
        <Route exact path="/Camposs" element={<Camposs />} />
        <Route exact path="/Secciones" element={<Secciones />} />
        <Route exact path="/Grupos" element={<Grupos />} />
        <Route exact path="/GrupoTabs" element={<GrupoTabs />} />
        <Route
          exact
          path="/DocumentosEmitidos"
          element={<DocumentosEmitidos />}
        />
        <Route exact path="/Aranceles" element={<Aranceles />} />
        {/* <Route exact path="/AppNavbar" element={<AppNavbar />} /> */}
      </Routes>
    </>
  );
};

export default GuardedRoute;
