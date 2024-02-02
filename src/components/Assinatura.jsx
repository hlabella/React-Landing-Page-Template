import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, ToggleButton, ButtonGroup } from "react-bootstrap";
import Cards from 'react-credit-cards-2';
import validateInfo from '../validateInfo';
import 'react-credit-cards-2/dist/es/styles-compiled.css';

const brazilianStates = [
    { value: 'AC', label: 'Acre' },
    { value: 'AL', label: 'Alagoas' },
    { value: 'AP', label: 'Amapá' },
    { value: 'AM', label: 'Amazonas' },
    { value: 'BA', label: 'Bahia' },
    { value: 'CE', label: 'Ceará' },
    { value: 'DF', label: 'Distrito Federal' },
    { value: 'ES', label: 'Espírito Santo' },
    { value: 'GO', label: 'Goiás' },
    { value: 'MA', label: 'Maranhão' },
    { value: 'MT', label: 'Mato Grosso' },
    { value: 'MS', label: 'Mato Grosso do Sul' },
    { value: 'MG', label: 'Minas Gerais' },
    { value: 'PA', label: 'Pará' },
    { value: 'PB', label: 'Paraíba' },
    { value: 'PR', label: 'Paraná' },
    { value: 'PE', label: 'Pernambuco' },
    { value: 'PI', label: 'Piauí' },
    { value: 'RJ', label: 'Rio de Janeiro' },
    { value: 'RN', label: 'Rio Grande do Norte' },
    { value: 'RS', label: 'Rio Grande do Sul' },
    { value: 'RO', label: 'Rondônia' },
    { value: 'RR', label: 'Roraima' },
    { value: 'SC', label: 'Santa Catarina' },
    { value: 'SP', label: 'São Paulo' },
    { value: 'SE', label: 'Sergipe' },
    { value: 'TO', label: 'Tocantins' }
];

const Assinatura = () => {
    const navigate = useNavigate();
    const apiUrl = process.env.REACT_APP_API_URL;
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [profile, setProfile] = useState({
        user: {
            first_name: '',
            email: ''
        },
        endereco_completo: '',
        cpf_cnpj: '',
        crp_number: '',
        inscricao_municipal: '',
        tipo_pix1: '',
        chave_pix1: '',
        tipo_pix2: '',
        chave_pix2: '',
        subscription_id: '',
        phone_number: ''
    });
    const [selectedPlan, setSelectedPlan] = useState('premium');
    const plans = {
        basico: { price: 9999, label: 'Básico - R$99/mês' },
        premium: { price: 19999, label: 'Premium - R$199,99/mês' }
    };
    const [values, setValues] = useState({

        // Customer Information
        customerDocumentType: '',
        customerDocumentNumber: '',

        // Billing Address (if needed separately)
        billingAddressLine1: '',
        billingAddressLine2: '',
        billingCity: '',
        billingState: '',
        billingZipCode: '',

        // Card Info
        cardName: '',
        cardNumber: '',
        cardExpiration: '',
        cardSecurityCode: '',
        focus: ''

    });

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
            setProfile(data);
        });     
    }, [navigate]);


    const handlePlanChange = (value) => setSelectedPlan(value);

    const handleFocus = (e) => {
        setValues({ 
            ...values,
            focus: (e.target.name === 'cardSecurityCode') ? 'cvc' : e.target.name
        });
    };

    const handleChange = e => {
        const { name, value } = e.target;
        setValues({
            ...values,
            [name]: value
        })
    };

    const handleSubmit = e => {

        e.preventDefault();
        setLoading(true);
        setErrors({});
        //console.log('values:',values);
        setErrors(validateInfo(values));
        
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        if (validateInfo(values).variant === 'sucesso') {
            
            const {
                customerDocumentNumber,
                billingAddressLine1,
                billingAddressLine2,
                billingCity,
                billingState,
                billingZipCode,
                cardName,
                cardNumber,
                cardExpiration,
                cardSecurityCode
            } = values;

            // Prepare card expiration parts
            const sanitizedExpiration = values.cardExpiration.replace(/\D/g, ''); // Remove non-digit characters
            const expMonth = sanitizedExpiration.substring(0, 2); // First two digits for month
            const expYear = sanitizedExpiration.substring(sanitizedExpiration.length - 2); // Last two digits for year

            // Sanitize the customer phone input
            const sanitizedPhone = profile.phone_number.replace(/\D/g, ''); // Remove non-digit characters
            const areaCode = sanitizedPhone.substring(0, 2); // First two digits for area code
            const phoneNumber = sanitizedPhone.substring(2); // Remaining digits for phone number
            
            // Sanitize document and count length for other fields
            
            const sanitizedDocument = customerDocumentNumber.replace(/\D/g, '');
            let customerType, customerDocumentType;

            if (sanitizedDocument.length === 11) {
                // CPF has 11 digits
                customerType = 'individual';
                customerDocumentType = 'CPF';
            } else if (sanitizedDocument.length === 14) {
                // CNPJ has 14 digits
                customerType = 'company';
                customerDocumentType = 'CNPJ';
            } else {
                // Handle invalid length
                customerType = 'unknown';
                customerDocumentType = 'unknown';
            }        
            
            const tokenizeCard = () => {

                //tokenize card
                const options_cardtoken = {
                    method: 'POST',
                    headers: {accept: 'application/json', 'content-type': 'application/json'},
                    body: JSON.stringify({
                    card: {
                        number: cardNumber,
                        holder_name: cardName,
                        holder_document: customerDocumentNumber,
                        exp_month: expMonth,
                        exp_year: expYear,
                        cvv: cardSecurityCode
                    },
                    type: 'card'
                    })
                };

                return fetch('https://api.pagar.me/core/v5/tokens?appId=pk_0Jg8yJXF7oIrLMXD', options_cardtoken)
                    .then(response => response.json())
                    .then(response => {
                        if (response.id) {
                            return response.id; // Return the card token
                        } else {
                            let tokenError = {};
                            tokenError.show = true;
                            tokenError.variant = "danger";
                            tokenError.message = response.message;
                            setErrors(tokenError)
                            throw new Error(response.message);
                        }
                    })
                    .catch(err => {
                        console.error(err);
                        throw err;
                    });

            };

            // Function to create the subscription
            const createSubscription = (cardToken) => {
                //dados da assinatura
                const sub_options = {
                    method: 'POST',
                    headers: {
                        'Authorization': `Token ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        payment_method: 'credit_card',
                        interval: 'month',
                        minimum_price: null,
                        interval_count: 1,
                        billing_type: 'prepaid',
                        installments: 1,
                        customer: {
                            phones: {mobile_phone: {country_code: '55', area_code: areaCode, number: phoneNumber}},
                            name: profile.user.first_name,
                            email: profile.user.email,
                            document_type: customerDocumentType,
                            document: sanitizedDocument,
                            customer_type: customerType
                        },
                        card_token: cardToken,
                        card: {
                            billing_address: {
                                line_1: billingAddressLine1,
                                line_2: billingAddressLine2,
                                zip_code: billingZipCode,
                                city: billingCity,
                                state: billingState,
                                country: 'BR'
                            },
                        },
                        pricing_scheme: {scheme_type: 'Unit', price: plans[selectedPlan].price},
                        quantity: 1,
                        currency: 'BRL',
                        description: 'cobra ai'
                    })
                };

                // console.log('chegou no sub_options: ',sub_options);

                return  fetch(`${apiUrl}/api/subscription/`, sub_options)
                    .then(response => response.json())
                    .then(response => {
                        
                        // Handle successful subscription response
                        if (response.id) {
                            //console.log('Subscription successful:', response);
                            // Handle success
                            setSuccessMessage('Assinatura realizada com sucesso! Retornando...');
                            setTimeout(() => {
                                navigate('/dashboard');
                            }, 2000); // Redirect after 2 seconds
                            
                        } else {
                            console.log('Subscription error:', response.error);
                            let subError = {};
                            subError.show = true;
                            subError.variant = "danger";
                            subError.message = response.error;
                            setErrors(subError)
                            throw new Error(response.error);
                        }
                    })
                    .catch(err => {
                        console.error('Subscription error:', err);
                        // Handle subscription error
                    });
            };
        
            tokenizeCard()
                .then(cardToken => createSubscription(cardToken))
                .catch(err => console.error("Error in subscription process:", err))
                .finally(() => {
                    setLoading(false);
                })
        }
        else {
            setLoading(false);
        }
    };

    return (
        <div className="patients-table">
            <h2>Assinatura</h2>
            <div>
                <div className="container-rp">
                    <div className="box justify-content-center align-items-center">
                        <div className="formDiv">
                            {
                                (!profile.subscription_id || profile.subscription_id === '') ? (
                                <div classname="noSub">
                                    
                                    <div className="creditCard">
                                        <Cards
                                            cvc={values.cardSecurityCode}
                                            expiry={values.cardExpiration}
                                            focused={values.focus}
                                            name={values.cardName}
                                            number={values.cardNumber}
                                        />
                                    </div>
                                    <div className='rpform'>
                                        <Form onSubmit={handleSubmit}>

                                            <Form.Group>
                                                <Form.Label>Escolha seu Plano</Form.Label>
                                                <Form.Control as="select" value={selectedPlan} onChange={e => setSelectedPlan(e.target.value)} className="plan-select-dropdown">
                                                    {Object.entries(plans).map(([planKey, planDetails]) => (
                                                        <option key={planKey} value={planKey}>{planDetails.label}</option>
                                                    ))}
                                                </Form.Control>
                                            </Form.Group>

                                            {/* Card Information */}
                                            <Form.Group>
                                                <Form.Control
                                                    type="text"
                                                    id="cardName"
                                                    data-testid="cardName"
                                                    name="cardName"
                                                    placeholder="Nome como está no Cartão"
                                                    value={values.cardName}
                                                    onChange={handleChange}
                                                    onFocus={handleFocus}
                                                    isValid={errors.cname}
                                                />
                                            </Form.Group>
                                            <Form.Group>
                                                <Form.Control
                                                    type="number"
                                                    id="cardNumber"
                                                    data-testid="cardNumber"
                                                    name="cardNumber"
                                                    placeholder="Número do Cartão"
                                                    value={values.cardNumber}
                                                    onChange={handleChange}
                                                    onFocus={handleFocus}
                                                    isValid={errors.cnumber}
                                                />
                                            </Form.Group>
                                            <Form.Group>
                                                <Form.Control
                                                    type="text"
                                                    id="cardExpiration"
                                                    data-testid="cardExpiration"
                                                    name="cardExpiration"
                                                    placeholder="Data de Expiração"
                                                    value={values.cardExpiration}
                                                    onChange={handleChange}
                                                    onFocus={handleFocus}
                                                    isValid={errors.cexp}
                                                />
                                            </Form.Group>
                                            <Form.Group>
                                                <Form.Control
                                                    type="number"
                                                    id="cardSecurityCode"
                                                    data-testid="cardSecurityCode"
                                                    name="cardSecurityCode"
                                                    placeholder="Código de Segurança"
                                                    value={values.cardSecurityCode}
                                                    onChange={handleChange}
                                                    onFocus={handleFocus}
                                                    isValid={errors.ccvv}
                                                />
                                            </Form.Group>
                                            <Form.Group>
                                                <Form.Control
                                                    type="text"
                                                    id="customerDocumentNumber"
                                                    data-testid="customerDocumentNumber"
                                                    name="customerDocumentNumber"
                                                    placeholder="Número do Documento (CPF/CNPJ)"
                                                    value={values.customerDocumentNumber}
                                                    onChange={handleChange}
                                                    onFocus={handleFocus}
                                                    isValid={errors.customerDocumentNumber}
                                                />
                                            </Form.Group>
                                            
                                            {/* Billing Address */}
                                            <Form.Group>
                                                <Form.Control
                                                    type="text"
                                                    id="billingAddressLine1"
                                                    data-testid="billingAddressLine1"
                                                    name="billingAddressLine1"
                                                    placeholder="Endereço de Cobrança - Linha 1"
                                                    value={values.billingAddressLine1}
                                                    onChange={handleChange}
                                                    onFocus={handleFocus}
                                                    isValid={errors.billingAddressLine1}
                                                />
                                            </Form.Group>

                                            <Form.Group>
                                                <Form.Control
                                                    type="text"
                                                    id="billingAddressLine2"
                                                    data-testid="billingAddressLine2"
                                                    name="billingAddressLine2"
                                                    placeholder="Endereço de Cobrança - Linha 2"
                                                    value={values.billingAddressLine2}
                                                    onChange={handleChange}
                                                    onFocus={handleFocus}
                                                    isValid={errors.billingAddressLine2}
                                                />
                                            </Form.Group>

                                            <Form.Group>
                                                <Form.Control
                                                    type="text"
                                                    id="billingCity"
                                                    data-testid="billingCity"
                                                    name="billingCity"
                                                    placeholder="Cidade"
                                                    value={values.billingCity}
                                                    onChange={handleChange}
                                                    onFocus={handleFocus}
                                                    isValid={errors.billingCity}
                                                />
                                            </Form.Group>
                                            <Form.Group>
                                                <Form.Control 
                                                    as="select" 
                                                    id="billingState" 
                                                    data-testid="billingState" 
                                                    name="billingState" 
                                                    value={values.billingState} 
                                                    onChange={handleChange}
                                                    onFocus={handleFocus}
                                                    isValid={errors.billingState}
                                                >
                                                    <option value="">Selecione o Estado</option>
                                                    {brazilianStates.map(state => (
                                                        <option key={state.value} value={state.value}>{state.label}</option>
                                                    ))}
                                                </Form.Control>
                                            </Form.Group>
                                            <Form.Group>
                                                <Form.Control
                                                    type="text"
                                                    id="billingZipCode"
                                                    data-testid="billingZipCode"
                                                    name="billingZipCode"
                                                    placeholder="CEP"
                                                    value={values.billingZipCode}
                                                    onChange={handleChange}
                                                    onFocus={handleFocus}
                                                    isValid={errors.billingZipCode}
                                                />
                                            </Form.Group>

                                            <div className="alert alert-{errors.variant} alert-rp" role="alert" style={{ display: errors.show ? 'block' : 'none' }}>
                                                {errors.message}
                                            </div>
                                            {successMessage && <div className="success-message">{successMessage}</div>}
                                            
                                            <Button
                                                size={"block"}
                                                data-testid="validateButton"
                                                id="validateButton"
                                                type="submit"
                                            >
                                                {loading ? 'Carregando...' : `Assinar plano ${plans[selectedPlan].label}`}
                                            </Button>
                                        </Form>
                                    </div>
                                </div>
                                ) : (
                                    // Else, display the paragraph
                                <div>
                                    <p>Sua assinatura já está ativa!</p>
                                    <p>Se quiser cancelar, alterar o cartão, o CNPJ ou a Razão Social, mande uma mensagem no Whatsapp para: +55 (11) 98264-6000 (prometemos que respondemos rápido)</p>
                                </div>
                                )
                            }
                            
                        </div>
                        
                    </div>
                </div>
            </div>
            

        </div>
    );
};

export default Assinatura;