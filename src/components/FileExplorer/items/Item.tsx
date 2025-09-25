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
    <p
      className={`px-2 pt-1 pb-1 ${
        isSelected ? 'bg-[var(--md-cspan-bg-color)]' : 'bg-transparent'
      }`}
    >
      {icon} {name}
    </p>
  );
}
