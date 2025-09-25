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
      style={{
        padding: 2,
        paddingTop: '.25rem',
        paddingBottom: '.25rem',
        backgroundColor: isSelected
          ? 'var(--md-cspan-bg-color)'
          : 'transparent',
      }}
    >
      {icon} {name}
    </p>
  );
}
