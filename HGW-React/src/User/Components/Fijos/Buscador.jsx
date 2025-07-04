import { useState } from 'react';
import { useNavigate, createSearchParams } from 'react-router-dom';

function Buscador() {
    const [term, setTerm] = useState('');
    const navigate = useNavigate();

    const handleSubmit = e => {
        e.preventDefault();
        const q = term.trim();
        if (!q) return;
        navigate({
            pathname: '/search',
            search: createSearchParams({ q }).toString()
        });
    };

    return (
        <div className="buscardor">
            <form onSubmit={handleSubmit}>
                <input
                    className="buscador-tex"
                    id="buscador"
                    type="text"
                    placeholder="Buscador"
                    value={term}
                    onChange={e => setTerm(e.target.value)}
                    autoComplete="off"
                    aria-label="Buscador de productos"
                />
                <button className="buscador-btn" type="submit">
                    <i className="bx bx-search" />
                </button>
            </form>
        </div>
    );
}

export default Buscador;
