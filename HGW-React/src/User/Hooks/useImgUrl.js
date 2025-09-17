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

export function useImageUrls(paths) {
    const [urls, setUrls] = useState([]);

    useEffect(() => {
        if (!paths || paths.length === 0) return;

        (async () => {
            try {
                const base = await findWorkingBaseUrl();
                const cleanBase = base.replace(/\/$/, '');
                const result = paths.map(path => `${cleanBase}/${path.replace(/^\//, '')}`);
                setUrls(result);
            } catch (e) {
                console.error('Error construyendo URLs:', e);
            }
        })();
    }, [paths]);

    return urls;
}
