export default function HeaderTitleTagline({
  title,
  tagline,
}) {
  return (
    <div className="flex flex-col w-full py-1">
      <h1 className="text-3xl font-bold tracking-wide">
        {title}
      </h1>
      <p className="text-sm text-neutral-400">{tagline}</p>
    </div>
  );
}
