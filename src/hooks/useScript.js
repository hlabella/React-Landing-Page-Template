import { useEffect } from 'react';

const useScript = (src, attrs = {}) => {
  useEffect(() => {
    // Create script
    const script = document.createElement('script');
    script.src = src;
    script.async = true;

    // Add any other attributes
    Object.keys(attrs).forEach(key => {
      script.setAttribute(key, attrs[key]);
    });

    // Append script to the body
    document.body.appendChild(script);

    // Remove script on cleanup
    return () => {
      document.body.removeChild(script);
    };
  }, [src, attrs]);
};

export default useScript;