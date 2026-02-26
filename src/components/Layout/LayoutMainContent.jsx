export default function LayoutMainContent({
  children,
  className = '',
}) {
  return (
    <div
      className={`flex-1 flex flex-col bg-neutral-950 p-4 min-h-0 ${className}`}
    >
      {children}
    </div>
  );
}
