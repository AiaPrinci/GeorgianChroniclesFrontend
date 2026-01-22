import './App.css';
import { useEffect } from 'react';

const Alert = ({ message, type = "success", visible, duration = 3000, onClose }) => {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onClose && onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [visible, duration, onClose]);

  return (
    <div className={`Alert ${visible ? "show" : ""} ${type}`}>
      <p>{message}</p>
    </div>
  );
};

export default Alert;