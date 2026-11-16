import { about } from "@/data/cv";

/** The "About Phathu OS" paragraphs from data/cv.ts, shared by the desktop and mobile interfaces. */
export default function AboutText() {
  return (
    <>
      {about.map((paragraph, index) => (
        <p key={index}>
          {paragraph.map((run, i) => {
            if (typeof run === "string") return run;
            if (run.href) {
              return (
                <a key={i} href={run.href} target="_blank" rel="noopener noreferrer">
                  {run.text}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              );
            }
            return run.strong ? <strong key={i}>{run.text}</strong> : run.text;
          })}
        </p>
      ))}
    </>
  );
}
