import { useState, useEffect } from 'react';

export function useImageUrl(path) {
    const [url, setUrl] = useState(null);

    useEffect(() => {
        if (!path) return;
        (async () => {
            try {
                if (path.startsWith('http')) {
                    setUrl(path);
                    return;
                }
                setUrl(path);
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
                const result = paths.map(path => 
                    path.startsWith('http') ? path : path
                );
                setUrls(result);
            } catch (e) {
                console.error('Error construyendo URLs:', e);
            }
        })();
    }, [paths]);

    return urls;
}
