export default function BreakpointIndicator() {
  return (
    <div className="fixed right-4 bottom-4 rounded-full bg-gray-900 px-3 py-1.5 font-mono text-xs text-white shadow-lg dark:bg-white dark:text-gray-900">
      <span className="sm:hidden">xs</span>
      <span className="hidden sm:inline md:hidden">sm</span>
      <span className="hidden md:inline lg:hidden">md</span>
      <span className="hidden lg:inline xl:hidden">lg</span>
      <span className="hidden xl:inline">xl</span>
    </div>
  );
}
