import { isLoggedIn } from "../../auth";

import HeaderView from "../../View/Components/header";
import InicioView from "../../View/Components/inicio";
import FooterView from "../../View/Components/footer";
import LoginModal from "../../View/Components/login/modalLogin";
// Context
import { ModalProvider } from "../Context/ModalContext";
import Inicio from "../User/inicio";

export default function InicioWrapper() {
    return isLoggedIn() ? (
        <Inicio />
    ) : (
        <ModalProvider>
            <HeaderView />
            <InicioView />
            <FooterView />
            <LoginModal />
        </ModalProvider>
    );
}
