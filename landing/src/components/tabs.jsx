import { cn } from "../utils";

export default function Tabs({
  tabs = [],
  activeTabId = "",
  onTabClick = () => {},
  tabsListClassName = "",
}) {
  return (
    <div>
      <TabsList
        className={tabsListClassName}
        tabs={tabs}
        activeTabId={activeTabId}
        onTabClick={onTabClick}
      />

      <div className="mt-10">
        {tabs.map((tab, idx) => (
          <div
            key={idx}
            className={cn("hidden", activeTabId === tab.id && "!block")}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
}

function TabsList({
  className,
  tabs = [],
  activeTabId,
  onTabClick = () => {},
}) {
  return (
    <div className={className}>
      <ul className="flex p-1.5 rounded-lg bg-neutral300">
        {tabs.map((tab, idx) => {
          const active = activeTabId === tab.id;

          return (
            <li
              key={idx}
              role="button"
              className={cn(
                "flex-1 flex items-center justify-center py-2 px-8 rounded",
                active && "bg-neutral100",
              )}
              onClick={() => onTabClick(tab)}
            >
              {tab.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
