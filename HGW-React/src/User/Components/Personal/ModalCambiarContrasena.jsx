import React, { useState } from 'react';

export default function ModalCambiarContrasena({ show, onClose, onSubmit, loading }) {
    const [form, setForm] = useState({
        actual: '',
        nueva: '',
        confirmacion: ''
    });
    const [error, setError] = useState('');
    
    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.actual || !form.nueva || !form.confirmacion) {
            setError('Todos los campos son obligatorios.');
            return;
        }
        if (form.nueva !== form.confirmacion) {
            setError('La nueva contraseña y la confirmación no coinciden.');
            return;
        }
        try {
            await onSubmit(form);
            setForm({ actual: '', nueva: '', confirmacion: '' });
            onClose();
        } catch (err) {
            setError(err.message || 'Error al cambiar la contraseña.');
        }
    };

    if (!show) return null;

    return (
        <div style={{ zIndex: 1050 }}>
            <div className="modal d-block" tabIndex="-1">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Cambiar contraseña</h5>
                            <button type="button" className="btn-close" onClick={onClose}></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label">Contraseña actual</label>
                                    <input type="password" className="form-control" name="actual" value={form.actual} onChange={handleChange} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Nueva contraseña</label>
                                    <input type="password" className="form-control" name="nueva" value={form.nueva} onChange={handleChange} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Confirmar nueva contraseña</label>
                                    <input type="password" className="form-control" name="confirmacion" value={form.confirmacion} onChange={handleChange} required />
                                </div>
                                {error && <div className="alert alert-danger">{error}</div>}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>Cancelar</button>
                                <button type="submit" className="btn btn-primary" disabled={loading}>Guardar</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
