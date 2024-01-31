import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import InvoiceOverrideModal from './InvoiceOverrideModal';

const Cobranca = () => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const navigate = useNavigate();
    const [selectedMonthYear, setSelectedMonthYear] = useState('');
    const [patientsData, setPatientsData] = useState([]);
    const [monthYearOptions, setMonthYearOptions] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPatient, setCurrentPatient] = useState(null); // To keep track of which patient's total is being overridden

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        //ultimo mes é o default da fatura
        const options = generateMonthYearOptions(2023);
        setMonthYearOptions(options);
        setSelectedMonthYear(options[0]); // Set the default selected option to the most recent date

    }, [navigate]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (selectedMonthYear && token) {
            fetchPatientsWithEvents(selectedMonthYear, setPatientsData, token);
        }
    }, [selectedMonthYear, apiUrl]);

    const fetchPatientsWithEvents = async (monthYear, setPatientsData, token) => {
        //console.log(monthYear);
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
            //console.log(data)
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const generateMonthYearOptions = (startYear) => {
        const options = [];
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1; // getMonth() returns 0-11

        // Generate options in descending order
        for (let year = currentYear; year >= startYear; year--) {
            const startMonth = year === currentYear ? currentMonth : 12;
            for (let month = startMonth; month >= 1; month--) {
                const monthFormatted = month.toString().padStart(2, '0');
                options.push(`${year}-${monthFormatted}`);
            }
        }
        return options;
    };

    const handleMonthYearChange = (event) => {
        setSelectedMonthYear(event.target.value);
    };


    const handleTotalClick = (patient) => {
        setCurrentPatient(patient);
        setIsModalOpen(true);
    };
    
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentPatient(null);
    };

    const renderPatientsData = () => {
        return (
            <>
                <div key="title" className="cobranca-row cobranca-row-header">
                    <p>Paciente</p>
                    <p>Consultas</p>
                    <p>Valor de Consultas</p>
                    <p>Consultas Canceladas</p>
                    <p>Valor de Cancelamentos </p>
                    <p>Total</p>
                    <p>Pagamento Efetuado</p>
                </div>
                {patientsData.map(patient => {
                    const formattedTotalEvents = new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    }).format(patient.total_consultation_charge);
                    const formattedTotalCancelledEvents = new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    }).format(patient.total_cancellation_charges);
                    const formattedTotal = new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    }).format(patient.total);

                    return (
                        <div key={patient.nome_paciente} className="cobranca-row">
                            <p>{patient.nome_paciente}</p>
                            <p>{patient.events_count}</p>
                            <p>{formattedTotalEvents}</p>
                            <p>{patient.cancelled_events_count}</p>
                            <p>{formattedTotalCancelledEvents}</p>
                            <p onClick={() => handleTotalClick(patient)} style={{cursor: 'pointer',color:'blue'}}>{formattedTotal}</p>
                            <p className="payment-status">
                                <i className="fa fa-times-circle" style={{ color: 'red' }}></i> {/* Red X icon */}
                            </p>
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
                <h3>Mês de Referência</h3>
                <select onChange={handleMonthYearChange} value={selectedMonthYear}>
                    {monthYearOptions.map(option => {
                        // Split the year and month
                        const [year, month] = option.split('-');
                        // Create a date object using the year and month. Note: Month is 0-indexed in JavaScript Date, so subtract 1.
                        const date = new Date(year, month - 1);
                        // Use toLocaleString to format the date
                        const dateString = date.toLocaleString('default', { month: 'long', year: 'numeric' });
                        return (
                            <option key={option} value={option}>
                                {dateString}
                            </option>
                        );
                    })}
                </select>
                <h3>Resumo do Mês</h3>
                {selectedMonthYear && renderPatientsData()}
            </div>
            
            <InvoiceOverrideModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                patient={currentPatient}
                monthYear={selectedMonthYear}
            />

        </div>
    );
};

export default Cobranca;
