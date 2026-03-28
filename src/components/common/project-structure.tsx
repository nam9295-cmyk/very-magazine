const projectStructure = [
  "src/",
  "app/",
  "globals.css",
  "layout.tsx",
  "page.tsx",
  "components/",
  "common/",
  "project-structure.tsx",
  "lib/",
  "site.ts",
];

export function ProjectStructure() {
  return (
    <div className="mt-8 rounded-[1.5rem] bg-stone-950 p-5 text-sm text-stone-200">
      <div className="grid gap-2 font-mono">
        {projectStructure.map((entry, index) => (
          <div
            key={entry}
            className="flex items-center gap-3 rounded-xl border border-white/5 px-3 py-2"
          >
            <span className="w-6 text-right text-stone-500">{index + 1}</span>
            <span>{entry}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
