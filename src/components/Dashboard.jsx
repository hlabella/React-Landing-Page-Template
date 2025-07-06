import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth0 } from '@auth0/auth0-react';
import { 
  FaUniversity,    // bank/institution icon
  FaChartLine,     // line-chart
  FaBullseye,      // bullseye
  FaFileAlt        // “file-text” alt icon
} from 'react-icons/fa';

import './Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const { isAuthenticated, loginWithRedirect, isLoading } = useAuth0();

    if (isLoading) {
      return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
      loginWithRedirect();
      return null;
    }
    
    return (
      <div className="dashboard-container">
        <div className="dashboard-grid">
          {/* Users Card */}
          <div className="dashboard-card" onClick={() => navigate('/dashboard/integration')}>
            <div className="card-content">
              <FaUniversity size={32} color="#034668" />
              <h3>Integração bancária</h3>
            </div>
          </div>

          {/* Reports Card */}
          <div className="dashboard-card" onClick={() => navigate('/dashboard/investments')}>
            <div className="card-content">
              <FaChartLine size={32} color="#034668" />
              <h3>Rentabilidade de investimentos</h3>
            </div>
          </div>

          {/* Clients/Cases Card */}
          <div className="dashboard-card" onClick={() => navigate('/dashboard/goals')}>
            <div className="card-content">
              <FaBullseye size={32} color="#034668" />
              <h3>Metas e projetos</h3>
            </div>
          </div>

          {/* Captures Card */}
          <div className="dashboard-card" onClick={() => navigate('/dashboard/reports')}>
            <div className="card-content">
              <FaFileAlt size={32} color="#034668" />
              <h3>Relatórios inteligentes</h3>
            </div>
          </div>
        </div>
      </div>
    );
};
  
export default Dashboard;
