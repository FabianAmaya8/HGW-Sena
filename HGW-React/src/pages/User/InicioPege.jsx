import ChatBot from "../../User/Components/Fijos/chatBot";
import Footer from "../../User/Components/Fijos/footer";
import Header from "../../User/Components/Fijos/header";
import InicioView from "../../View/Components/inicio";
import PrivateRoute from "../Context/PrivateRoute";

export default function Inicio(){
    return(
        <PrivateRoute>
            <Header />
            <InicioView />
            <Footer />
            <ChatBot />
        </PrivateRoute>
    )
}