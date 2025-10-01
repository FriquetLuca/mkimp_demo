import React, { useCallback, useState } from 'react';
import { createPortal } from 'react-dom';
import { ModalContext, type ModalSettings } from '../hooks/useModal';
import ContextModalContainer from '../components/ContextMenuModals/ContextModalContainer';

type ModalState = {
  content: React.ReactNode;
  settings: Partial<ModalSettings>;
} | null;

interface ModalProviderProps {
  children: React.ReactNode;
}

export function ModalProvider({ children }: ModalProviderProps) {
  const [modalState, setModalState] = useState<ModalState>(null);

  const open = useCallback(
    (content: React.ReactNode, settings: Partial<ModalSettings> = {}) => {
      setModalState({
        content: (
          <ContextModalContainer containerOnly={settings?.containerOnly}>
            {content}
          </ContextModalContainer>
        ),
        settings,
      });
    },
    []
  );

  const close = useCallback(() => {
    setModalState(null);
  }, []);

  return (
    <ModalContext.Provider value={{ open, close }}>
      {children}
      {createPortal(
        modalState ? (
          <div
            className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex justify-center items-center z-[1000]"
            onClick={modalState.settings.static === true ? undefined : close}
          >
            <div
              className="bg-[var(--md-bg-color)] rounded-[8px] shadow-[0_10px_40px_rgba(0,0,0,0.2)] min-w-[300px] max-w-[90vw] min-h-[100px] max-h-[90vh] overflow-auto relative flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {modalState.content}
            </div>
          </div>
        ) : null,
        document.body
      )}
    </ModalContext.Provider>
  );
}
