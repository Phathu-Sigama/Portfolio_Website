import { cv, type SectionId } from "@/data/cv";
import ContactForm from "./ContactForm";
import PixelIcon from "./PixelIcon";
import Portrait from "./Portrait";
import styles from "./SectionContent.module.css";

/**
 * Renders one CV section from data/cv.ts.
 * Used unchanged by the desktop windows, the mobile apps and the no-JavaScript fallback;
 * only the surrounding CSS differs.
 */
export default function SectionContent({ id }: { id: SectionId }) {
  return <div className={styles.content}>{render(id)}</div>;
}

function Tags({ items, label }: { items: string[]; label: string }) {
  return (
    <ul className={styles.tags} aria-label={label}>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function render(id: SectionId) {
  const { identity, contact } = cv;

  switch (id) {
    case "profile":
      return (
        <>
          <div className={styles.identity}>
            <Portrait />
            <div>
              <h2 className={styles.name}>{identity.name}</h2>
              <ul className={styles.plain}>
                <li>{identity.title}</li>
                <li>{identity.degree}</li>
                <li>{identity.location}</li>
                <li>{identity.expected}</li>
              </ul>
            </div>
          </div>
          <h3 className={styles.heading}>Professional profile</h3>
          {cv.profile.map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
        </>
      );

    case "education":
      return (
        <>
          {cv.education.map((entry) => (
            <article key={entry.qualification} className={styles.entry}>
              <header className={styles.entryHeader}>
                <h3 className={styles.entryTitle}>{entry.qualification}</h3>
                <span className={styles.badge}>{entry.status}</span>
              </header>
              <p className={styles.org}>{entry.institution}</p>
              {entry.subjects && (
                <>
                  <h4 className={styles.subheading}>Subjects</h4>
                  <Tags items={entry.subjects} label={`${entry.qualification} subjects`} />
                </>
              )}
            </article>
          ))}
        </>
      );

    case "projects":
      return (
        <>
          {cv.projects.map((project) => (
            <article key={project.name} className={styles.entry}>
              <header className={styles.entryHeader}>
                <h3 className={styles.entryTitle}>
                  {project.name}
                  {project.tagline && <span className={styles.tagline}> — {project.tagline}</span>}
                </h3>
                {project.status && <span className={styles.badge}>{project.status}</span>}
              </header>
              {project.context && <p className={styles.org}>{project.context}</p>}
              {project.link && (
                <p>
                  <a href={project.link.href} target="_blank" rel="noopener noreferrer">
                    {project.link.label}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </p>
              )}
              <ul className={styles.bullets}>
                {project.highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <Tags items={project.stack} label={`${project.name} technologies`} />
            </article>
          ))}
        </>
      );

    case "experience":
      return (
        <>
          {cv.experience.map((job) => (
            <article key={job.role} className={styles.entry}>
              <header className={styles.entryHeader}>
                <h3 className={styles.entryTitle}>{job.role}</h3>
                <span className={styles.badge}>{job.period}</span>
              </header>
              <p className={styles.org}>{job.organisation}</p>
              <ul className={styles.bullets}>
                {job.highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
          <article className={styles.entry}>
            <h3 className={styles.entryTitle}>Leadership &amp; professional development</h3>
            <ul className={styles.bullets}>
              {cv.leadership.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </>
      );

    case "skills":
      return (
        <dl className={styles.skills}>
          {cv.skills.map((group) => (
            <div key={group.category} className={styles.skillGroup}>
              <dt>{group.category}</dt>
              <dd>
                <Tags items={group.items} label={group.category} />
              </dd>
            </div>
          ))}
        </dl>
      );

    case "certifications":
      return cv.certifications.length === 0 ? (
        <div className={styles.empty}>
          <PixelIcon name="certifications" size={64} />
          <p>
            <strong>No certifications added yet.</strong>
          </p>
          <p>Check back for future updates.</p>
        </div>
      ) : (
        <ul className={styles.bullets}>
          {cv.certifications.map((cert) => (
            <li key={cert.name}>
              <strong>{cert.name}</strong> — {cert.issuer}, {cert.year}
            </li>
          ))}
        </ul>
      );

    case "contact":
      return (
        <>
          <dl className={styles.contactList}>
            <div>
              <dt>Email</dt>
              <dd>
                <a href={`mailto:${contact.email}`}>{contact.email}</a>
              </dd>
            </div>
            <div>
              <dt>Phone</dt>
              <dd>
                <a href={contact.phoneHref}>{contact.phone}</a>
              </dd>
            </div>
            <div>
              <dt>Location</dt>
              <dd>{contact.location}</dd>
            </div>
            <div>
              <dt>GitHub</dt>
              <dd>
                {contact.github ? (
                  <a href={contact.github} target="_blank" rel="noopener noreferrer">
                    {contact.github.replace(/^https?:\/\//, "")}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                ) : (
                  "Not linked yet"
                )}
              </dd>
            </div>
            <div>
              <dt>References</dt>
              <dd>{cv.references}</dd>
            </div>
          </dl>
          <p>
            <a className={styles.button} href={contact.cvFile} download={contact.cvFileName}>
              Download CV (PDF)
            </a>
          </p>
          <h3 className={styles.heading}>Send a message</h3>
          <ContactForm email={contact.email} />
        </>
      );
  }
}
