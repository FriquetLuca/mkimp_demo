import { createContext, useContext } from "react";

export type ModalSettings = {
  containerOnly: boolean;
};

type ModalContextType = {
  open: (content: React.ReactNode, settings?: Partial<ModalSettings>) => void;
  close: () => void;
};

export const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = (): ModalContextType => {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModal must be used within ModalProvider");
  return ctx;
};
