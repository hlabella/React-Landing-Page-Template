import React, { useState, useEffect, useRef } from 'react';


export const Contact = (props) => {

  //legal stuff
  const [isPrivacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [isTermsModalOpen, setTermsModalOpen] = useState(false);

  const privacyModalRef = useRef(); // Create a ref for the privacy modal
  const termsModalRef = useRef(); // Create a ref for the terms modal

  //useEffect for closing modals when clicking outside the box:

  //privacy modal
  useEffect(() => {
    // Function to handle click event
    const handleClickOutside = (event) => {
      if (privacyModalRef.current && !privacyModalRef.current.contains(event.target)) {
        setPrivacyModalOpen(false); // Close the modal if click is outside the modal content
      }
    };

    // Add event listener when the privacy modal is open
    if (isPrivacyModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Cleanup the event listener
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isPrivacyModalOpen]); // Only re-run the effect if isPrivacyModalOpen changes

  //terms modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (termsModalRef.current && !termsModalRef.current.contains(event.target)) {
        setTermsModalOpen(false); // Close the modal if click is outside the modal content
      }
    };

    if (isTermsModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isTermsModalOpen]);
 
  //whats message
  const whatsappNumber = "5511982646000";
  const templateMessage = "Olá! Estou interessado em saber mais sobre os serviços do COBRA AÍ.";
  const encodedMessage = encodeURIComponent(templateMessage);

  return (
    <div>
      <div id="contact">
        <div className="container">
          <div className="col-md-12">
            <div className="row">
              <div className="social">
                <ul>
                  
                  <li className='fali'>
                    <a href={props.data ? props.data.linkedin : "/"}>
                      <i className="fa fa-linkedin"></i>
                    </a>
                  </li>
                  <li className='fali'>
                    <a href={props.data ? props.data.instagram : "/"}>
                      <i className="fa fa-instagram"></i>
                    </a>
                  </li>
                  <li className='fali'>
                    <a href={`https://wa.me/${whatsappNumber}?text=${encodedMessage}`}>
                      <i className="fa fa-whatsapp"></i>
                    </a>
                  </li>
                  <li className='fali'>
                    <a href='/posts'>
                      <i className="fa fa-book"></i>
                    </a>
                  </li> 
                  <li>
                    <p>CNPJ: {props.data ? props.data.cnpj : ""}</p>
                    <p>Razão Social: {props.data ? props.data.razaoSocial : ""}</p>
                  </li>
                  <li>
                    <img src="img/LGPD.png" alt="Site em conformidade com a Lei Geral de Proteção de Dados" style={{ width: '80px', height: 'auto' }} />
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="footer">
        <div className="footer-container">
          <div style={{color:"blue"}} onClick={() => setPrivacyModalOpen(true)}>Política de Privacidade</div>
          <div style={{color:"blue"}} onClick={() => setTermsModalOpen(true)}>Termos e Condições</div>
        </div>
      </div>
      
      {isPrivacyModalOpen && (
        <div className="modalcontact" onClick={() => setPrivacyModalOpen(false)}>
          <div className="modalcontact-content" onClick={e => e.stopPropagation()} ref={privacyModalRef}>
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
        <div className="modalcontact" onClick={() => setTermsModalOpen(false)}>
          <div className="modalcontact-content" onClick={e => e.stopPropagation()} ref={termsModalRef}>
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
