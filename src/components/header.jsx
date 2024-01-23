import React from "react";

export const Header = (props) => {
  return (
    <header id="header">
      <div className="intro">
        <div className="overlay">
          <div className="container">
            <div className="row">
              <div className="col-md-8 col-md-offset-2 intro-text">
                
                <h1>
                  {props.data ? props.data.title : "Loading"}
                  <span></span>
                </h1>
                <h3>{props.data ? props.data.paragraph : "Loading"}</h3>
                <p>{props.data ? props.data.paragraph2 : "Loading"}</p>
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
