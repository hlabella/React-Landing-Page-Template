import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
const DeleteConfirmationModal = ({ isOpen, onClose, eventID, eventName, eventDate, hasRecurrence, onDeleteSingle, onDeleteFuture, onDeleteAll, onCancelByPatient }) => {
    const navigate = useNavigate();
    const [isCancelledByPatient, setIsCancelledByPatient] = useState(false);
    const [chargeValue, setChargeValue] = useState('');
    const apiUrl = process.env.REACT_APP_API_URL;
              
    const fetchData = async () => {
        if (isOpen) {
            const token = localStorage.getItem('token');
            if (!token) {
                // Assuming you have a way to navigate to login
                navigate('/login');
                return;
            }

            try {
                // Modify the URL to include event name/date as required by your API
                const eventDate_obj = new Date(eventDate);
                const formattedDate = eventDate_obj.toISOString();
      
                const url = `${apiUrl}/api/event-cancellation/?eventID=${eventID}&eventDate=${encodeURIComponent(formattedDate)}`;
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Token ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) throw new Error('Error fetching event cancellation data');
                const data = await response.json();
                //console.log('user cancelled data:', data)
                setIsCancelledByPatient(data.isCancelledByPatient);
                setChargeValue(data.chargeValue);
                
            } catch (error) {
                console.error('Error fetching event cancellation data:', error);
            }
        }
    };

    useEffect(() => {
        fetchData();
    }, [isOpen, eventName, eventDate]);

    if (!isOpen) return null;

    // Handle change in cancellation checkbox
    const handleCancellationChange = (e) => {
        const checked = e.target.checked;
        setIsCancelledByPatient(checked);
        
        if (!checked) {
            setChargeValue('0');
            // API
            // Send eventName, isCancelledByPatient, and chargeValue to your backend
            console.log("Saving cancellation charge for:", eventName, false, '0');
            const eventDate_obj = new Date(eventDate);
            const formattedDate = eventDate_obj.toISOString();
      
            const token = localStorage.getItem('token');
            if (!token) {
                // Assuming you have a way to navigate to login
                navigate('/login');
                return;
            }

            fetch(`${apiUrl}/api/event-cancellation/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    eventID: eventID,
                    eventDate: formattedDate
                })
            });

            // Handle successful deletion here (e.g., refetch events, update state)
            //fetchData();
            
        }
    };

    // Handle charge value change
    const handleChargeValueChange = (e) => {
        setChargeValue(e.target.value);
    };

    const handleSaveCancellationCharge = () => {
        // API call logic here
        // Send eventName, isCancelledByPatient, and chargeValue to your backend
        onCancelByPatient();
        console.log("Saving cancellation charge for:", eventName, isCancelledByPatient, chargeValue);
        // Implement actual API call logic

        const eventDate_obj = new Date(eventDate);
        const formattedDate = eventDate_obj.toISOString();
      
        const token = localStorage.getItem('token');
        if (!token) {
            // Assuming you have a way to navigate to login
            navigate('/login');
            return;
        }

        fetch(`${apiUrl}/api/event-cancellation/`, {
            method: 'POST',
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                eventID: eventID,
                eventDate: formattedDate,
                chargeValue: chargeValue
            })
        });

        // Handle successful deletion here (e.g., refetch events, update state)
        //fetchData();
    };


    // Determine which function to call for deleting the event
    const handleDeleteEvent = hasRecurrence ? onDeleteSingle : onDeleteAll;

    return (
        <div className="modal">
            <div className="addpatientmodal">
                <p>Ação para: '{eventName}'?</p>
                
                <button onClick={handleDeleteEvent}>Deletar este evento</button>
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
                <div className='deletionmodal'>
                    
                    <label>
                        <input type="checkbox" id="cancelCheckbox" 
                            checked={isCancelledByPatient} 
                            onChange={handleCancellationChange} 
                        />
                        <span className="custom-checkbox"></span>
                        <span className="checkbox-label">Evento cancelado pelo paciente</span>
                    </label>
                
                    {isCancelledByPatient && (
                        <>
                            <input 
                                type="number"
                                value={chargeValue}
                                onChange={handleChargeValueChange}
                                placeholder="Cobrar cancelamento"
                            />
                            
                            <button className='save-cancellation-button' onClick={handleSaveCancellationCharge}>
                                Salvar cobrança de cancelamento
                            </button>
                            
                        </>
                    )}
                </div>

                <button onClick={onClose}>Voltar</button>
            </div>
        </div>
    );
}

export default DeleteConfirmationModal;