import React from "react";

export const Team = (props) => {
  return (
    <div id="team" className="text-center">
      <div className="container">
        <div className="col-md-8 col-md-offset-2 section-title">
          <h2>Conheça o time</h2>
        </div>
        <div id="row">
          {props.data
            ? props.data.map((d, i) => (
                <a key={`${d.name}-${i}`} href={d.linkedin}>
                  <div className="col-md-6 col-sm-6 team">
                    <div className="thumbnail">
                      {" "}
                      <img src={d.img} alt="..." className="team-img" />
                      <div className="caption">
                        <h4>{d.name}</h4>
                        <p>{d.job}</p>
                      </div>
                    </div>
                  </div>
                </a>
              ))
            : "loading"}
        </div>
      </div>
    </div>
  );
};
