import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import InvoiceOverrideModal from './InvoiceOverrideModal';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const Cobranca = () => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const navigate = useNavigate();
    const [selectedMonthYear, setSelectedMonthYear] = useState('');
    const [patientsData, setPatientsData] = useState([]);
    const [monthYearOptions, setMonthYearOptions] = useState([]);
    const [payments, setPayments] = useState([]);
    const [overrideList, setOverrideList] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPatient, setCurrentPatient] = useState(null); // To keep track of which patient's total is being overridden

    useEffect(() => {
        const options = generateMonthYearOptions(2023);
        setMonthYearOptions(options);
        setSelectedMonthYear(options[0]); // Set the default selected option to the most recent date
    }, []);

    useEffect(() => {
       
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        
        fetch(`${apiUrl}/api/profile/`, {
            headers: {
                'Authorization': `Token ${token}`
            }
        })
        .then(res => res.json())
        .then(data => {
            
            //console.log(data);
            if (!data.subscription_id || data.subscription_id === '') {
                navigate('/dashboard/assinatura');
                return;
            }           
            else {
                //ultimo mes é o default da fatura
                if (selectedMonthYear && token) {
                    fetchPatientsWithEvents(selectedMonthYear, setPatientsData, token);
                    fetchOverrides(selectedMonthYear);
                    fetchPayments(selectedMonthYear);
                }
            }

        });    
    
    }, [navigate, selectedMonthYear, apiUrl]);

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
            
            setPatientsData(data);
            
            //console.log("data", data)
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const fetchOverrides = async (monthYear) => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        try {
            const [year, month] = monthYear.split('-');
            const url = `${apiUrl}/api/invoice-override-list/?month=${month}&year=${year}`;
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) throw new Error('Error fetching event cancellation data');
            const data = await response.json();
            
            setOverrideList(data);
            
            //console.log("override list",data);
            
        } catch (error) {
            console.error('Error fetching event cancellation data:', error);
        }
    };

    const fetchPayments = async (monthYear) => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        try {
            const [year, month] = monthYear.split('-');
            const url = `${apiUrl}/api/invoice-payments/?month=${month}&year=${year}`;
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) throw new Error('Error fetching event cancellation data');
            const data = await response.json();
            
        
            setPayments(data);
        
            //console.log("payments",data)
            
        } catch (error) {
            console.error('Error fetching event cancellation data:', error);
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
        fetchOverrides(selectedMonthYear);
    };

    const goToDashboard = () => {
        navigate('/dashboard'); 
    };

    const renderPaymentStatus = (patient) => {
        // Assuming each patient object in patientsData has an 'id' field
        const isPaid = payments.some(payment => payment.id === patient.patient_id);
        
        if (isPaid) {
            return (
                <p className="payment-status">
                    <i className="fa fa-check-circle" style={{ color: 'green' }}></i> {/* Green check icon */}
                </p>
            );
        } else {
            return (
                <p className="payment-status">
                    <i className="fa fa-times-circle" style={{ color: 'red' }}></i> {/* Red X icon */}
                </p>
            );
        }
    };

    const renderOverrides = (patient) => {
        // Find the override for the specific patient
        const patientOverride = overrideList.find(override => override.patient_id === patient.patient_id);
    
        // If an override exists, format and display the override amount
        if (patientOverride) {
            const formattedOverrideAmount = new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            }).format(patientOverride.override_amount);
    
            return (
                <p style={{ fontWeight: "bold", color: "#11d194" }}>
                    {formattedOverrideAmount} <i className="fa fa-pencil" onClick={() => handleTotalClick(patient)} style={{ cursor: 'pointer' }}></i>
                </p>
            );
        } else {
            // If no override exists, display the default total
            return (
                <p style={{ fontWeight: "bold", color: "#11d194" }}>
                    {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    }).format(patient.total)} <i className="fa fa-pencil" onClick={() => handleTotalClick(patient)} style={{ cursor: 'pointer' }}></i>
                </p>
            );
        }
    };

    const renderPatientsData = () => {
        return (
            <>
                <div key="title" className="cobranca-row cobranca-row-header">
                    <p>Paciente</p>
                    <p>Consultas Realizadas</p>
                    <p>Valor de Consultas</p>
                    <p>Consultas Canceladas</p>
                    <p>Valor de Cancelamentos </p>
                    <p>Total Calculado</p>
                    <p>Total para Cobrança</p>
                    {/*<p>Envia Cobrança?</p>*/}
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
                            <p>{formattedTotal}</p>
                            {renderOverrides(patient)}
                            {/*<p>{patient.envia_cobranca}</p>*/}
                            {renderPaymentStatus(patient)}
                        </div>
                    );
                })}
            </>
        );
    };
    return (
        <div className="patients-table">
            <div className="dashboard-link">
                <button onClick={goToDashboard} className="dashboard-button"><FontAwesomeIcon icon={faArrowLeft} /> Voltar</button>
            </div>
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
                updateOverrides={() => fetchOverrides(selectedMonthYear)}
            />

        </div>
    );
};

export default Cobranca;
