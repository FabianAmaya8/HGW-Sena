// Importación de elementos fijos
import { initHeader } from './fijos/header.js';
import { initFooter } from './fijos/footer.js';
import { ChatBot } from './fijos/chatbot.js';

// Importación de elementos de modales
import { ReferralModal } from './referidos/referidosHTML.js'

// Importación de funciones logica de los modales y validación
import { mostrarModal } from './referidos/referido.js';

// Inicialización de elementos fijos
initHeader();
initFooter();
ChatBot();

// Inicialización de elementos de modales
ReferralModal();

// Inicialización de logica de los modales y validación
mostrarModal();
