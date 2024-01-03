import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

const Cobranca = () => {
    const navigate = useNavigate();
    const [selectedMonthYear, setSelectedMonthYear] = useState('');
    const [patientsData, setPatientsData] = useState([]);
    const [monthYearOptions, setMonthYearOptions] = useState([]);
    const apiUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        setMonthYearOptions(generateMonthYearOptions(2023));
    }, [navigate]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (selectedMonthYear && token) {
            fetchPatientsWithEvents(selectedMonthYear, setPatientsData, token);
        }
    }, [selectedMonthYear, apiUrl]);

    const fetchPatientsWithEvents = async (monthYear, setPatientsData, token) => {
        try {
            const url = new URL(`${apiUrl}/api/user-invoices/`);
            url.searchParams.append("monthYear", monthYear);
    
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                }
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const data = await response.json();
            setPatientsData(data); // Use data from the response
            console.log(data)
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const generateMonthYearOptions = (startYear) => {
        const options = [];
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1; // getMonth() returns 0-11

        for (let year = startYear; year <= currentYear; year++) {
            const maxMonth = year === currentYear ? currentMonth : 12;
            for (let month = 1; month <= maxMonth; month++) {
                const monthFormatted = month.toString().padStart(2, '0');
                options.push(`${year}-${monthFormatted}`);
            }
        }
        return options;
        
    };

    const handleMonthYearChange = (event) => {
        setSelectedMonthYear(event.target.value);
    };

    const renderPatientsData = () => {
        return (
            <>
                <div className="cobranca-row cobranca-row-header">
                    <p>Paciente</p>
                    <p>Eventos</p>
                    <p>Total</p>
                </div>
                {patientsData.map(patient => {
                    const formattedTotal = new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    }).format(patient.total);

                    return (
                        <div key={patient.id} className="cobranca-row">
                            <p>{patient.nome_paciente}</p>
                            <p>{patient.events_count}</p>
                            <p>{formattedTotal}</p>
                        </div>
                    );
                })}
            </>
        );
    };
    return (
        <div className="patients-table">
            <h2>Cobrança</h2>
            <div className='cobranca-table'>
                <select onChange={handleMonthYearChange} value={selectedMonthYear}>
                    {monthYearOptions.map(option => (
                        <option key={option} value={option}>
                            {new Date(option + '-01').toLocaleString('default', { month: 'long', year: 'numeric' })}
                        </option>
                    ))}
                </select>
                {selectedMonthYear && renderPatientsData()}
            </div>
        </div>
    );
};

export default Cobranca;
