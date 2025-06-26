import { useSearchParams } from 'react-router-dom';
import { Infinity } from 'ldrs/react';
import { useBuscarProductos } from '../../Hooks/useBuscarProductos';
import { ProductosLimitados } from '../../../View/Components/productos';

export default function ResultadoBusqueda() {
    const [searchParams] = useSearchParams();
    const q = searchParams.get('q') || '';
    const { loading, productosFiltrados } = useBuscarProductos(q);

    if (loading) {
        return (
            <div className="cargando">
                <Infinity
                size="150"
                stroke="10"
                strokeLength="0.15"
                bgOpacity="0.3"
                speed="1.3"
                color="#47BF26"
                />
            </div>
        );
    }

    return (
        <main className="contenido">
            <h5>Resultados para “{q}”</h5>

            <section className="conten-item">
                <div className="item-subcategoria">
                <h3>Productos</h3>
                {productosFiltrados.length > 0 ? (
                    <div className="productos-container">
                        <ProductosLimitados limit={100} productos={productosFiltrados} />
                    </div>
                ) : (
                    <p>No hay productos encontrados.</p>
                )}
                </div>
            </section>
        </main>
    );
}
