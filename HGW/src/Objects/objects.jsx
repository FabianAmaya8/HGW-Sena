import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import LogoutIcon from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/Home'
import CategoryIcon from '@mui/icons-material/Category'
import Inventory2Icon from '@mui/icons-material/Inventory2'
import PeopleIcon from '@mui/icons-material/People'
import { Title } from '@mui/icons-material';

export const objeto = [
    {id: 1, value: "Categorias", icon: <CategoryIcon />, colorText: "white", childs: [
        {id: 2, value: "Crear", icon: <></>, colorText: "white", click: "/Categorias/Crear" },
        {id: 3, value: "Ver Lista", icon: <></>, colorText: "white", click: "/Categorias/Lista" },
        {id: 30, value: "Subcategorias", icon: <></>, colorText: "white", childs: [
          {id: 31, value: "Crear", icon: <></>, colorText: "white", click: "/Categorias/Subcategorias/Crear" },
          {id: 32, value: "Ver Lista", icon: <></>, colorText: "white", click: "/Categorias/Subcategorias/Lista" },
        ]},
    ]},
    {id: 4, value: "Productos", icon: <Inventory2Icon />, colorText: "white", childs: [
        {id: 5, value: "Crear", icon: <></>, colorText: "white", click: "Productos/Crear" },
        {id: 6, value: "Ver Lista", icon: <></>, colorText: "white", click: "Productos/Lista" },
      ]
    },
    {id: 7, value: "Usuarios", icon: <PeopleIcon />, colorText: "white", childs: [
        {id: 8, value: "Crear", icon: <></>, colorText: "white", click: "Usuarios/Crear" },
        {id: 9, value: "Ver Lista", icon: <></>, colorText: "white", click: "Usuarios/Lista" },
      ]
    }
  ];
export const objectSpeedDial = [
    {arialLabel: "Usuario", icon: <AccountCircleIcon />, rute: ""},
    {arialLabel: "Cerrar Sesion", icon: <LogoutIcon />, rute: ""},
    {arialLabel: "Home", icon: <HomeIcon />, rute: ""},
];