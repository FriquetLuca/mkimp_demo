import React, { useCallback, useState } from 'react';
import { createPortal } from 'react-dom';
import { ModalContext, type ModalSettings } from '../hooks/useModal';
import ContextModalContainer from '../components/ContextMenuModals/ContextModalContainer';

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [modalContent, setModalContent] = useState<React.ReactNode | null>(
    null
  );

  const open = useCallback(
    (content: React.ReactNode, settings: Partial<ModalSettings> = {}) => {
      setModalContent(
        <ContextModalContainer containerOnly={settings?.containerOnly}>
          {content}
        </ContextModalContainer>
      );
    },
    []
  );

  const close = useCallback(() => {
    setModalContent(null);
  }, []);

  return (
    <ModalContext.Provider value={{ open, close }}>
      {children}
      {createPortal(
        modalContent ? (
          <div
            className="modal-backdrop"
            onClick={close} // Clicking backdrop triggers close
          >
            <div
              className="modal"
              onClick={(e) => e.stopPropagation()} // Prevent close when clicking inside modal
            >
              {modalContent}
            </div>
          </div>
        ) : null,
        document.body
      )}
    </ModalContext.Provider>
  );
};
