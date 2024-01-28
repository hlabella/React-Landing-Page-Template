import React from "react";

const EmbedVideo = (props) => {
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: `
          <video
            loop
            muted
            controls="true"
            autoplay="autoplay"
            playsinline
            class="${props.className}"
          ><source src="img/jumbotronvid.mp4" type="video/mp4"></video>
        `,
      }}
    ></div>
  );
};

export default EmbedVideo;