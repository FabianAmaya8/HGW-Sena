import FooterView from "../../View/Components/footer";
import Header from "../../User/Components/Fijos/header";
import LoginModal from "../../View/Components/login/modalLogin";
import { ModalProvider } from "../Context/ModalContext";
import Personal from "../../User/Components/Personal/Personal";

export default function PersonalPage() {
    return (
        <ModalProvider>
            <Header />
            <Personal />
            <FooterView />
            <LoginModal />
        </ModalProvider>
    );
}
