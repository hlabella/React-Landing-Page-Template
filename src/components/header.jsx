import React from "react";

export const Header = (props) => {
  
  const createMarkup = (htmlContent) => {
    return { __html: htmlContent };
  };

  return (
    <header id="header">
      <div className="background-video">
        <img src="img/jumbotrongif.gif" alt="Background" className="headerGif" />
        <div className="overlay">
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
                  SE INSCREVA AGORA!
                </a>{" "}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};