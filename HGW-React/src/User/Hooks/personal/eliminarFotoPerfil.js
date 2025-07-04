import Swal from 'sweetalert2';
import { urlDB } from '../../../urlDB';

export default async function eliminarFotoPerfil(userId) {
    const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Quieres borrar tu foto de perfil?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No',
        reverseButtons: true
    });
    if (!result.isConfirmed) return { cancelled: true };
    const endpoint = `api/personal/delete?id=${userId}`;
    const url = await urlDB(endpoint);
    const res = await fetch(url, { method: 'DELETE' });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Error al eliminar la foto');
    return data;
}
