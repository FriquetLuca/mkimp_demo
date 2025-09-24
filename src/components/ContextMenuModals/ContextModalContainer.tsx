import { useModal } from "../../hooks/useModal";

type ContextModalContainerProps = {
  containerOnly?: boolean;
  children: React.ReactNode;
}

export default function ContextModalContainer({ containerOnly, children }: ContextModalContainerProps) {
  if(containerOnly) {
    return (
      <div className="modal-container">
        {children}
      </div>
    );
  }
  const { close } = useModal();
  
  return (
    <div className="modal-container">
      <button className="modal-close-button" onClick={close}>
        &times;
      </button>
      <div className="modal-content">
        {children}
      </div>
    </div>
  );
}
