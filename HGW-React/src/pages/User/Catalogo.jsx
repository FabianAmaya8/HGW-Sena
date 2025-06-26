import ChatBot from "../../User/Components/Fijos/chatBot";
import Header from "../../User/Components/Fijos/header";
import Catalogo from "../../View/Components/catalogo/catalogo";
import FooterView from "../../View/Components/footer";
import PrivateRoute from "../Context/PrivateRoute";

export default function CatalogoUser(){
    return(
        <PrivateRoute>
            <Header />
            <Catalogo />
            <FooterView />
            <ChatBot />
        </PrivateRoute>
    )
}