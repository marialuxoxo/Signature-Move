import { useId, useRef } from "react";
import type { Person } from "../types";
import type { Action } from "../state/useAppState";
import { makePortrait } from "../lib/browser";
import { Field } from "./Field";
import { Section } from "./Section";
import { CheckIcon, PlusIcon } from "./Icons";

interface Props {
  team: Person[];
  active: Person;
  dispatch: React.Dispatch<Action>;
  notify: (msg: string, isError?: boolean) => void;
}

const PHOTO_TYPES = ["image/png", "image/jpeg", "image/webp"];

function Avatar({ person, className = "avatar" }: { person: Person; className?: string }) {
  return person.photo ? (
    <img className={`${className} avatar-photo`} src={person.photo} alt="" />
  ) : (
    <span className={className} aria-hidden="true">{initials(person.name)}</span>
  );
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "+";
  return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
}

export function TeamPanel({ team, active, dispatch, notify }: Props) {
  const set = (key: keyof Person) => (value: string) => dispatch({ type: "person", id: active.id, patch: { [key]: value } });
  const summary = `${team.length} ${team.length === 1 ? "Person" : "Personen"}`;
  const firstName = active.name.trim().split(/\s+/)[0];
  const fileInput = useRef<HTMLInputElement>(null);
  const photoId = useId();

  async function handlePhoto(file?: File) {
    if (!file) return;
    if (!PHOTO_TYPES.includes(file.type)) return notify("Bitte ein Foto als JPG, PNG oder WebP wählen.", true);
    if (file.size > 8 * 1024 * 1024) return notify("Das Foto ist größer als 8 MB. Bitte ein kleineres wählen.", true);
    try {
      const photo = await makePortrait(file);
      dispatch({ type: "person", id: active.id, patch: { photo } });
      notify("Foto übernommen und rund zugeschnitten.");
    } catch {
      notify("Das Foto ließ sich nicht öffnen. Bitte ein anderes versuchen.", true);
    }
  }

  return (
    <Section title="Team" summary={summary}>
      <div className="group">
        <ul className="card team-list">
          {team.map((p) => {
            const current = p.id === active.id;
            return (
              <li key={p.id}>
                <button type="button" aria-current={current} onClick={() => dispatch({ type: "select", id: p.id })}>
                  <Avatar person={p} />
                  <span className="team-person">
                    <span className="team-name">{p.name || "Neue Person"}</span>
                    <span className="team-role">{p.role || "Funktion fehlt"}</span>
                  </span>
                  {current && <CheckIcon className="team-check" />}
                </button>
              </li>
            );
          })}
          <li>
            <button type="button" className="team-add" onClick={() => dispatch({ type: "addPerson" })}>
              <span className="avatar avatar-add" aria-hidden="true"><PlusIcon /></span>
              Person hinzufügen
            </button>
          </li>
        </ul>
        <p className="footnote">Neues Logo oder neue Farbe? Alle Vorlagen im Team ziehen automatisch mit.</p>
      </div>

      <div className="group">
        <h3 className="group-title">Angaben für {active.name || "die neue Person"}</h3>
        <div className="card">
          <div className="photo-row">
            <Avatar person={active} className="avatar avatar-large" />
            <div className="photo-row-text">
              <span className="photo-row-title">Porträtfoto</span>
              <span className="photo-row-actions">
                <label className="btn-link" htmlFor={photoId}>{active.photo ? "Anderes Foto wählen" : "Foto hochladen"}</label>
                {active.photo && (
                  <button className="btn-link btn-destructive-inline" type="button" onClick={() => dispatch({ type: "person", id: active.id, patch: { photo: "" } })}>
                    Entfernen
                  </button>
                )}
              </span>
            </div>
            <input
              ref={fileInput}
              id={photoId}
              className="visually-hidden"
              type="file"
              accept={PHOTO_TYPES.join(",")}
              onChange={(e) => { handlePhoto(e.target.files?.[0]); if (fileInput.current) fileInput.current.value = ""; }}
            />
          </div>
          <Field label="Name" value={active.name} onChange={set("name")} />
          <Field label="Funktion" value={active.role} onChange={set("role")} />
          <div className="row2">
            <Field label="Telefon Durchwahl" value={active.phone} onChange={set("phone")} />
            <Field label="Mobil" value={active.mobile} onChange={set("mobile")} />
          </div>
          <Field label="E-Mail" type="email" value={active.email} onChange={set("email")} />
        </div>
        {team.length > 1 && (
          <button className="btn-link btn-destructive" type="button" onClick={() => dispatch({ type: "removePerson", id: active.id })}>
            {firstName ? `${firstName} entfernen` : "Person entfernen"}
          </button>
        )}
      </div>
    </Section>
  );
}
