import Educacion from "../../User/Components/Educacion/Educacion";
import FooterView from "../../View/Components/footer";
import Header from "../../User/Components/Fijos/header";
import LoginModal from "../../View/Components/login/modalLogin";
import { ModalProvider } from "../Context/ModalContext";

export default function EducacionPage() {
    return (
        <ModalProvider>
            <Header />
            <Educacion />
            <FooterView />
            <LoginModal />
        </ModalProvider>
    );
}
