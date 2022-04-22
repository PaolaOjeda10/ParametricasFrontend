import React from 'react';
import * as AiIcons from "react-icons/ai";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

export const SideBarData = [

      {
        title: "Inicio",
        path: "/Inicio",
        icon: <AiIcons.AiFillHome style={{color:'white'}} />,
      },
      {
        title: "Categorías",
        path: "/Categorias",
        icon: <AiIcons.AiFillGolden style={{color:'white'}}  />,
      },
      {
        title: "Catálogos Trámites",
        path: "/CatalogoTInicio",
        icon: <AiIcons.AiOutlineFileDone style={{color:'white'}}  />,
      },
      {
        title: "Cerrar Sesión",
        path: "",
        icon: <ExitToAppIcon style={{color:'white'}}/>,
        iconClosed: <ArrowDropDownIcon style={{color:'black'}} />,
        iconOpened: <ArrowDropUpIcon style={{color:'black'}} />,
       subnav: [
         {
            title: "",
            path: "#",
            icon: <ExitToAppIcon />,
         },
        ],
      },
];
