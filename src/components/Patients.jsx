import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

const Patients = () => {
    const [patients, setPatients] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        fetch('http://127.0.0.1:8000/api/user-patients/', {
            method: 'GET',
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => setPatients(data))
        .catch(error => console.error('Error:', error));
    }, [navigate]);

    const handleEdit = (patientId) => {
        navigate(`/dashboard/meus-pacientes/edit/${patientId}`); 
    };

    const handleDelete = (patientId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
    
        const confirmDelete = window.confirm("Tem certeza que gostaria de apagar esse paciente?");
        if (confirmDelete) {
            fetch(`http://127.0.0.1:8000/api/user-patients/${patientId}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    // Remove the deleted patient from the state
                    setPatients(prevPatients => prevPatients.filter(patient => patient.id !== patientId));
                } else {
                    throw new Error('Something went wrong while deleting the patient.');
                }
            })
            .catch(error => console.error('Error:', error));
        }
    };
    
    const handleAddNewPatient = () => {
        navigate('/dashboard/meus-pacientes/add'); 
    };

    return (
        <div className="patients-table">
            <h2>PACIENTES</h2>
            <button className='add-patient-btn' onClick={handleAddNewPatient}>Adicionar Paciente</button> 
            <table>
                <thead>
                    <tr>
                        <th>Nome do Paciente</th>
                        <th>WhatsApp</th>
                        <th>Editar</th>
                        <th>Apagar</th>
                    </tr>
                </thead>
                <tbody>
                    {patients.map(patient => (
                        <tr key={patient.id}>
                            <td>{patient.nome_paciente}</td>
                            <td>{patient.whatsapp}</td>
                            <td>
                                <button className='edit-btn' onClick={() => handleEdit(patient.id)}>Editar</button>
                            </td>
                            <td>
                                <button className='delete-btn' onClick={() => handleDelete(patient.id)}>Apagar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
                
            </table>
            
        </div>
    );
};

export default Patients;