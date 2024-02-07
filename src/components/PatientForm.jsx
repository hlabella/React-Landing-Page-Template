import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';



const PatientForm = () => {

    const initialPatientState = {
        nome_paciente: null,
        nome_contato_whatsapp: null,
        whatsapp: null,
        envia_cobranca: null,
        tipo_cobranca: 'Pós-mensal',
        data_cobranca: null,
        dias_para_vencimento_apos_cobranca: null,
        preco_por_consulta: null,
        emissao: null,
        emissao_customizada: null,
        metodo_pagamento: null,
        nome_completo_para_nota_fiscal_ou_recibo: null,
        cpf_para_nota_fiscal_ou_recibo: null,
        endereco_completo: null,
        declaracao_atendimento_psicologico: null,
        data_inicio_declaracao_atendimento_psicologico: null        
    };
    const { patientId } = useParams();
    const navigate = useNavigate();
    const isEditing = patientId !== undefined;
    const [patient, setPatient] = useState(initialPatientState);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const apiUrl = process.env.REACT_APP_API_URL;
    //tooltip variables
    const [tooltipVisible, setTooltipVisible] = useState(false);
    const [tooltipContent, setTooltipContent] = useState('');
    const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
    //button can be clicked once
    const [isButtonDisabled, setIsButtonDisabled] = useState(false); // State variable to track button disabled status

    const validateInputs = () => {
        
        //phone
        if (!patient.whatsapp.trim()) {
            setErrorMessage('Whatsapp é obrigatório.');
            return false;
        }

        //dias para vencimento
        const dias = Number(patient.dias_para_vencimento_apos_cobranca); // Convert to number
        if (isNaN(dias)) {
            setErrorMessage('Dias para vencimento após cobrança deve ser numérico.');
            return false;
        } else if (patient.dias_para_vencimento_apos_cobranca  && (!Number.isInteger(dias) || dias <= 0) ) {
            setErrorMessage('Dias para vencimento após cobrança deve ser um número inteiro maior que zero.');
            return false;
        }
        
    
        // preco_por_consulta
        if (!patient.preco_por_consulta) {
            setErrorMessage('Preço por consulta é obrigatório.');
            return false;
        }
        const preco = parseFloat(patient.preco_por_consulta);
        if (isNaN(preco) || preco < 0) {
            setErrorMessage('Preço por consulta deve ser um número positivo.');
            return false;
        }
        const decimalCheck = (/^\d+(\.\d{0,2})?$/).test(patient.preco_por_consulta); // Check if the price has more than two decimal places
        if (!decimalCheck) {
            setErrorMessage('Preço por consulta deve ter no máximo duas casas decimais.');
            return false;
        }

        //cpf_para_nota_fiscal_ou_recibo
        const regexTestDocument = (documentNumber) => {
            const regex = /([0-9]{2}[\.]?[0-9]{3}[\.]?[0-9]{3}[\/]?[0-9]{4}[-]?[0-9]{2})|([0-9]{3}[\.]?[0-9]{3}[\.]?[0-9]{3}[-]?[0-9]{2})/;
            return regex.test(documentNumber);
        };
        if (patient.cpf_para_nota_fiscal_ou_recibo != null && !regexTestDocument(patient.cpf_para_nota_fiscal_ou_recibo) ) {
            setErrorMessage('Documento incompleto ou inválido.');
            return false;
        }
        
                
        //pass
        return true;
    };
    
    useEffect(() => {
        const token = localStorage.getItem('token');
        
        if (!token) {
            navigate('/login');
            return;
        }

        if (isEditing) {
            fetch(`${apiUrl}/api/user-patients/${patientId}/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                setPatient(data);
            });       
        }
    }, [patientId, isEditing, navigate]);

    const handleInputChange = (event) => {
        setPatient({ ...patient, [event.target.name]: event.target.value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        setErrorMessage('');
        if (!validateInputs()) return;

        setIsButtonDisabled(true); // Disable the button on submit
        
        const token = localStorage.getItem('token');
        const method = isEditing ? 'PUT' : 'POST';
        const url = isEditing ? `${apiUrl}/api/user-patients/${patientId}/` : `${apiUrl}/api/user-patients/`;
    
        fetch(url, {
            method: method,
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(patient)
        })
        .then(response => {
            if (!response.ok) {
                setIsButtonDisabled(false);
                return response.json().then(error => {
                    const errorMessages = Object.keys(error).map(key => `${key}: ${error[key].join(", ")}`).join("\n");
                    setErrorMessage(`Error Response: ${errorMessages}`);
                    throw new Error('Server responded with an error');
                });
            }
            setErrorMessage(''); // Clear any existing errors
            return response.json();
        })
        .then(() => {
            // Handle success
            setSuccessMessage(isEditing ? 'Paciente atualizado com sucesso! Retornando...' : 'Paciente adicionado com sucesso! Retornando...');
            setTimeout(() => {
                navigate('/dashboard/meus-pacientes');
            }, 2000); // Redirect after 2 seconds
        })
        .catch(error => {
            console.error('Error:', error);
            setErrorMessage('An unexpected error occurred.'); // Generic error message
            setIsButtonDisabled(false);
        });
    };
    
    const handleReturn = () => {
        navigate('/dashboard/meus-pacientes'); // Navigate to the dashboard
    };

    const showTooltip = (event, content) => {
        const { top, left, height } = event.currentTarget.getBoundingClientRect();
        setTooltipContent(content);
        setTooltipPosition({ top: top + height + window.scrollY, left: left + window.scrollX });
        setTooltipVisible(true);
    };

    const hideTooltip = () => {
        setTooltipVisible(false);
    };

    return (
        <div className='patient-form-container'>

            <h2 className='text-center'>{isEditing ? 'Editar Paciente' : 'Adicionar Paciente'}</h2>
            <button className="return-button" type="button" onClick={handleReturn}>Retornar aos Pacientes</button>

            
            <form onSubmit={handleSubmit}>

                {/* Nome do Paciente */}
                <span className="value-display">Nome do Paciente </span>
                <span
                    className="fa fa-info-circle tooltip-icon"
                    onMouseEnter={(e) => showTooltip(e, "Nome da pessoa que recebe o atendimento (se forem mais de uma pessoa, escreva todos os nomes no mesmo campo, separados por vírgula)")}
                    onMouseLeave={hideTooltip}
                ></span>
                <input
                    type="text"
                    name="nome_paciente"
                    value={patient.nome_paciente || ''}
                    onChange={handleInputChange}
                    placeholder="Ex: João Silva"
                    required
                />
                
                {/* Nome do Contato no WhatsApp */}
                <span className="value-display">Nome do Contato no WhatsApp </span>
                <span
                    className="fa fa-info-circle tooltip-icon"
                    onMouseEnter={(e) => showTooltip(e, "Nome da pessoa para quem será feita a cobrança")}
                    onMouseLeave={hideTooltip}
                ></span>
                <input
                    type="text"
                    name="nome_contato_whatsapp"
                    value={patient.nome_contato_whatsapp || ''}
                    onChange={handleInputChange}
                    placeholder="Ex: Maria Silva"
                />

                {/* WhatsApp */}
                <span className="value-display">WhatsApp </span>
                <span
                    className="fa fa-info-circle tooltip-icon"
                    onMouseEnter={(e) => showTooltip(e, "Whatsapp da pessoa que receberá a cobrança")}
                    onMouseLeave={hideTooltip}
                ></span>
                <input
                    type="text"
                    name="whatsapp"
                    value={patient.whatsapp || ''}
                    onChange={handleInputChange}
                    placeholder="Ex: 11912345678"
                    pattern="\d{11}"
                    title="Digite o WhatsApp no formato 11912345678. Apenas números, DDD + 9 dígitos."
                />

                {/* envia_cobranca */}
                <span className="value-display">Envia Cobrança? </span>
                <span
                    className="fa fa-info-circle tooltip-icon"
                    onMouseEnter={(e) => showTooltip(e, "Paciente deveria receber alguma cobrança?")}
                    onMouseLeave={hideTooltip}
                ></span>
                <select
                    name="envia_cobranca"
                    value={patient.envia_cobranca || ''}
                    onChange={handleInputChange}
                >
                    <option value="">Selecione</option>
                    <option value="Sim">Sim</option>
                    <option value="Não">Não</option>
                </select>
                
                {/* Tipo de Cobrança */}
                {patient.envia_cobranca !== 'Não' && (
                    <div>
                        <span className="value-display">Tipo de Cobrança </span>
                        <span
                            className="fa fa-info-circle tooltip-icon"
                            onMouseEnter={(e) => showTooltip(e, "O paciente deve pagar de forma pós-mensal, ou seja, após o atendimento")}
                            onMouseLeave={hideTooltip}
                        ></span>
                        <input
                            type="text"
                            name="tipo_cobranca"
                            value={patient.tipo_cobranca || 'Pós-mensal'}
                            onChange={handleInputChange}
                            placeholder="Pós-mensal"
                            disabled
                        />
                    </div>
                )}

                {/* Data de Cobrança */}
                {patient.envia_cobranca !== 'Não' && (
                    <div>
                        <span className="value-display">Dia de Cobrança </span>
                        <span
                            className="fa fa-info-circle tooltip-icon"
                            onMouseEnter={(e) => showTooltip(e, "Em qual dia do mês deve ser cobrado o pagamento?")}
                            onMouseLeave={hideTooltip}
                        ></span>
                        <input
                            type="number"
                            name="data_cobranca"
                            value={patient.data_cobranca || null}
                            onChange={handleInputChange}
                            placeholder="Ex: 25"
                            step="1"
                            min="1"
                            max="31"
                        />
                    </div>
                )}

                {/* dias_para_vencimento_apos_cobranca */}
                {patient.envia_cobranca !== 'Não' && (
                    <div>
                        <span className="value-display">Dias para Vencimento Após Cobrança </span>
                        <span
                            className="fa fa-info-circle tooltip-icon"
                            onMouseEnter={(e) => showTooltip(e, "Quantos dias a pessoa tem de prazo para pagar?")}
                            onMouseLeave={hideTooltip}
                        ></span>
                        <input
                            type="number"
                            name="dias_para_vencimento_apos_cobranca"
                            value={patient.dias_para_vencimento_apos_cobranca || null}
                            onChange={handleInputChange}
                            placeholder="Ex: 1"
                            step="1" 
                            min="0"
                        />
                    </div>
                )}

                {/* preco_por_consulta */}
                <span className="value-display">Preço por Consulta (R$) </span>
                <span
                    className="fa fa-info-circle tooltip-icon"
                    onMouseEnter={(e) => showTooltip(e, "Valor da consulta (se for pró bono / social, insira o número 0)")}
                    onMouseLeave={hideTooltip}
                ></span>
                <input
                    type="number"
                    name="preco_por_consulta"
                    value={patient.preco_por_consulta || ''}
                    onChange={handleInputChange}
                    placeholder="Ex: 150.00"
                    step="0.01"
                    min="0"
                />
                                
                {/* emissao */}
                <span className="value-display">Emissão </span>
                <span
                    className="fa fa-info-circle tooltip-icon"
                    onMouseEnter={(e) => showTooltip(e, "Como deve ser feito o comprovante de pagamento para a pessoa?")}
                    onMouseLeave={hideTooltip}
                ></span>
                <select
                    name="emissao"
                    value={patient.emissao || ''}
                    onChange={handleInputChange}
                >
                    <option value="">Selecione uma opção</option>
                    <option value="nada">Nada</option>
                    <option value="recibo">Recibo</option>
                    <option value="nf">Nota Fiscal</option>
                    <option value="recibo_nf">Recibo e Nota Fiscal</option>
                    <option value="emissao_customizada">Emissão Customizada</option>
                </select>

                {/* emissao_customizada */}
                {patient.emissao === 'emissao_customizada' && (
                    <div>
                        <span className="value-display">Emissão Customizada </span>
                        <span
                            className="fa fa-info-circle tooltip-icon"
                            onMouseEnter={(e) => showTooltip(e, "Se não houver quebra, deixe em branco. Caso este paciente precise quebrar uma mesma consulta em mais de uma sessão, pessoa ou qualquer outra especificidade, escreva tudo aqui")}
                            onMouseLeave={hideTooltip}
                        ></span>
                        <input
                            type="text"
                            name="emissao_customizada"
                            value={patient.emissao_customizada || ''}
                            onChange={handleInputChange}
                            placeholder="Emissão customizada"
                        />
                    </div>
                )}
                
                {/* metodo_pagamento */}
                {patient.envia_cobranca !== 'Não' && (
                    <div>
                        <span className="value-display">Método de Pagamento </span>
                        <span
                            className="fa fa-info-circle tooltip-icon"
                            onMouseEnter={(e) => showTooltip(e, "Primeiro ou segundo PIX cadastrado para o consultório")}
                            onMouseLeave={hideTooltip}
                        ></span>
                        <select
                            name="metodo_pagamento"
                            value={patient.metodo_pagamento || ''}
                            onChange={handleInputChange}
                        >
                            <option value="">Selecione o Método de Pagamento</option>
                            <option value="chave_pix1">Chave Pix 1</option>
                            <option value="chave_pix2">Chave Pix 2</option>
                        </select>
                    </div>
                )}

                {/* nome_completo_para_nota_fiscal_ou_recibo */}
                {patient.emissao !== 'nada' && (
                    <div>
                        <span className="value-display">Nome Completo para Nota Fiscal ou Recibo </span>
                        <span
                            className="fa fa-info-circle tooltip-icon"
                            onMouseEnter={(e) => showTooltip(e, "Nome completo para ser inserido no recibo/NF")}
                            onMouseLeave={hideTooltip}
                        ></span>
                        <input
                            type="text"
                            name="nome_completo_para_nota_fiscal_ou_recibo"
                            value={patient.nome_completo_para_nota_fiscal_ou_recibo || ''}
                            onChange={handleInputChange}
                            placeholder="Ex: João Silva"
                        />
                    </div>
                )}

                {/* cpf_para_nota_fiscal_ou_recibo */}
                {patient.emissao !== 'nada' && (
                    <div>
                        <span className="value-display">CPF para Nota Fiscal ou Recibo </span>
                        <span
                            className="fa fa-info-circle tooltip-icon"
                            onMouseEnter={(e) => showTooltip(e, "CPF para ser inserido no recibo/NF")}
                            onMouseLeave={hideTooltip}
                        ></span>
                        <input
                            type="text"
                            name="cpf_para_nota_fiscal_ou_recibo"
                            value={patient.cpf_para_nota_fiscal_ou_recibo || ''}
                            onChange={handleInputChange}
                            placeholder="Ex: 123.456.789-00"
                            pattern="\d{3}\.\d{3}\.\d{3}-\d{2}"  // Pattern for Brazilian CPF
                            title="Digite um CPF no formato 000.000.000-00"
                        />
                    </div>
                )}


                {/* endereco_completo */}
                {patient.emissao !== 'nada' && (
                    <div>
                        <span className="value-display">Endereço Completo </span>
                        <span
                            className="fa fa-info-circle tooltip-icon"
                            onMouseEnter={(e) => showTooltip(e, "Endereço para ser adicionado no recibo/NF")}
                            onMouseLeave={hideTooltip}
                        ></span>
                        <input
                            type="text"
                            name="endereco_completo"
                            value={patient.endereco_completo || ''}
                            onChange={handleInputChange}
                            placeholder="Ex: Rua Vergueiro 1057 apto 123"
                        />
                    </div>
                )}

                {/* declaracao */}
                {patient.emissao !== 'nada' && (
                    <div>
                        <span className="value-display">Precisa de Declaração de Atendimento Psicológico? </span>
                        <span
                            className="fa fa-info-circle tooltip-icon"
                            onMouseEnter={(e) => showTooltip(e, "Paciente precisa de uma declaração de atendimento psicológico para comprovar o tratamento?")}
                            onMouseLeave={hideTooltip}
                        ></span>
                        <select
                            name="declaracao_atendimento_psicologico"
                            value={patient.declaracao_atendimento_psicologico || ''}
                            onChange={handleInputChange}
                        >
                            <option value="Não">Não</option>
                            <option value="Sim">Sim</option>
                        </select>
                    </div>
                )}


                {/* data inicio declaracao */}
                {patient.emissao !== 'nada' && patient.declaracao_atendimento_psicologico === 'Sim' && (
                    <div>
                        <span className="value-display">Data de Início do Tratamento Psicológico </span>
                        <span
                            className="fa fa-info-circle tooltip-icon"
                            onMouseEnter={(e) => showTooltip(e, "Caso o paciente precise de uma declaração de atendimento psicológico, qual é a data de início do tratamento?")}
                            onMouseLeave={hideTooltip}
                        ></span>
                        <input
                            type="date"
                            name="data_inicio_declaracao_atendimento_psicologico"
                            value={patient.data_inicio_declaracao_atendimento_psicologico || null}
                            onChange={handleInputChange}
                        />
                    </div>
                )}

                {errorMessage && <div className="error-message">{errorMessage}</div>}
                {successMessage && <div className="success-message">{successMessage}</div>}

                {/* Submit Button */}
                <button type="submit" disabled={isButtonDisabled}>
                    {isEditing ? 'Atualizar' : 'Adicionar'}
                </button>

            </form>

            
            {tooltipVisible && (
            <div className="custom-tooltip" style={{ top: tooltipPosition.top, left: tooltipPosition.left }}>
                {tooltipContent}
            </div>
            )}

        </div>
    );
};

export default PatientForm;