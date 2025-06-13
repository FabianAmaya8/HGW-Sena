import Catalogo from "../../View/Components/catalogo/catalogo";
import FooterView from "../../View/Components/footer";
import HeaderView from "../../View/Components/header";
import LoginModal from "../../View/Components/login/modalLogin";
import { ModalProvider } from "../Context/ModalContext";

export default function CatalogoPage(){
    return (
        <ModalProvider>
            <HeaderView />
            <Catalogo />
            <FooterView />
            <LoginModal />
        </ModalProvider>
    )
};