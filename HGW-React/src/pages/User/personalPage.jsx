import FooterView from "../../View/Components/footer";
import Header from "../../User/Components/Fijos/header";
import Personal from "../../User/Components/Personal/Personal";
import PrivateRoute from "../Context/PrivateRoute";
import ChatBot from "../../User/Components/Fijos/chatBot";

export default function PersonalPage() {
    return (
        <PrivateRoute>
            <Header />
            <Personal />
            <FooterView />
            <ChatBot />
        </PrivateRoute>
    );
}
