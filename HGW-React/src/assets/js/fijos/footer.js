export function initFooter() {
    // Crear elementos del footer
    const footer = document.createElement('footer');
    const footerDiv = document.createElement('div');
    footerDiv.className = 'footer';
    
    
    // Información de la empresa
    const informacionDiv = document.createElement('div');
    informacionDiv.className = 'informacion';
    
    const logoDivFooter = document.createElement('div');
    logoDivFooter.className = 'logo';
    
    const logoImgFooter = document.createElement('img');
    logoImgFooter.src = './static/User/img/logo.png';
    logoImgFooter.alt = 'logo';
    logoDivFooter.appendChild(logoImgFooter);
    
    informacionDiv.appendChild(logoDivFooter);
    
    // Información de contacto
    const contactoDiv = document.createElement('div');
    contactoDiv.className = 'contacto';
    
    // Crear cada sección de contacto
    const contactoItems = [
        ['Green World Colombia SAS', 'Nit. 901270584'],
        ['Telefono: 3142921508', 'Direccion Calle 119 #14 42'],
        ['documentoscompensaciones@world-food.co', 'Copyright 2022 Todos los Derechos reservados | HGW | Green World Colombia SAS']
    ];
    
    contactoItems.forEach(item => {
        const contactoItemDiv = document.createElement('div');
        contactoItemDiv.className = 'contacto-item';
    
        item.forEach(text => {
        const p = document.createElement('p');
        p.textContent = text;
        contactoItemDiv.appendChild(p);
        });
    
        contactoDiv.appendChild(contactoItemDiv);
    });
    
    // Añadir todo al footer
    footerDiv.appendChild(informacionDiv);
    footerDiv.appendChild(contactoDiv);
    
    // Agregar el footer al cuerpo del documento
    footer.appendChild(footerDiv);
    document.body.appendChild(footer);
}

