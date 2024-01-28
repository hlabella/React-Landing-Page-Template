import React from "react";

const EmbedVideo = (props) => {
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: `
          <video
            loop
            muted
            autoplay="autoplay"
            playsinline
            src="${props.src}"
            class="${props.className}"
          ></video>
        `,
      }}
    ></div>
  );
};

export default EmbedVideo;