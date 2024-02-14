import React from "react";
//whatsapp stuff
import { WhatsAppWidget } from 'react-whatsapp-widget';
import 'react-whatsapp-widget/dist/index.css';


export const Header = (props) => {
  
  const createMarkup = (htmlContent) => {
    return { __html: htmlContent };
  };
  const videoUrl = "https://www.youtube-nocookie.com/embed/xJIlTbBWxek?autoplay=1&mute=1&loop=1&playlist=xJIlTbBWxek&controls=0&showinfo=0&autohide=1&modestbranding=1&vq=hd1080";


  return (
    <header id="header">
      <div className="background-video">
        <div className="video-background">
          <div className="video-foreground">
            <iframe 
              src={videoUrl}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen />
          </div>
        </div>
        <div className="overlay">
          <div className="image-background" style={{ backgroundImage: `url('img/jumbo_mobile.png')` }}></div>
          <div className="container">
            <div className="row">
              <div className="col-md-8 col-md-offset-2 intro-text header-text">
                <h1>
                  {props.data ? props.data.title : "Loading"}
                  <span></span>
                </h1>
                <h3>{props.data ? props.data.paragraph : "Loading"}</h3>
                {/* Render paragraph2 with HTML content (the strong tag)*/}
                <p dangerouslySetInnerHTML={createMarkup(props.data ? props.data.paragraph2 : "Loading")}></p>
                <a
                  href="./signup"
                  className="btn btn-custom btn-lg page-scroll"
                >
                  INSCREVA-SE AGORA!
                </a>{" "}
              </div>
            </div>
          </div>
        </div>
      </div>
      <WhatsAppWidget 
                companyName="COBRA AI" 
                message="Olá! Qual é sua dúvida?" 
                phoneNumber="5511982646000" 
                sendButtonText="Enviar"
                inputPlaceHolder="Escreva uma mensagem"
                replyTimeText="Responde típicamente em menos de 1 dia"
      />
    </header>
  );
};