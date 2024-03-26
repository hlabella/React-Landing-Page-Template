import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

export const Price = () => {
    const navigate = useNavigate(); 

    const redirectToSignup = () => {
        navigate('/signup'); 
    };

    const whatsappNumber = "5511982646000";
    const templateMessage = "Olá! Estou interessado em saber mais sobre os serviços do COBRA AÍ.";
    const encodedMessage = encodeURIComponent(templateMessage);
    

    return (
        <div id="price" className="text-center">
            <div className="container">
                <div className="section-title">
                <h2>Planos</h2>
                </div>
                <div className="row">
                    <div className="col-md-4 planos">
                        <div className="plano1">
                            <h3>Básico</h3>
                            <p style={{textDecoration: "line-through", color: "black", marginBottom: "0px"}}>R$99/Mês</p>
                            
                            <h4>30 dias grátis</h4>
                            <h4 style={{marginTop: "0px"}}>R$49/Mês</h4>
                            <ul>
                                <li>Pacientes ilimitados</li>
                                <li>Cobrança automática</li>
                                <li>Calendário inteligente</li>
                                <li>Relatórios de controle</li>
                            </ul>
                            <button onClick={redirectToSignup} className="signup-button">Começe agora!</button>
                        </div>
                    </div>
                    <div className="col-md-4 planos">
                        <div className="plano2">
                            <h3 style={{color:"white"}}>Premium <FontAwesomeIcon icon={faStar} style={{color:"yellow"}}/></h3>
                            <p style={{color:"white", textDecoration: "line-through", marginBottom: "0px"}}>R$199/Mês</p>
                            
                            <h4 style={{color:"white"}}>30 dias grátis</h4>
                            <h4 style={{color:"white", marginTop: "0px"}}>R$99/Mês</h4>
                            <ul>
                                <li style={{color:"white"}}>Todos os benefícios do Plano Básico</li>
                                <li style={{color:"white"}}>+</li>
                                <li style={{color:"white",fontWeight:"bold"}}>Emissão customizada de Nota Fiscal ou Recibo</li>
                            </ul>
                            <button onClick={redirectToSignup} className="signup-button">Começe agora!</button>
                        </div>
                    </div>
                    <div className="col-md-4 planos">
                        <div className="plano3">
                            <h3>Customizado</h3>
                            <ul>
                                <li>Está sentindo falta de algum recurso? Converse conosco e podemos verificar a possibilidade de um plano customizado!</li>
                            </ul>
                            <a href={`https://wa.me/${whatsappNumber}?text=${encodedMessage}`}>
                                <button className="signup-button">Fale Conosco</button>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
    
};
