import { GUIDE_HEADER } from "../content/guide";

type GuideEntryProps = {
  title: string;
  body: string;
};

/** Compact Ch.11 sidebar with light Guide styling — not the main lesson block. */
export function GuideEntry({ title, body }: GuideEntryProps) {
  return (
    <aside className="guide-entry" aria-label="Ch.11 Guide sidebar">
      <p className="guide-kicker">{GUIDE_HEADER}</p>
      <h3 className="guide-title">{title}</h3>
      <p className="guide-body">{body}</p>
    </aside>
  );
}
