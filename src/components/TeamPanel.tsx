import type { Person } from "../types";
import type { Action } from "../state/useAppState";
import { Field } from "./Field";
import { Section } from "./Section";
import { CheckIcon, PlusIcon } from "./Icons";

interface Props {
  team: Person[];
  active: Person;
  dispatch: React.Dispatch<Action>;
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "+";
  return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
}

export function TeamPanel({ team, active, dispatch }: Props) {
  const set = (key: keyof Person) => (value: string) => dispatch({ type: "person", id: active.id, patch: { [key]: value } });
  const summary = `${team.length} ${team.length === 1 ? "Person" : "Personen"}`;
  const firstName = active.name.trim().split(/\s+/)[0];

  return (
    <Section title="Team" summary={summary}>
      <div className="group">
        <ul className="card team-list">
          {team.map((p) => {
            const current = p.id === active.id;
            return (
              <li key={p.id}>
                <button type="button" aria-current={current} onClick={() => dispatch({ type: "select", id: p.id })}>
                  <span className="avatar" aria-hidden="true">{initials(p.name)}</span>
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
