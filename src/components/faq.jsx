import React, { useState } from 'react';

export const Faq = (props) => {
  // State to keep track of the currently active FAQ item
  const [activeIndex, setActiveIndex] = useState(null);

  // Function to handle clicking on a question
  const toggleFaq = (index) => {
    // If the clicked question is already active, close it, otherwise, open the clicked question
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div id="faq" class="text-center">
      <div className="container">
        <div className="section-title">
          <h2>Perguntas Frequentes</h2>
        </div>
        <div className="row">
          {props.data ? (
            props.data.map((faq, index) => (
              <div key={`faq-${index}`} className="col-md-12">
                <div className="faq-item">
                  <h4
                    className="faq-question"
                    onClick={() => toggleFaq(index)}
                    style={{ cursor: 'pointer' }}
                  >
                    {faq.question}
                  </h4>
                  <div className={`faq-answer ${activeIndex === index ? 'active' : ''}`}>
                    {typeof faq.answer === 'string' ? (
                      <p>{faq.answer}</p>
                    ) : (
                      <div>
                        <p>{faq.answer.introduction}</p>
                        <div class="align-items-center"> 
                            <ul className="faq-details-list">
                            {faq.answer.details.map((detail, detailIndex) => (
                                <li key={`detail-${detailIndex}`}>• {detail}</li>
                            ))}
                            </ul>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            'loading'
          )}
        </div>
      </div>
    </div>
  );
};