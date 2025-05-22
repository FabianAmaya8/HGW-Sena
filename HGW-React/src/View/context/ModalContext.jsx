import React, { createContext, useContext, useRef } from 'react';
import Modal from 'bootstrap/js/dist/modal';

const ModalContext = createContext();

export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children }) => {
  const loginModalRef = useRef(null);

  const showLoginModal = () => {
    if (loginModalRef.current) {
      const modal = new Modal(loginModalRef.current, {
        backdrop: false // <--- Desactiva el backdrop
      });
      modal.show();
    }
  };

  return (
    <ModalContext.Provider value={{ showLoginModal, loginModalRef }}>
      {children}
    </ModalContext.Provider>
  );
};
