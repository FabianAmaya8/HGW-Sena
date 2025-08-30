import { Outlet, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

const LayoutRol = () => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" />;
    }

    let navigationLinks = [];

    if (user?.role === 1) {
        navigationLinks = [
            { to: '/administrador', text: 'Administrador' },
        ];
    } else if (user?.role === 2) {
        navigationLinks = [
            { to: '/moderador', text: 'Moderador' },
        ];
    } else {
        return <Navigate to="/inicio" />;
    }

    return (
        <Outlet />
    );
};

export default LayoutRol;