import { useState, useEffect } from 'react';
import { findWorkingBaseUrl } from '../../urlDB';

export function useImageUrl(path) {
    const [url, setUrl] = useState(null);

    useEffect(() => {
        if (!path) return;
        (async () => {
            try {
                const base = await findWorkingBaseUrl(); 
                // elimina slash final de base y slash inicial de path
                const full = `${base.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
                setUrl(full);
            } catch (e) {
                console.error('Error construyendo URL de imagen:', e);
            }
        })();
    }, [path]);

    return url;
}
