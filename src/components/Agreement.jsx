import React, { useEffect, useState }  from 'react';
import { useNavigate } from 'react-router-dom';


const Agreement = () => {
    const navigate = useNavigate();

    const [userInfo, setUserInfo] = useState({});

    useEffect(() => {

        const token = localStorage.getItem('token');
        fetch('https://apissl.cobraai.me/api/profile/', {
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
        fetch('https://apissl.cobraai.me/api/delete_user/', {
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
                <p>
CONTRATO DE PRESTAÇÃO DE SERVIÇOS.
São partes no presente instrumento particular:
(a) {userInfo.user?.first_name}, inscrito no CNPJ sob o n. {userInfo.cpf_cnpj}, responsável pelo e-mail {userInfo.user?.email}, doravante denominado “CONTRATANTE”; e
(b) HENRIQUE MARTINS LABELLA COSTA, brasileiro, solteiro, engenheiro, portador da
cédula de identidade RG n. 38.512.512-4, inscrito no CPF/MF sob o n. 378.738.638-67, residente
e domiciliado à Rua dos Pinheiros, n. 1057, apartamento 1712, no Município de São Paulo, no
Estado de São Paulo, CEP 05422-012, responsável pelo e-mail hlabella@umich.edu; e
LEONARDO NARDINI BOCK, brasileiro, solteiro, administrador de empresas, portador da
cédula de identidade RG n. 37.614.861-5 SSP/SP, inscrito no CPF/MF sob o n. 386.678618-20,
residente e domiciliado à Rua Afonso Brás, n. 155, apartamento 81, no Município de São Paulo,
no Estado de São Paulo, CEP 04511-010, responsável pelo e-mail leobock95@gmail.com, em
conjunto denominados como “CONTRATADOS”
CONTRATANTE e CONTRATADOS, doravante denominados conjuntamente como "Partes"
e individualmente "Parte";
OBJETO
Cláusula 1. O presente Contrato tem como objeto a prestação de serviços de intermediação de
cobrança, recebimento, emissão de Nota Fiscal (“NF”) e confecção de relatório referente às
consultas de psicologia prestadas pelo CONTRATANTE a seus pacientes.
Cláusula 1.1. Os serviços acima mencionados serão executados pelos CONTRATADOS,
utilizando o nome fantasia “COBRA AI”, que declaram ser devidamente habilitado para
realização de todas as atividades objeto deste contrato.
Cláusula 1.2. Os serviços acima mencionados observarão em sua execução as “políticas
de pagamento individuais” dos pacientes do CONTRATANTE, ou seja, preço por
consulta, emissão de uma NF por consulta ou uma NF consolidada por mês, carimbo e
assinatura na NF, política de retorno (divisão de NFs), consulta cortesia (sem NF), regras
de cancelamento, data de cobrança e frequência de cobrança (pacote, semanal, pós sessão
ou mensal).
OBRIGAÇÕES DO CONTRATANTE
Cláusula 2. O CONTRATANTE deverá fornecer aos CONTRATADOS, em até 05 dias corridos
após o pagamento de cada mensalidade, todas as informações necessárias à prestação e realização
do serviço contratado, em especial, a tabela de cadastro dos clientes, o acesso ao calendário, bem
como conceder acesso ao site Nota do Milhão.
Cláusula 2.2. O CONTRATANTE deverá estar e se manter com o cadastro regular
perante os sistemas acima mencionados, sendo de sua responsabilidade o pagamento de
taxas, mensalidades ou demais tarifas de acesso.
Cláusula 3. O CONTRATANTE deverá efetuar o pagamento na forma e condições estabelecidas
na Cláusula 8.
OBRIGAÇÕES DOS CONTRATADOS
Cláusula 4. Os CONTRATADOS deverão prestar o serviço conforme descritivo, especificações
e prazos acordados neste contrato.
Cláusula 5. OS CONTRATADOS obrigam-se a manter o sigilo de informações, documentos e
dados pessoais coletados durante e após a realização do serviço, comprometendo-se a eliminá-los
ao término da contratação, observadas as Cláusulas 11, 12 e 13.
FORMA DE EXECUÇÃO DOS SERVIÇOS
Cláusula 6. Os serviços serão prestados pelos CONTRATADOS em até 40 (quarenta) dias
corridos após o pagamento de cada mensalidade.
Cláusula 6.1. Os serviços prestados pelos CONTRATADOS consideram apenas as
consultas que ocorreram dentro do período de 30 (trinta) dias corridos após o pagamento
de cada mensalidade.
Cláusula 6.2. Em caso de impossibilidade de cumprimento no prazo estabelecido, os
CONTRATADOS deverão comunicar de imediato o CONTRATANTE que dirá se deseja
manter o contrato, caso em que será estabelecida uma data para entrega do serviço.
Cláusula 7. As Partes declaram não manter qualquer vínculo empregatício com empregados,
dirigente e/ou prepostos uma das outras, e não se estabelecerá entre as Partes, por força deste
Contrato, qualquer forma de associação, solidariedade ou vínculo societário ou trabalhista
competindo, portanto, a cada uma delas o cumprimento de suas respectivas obrigações ficais,
trabalhistas, sociais e previdenciárias, entre outras, na forma de legislação em vigor.
PREÇO E CONDIÇÕES DE PAGAMENTO
Cláusula 8. O CONTRATANTE deverá pagar aos CONTRATADOS, em até 5 (cinco) dias úteis
da assinatura deste contrato, a quantia integral de R$ 199,00 (cento e noventa e nove reais),
realizada por meio de PIX ou transferência bancária, conforme dados bancários fornecidos pelos
CONTRATADOS.
Cláusula 8.1. O não pagamento no prazo estabelecido acima implica rescisão contratual,
sem a cobrança de quaisquer valores a título de multa em desfavor do CONTRATANTE.
ISENÇÃO DE RESPONSABILIDADE POR FRAUDE E INFORMAÇÃO FALSA
Cláusula 9. Os CONTRATADOS não serão responsáveis por quaisquer atos de fraude ou
informações falsas relacionadas a NFs solicitadas pelo CONTRATANTE, que se compromete a
fornecer informações precisas e legítimas para a emissão.
Cláusula 9.1. Esta cláusula tem a finalidade de estabelecer que o CONTRATANTE não
se envolve em atividades fraudulentas ou ilegais e não endossa tais práticas. O
CONTRATANTE reconhece que é sua obrigação agir de acordo com todas as leis e
regulamentos aplicáveis relacionados à emissão de notas fiscais.
CESSÃO E TRANSFERÊNCIA
Cláusula 10. Nenhuma das Partes poderá ceder ou transferir a terceiros, no todo ou em parte, os
direitos e obrigações oriundos do presente Contrato, salvo com a prévia anuência, por escrito, da
outra Parte.
CONFIDENCIALIDADE
Cláusula 11. Os CONTRATADOS concorda em manter todas as informações confidenciais
fornecidas pelo CONTRATANTE, incluindo, mas não se limitando a, informações sobre
pacientes, registros médicos, dados pessoais, informações financeiras e quaisquer outros
documentos ou informações relacionados à prestação de serviços e ao negócio do
CONTRATANTE.
Cláusula 12. Os CONTRATADOS se comprometem a não divulgar, compartilhar, transmitir ou
utilizar de qualquer forma informações confidenciais sem o prévio consentimento por escrito do
CONTRATANTE.
Cláusula 13. O dever de confidencialidade estabelecido nesta cláusula permanecerá em vigor
mesmo após a conclusão ou rescisão deste contrato.
RESCISÃO
Cláusula 14. O descumprimento de quaisquer das Cláusulas pelo CONTRATANTE ou pelos
CONTRATADOS implica rescisão deste contrato, a menos que as Partes concordem em sanar o
vício e manter a relação contratual.
Cláusula 15. O presente instrumento poderá ser rescindido por quaisquer das Partes a qualquer
momento, mediante comunicação de uma Parte à outra.
Cláusula 16. No caso de a rescisão ser requerida pelos CONTRATADOS, o CONTRATANTE
será ressarcido proporcionalmente pela parcela dos serviços contratados e não prestados.
FORO
Cláusula 17. Para dirimir quaisquer controvérsias oriundas do presente contrato, as partes elegem
o foro da comarca de São Paulo.</p>
            </div>
            <button onClick={handleAgree} className="btn btn-success">Agree</button>
            <button onClick={handleDisagree} className="btn btn-danger">Disagree</button>
        </div>
    );
};

export default Agreement;
