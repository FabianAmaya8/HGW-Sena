import FooterView from "../../View/Components/footer";
import HeaderView from "../../View/Components/header";
import LoginView from "../../View/Components/login/loginView";
import LoginModal from "../../View/Components/login/modalLogin";
import { ModalProvider } from "../../View/context/ModalContext";

export default function LoginPage(){
    return (
        <ModalProvider>
            <HeaderView />
            <LoginView />
            <FooterView />
            <LoginModal />
        </ModalProvider>
    )
};