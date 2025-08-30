import { isLoggedIn } from "../../auth";
import ResultadoBusqueda from "../../User/Components/Fijos/ResultadoBusqueda";
import FooterView from "../../View/Components/footer";

import PrivateRoute from "../Context/PrivateRoute";
import Header from "../../User/Components/Fijos/header";
import ChatBot from "../../User/Components/Fijos/chatBot";

import { ModalProvider } from "../Context/ModalContext";
import HeaderView from "../../View/Components/header";
import LoginModal from "../../View/Components/login/modalLogin";

export default function Buquedapage(){
    return (
        isLoggedIn()?
        <PrivateRoute>
            <Header />
            <ResultadoBusqueda />
            <FooterView />
            <ChatBot />
        </PrivateRoute>
        :
        <ModalProvider>
            <HeaderView />
            <ResultadoBusqueda />
            <FooterView />
            <LoginModal />
        </ModalProvider>
    )
};