import React, { createContext, useContext, useRef } from 'react';
import Modal from 'bootstrap/js/dist/modal';

const ModalContext = createContext();

export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children }) => {
  const loginModalRef = useRef(null);
  const modalRef = useRef(null);

  const showLoginModal = () => {
    if (!modalRef.current) {
      modalRef.current = new Modal(loginModalRef.current, {
        backdrop: false
      });
    }
    modalRef.current.show();
  };

  return (
    <ModalContext.Provider value={{ showLoginModal, loginModalRef }}>
      {children}
    </ModalContext.Provider>
  );
};
