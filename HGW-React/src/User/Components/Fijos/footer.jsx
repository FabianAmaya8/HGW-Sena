import logo from '../../../assets/img/logo.png';

const Footer = () => {
const contactoItems = [
    ['Green World Colombia SAS'], 
    ['Nit. 901270584'],
    ['Telefono: 3142921508'], 
    ['Direccion Calle 119 #14 42'],
    ['documentoscompensaciones@world-food.co'],
    ['Copyright 2023 Todos los Derechos reservados | HGW | Green World Colombia SAS']
];

return (
    <footer>
        <div className="footer">
            <div className="informacion">
            <div className="logo">
                <img src= {logo} alt="logo" />
            </div>
            </div>

            <div className="contacto">
            {contactoItems.map((item, idx) => (
                <div key={idx} className="contacto-item">
                {item.map((text, i) => (
                    <p key={i}>{text}</p>
                ))}
                </div>
            ))}
            </div>
        </div>
    </footer>
);
};

export default Footer;
