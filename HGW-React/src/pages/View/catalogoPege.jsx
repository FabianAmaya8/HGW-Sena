import { isLoggedIn } from "../../auth";

import Catalogo from "../../View/Components/catalogo/catalogo";
import FooterView from "../../View/Components/footer";
import HeaderView from "../../View/Components/header";
import LoginModal from "../../View/Components/login/modalLogin";
import { ModalProvider } from "../Context/ModalContext";
import CatalogoUser from "../User/Catalogo";

export default function CatalogoPage(){
    return isLoggedIn() ? (
            <CatalogoUser />
        ) : (
            <ModalProvider>
                <HeaderView />
                <Catalogo />
                <FooterView />
                <LoginModal />
            </ModalProvider>
        );
};