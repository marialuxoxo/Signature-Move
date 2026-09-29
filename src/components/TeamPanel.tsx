import type { Person } from "../types";
import type { Action } from "../state/useAppState";
import { Field } from "./Field";
import { Section } from "./Section";
import { PlusIcon } from "./Icons";

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

  return (
    <Section step={3} title="Team" summary={summary}>
      <p className="step-intro">Neues Logo oder neue Farbe? Alle Vorlagen im Team ziehen automatisch mit.</p>
      <ul className="team-list">
        {team.map((p) => (
          <li key={p.id}>
            <button type="button" aria-current={p.id === active.id} onClick={() => dispatch({ type: "select", id: p.id })}>
              <span className="avatar" aria-hidden="true">{initials(p.name)}</span>
              <span className="team-person">
                <span className="team-name">{p.name || "Neue Person"}</span>
                <span className="team-role">{p.role || "Funktion fehlt"}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
      <div className="team-actions">
        <button className="btn btn-secondary btn-small" type="button" onClick={() => dispatch({ type: "addPerson" })}>
          <PlusIcon /> Person hinzufügen
        </button>
        <button className="btn btn-quiet btn-small" type="button" disabled={team.length < 2} onClick={() => dispatch({ type: "removePerson", id: active.id })}>
          {active.name ? `${active.name.split(" ")[0]} entfernen` : "Entfernen"}
        </button>
      </div>
      <div className="group person-form">
        <h3 className="group-title">Angaben für {active.name || "die neue Person"}</h3>
        <Field label="Name" value={active.name} onChange={set("name")} />
        <Field label="Funktion" value={active.role} onChange={set("role")} />
        <div className="row2">
          <Field label="Telefon Durchwahl" value={active.phone} onChange={set("phone")} />
          <Field label="Mobil" value={active.mobile} onChange={set("mobile")} />
        </div>
        <Field label="E-Mail" type="email" value={active.email} onChange={set("email")} />
      </div>
    </Section>
  );
}
