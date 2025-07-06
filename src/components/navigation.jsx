import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

export const Navigation = (props) => {
  const navigate = useNavigate(); // Initialize useNavigate
  const { loginWithRedirect, logout, isAuthenticated, getAccessTokenSilently, isLoading } = useAuth0();

  /* ---------------- CALL /api/logged ONCE PER LOGIN ------------------ */
  const called = useRef(false);

  useEffect(() => {
    // wait until Auth0 has finished initialising
    if (isLoading) return;

    if (isAuthenticated && !called.current) {
      called.current = true;            // make it one-shot
      (async () => {
        try {
          // 1) get a JWT that your FastAPI accepts
          const token = await getAccessTokenSilently({
            audience: 'https://api.gestoria.com.br/',        // same as above
            scope: 'openid profile email'
          });

          // 2) hit the provisioning endpoint
          await fetch('http://127.0.0.1:8000/api/logged', {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` }
          });
        } catch (err) {
          console.error('Could not create / refresh user', err);
          // optional: show toast / retry logic
        }
      })();
    }
  }, [isAuthenticated, isLoading, getAccessTokenSilently]);

  const handleLogin = () => {
    loginWithRedirect()
  };

  const handleLogout = () => {
    logout({ logoutParams: { returnTo: window.location.origin } })
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
            <img src="img/logo_g.png" style={{height: '65px', width:'175px', marginRight: '10px'}} alt=""/>
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
              <a href="#contact" className="page-scroll" onClick={(e) => handleAnchorClick(e, '#contact')}>
                Contato
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
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};
