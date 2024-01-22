import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Assinatura = () => {
    const navigate = useNavigate();
    const [subscriptionData, setSubscriptionData] = useState({
        customerName: '',
        cardNumber: '',
        cardHolderName: '',
        cardExpirationYear: '',
        cardExpirationMonth: '',
        cardCvv: '',
        billingAddressLineOne: '',
        billingAddressLineTwo: '',
        billingAddressZipCode: '',
        billingAddressCity: '',
        billingAddressState: '',
        billingAddressCountry: ''
    });

    //useScript('https://checkout.pagar.me/v1/tokenizecard.js', {'data-pagarmecheckout-app-id': '{{sua chave pública}}'});

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        
        
    }, [navigate]);

    const handleChange = (e) => {
        setSubscriptionData({ ...subscriptionData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const options = {
            method: 'POST',
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
                authorization: 'Basic ZWRja21lb2RrbWNvZWttYzplb2ZrbWNvZWttZA=='
            },
            body: JSON.stringify({
                payment_method: 'credit_card',
                interval: 'month',
                minimum_price: 19900,
                interval_count: 1,
                billing_type: 'prepaid',
                installments: 1,
                customer: { name: subscriptionData.customerName },
                card: {
                    billing_address: {
                        line_1: subscriptionData.billingAddressLineOne,
                        line_2: subscriptionData.billingAddressLineTwo,
                        zip_code: subscriptionData.billingAddressZipCode,
                        city: subscriptionData.billingAddressCity,
                        state: subscriptionData.billingAddressState,
                        country: subscriptionData.billingAddressCountry
                    },
                    number: subscriptionData.cardNumber,
                    holder_name: subscriptionData.cardHolderName,
                    holder_document: subscriptionData.cardHolderDocument,
                    exp_month: subscriptionData.cardExpirationMonth,
                    exp_year: subscriptionData.cardExpirationYear,
                    cvv: subscriptionData.cardCvv
                },
                pricing_scheme: { scheme_type: 'Unit', price: 199 },
                quantity: 1,
                currency: 'BRL',
                statement_descriptor: 'cobraai',
                description: 'subscriptcobraai'
            })
        };

        try {
            const response = await fetch('https://api.pagar.me/core/v5/subscriptions', options);
            const data = await response.json();

            if (response.ok) {
                console.log(data);
                alert('Subscription successful!');
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Subscription failed: ' + error.message);
        }
    };

    return (
        <div className="recurring-payments">
            <h2>Assinatura</h2>
            
            <form data-pagarmecheckout-form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="holder-name">Nome no Cartão:</label>
                    <input type="text" id="holder-name" name="holder-name" data-pagarmecheckout-element="holder_name" onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="card-number">Número do Cartão:</label>
                    <input type="text" id="card-number" name="card-number" data-pagarmecheckout-element="number" placeholder="1234 5678 9012 3456" onChange={handleChange} />
                    <span data-pagarmecheckout-element="brand"></span>
                </div>
                <div className="form-group">
                    <label htmlFor="card-exp-month">Mês de expiração:</label>
                    <input type="text" id="card-exp-month" name="card-exp-month" data-pagarmecheckout-element="exp_month" placeholder="MM" onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="card-exp-year">Ano de expiração:</label>
                    <input type="text" id="card-exp-year" name="card-exp-year" data-pagarmecheckout-element="exp_year" placeholder="AA" onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="cvv">CVV:</label>
                    <input type="text" id="cvv" name="cvv" data-pagarmecheckout-element="cvv" placeholder="123" onChange={handleChange}/>
                </div>
                <div className="form-group">
                    <label htmlFor="buyer-name">Nome do Comprador:</label>
                    <input type="text" id="buyer-name" name="buyer-name" onChange={handleChange}/>
                </div>
                <button type="submit" className="submit-button">Enviar</button>
            </form>
        </div>
    );
};

export default Assinatura;