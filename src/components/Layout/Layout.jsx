/**
 * Layout.jsx - High-level layout component
 *
 * Neutral gradient background with header and main content sections
 */

export default function Layout({ header, mainContent }) {
  return (
    <div className="h-screen bg-gradient-to-b from-neutral-950 to-neutral-900 text-neutral-100 font-sans flex flex-col">
      {/* Header Section */}
      {header && (
        <header className="shrink-0 flex items-center justify-between px-4 py-1 border-b border-neutral-600">
          {header}
        </header>
      )}

      {/* Main Content Area */}
      {mainContent && (
        <main className="flex-1 flex flex-col border-r border-neutral-600 overflow-y-auto min-h-0">
          {mainContent}
        </main>
      )}
    </div>
  );
}
