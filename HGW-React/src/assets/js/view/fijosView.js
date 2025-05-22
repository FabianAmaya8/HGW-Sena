// Importación de elementos fijos
import { initHeader } from './headerView.js';
import { initFooter } from '../fijos/footer.js';
import { ChatBot } from '../fijos/chatbot.js';

// Importación de elementos de modales
import { htmlLogin } from '../login/gral-html-login.js';

// Importación de funciones logica de los modales y validación
import { initLogin } from '..//login/login.js';

// Inicialización de elementos fijos
initHeader();
initFooter();
ChatBot();

// Inicialización de elementos de modales
htmlLogin();

// Inicialización de logica de los modales y validación
initLogin();
