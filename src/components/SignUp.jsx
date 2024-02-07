import React, { useState } from 'react';
import { useNavigate } from "react-router-dom"; // Import useNavigate

const SignUp = () => {
    //const [username, setUsername] = useState('');
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const [email, setEmail] = useState('');
    const [cpfCnpj, setCpfCnpj] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [firstName, setFirstName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const apiUrl = process.env.REACT_APP_API_URL;
    const navigate = useNavigate(); // Initialize useNavigate
    //legal stuff
    const [isPrivacyModalOpen, setPrivacyModalOpen] = useState(false);
    const [isTermsModalOpen, setTermsModalOpen] = useState(false);


    const validateInputs = () => {
        if (!email.trim()) {
            setError('Email é obrigatório.');
            return false;
        }     
        if (!firstName.trim()) {
            setError('Nome/Razão Social é obrigatório.');
            return false;
        }  
        //document
        const regexTestDocument = (documentNumber) => {
            const regex = /([0-9]{2}[\.]?[0-9]{3}[\.]?[0-9]{3}[\/]?[0-9]{4}[-]?[0-9]{2})|([0-9]{3}[\.]?[0-9]{3}[\.]?[0-9]{3}[-]?[0-9]{2})/;
            return regex.test(documentNumber);
        };
        if (!cpfCnpj.trim()) {
            setError('Documento é obrigatório.');
            return false;
        }
        if (cpfCnpj === null || !regexTestDocument(cpfCnpj) ) {
            setError('Documento incompleto ou inválido.');
            return false;
        }
        
        //phone
        const regexTestPhone = (phoneNumber) => {
            const regex = /^\s*\(?(\d{2})\)?[-. ]?9[-. ]?(\d{4})[-. ]?(\d{4})\s*$/;
            return regex.test(phoneNumber);
        };
        if (!phoneNumber.trim()) {
            setError('Telefone é obrigatório.');
            return false;
        }
        if (phoneNumber === null || !regexTestPhone(phoneNumber) ) {
            setError('Telefone incompleto ou inválido.');
            return false;
        }
        //password
        if (!password1 || !password2) {
            setError('É necessário confirmar a senha.');
            return false;
        }
        if (password1 !== password2) {
            setError('Senhas não são iguais.');
            return false;
        }
        

        return true;
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setError('');
        if (!validateInputs()) return;

        //data sanitization
        const sanitizedDocument = cpfCnpj.replace(/\D/g, '');
        const sanitizedPhone = phoneNumber.replace(/\D/g, '')

        setLoading(true);
        fetch(`${apiUrl}/api/signup/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: email, password1, password2, email, cpf_cnpj: sanitizedDocument, first_name: firstName, phone_number: sanitizedPhone})
        })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => { throw new Error(text) });
            }
            return response.json();
        })
        .then(data => {
            localStorage.setItem('token', data.token);
            navigate('/dashboard');
        })
        .catch(error => {
            try {
                const errorHTML = new DOMParser().parseFromString(error.message, 'text/html');
                const errorMessage = errorHTML.body.textContent || error.message;
                setError('Erro durante cadastro: ' + errorMessage);
            } catch (parseError) {
                setError('Erro durante cadastro: ' + error.message);
            }
        })
        .finally(() => {
            setLoading(false);
        });
    };

    return (
        <div id="signup" className="text-center">
            <div className="container">
                <div className="section-title">
                    <h2>Cadastro</h2>
                </div>
                
                <form onSubmit={handleSubmit} noValidate>
                    {/* <div className="form-group">
                        <label htmlFor="username">Usuário</label>
                        <input 
                            type="text" 
                            id="username"
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                            className="form-control"
                        />
                    </div>                     */}
                    <div className="form-group">
                        <label htmlFor="email">E-mail</label>
                        <input 
                            type="email" 
                            id="email"
                            value={email} 
                            placeholder="Esse e-mail será seu método de entrada"
                            onChange={(e) => setEmail(e.target.value)} 
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="firstName">Nome Completo/Razão Social</label>
                        <input 
                            type="text" 
                            id="firstName"
                            value={firstName} 
                            placeholder="Nome Completo ou Razão Social do usuário"
                            onChange={(e) => setFirstName(e.target.value)} 
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="cpfCnpj">CPF/CNPJ</label>
                        <input 
                            type="text" 
                            id="cpfCnpj"
                            value={cpfCnpj} 
                            placeholder="Número do Documento (CPF/CNPJ)"
                            onChange={(e) => setCpfCnpj(e.target.value)} 
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="phoneNumber">Telefone</label>
                        <input 
                            type="text" 
                            id="phoneNumber"
                            value={phoneNumber} 
                            placeholder="Telefone (ex: 11912345678)"
                            onChange={(e) => setPhoneNumber(e.target.value)} 
                            className="form-control"
                            pattern="\d{11}"
                            title="Digite o Telefone no formato 11912345678. Apenas números, DDD + 9 dígitos."
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password1">Senha</label>
                        <input 
                            type="password" 
                            id="password1"
                            value={password1} 
                            placeholder="********"
                            onChange={(e) => setPassword1(e.target.value)} 
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password2">Confirme a Senha</label>
                        <input 
                            type="password" 
                            id="password2"
                            value={password2} 
                            placeholder="********"
                            onChange={(e) => setPassword2(e.target.value)} 
                            className="form-control"
                        />
                    </div>

                    <p style={{fontSize: '10px', textAlign:"left"}}>Ao clicar em Cadastrar, você concorda com os 
                        <a onClick={() => setTermsModalOpen(true)}> Termos e Condições</a> e 
                        <a onClick={() => setPrivacyModalOpen(true)}> Política de Privacidade</a>
                    </p>
                    
                    {error && <div className="alert alert-danger">{error}</div>}

                    <button className="btn btn-primary" type="submit" disabled={loading}>
                        {loading ? 'Cadastrando...' : 'Cadastrar'}
                    </button>

                </form>
            </div>

            {isPrivacyModalOpen && (
                <div className="modalcontact">
                <div className="modalcontact-content" style={{textAlign:"left"}}>
                    <span className="close" onClick={() => setPrivacyModalOpen(false)}>&times;</span>
                    <h2>Política de Privacidade</h2>
                    <p>
                    Política de Privacidade do COBRA AI
                    <br></br>1. Coleta de Informações
                    <br></br>O COBRA AI coleta informações fornecidas voluntariamente pelos usuários durante o processo de registro na plataforma, como nome, endereço de e-mail, e detalhes de contato. Além disso, informações de cobrança e dados relacionados ao uso do serviço também são coletados automaticamente.
                    <br></br>2. Uso de Informações
                    <br></br>As informações coletadas são utilizadas para facilitar o acesso e a utilização dos serviços do COBRA AI, personalizar a experiência do usuário, realizar transações e fornecer suporte ao cliente. Também podem ser utilizadas para comunicações sobre atualizações, novos recursos e ofertas especiais.
                    <br></br>3. Compartilhamento de Informações
                    <br></br>O COBRA AI não compartilha informações pessoais identificáveis dos usuários com terceiros sem consentimento prévio. As informações podem ser compartilhadas com parceiros estratégicos para fornecer serviços específicos, desde que concordem em manter a confidencialidade das informações.
                    <br></br>4. Segurança
                    <br></br>O COBRA AI emprega medidas de segurança adequadas para proteger as informações dos usuários contra acesso não autorizado, alteração, divulgação ou destruição não autorizada.
                    <br></br>5. Alterações na Política
                    <br></br>O COBRA AI reserva-se o direito de atualizar sua Política de Privacidade periodicamente. Os usuários serão notificados sobre alterações significativas por meio da plataforma ou por e-mail.
                    <br></br>6. Retenção de Dados
                    <br></br>As informações dos usuários serão retidas pelo tempo necessário para fornecer os serviços solicitados ou conforme exigido por lei. Os usuários têm o direito de solicitar a exclusão de suas informações a qualquer momento.
                    <br></br>7. Contato
                    <br></br>Para quaisquer dúvidas sobre a Política de Privacidade ou para exercer direitos relacionados à privacidade dos dados, entre em contato conosco através do seguinte e-mail: contato@cobraai.me.
                    
                    Data da última atualização: 02/janeiro/2024
                    </p>
                </div>
                </div>
            )}

            {isTermsModalOpen && (
                <div className="modalcontact">
                <div className="modalcontact-content" style={{textAlign:"left"}}>
                    <span className="close" onClick={() => setTermsModalOpen(false)}>&times;</span>
                    <h2>Termos e Condições</h2>
                    <p>
                            TERMOS E CONDIÇÕES DE USO<br></br>
                            <br></br>Ao utilizar a plataforma COBRA AI ("Plataforma"), você ("Usuário") concorda e aceita os seguintes termos e condições:
                            <br></br>1. Descrição dos Serviços Oferecidos
                            <br></br>1.1 A COBRA AI oferece serviços de intermediação de cobrança, recebimento, emissão de Nota Fiscal ("NF") e confecção de relatórios referentes às consultas de psicologia prestadas por profissionais psicólogos, psicanalistas ou terapeutas ("Prestadores de Serviço").
                            <br></br>1.2 Os serviços oferecidos pela Plataforma são exclusivamente para a gestão administrativa das consultas dos Prestadores de Serviço e não constituem a prática da psicologia ou a prestação direta de serviços médicos ou terapêuticos aos pacientes.
                            <br></br>2. Registro e Responsabilidades do Usuário
                            <br></br>2.1 Ao utilizar a Plataforma, o Usuário concorda em fornecer informações precisas, atualizadas e completas, sendo responsável pela veracidade dos dados cadastrados. A Plataforma não é responsável por erros advindos de informações incorretas e desatuaizadas por parte do usuário.
                            <br></br>2.2 O Usuário é responsável pela segurança de suas credenciais de acesso à Plataforma e deve notificar imediatamente a COBRA AI sobre qualquer uso não autorizado de sua conta.
                            <br></br>3. Pagamento e Cancelamento
                            <br></br>3.1 O acesso à Plataforma requer o pagamento recorrente mensal no valor acordado na data de acordo deste documento, por meio do cartão de crédito cadastrado pelo Usuário.
                            <br></br>3.2 O cancelamento do serviço pode ser solicitado pelo Usuário enviando um e-mail para contato@cobraai.me. Após o cancelamento, o acesso à Plataforma será suspenso.
                            <br></br>3.3 Não haverá reembolso das mensalidades já pagas, exceto nos casos em que o pagamento foi efetuado, mas o e-mail de solicitação de cancelamento foi enviado antes do pagamento.
                            <br></br>4. Suspensão e Interrupção do Acesso
                            <br></br>4.1 Em caso de inadimplência ou falha no pagamento mensal, o acesso à Plataforma poderá ser suspenso até a regularização do pagamento.
                            <br></br>4.2 A COBRA AI se reserva o direito de interromper temporariamente o acesso à Plataforma para manutenção, atualização ou aprimoramento dos serviços, sem aviso prévio.
                            <br></br>5. Proteção de Dados e Privacidade
                            <br></br>5.1 A COBRA AI compromete-se a proteger os dados pessoais dos Usuários, utilizando medidas de segurança adequadas e em conformidade com as leis de proteção de dados vigentes.
                            <br></br>6. Responsabilidades e Conduta do Usuário
                            <br></br>6.1 O Usuário concorda e se compromete a utilizar a Plataforma de maneira ética, legal e em conformidade com todas as leis, regulamentos e diretrizes aplicáveis.
                            <br></br>6.2 É estritamente proibido o uso da Plataforma para atividades ilegais, fraudulentas, difamatórias, prejudiciais, obscenas, discriminatórias, ou que violem os direitos de terceiros.
                            <br></br>6.3 O Usuário reconhece e concorda que é o único responsável por suas ações, conduta e conteúdo gerado ou compartilhado na Plataforma, isentando a COBRA AI de qualquer responsabilidade decorrente dessas atividades.
                            <br></br>7. Propriedade Intelectual
                            <br></br>7.1 Todos os direitos de propriedade intelectual relacionados à Plataforma, incluindo software, design, marcas registradas e conteúdo, pertencem à COBRA AI.
                            <br></br>7.2 O Usuário não está autorizado a reproduzir, distribuir ou utilizar qualquer conteúdo da Plataforma para fins comerciais sem consentimento prévio por escrito da COBRA AI.
                            <br></br>8. Alterações nos Termos e Condições
                            <br></br>8.1 A COBRA AI reserva-se o direito de alterar, modificar ou atualizar estes termos e condições a qualquer momento, sendo de responsabilidade do Usuário verificar periodicamente as mudanças.
                            <br></br>8.2 A COBRA AI reserva-se o direito de modificar o valor mensal dos serviços oferecidos na Plataforma.
                            <br></br>8.3 Em caso de alteração de preço, a COBRA AI se compromete a informar o Usuário com pelo menos 20 (vinte) dias corridos de antecedência antes que a mudança entre em vigor.
                            <br></br>8.4 A notificação sobre a alteração de preço será enviada ao endereço de e-mail fornecido pelo Usuário no momento do cadastro na Plataforma.
                            <br></br>9. Disposições Gerais
                            <br></br>9.1 Estes termos e condições representam o acordo completo entre o Usuário e a COBRA AI em relação ao uso da Plataforma, substituindo quaisquer acordos anteriores.
                            <br></br>9.2 Caso qualquer disposição destes termos seja considerada inválida ou inexequível, as demais disposições permanecerão em pleno vigor e efeito.

                            <br></br>Data da última atualização: 02/janeiro/2024
                    </p>
                </div>
                </div>
            )} 

        </div>
    );
};

export default SignUp;
