import ChatBot from "../../User/Components/Fijos/chatBot";
import Header from "../../User/Components/Fijos/header";
import Personal from "../../User/Components/Personal/Personal";
import FooterView from "../../View/Components/footer";
import PrivateRoute from "../Context/PrivateRoute";

export default function PersonalPege() {
    return (
        <PrivateRoute>
            <Header />
            <Personal />
            <FooterView />
            <ChatBot />
        </PrivateRoute>
    )
}
