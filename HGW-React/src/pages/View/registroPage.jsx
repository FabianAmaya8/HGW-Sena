import FooterView from "../../View/Components/footer";
import HeaderView from "../../View/Components/header";
import LoginModal from "../../View/Components/login/modalLogin";
import RegistrationForm from "../../View/Components/Registro/registroForm";
import { ModalProvider } from "../Context/ModalContext";

export default function RegistroPage(){
    return (
        <ModalProvider>
            <HeaderView />
            <RegistrationForm />
            <FooterView />
            <LoginModal />
        </ModalProvider>
    )
};