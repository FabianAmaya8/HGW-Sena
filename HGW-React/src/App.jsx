import FooterView from "./View/Components/footer"
import HeaderView from "./View/Components/header"
import InicioView from "./View/Components/inicio"
import LoginModal from "./View/Components/modalLogin"
// Context
import {ModalProvider} from './View/context/ModalContext';

function App() {

  return (
    <ModalProvider>
      <HeaderView />
      <InicioView />
      <FooterView />
      <LoginModal />
    </ModalProvider>
  )
}

export default App
