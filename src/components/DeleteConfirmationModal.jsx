import React from 'react';

const DeleteConfirmationModal = ({ isOpen, onClose, eventName, hasRecurrence, onDeleteSingle, onDeleteFuture, onDeleteAll, onCancelByPatient }) => {    if (!isOpen) return null;
    if (!isOpen) return null;
    return (
        <div className="modal">
            <div className="addpatientmodal">
                <p>Ação para: '{eventName}'?</p>
                <button onClick={onDeleteSingle}>Deletar este evento</button>
                {hasRecurrence && (
                    <>
                        <button onClick={onDeleteFuture}>
                            Deletar este evento e todos no futuro
                        </button>
                        <button onClick={onDeleteAll}>
                            Deletar todos os eventos na recorrência
                        </button>
                    </>
                )}
                <button onClick={onCancelByPatient}>
                    Evento cancelado pelo paciente
                </button>
                <button onClick={onClose}>Não</button>
            </div>
        </div>
    );
}

export default DeleteConfirmationModal;