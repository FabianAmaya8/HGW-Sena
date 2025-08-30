import { Navigate, Outlet } from 'react-router-dom';
import { isLoggedIn } from '../../auth';
import Header from '../../User/Components/Fijos/header';
import FooterView from '../../View/Components/footer';
import ChatBot from '../../User/Components/Fijos/chatBot';
import PrivateRoute from '../Context/PrivateRoute';

export default function PrivateLayout() {
    if (!isLoggedIn()) {
        return <Navigate to="/login" replace />;
    }

    return (
        <PrivateRoute>
            <Header />
            <Outlet />
            <FooterView />
            <ChatBot />
        </PrivateRoute>
    );
}