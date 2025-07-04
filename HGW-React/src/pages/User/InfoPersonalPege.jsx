import ChatBot from "../../User/Components/Fijos/chatBot";
import Header from "../../User/Components/Fijos/header";
import PersonalInfo from "../../User/Components/Personal/PersonalInfo";
import FooterView from "../../View/Components/footer";
import PrivateRoute from "../Context/PrivateRoute";

export default function InfoPersonalPege() {
    return (
        <PrivateRoute>
            <Header />
            <PersonalInfo />
            <FooterView />
            <ChatBot />
        </PrivateRoute>
    )
}
