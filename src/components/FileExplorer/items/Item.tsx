export default function Item({ icon, name, isSelected }: { icon: React.ReactNode, name: string, isSelected: boolean }) {
    return (
        <p style={{ padding: 2, margin: 2, backgroundColor: isSelected ? 'var(--md-cspan-bg-color)' : 'transparent', }}>{icon} {name}</p>
    )    
}
