import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Bar } from 'react-chartjs-2';
import UnpaidReportTable from './UnpaidReportTable';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';

// Register the components you need
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const Patients = () => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [graphData, setGraphData] = useState({
        labels: [], // Months
        datasets: [
            {
                label: 'Valor Cobrado',
                data: [],
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            },
            {
                label: 'Valor Recebido',
                data: [],
                backgroundColor: 'rgba(17, 209, 148, 0.5)',
                borderColor: 'rgba(17, 209, 148, 1)',
                borderWidth: 1,
            }
        ],
    });
    const [unpaidData, setUnpaidData] = useState([]);
    //not subscribed:
    const [blurClass, setBlurClass] = useState('');
    const [subscription, setSubscription] = useState(true);
    
    
    useEffect(() => {
        //token
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        //pega os meses do relatório de receita
        const end = new Date();
        const endMonthYear = `${end.getFullYear()}-${end.getMonth().toString().padStart(2, '0')}`;
        const start = new Date(new Date().setFullYear(end.getFullYear() - 1));
        const startMonthYear = `${start.getFullYear()}-${start.getMonth().toString().padStart(2, '0')}`;
        
        //chama a api com esses meses
        fetch(`${apiUrl}/api/profile/`, {
            headers: {
                'Authorization': `Token ${token}`
            }
        })
        .then(res => res.json())
        .then(data => {
            
            if (!data.subscription_id || data.subscription_id === '') {
                setBlurClass('blur-content');
                setSubscription(false);
            }           
            
            fetchUserInvoiceReport(startMonthYear, endMonthYear, token);
            fetchPaymentsReport(startMonthYear, endMonthYear, token);
            fetchUnpaidReport(startMonthYear, endMonthYear, token);
            
            //finish loading
            setLoading(false);
        });

    }, [navigate]);
    
    const fetchUserInvoiceReport = async (startMonthYear, endMonthYear, token) => {
       
        try {
            const url = new URL(`${apiUrl}/api/user-invoices-report/`);
            url.searchParams.append("startMonthYear", startMonthYear);
            url.searchParams.append("endMonthYear", endMonthYear);
    
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
            
            const labels = data.map(item => item.monthYear);
            const totalCharged = data.map(item => item.total);

            setGraphData(prevData => ({
                ...prevData,
                labels, 
                datasets: [
                    { ...prevData.datasets[0], data: totalCharged }, // Update only the first dataset
                    prevData.datasets[1] // Keep the second dataset unchanged
                ]
            }));

            //console.log("data", data);

        } catch (error) {
            console.error('Error:', error);
        }
    };

    const fetchPaymentsReport = async (startMonthYear, endMonthYear, token) => {
        try {
            const url = new URL(`${apiUrl}/api/user-payments-report/`);
            url.searchParams.append("startMonthYear", startMonthYear);
            url.searchParams.append("endMonthYear", endMonthYear);
    
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
            
            const totalReceived = data.map(item => item.total); // Assuming `data` has a similar structure with 'total' field

            setGraphData(prevData => ({
                ...prevData,
                datasets: [
                    prevData.datasets[0], // Keep the first dataset unchanged
                    { ...prevData.datasets[1], data: totalReceived } // Update only the second dataset
                ]
            }));


        } catch (error) {
            console.error('Error:', error);
        }
    };

    const fetchUnpaidReport = async (startMonthYear, endMonthYear, token) => {
        try {
            const url = new URL(`${apiUrl}/api/user-unpaid-report/`);
            url.searchParams.append("startMonthYear", startMonthYear);
            url.searchParams.append("endMonthYear", endMonthYear);
    
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
            
            setUnpaidData(data);

        } catch (error) {
            console.error('Error:', error);
        }
    };

    const goToDashboard = () => {
        navigate('/dashboard'); 
    };

    return (
        <div className="patients-table">
            <div className="dashboard-link">
                <button onClick={goToDashboard} className="dashboard-button"><FontAwesomeIcon icon={faArrowLeft} /> Voltar</button>
            </div>
            <h2>Relatórios</h2>
            <h3>Valor Cobrado por mês</h3>
            <Bar
                data={graphData}
                options={{
                    scales: {
                        y: {
                            beginAtZero: true,
                        },
                    },
                }}
            />
            <h3>Inadimplência no Ano</h3>
            <UnpaidReportTable data={unpaidData} />
        </div>
    );
};

export default Patients;
