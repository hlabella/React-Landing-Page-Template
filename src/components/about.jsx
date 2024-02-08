import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquareMinus, faSquarePlus } from "@fortawesome/free-solid-svg-icons";


export const About = (props) => {

  // State to keep track of the currently active FAQ item
  const [activeIndex, setActiveIndex] = useState(null);

  // Function to handle clicking on a question
  const toggleAbout = (index) => {
    // If the clicked question is already active, close it, otherwise, open the clicked question
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div id="about">
      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-md-6">
            <img src="img/print_dash.png" className="img-responsive" alt="" />
            <p></p>
            <img src="img/print_dash2.png" className="img-responsive" alt="" />
          </div>
          <div className="col-xs-12 col-md-6">
            <div className="about-text">
              <h2>SOBRE</h2>
              <p>{props.data ? props.data.paragraph : "loading..."}</p>
              <h3>POR QUE NÓS?</h3>
              <div className="list-style">
                <div className="col-lg-6 col-sm-6 col-xs-12">
                  <ul>
                    {props.data
                        ? props.data.Why.map((d, i) => (
                            <li key={`${d.title}-${i}`} onClick={() => toggleAbout(i)}>
                              <FontAwesomeIcon icon={activeIndex === i ? faSquareMinus : faSquarePlus} />
                              <strong>{d.title}</strong>
                              {activeIndex === i && <p>{d.description}</p>}
                            </li>
                          ))
                        : "loading"}
                  </ul>
                </div>
                <div className="col-lg-6 col-sm-6 col-xs-12">
                  <ul>
                    {props.data
                        ? props.data.Why2.map((d, i) => (
                            <li key={`${d.title}-${i}`} onClick={() => toggleAbout(i + props.data.Why.length)}>
                              <FontAwesomeIcon icon={activeIndex === i + props.data.Why.length ? faSquareMinus : faSquarePlus} />
                              <strong>{d.title}</strong>
                              {activeIndex === i + props.data.Why.length && <p>{d.description}</p>}
                            </li>
                          ))
                        : "loading"}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
