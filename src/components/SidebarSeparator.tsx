
type SidebarSeparatorProps = {
    onMouseDown?: React.MouseEventHandler<HTMLDivElement> | undefined;
};

export default function SidebarSeparator({
    onMouseDown
}: SidebarSeparatorProps) {
    return (
        <div
            onMouseDown={onMouseDown}
            style={{
                width: '4px',
                cursor: 'col-resize',
                zIndex: 100,
            }}
        >
            <div style={{ width: 1, height: '100%', backgroundColor: '#555', }}></div>
        </div>
    );
}
