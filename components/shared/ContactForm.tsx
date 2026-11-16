"use client";

import { useId, useState, type FormEvent } from "react";
import styles from "./SectionContent.module.css";

/**
 * A backend-free contact form: it composes an email in the visitor's own mail app.
 * Nothing is sent to or stored on a server.
 */
export default function ContactForm({ email }: { email: string }) {
  const uid = useId();
  const [status, setStatus] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    const subject = `Portfolio enquiry from ${name}`;
    const body = `${message}\n\n— ${name}`;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setStatus(`Opening your email app… If nothing happens, write to ${email} directly.`);
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label htmlFor={`${uid}-name`}>Your name</label>
        <input id={`${uid}-name`} name="name" type="text" autoComplete="name" required maxLength={80} />
      </div>
      <div className={styles.field}>
        <label htmlFor={`${uid}-message`}>Message</label>
        <textarea id={`${uid}-message`} name="message" rows={4} required maxLength={2000} />
      </div>
      <p className={styles.hint}>Sending opens a draft in your own email app.</p>
      <button type="submit" className={styles.button}>
        Compose email
      </button>
      <p className={styles.status} role="status">
        {status}
      </p>
    </form>
  );
}
