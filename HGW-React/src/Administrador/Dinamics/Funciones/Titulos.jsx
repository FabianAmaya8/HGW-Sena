const titulos = (string)=>{
    let titulo = string.replace(/_/g, "");
    titulo = titulo.replace(/\b\w/g, (l)=>l.toUpperCase());
    return titulo;
}

export default titulos;