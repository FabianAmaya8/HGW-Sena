import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import LogoutIcon from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/Home'
import CategoryIcon from '@mui/icons-material/Category'
import Inventory2Icon from '@mui/icons-material/Inventory2'
import PeopleIcon from '@mui/icons-material/People'
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import { Title } from '@mui/icons-material';

export const objeto = [
    {id: 1, value: "Categorias", icon: <CategoryIcon />, colorText: "white", childs: [
        {id: 2, value: "Crear", icon: <></>, colorText: "white", click: "Categorias/Crear" },
        {id: 3, value: "Ver Lista", icon: <></>, colorText: "white", click: "Categorias/Lista" },
        {id: 30, value: "Subcategorias", icon: <></>, colorText: "white", childs: [
          {id: 31, value: "Crear", icon: <></>, colorText: "white", click: "Categorias/Subcategorias/Crear" },
          {id: 32, value: "Ver Lista", icon: <></>, colorText: "white", click: "Categorias/Subcategorias/Lista" },
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
    },
    {id: 10, value: "Membresias", icon: <CardMembershipIcon />, colorText: "white", childs: [
        {id: 11, value: "Crear", icon: <></>, colorText: "white", click: "Membresias/Crear" },
        {id: 12, value: "Ver Lista", icon: <></>, colorText: "white", click: "Membresias/Lista" },
      ]
    },
    {id: 13, value: "Bonos", icon: <CardGiftcardIcon />, colorText: "white", childs: [
        {id: 14, value: "Crear", icon: <></>, colorText: "white", click: "Bonos/Crear" },
        {id: 15, value: "Ver Lista", icon: <></>, colorText: "white", click: "Bonos/Lista" },
      ]
    },
    {id: 16, value: "opciones", icon: <AccountCircleIcon />, colorText: "white", childs: [
        {id: 17, value: "cerrar sesion", icon: <LogoutIcon />, colorText: "white", click: "/login" },
        {id: 18, value: "ir a pagina", icon: <HomeIcon />, colorText: "white", click: "/inicio" },
      ]
    }
  ];
export const objectSpeedDial = [
    {arialLabel: "Usuario", icon: <AccountCircleIcon />, rute: ""},
    {arialLabel: "Cerrar Sesion", icon: <LogoutIcon />, rute: ""},
    {arialLabel: "Home", icon: <HomeIcon />, rute: "/Administrador/Home"},
];