import ChatBot from "../../User/Components/Fijos/chatBot";
import Header from "../../User/Components/Fijos/header";
import FooterView from "../../View/Components/footer";
import InicioView from "../../View/Components/inicio";
import PrivateRoute from "../Context/PrivateRoute";

export default function Inicio(){
    return(
        <PrivateRoute>
            <Header />
            <InicioView />
            <FooterView />
            <ChatBot />
        </PrivateRoute>
    )
}