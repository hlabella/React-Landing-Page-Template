import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import InvoiceOverrideModal from './InvoiceOverrideModal';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const CobrancaAdmin = () => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const navigate = useNavigate();
    const [selectedMonthYear, setSelectedMonthYear] = useState('');
    
    //admin
    const [selectedUser, setSelectedUser] = useState(''); // State to track the selected user
    const [users, setUsers] = useState([]); // State to store all users

    const [patientsData, setPatientsData] = useState([]);
    const [monthYearOptions, setMonthYearOptions] = useState([]);
    const [payments, setPayments] = useState([]);

    //override
    const [overrideList, setOverrideList] = useState([]);
    const [currentPatient, setCurrentPatient] = useState(null); // To keep track of which patient's total is being overridden
    const [loading, setLoading] = useState(true);

    //check if user is staff
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        const checkStaffStatus = async () => {
            const response = await fetch(`${apiUrl}/api/check-user-staff-status/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Token ${token}`
                },
            });
            const data = await response.json();
            if (!data.isStaff) {
                navigate('/');
            }
        };
        checkStaffStatus();
    }, [navigate]);

    useEffect(() => {
        console.log(selectedUser);
    }, [selectedUser]);


    //generate users and month options
    useEffect(() => {
        const options = generateMonthYearOptions(2023);
        setMonthYearOptions(options);
        setSelectedMonthYear(options[0]); // Set the default selected option to the most recent date
        fetchUsers(); // Fetch all users when the component mounts
    }, []);

    //get patients, payments and overrides
    useEffect(() => {
       
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/');
            return;
        }
   
        if (selectedMonthYear && token && selectedUser) {
            fetchPatientsWithEvents(selectedMonthYear, setPatientsData, token, selectedUser);
            fetchOverrides(selectedMonthYear, selectedUser);
            fetchPayments(selectedMonthYear, selectedUser);
        }
        setLoading(false);

    }, [navigate, selectedMonthYear, selectedUser, apiUrl]);

    const fetchUsers = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        try {
            const url = new URL(`${apiUrl}/api/users/`);
    
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
            
            setUsers(data);
            setSelectedUser(data[0].username);

        } catch (error) {
            console.error('Error:', error);
        }
    };

    const fetchPatientsWithEvents = async (monthYear, setPatientsData, token, selectedUser) => {
       
        try {
            const url = new URL(`${apiUrl}/api/user-invoices-admin/`);
            url.searchParams.append("monthYear", monthYear);
            url.searchParams.append("username", selectedUser);

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

    const fetchOverrides = async (monthYear, selectedUser) => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        try {
            const [year, month] = monthYear.split('-');
            const url = `${apiUrl}/api/invoice-override-list-admin/?month=${month}&year=${year}&username=${selectedUser}`;

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

    const fetchPayments = async (monthYear, selectedUser) => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        try {
            const [year, month] = monthYear.split('-');
            const url = `${apiUrl}/api/invoice-payments-admin/?month=${month}&year=${year}&username=${selectedUser}`;
            
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

    const handleUserChange = (event) => {
        setSelectedUser(event.target.value);
    };

    const goToDashboard = () => {
        navigate('/dashboard'); 
    };

    if (loading) {
        return <div>Loading...</div>;
    }

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
            }).format( patientOverride.override_amount);
    
            return (
                <p style={{ fontWeight: "bold", color: "#11d194" }}>
                    {formattedOverrideAmount} 
                </p>
            );
        } else {
            // If no override exists, display the default total
            return (
                <p style={{ fontWeight: "bold", color: "#11d194" }}>
                    {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    }).format(patient.total)}
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
                    const formattedTotal =new Intl.NumberFormat('pt-BR', {
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
                <h3>User</h3>
                <select onChange={handleUserChange} value={selectedUser}>
                    {users.map(user => {
                        return (
                            <option key={user.username} value={user.username}>
                                {user.username}
                            </option>
                        );
                    })}
                </select>
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

        </div>
    );
};

export default CobrancaAdmin;
