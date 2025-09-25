import { useModal } from '../../hooks/useModal';

type ContextModalContainerProps = {
  containerOnly?: boolean;
  children: React.ReactNode;
};

export default function ContextModalContainer({
  containerOnly,
  children,
}: ContextModalContainerProps) {
  if (containerOnly) {
    return (
      <div className="flex-1 flex flex-col relative w-full h-full bg-transparent shadow-[0_10px_40px_rgba(0,0,0,0.2)]">
        {children}
      </div>
    );
  }
  const { close } = useModal();

  return (
    <div className="flex-1 flex flex-col relative w-full h-full bg-transparent shadow-[0_10px_40px_rgba(0,0,0,0.2)]">
      <button
        className="
      p-[0.25rem] pt-[0.1rem] absolute top-0 right-0
      bg-transparent border-0
      text-[1.75rem] leading-none cursor-pointer
      text-gray-400
      transition-colors duration-200 ease-in-out
      hover:text-gray-800"
        onClick={close}
      >
        &times;
      </button>
      <div
        className="flex-1 p-1 w-full h-full"
        style={{ paddingTop: 'calc(0.1rem + 1.5rem)' }}
      >
        {children}
      </div>
    </div>
  );
}
