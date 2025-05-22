import FooterView from "../../View/Components/footer";
import HeaderView from "../../View/Components/header";
import RegistroView from "../../View/Components/Registro/registroView";
import LoginModal from "../../View/Components/login/modalLogin";
import { ModalProvider } from "../../View/context/ModalContext";

export default function RegistroPage(){
    return (
        <ModalProvider>
            <HeaderView />
            <RegistroView />
            <FooterView />
            <LoginModal />
        </ModalProvider>
    )
};