import ProductoDetalle from "../../View/Components/ProductoDetalle";
import FooterView from "../../View/Components/footer";
import Header from "../../User/Components/Fijos/header";
import LoginModal from "../../View/Components/login/modalLogin";
import { ModalProvider } from "../Context/ModalContext";


export default function ProductoPag() {
    return (
        <ModalProvider>
            <Header />
            <ProductoDetalle />
            
            <FooterView />
            <LoginModal />
        </ModalProvider>
    )
};