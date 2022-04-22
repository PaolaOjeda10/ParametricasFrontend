import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { SideBarData } from './SideBarData';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Submenu from './Submenu';
import { IconContext } from 'react-icons/lib';
import {
  createTheme,
  IconButton,
  Menu,
  MenuItem,
  ThemeProvider,
} from '@material-ui/core';

import { NavLink } from 'react-router-dom';

import './NavBar.css';
import { DrawContext } from '../Context/drawer/DrawContext';
import { shallowEqual, useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setLogin } from '../redux/userReducer';
import Storage from '../plugins/Storage';

const NavIcon = styled(Link)`
  margin-left: 2rem;
  font-size: 2rem;
  height: 80px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  color=white
`;

const SidebarNav = styled.nav`
  background: #15171c;
  width: 250px;
  height: 100vh;
  display: flex;
  justify-content: center;
  position: fixed;
  top: 0;
  left: ${({ sidebar }) => (sidebar ? '0' : '-100%')};
  transition: 350ms;
  z-index: 10;
`;

const SidebarWrap = styled.div`
  width: 100%;
`;

const mdTheme = createTheme();
const Sidebar = () => {
  const [sidebar, setSidebar] = useState(false);
  // const showSidebar = () => setSidebar(!sidebar);
  const showSidebar = () => {
    setSidebar(!sidebar);
    setOpenT(!openT);
    const mt = openT ? 280 : 200;
    setDraw({ marginLeft: mt });
  };
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loggedIn } = useSelector(
    (state) => ({
      loggedIn: state.user.loggedIn,
    }),
    shallowEqual,
  );
  const { setDraw } = React.useContext(DrawContext);
  const [openT, setOpenT] = React.useState(true);
  const [click, setClick] = React.useState(false);
  const handleClick = () => setClick(!click);

  const [click2, setClick2] = React.useState(true);
  // eslint-disable-next-line no-unused-vars
  const handleClick2 = () => setClick2(!click2);

  const Close = () => setClick(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    loggedIn && (
      <>
        <ThemeProvider theme={mdTheme}>
          <IconContext.Provider value={{ color: '#fff' }}>
            <div>
              <div
                className={click ? 'main-container' : ''}
                onClick={() => Close()}
              />
              <nav className="navbar" onClick={(e) => e.stopPropagation()}>
                <div className="nav-container">
                  <h1 className="nav-logo">Paramétricas</h1>
                  <ul className={click ? 'nav-menu active' : 'nav-menu'}>
                    <li className="nav-item">
                      <NavLink
                        exact="true"
                        to="/Inicio"
                        activeclassname="active"
                        className="nav-links"
                        onClick={click ? handleClick : null}
                      >
                        Inicio
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink
                        exact="true"
                        to="/Categorias"
                        activeclassname="active"
                        className="nav-links"
                        onClick={click ? handleClick : null}
                      >
                        Categorias
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink
                        exact="true"
                        to="/CatalogoTInicio"
                        activeclassname="active"
                        className="nav-links"
                        onClick={click ? handleClick : null}
                      >
                        Catálogo trámites
                      </NavLink>
                    </li>
                    <li style={{ marginTop: '40px' }}>
                      <IconButton
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleMenu}
                        style={{ color: 'white', fontSize: 'Large' }}
                      >
                        <ExitToAppIcon style={{ fontSize: '2rem' }} />
                      </IconButton>
                      <Menu
                        id="menu-appbar"
                        anchorEl={anchorEl}
                        anchorOrigin={{
                          vertical: 'top',
                          horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                          vertical: 'top',
                          horizontal: 'right',
                        }}
                        open={open}
                        onClose={handleClose}
                      >
                        <MenuItem
                          onClick={() => {
                            window.localStorage.removeItem('token');
                            window.localStorage.removeItem('usuario');
                            // window.location.reload();
                            Storage.removeAll();
                            dispatch(setLogin(false));
                            setAnchorEl(false);
                            navigate('/login');
                          }}
                        >
                          Cerrar Sesión
                        </MenuItem>
                      </Menu>
                    </li>
                  </ul>
                  <div className="nav-icon" onClick={showSidebar}>
                    <i className={click ? 'fa fa-times' : 'fa fa-bars'}>
                      {' '}
                      <FaIcons.FaBars />
                    </i>
                    {/* <i  onClick={() => {
                        window.localStorage.removeItem('token');
                        window.localStorage.removeItem('usuario');
                        window.location.reload();
                      }}> <ExitToAppIcon /></i> */}
                  </div>
                </div>
              </nav>
              <SidebarNav
                sidebar={sidebar}
                onClick={click2 ? showSidebar : null}
              >
                <SidebarWrap>
                  <NavIcon to="#">
                    <AiIcons.AiOutlineClose onClick={showSidebar} />
                  </NavIcon>
                  {SideBarData.map((item, index) => {
                    return <Submenu item={item} key={index} />;
                  })}
                </SidebarWrap>
              </SidebarNav>
            </div>
          </IconContext.Provider>
        </ThemeProvider>
      </>
    )
  );
};

export default Sidebar;
