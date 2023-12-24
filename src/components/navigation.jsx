import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate instead of useHistory

export const Navigation = (props) => {
  const navigate = useNavigate(); // Initialize useNavigate
  const isAuthenticated = !!localStorage.getItem('token'); // Check if the user is authenticated

  const handleLogin = () => {
    navigate('/login'); // Use navigate for redirection
  };

  const handleSignup = () => {
    navigate('/signup'); // Use navigate for redirection
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login'); // Or navigate to another page after logout
  };

  const handleDashboard = () => {
    navigate('/dashboard');
  };

  const handleAnchorClick = (e, anchorId) => {
    if (window.location.pathname !== '/') {
      e.preventDefault();
      window.location.href = '/' + anchorId; // Redirect to home page with the anchor
    }
    // else, let the browser handle the anchor scrolling
  };

  return (
    <nav id="menu" className="navbar navbar-default navbar-fixed-top">
      <div className="container">
        <div className="navbar-header">
          <button
            type="button"
            className="navbar-toggle collapsed"
            data-toggle="collapse"
            data-target="#bs-example-navbar-collapse-1"
          >
            {" "}
            <span className="sr-only">Toggle navigation</span>{" "}
            <span className="icon-bar"></span>{" "}
            <span className="icon-bar"></span>{" "}
            <span className="icon-bar"></span>{" "}
          </button>
          
          <a className="navbar-brand page-scroll" href="#page-top" onClick={(e) => handleAnchorClick(e, '#page-top')} style={{ display: 'flex', alignItems: 'center' }}>
            <img src="/img/cobraai.png" style={{height: '55px', width:'50px', marginRight: '10px'}} alt=""/>COBRA AI
          </a>{" "}
        </div>

        <div
          className="collapse navbar-collapse"
          id="bs-example-navbar-collapse-1"
        >
          <ul className="nav navbar-nav navbar-right">
            <li>
              <a href="#about" className="page-scroll" onClick={(e) => handleAnchorClick(e, '#about')}>
                Sobre
              </a>
            </li>
            <li>
              <a href="#services" className="page-scroll" onClick={(e) => handleAnchorClick(e, '#services')}>
                Serviços
              </a>
            </li>
            <li>
              <a href="#faq" className="page-scroll" onClick={(e) => handleAnchorClick(e, '#faq')}>
                FAQ
              </a>
            </li>
            <li>
              <a href="#team" className="page-scroll" onClick={(e) => handleAnchorClick(e, '#team')}>
                Time
              </a>
            </li>
            <li>
              <a href="#contact" className="page-scroll" onClick={(e) => handleAnchorClick(e, '#contact')}>
                Orçamento
              </a>
            </li>
            
            {isAuthenticated ? (
            <>
              <li>
                <button onClick={handleDashboard} className="btn btn-default navbar-btn">
                  Dashboard
                </button>
              </li>
              <li>
                <button onClick={handleLogout} className="btn btn-primary navbar-btn">
                  Logout
                </button>
              </li>
            </>
            ) : (
              <>
                <li>
                  <button onClick={handleLogin} className="btn btn-default navbar-btn">
                    Entrar
                  </button>
                </li>
                <li>
                  <button onClick={handleSignup} className="btn btn-primary navbar-btn">
                    Cadastro
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};
