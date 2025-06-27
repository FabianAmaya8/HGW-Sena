import Personal from "../../View/Components/Personal/Personal";
import FooterView from "../../View/Components/footer";
import Header from "../../User/Components/Fijos/header";
import LoginModal from "../../View/Components/login/modalLogin";
import { ModalProvider } from "../Context/ModalContext";

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
