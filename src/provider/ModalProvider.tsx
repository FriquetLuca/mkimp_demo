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
            className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex justify-center items-center z-[1000]"
            onClick={close}
          >
            <div
              className="bg-[var(--md-bg-color)] rounded-[8px] shadow-[0_10px_40px_rgba(0,0,0,0.2)] min-w-[300px] max-w-[90vw] min-h-[100px] max-h-[90vh] overflow-auto relative flex flex-col"
              onClick={(e) => e.stopPropagation()}
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
