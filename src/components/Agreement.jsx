import React, { useEffect, useState }  from 'react';
import { useNavigate } from 'react-router-dom';


const Agreement = () => {
    const navigate = useNavigate();

    const [userInfo, setUserInfo] = useState({});
    
    const apiUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {

        const token = localStorage.getItem('token');
        fetch(`${apiUrl}/api/profile/`, {
            headers: {
                'Authorization': `Token ${token}`
            }
        })
        .then(response => response.json())
        .then(data => setUserInfo(data))
        .catch(error => console.error('Error fetching user info:', error));
    }, []);


    const handleAgree = () => {
        // Logic after agreeing, such as redirecting to the dashboard
        navigate('/dashboard');
    };

    const handleDisagree = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found');
            navigate('/');
            return;
        }
        console.log('Token used for request:', token);
        fetch(`${apiUrl}/api/delete_user/`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json',
            },
        })
        .then(response => {
            if (response.ok) {
                console.log('User deleted');
            } else {
                throw new Error('Failed to delete user');   
            }
        })
        .catch(error => console.error('Error:', error))
        .finally(() => {
            localStorage.removeItem('token'); // Remove the token
            navigate('/'); // Navigate to home or login page
        });
    };


    return (
        <div className="agreement">
            <h2>Contrato</h2>
            <div className="agreement-text">
                {/* Agreement text goes here */}
                <p> TERMOS E CONDIÇÕES DE USO<br></br>
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
            <button onClick={handleAgree} className="btn btn-success">Agree</button>
            <button onClick={handleDisagree} className="btn btn-danger">Disagree</button>
        </div>
    );
};

export default Agreement;
