import { isLoggedIn } from "../../auth";
// import Header from "../components/Header";
// import Inicio from "../pages/Inicio";
// import Footer from "../components/Footer";

import HeaderView from "../../View/Components/header";
import InicioView from "../../View/Components/inicio";
import FooterView from "../../View/Components/footer";
import LoginModal from "../../View/Components/login/modalLogin";
// Context
import { ModalProvider } from "../../View/context/ModalContext";

export default function InicioWrapper() {
    return isLoggedIn() ? (
        <>
            <Header />
            <Inicio />
            <Footer />
        </>
    ) : (
        <ModalProvider>
            <HeaderView />
            <InicioView />
            <FooterView />
            <LoginModal />
        </ModalProvider>
    );
}
