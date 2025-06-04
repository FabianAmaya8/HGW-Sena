import useCatalogo from '../../hooks/useCatalogo';
import ItemCatalogo from './ItemCatalogo';
import '../../../assets/css/paginaproducto/catalogo.css';
import { urlDB } from '../../../urlDB';
// importar imagenes del slider
import pat1 from '../../../assets/img/catalogo/pat1.jpeg';
import pat2 from '../../../assets/img/catalogo/pat2.jpeg';
import pat3 from '../../../assets/img/catalogo/pat3.jpeg';
import pat4 from '../../../assets/img/catalogo/pat4.jpeg';
import pat5 from '../../../assets/img/catalogo/pat5.jpeg';


const Catalogo = () => {
    const { categories, subcategories, loading, error } = useCatalogo();

    if (loading) {
        return <p>Cargando...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }
    
    const imagenes = [pat1, pat2, pat3, pat4, pat5];

    const urlimg = 'http://localhost:3000/static/uploads/profile_pictures/Fabian_Amaya8.jpg'
    return (
        <main className="contenido">
        <div className="contenedor-principal">
            <div className="catalogo">
                {categories.map((category) => (
                    <a href={`#${category.nombre.replace(/\s+/g, '')}`} className="categorias">
                        <img
                        src= {urlimg}
                        alt={`Imagen de la categoría de ${category.nombre}`}
                        />
                        <div className="texto-categorias">
                            <h3>{category.nombre}</h3>
                        </div>
                    </a>
                ))}
            </div>

            <div className="contenedor-info">
            <div className="catalog-k">
                <div className="pato card">
                <div className="patologias">
                    <h2>¿Sufres de alguna de estas afecciones?</h2>
                    <p>
                    En HGW, tenemos los kits perfectos para cada necesidad de tu salud. ¡Recupera tu
                    bienestar con nuestros productos especializados!
                    </p>
                    <button className="btn">Read more</button>
                </div>
                </div>

                <div className="card-descuentos card">
                <div className="desc">
                    <h2>
                    SI TIENES EL RANGO MASTER TE ENTRAS EL 52% EN TODOS LOS PRODUCTOS
                    </h2>
                    <button className="btn">Browse Products</button>
                </div>
                </div>
            </div>

            <div className="KITS">
                <div className="slider-KITS">
                    <ul>
                        {
                        imagenes.map((img, i) => (
                            <li key={i}>
                                <a href="/user/catalogo/paginaproducto.html">
                                    <img src={img} alt={`Kit ${i + 1}`} />
                                </a>
                            </li>
                        ))
                        }
                    </ul>
                </div>
            </div>
            </div>
        </div>

        {categories.map((cat) => {
            // Filtramos las subcategorías para esta categoría
            const subsDeEstaCategoria = subcategories.filter(
            (sub) => sub.categoryId === cat.id
            );
            return (
            <ItemCatalogo
                key={cat.id}
                category={cat}
                subcategories={subsDeEstaCategoria}
            />
            );
        })}
        </main>
    );
};

export default Catalogo;
