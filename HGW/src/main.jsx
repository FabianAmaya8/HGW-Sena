import Controlador from './controlador'
import { createRoot } from 'react-dom/client'

const Main = ()=>{
  return(
    <Controlador />
  )
}

createRoot(document.getElementById('root')).render(<Main />)