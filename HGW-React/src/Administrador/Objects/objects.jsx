import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import LogoutIcon from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/Home'
import CategoryIcon from '@mui/icons-material/Category'
import Inventory2Icon from '@mui/icons-material/Inventory2'
import PeopleIcon from '@mui/icons-material/People'
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import SettingsIcon from '@mui/icons-material/Settings';
import { Title } from '@mui/icons-material';
import { useMemo } from 'react';

export const objeto = [
    {id: 1, value: "Categorias", icon: <CategoryIcon />, colorText: "white", childs: [
        {id: 2, value: "Crear", icon: <></>, colorText: "white", click: "/Administrador/Categorias/Crear" },
        {id: 3, value: "Ver Lista", icon: <></>, colorText: "white", click: "/Administrador/Categorias/Lista" },
        {id: 30, value: "Subcategorias", icon: <></>, colorText: "white", childs: [
          {id: 31, value: "Crear", icon: <></>, colorText: "white", click: "/Administrador/Categorias/Subcategorias/Crear" },
          {id: 32, value: "Ver Lista", icon: <></>, colorText: "white", click: "/Administrador/Categorias/Subcategorias/Lista" },
        ]},
    ]},
    {id: 4, value: "Productos", icon: <Inventory2Icon />, colorText: "white", childs: [
        {id: 5, value: "Crear", icon: <></>, colorText: "white", click: "/Administrador/Productos/Crear" },
        {id: 6, value: "Ver Lista", icon: <></>, colorText: "white", click: "/Administrador/Productos/Lista" },
      ]
    },
    {id: 7, value: "Usuarios", icon: <PeopleIcon />, colorText: "white", childs: [
        {id: 8, value: "Crear", icon: <></>, colorText: "white", click: "/Administrador/Usuarios/Crear" },
        {id: 9, value: "Ver Lista", icon: <></>, colorText: "white", click: "/Administrador/Usuarios/Lista" },
      ]
    },
    {id: 10, value: "Membresias", icon: <CardMembershipIcon />, colorText: "white", childs: [
        {id: 11, value: "Crear", icon: <></>, colorText: "white", click: "/Administrador/Membresias/Crear" },
        {id: 12, value: "Ver Lista", icon: <></>, colorText: "white", click: "/Administrador/Membresias/Lista" },
      ]
    },
    {id: 13, value: "Bonos", icon: <CardGiftcardIcon />, colorText: "white", childs: [
        {id: 14, value: "Crear", icon: <></>, colorText: "white", click: "/Administrador/Bonos/Crear" },
        {id: 15, value: "Ver Lista", icon: <></>, colorText: "white", click: "/Administrador/Bonos/Lista" },
      ]
    },
    {
      id: 16, value: "Modulos", icon: <SettingsIcon />, colorText: "white", childs: [
        {id: 17, value: "Crear", icon: <></>, colorText: "white", click: "/Administrador/GestionVistas/Crear" },
        {id: 18, value: "Editar", icon: <></>, colorText: "white", click: "/Administrador/Bonos/Lista" },
      ]
    }
  ];
export const objectSpeedDial = [
    {arialLabel: "Cerrar Sesion", icon: <LogoutIcon />, rute: "/"},
    {arialLabel: "Home", icon: <HomeIcon />, rute: "/"},
]