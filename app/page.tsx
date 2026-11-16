import Desktop from "@/components/desktop/Desktop";
import MobileShell from "@/components/mobile/MobileShell";
import BootScreen from "@/components/shared/BootScreen";
import HirePrompt from "@/components/shared/HirePrompt";
import SectionContent from "@/components/shared/SectionContent";
import { cv, sections } from "@/data/cv";

export default function Home() {
  return (
    <>
      <BootScreen />
      <main>
        <h1 className="sr-only">
          {cv.identity.name} — {cv.identity.title} portfolio
        </h1>
        {/* 768px and above: Phathu OS 9 */}
        <div className="desktop-only">
          <Desktop />
        </div>
        {/* Below 768px: Phathu Mobile */}
        <div className="mobile-only">
          <MobileShell />
        </div>
        {/* Without JavaScript the windows cannot open, so show the whole CV as one document. */}
        <HirePrompt />
        <noscript>
          <div className="noscript">
            <h1>
              {cv.identity.name} — {cv.identity.title}
            </h1>
            {sections.map((section) => (
              <section key={section.id} aria-labelledby={`ns-${section.id}`}>
                <h2 id={`ns-${section.id}`}>{section.label}</h2>
                <SectionContent id={section.id} />
              </section>
            ))}
          </div>
        </noscript>
      </main>
    </>
  );
}
