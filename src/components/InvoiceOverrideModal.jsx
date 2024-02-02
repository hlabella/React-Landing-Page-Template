import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

const InvoiceOverrideModal = ({ isOpen, onClose, patient, monthYear, updateOverrides }) => {
    const navigate = useNavigate();
    const [override, setOverride] = useState(false);
    const [chargeValue, setChargeValue] = useState('');
    const [inputError, setInputError] = useState('');
    const apiUrl = process.env.REACT_APP_API_URL;
    const moneyRegex = /^\d+(\.\d{0,2})?$/;

    useEffect(() => {
        // Clear error message when modal is opened or chargeValue is changed
        setInputError('');
    }, [isOpen, chargeValue]);
    
    const fetchData = async () => {
        
        if (isOpen) {
            const token = localStorage.getItem('token');
            if (!token) {
                // Assuming you have a way to navigate to login
                navigate('/login');
                return;
            }

            try {
                const [year, month] = monthYear.split('-');
                const url = `${apiUrl}/api/invoice-overrides/?patient_id=${patient.patient_id}&month=${month}&year=${year}`;
                
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Token ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) throw new Error('Error fetching event cancellation data');
                const data = await response.json();
                //console.log('user override data:', data);
                setOverride(data.override_flag);
                setChargeValue(data.override_amount);

            } catch (error) {
                console.error('Error fetching event cancellation data:', error);
            }
        }
    };

    useEffect(() => {
        fetchData();
    }, [isOpen,monthYear]);

    if (!isOpen) return null;

    // Handle change in override checkbox
    const handleOverrideChange = (e) => {
        //console.log("override checkbox clicked");
        const checked = e.target.checked;
        setOverride(checked);

        if (!checked) {
            setChargeValue('0');
            // API
            // Send eventName, isCancelledByPatient, and chargeValue to your backend
            const [year, month] = monthYear.split('-');

            const token = localStorage.getItem('token');
            if (!token) {
                // Assuming you have a way to navigate to login
                navigate('/login');
                return;
            }

            fetch(`${apiUrl}/api/invoice-overrides/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    patient_id: patient.patient_id,
                    month: month,
                    year: year
                })
            });
            // Handle successful deletion here (e.g., refetch events, update state)
            //fetchData();
            
        }

    };

    
    // Handle charge value change
    const handleChargeValueChange = (e) => {
        const value = e.target.value;
        if (moneyRegex.test(value) || value === '') {
            setChargeValue(value);
            setInputError('');  // Clear error message if the input is valid
        } else {
            setInputError('Determine um valor válido (ex: 1000)');
        }
    };


     //call api to save
    const handleSaveOverrideCharge = () => {
        // API call logic here
        const [year, month] = monthYear.split('-');
        const token = localStorage.getItem('token');
        if (!token) {
            // Assuming you have a way to navigate to login
            navigate('/login');
            return;
        }

        fetch(`${apiUrl}/api/invoice-overrides/`, {
            method: 'POST',
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                patient_id: patient.patient_id,
                month: month,
                year: year,
                override_amount: chargeValue
            })
        });

        updateOverrides(); // This will trigger the re-fetching of overrides in the parent component
        onClose(); //close the modal

    };

    return (
        <div className="modal">
            <div className="addpatientmodal">
                <p>Mudar valor final para '{patient.nome_paciente}'?</p>

                <div className='deletionmodal'>
                    
                    <label>
                        <input type="checkbox" id="cancelCheckbox" 
                            checked={override} 
                            onChange={handleOverrideChange} 
                        />
                        <span className="custom-checkbox"></span>
                        <span className="checkbox-label">Sobrescrever valor</span>
                    </label>
                
                    {override && (
                        <>
                            <input 
                                type="number"
                                value={chargeValue}
                                onChange={handleChargeValueChange}
                                placeholder="Novo Valor (ex.: 2000)"
                            />
                            {inputError && <div style={{ color: 'red' }}>{inputError}</div>}
                            <button className='save-cancellation-button' onClick={handleSaveOverrideCharge}>
                                Salvar novo valor
                            </button>
                            
                        </>
                    )}
                </div>

                <button onClick={onClose}>Voltar</button>
            </div>
        </div>
    );
}

export default InvoiceOverrideModal;