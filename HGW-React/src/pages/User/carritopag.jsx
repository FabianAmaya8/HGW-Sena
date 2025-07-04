import ChatBot from "../../User/Components/Fijos/chatBot";
import Header from "../../User/Components/Fijos/header";
import CarritoCompleto from "../../View/Components/carrito/CarritoCompleto";
import FooterView from "../../View/Components/footer";
import PrivateRoute from "../Context/PrivateRoute";

export default function Carritopage() {
    return (
        <PrivateRoute>
            <Header />
            <CarritoCompleto />
            <FooterView />
            <ChatBot />
        </PrivateRoute>
    );
}
''