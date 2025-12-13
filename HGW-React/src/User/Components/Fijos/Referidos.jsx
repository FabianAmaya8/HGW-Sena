import ReactDOM from "react-dom";
import { QRCodeCanvas } from "qrcode.react";
import Swal from "sweetalert2";

export default function Referidos({ refOpen, setRefOpen, user }) {
    if (!refOpen) return null;

    const baseURL = window.location.origin;
    const referralLink = `${baseURL}/register?ref=${user}`;

    const copiarLink = () => {
        navigator.clipboard.writeText(referralLink);
        Swal.fire({
            title: "¡Link copiado!",
            text: "El link de referido ha sido copiado al portapapeles.",
            icon: "success",
            timer: 3000,
            showConfirmButton: false,
        });
    };

    return ReactDOM.createPortal(
        (
            <div className="ref-modal-overlay">
                <div className="ref-modal-box">

                    <div className="ref-modal-header">
                        <h3 className="ref-modal-title">Invita a tus Referidos</h3>
                        <button
                            className="ref-close-btn"
                            onClick={() => setRefOpen(false)}
                        >
                            ×
                        </button>
                    </div>

                    <div className="ref-modal-body">
                        <p className="ref-text">Comparte tu link de referido:</p>

                        <div className="ref-input-copy">
                            <input
                                type="text"
                                value={referralLink}
                                readOnly
                                className="ref-copy-input"
                            />
                            <button
                                className="ref-btn-copy"
                                onClick={copiarLink}
                            >
                                Copiar
                            </button>
                        </div>

                        <div className="ref-qr-section">
                            <QRCodeCanvas value={referralLink} size={180} />
                            <p className="ref-qr-text">Escanéalo para registrarse</p>
                        </div>
                    </div>

                    <div className="ref-modal-footer">
                        <button
                            className="ref-btn-close-modal"
                            onClick={() => setRefOpen(false)}
                        >
                            Cerrar
                        </button>
                    </div>

                </div>
            </div>
        ),
        document.body
    );
}
