export default function Item({ icon, name, isSelected }: { icon: React.ReactNode, name: string, isSelected: boolean }) {
    return (
        <p style={{ padding: 2, margin: 2, backgroundColor: isSelected ? '#333' : 'transparent', }}>{icon} {name}</p>
    )    
}
