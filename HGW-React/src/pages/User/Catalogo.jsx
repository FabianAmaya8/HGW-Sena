import ChatBot from "../../User/Components/Fijos/chatBot";
import Footer from "../../User/Components/Fijos/footer";
import Header from "../../User/Components/Fijos/header";
import Catalogo from "../../View/Components/catalogo/catalogo";
import PrivateRoute from "../Context/PrivateRoute";

export default function CatalogoUser(){
    return(
        <PrivateRoute>
            <Header />
            <Catalogo />
            <Footer />
            <ChatBot />
        </PrivateRoute>
    )
}