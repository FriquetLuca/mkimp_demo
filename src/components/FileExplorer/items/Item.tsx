export default function Item({
  icon,
  name,
  isSelected,
}: {
  icon: React.ReactNode;
  name: string;
  isSelected: boolean;
}) {
  return (
    <div
      className={`flex items-center py-1 ${isSelected ? 'bg-[var(--md-cspan-bg-color)]' : 'bg-transparent'}`}
    >
      {icon}
      <p className="px-1">{name}</p>
    </div>
  );
}
