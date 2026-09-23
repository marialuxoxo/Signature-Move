import type { Person } from "../types";
import type { Action } from "../state/useAppState";
import { Field } from "./Field";

interface Props {
  team: Person[];
  active: Person;
  dispatch: React.Dispatch<Action>;
}

export function TeamPanel({ team, active, dispatch }: Props) {
  const set = (key: keyof Person) => (value: string) => dispatch({ type: "person", id: active.id, patch: { [key]: value } });
  return (
    <section className="block" aria-labelledby="h-team">
      <h2 id="h-team">Team</h2>
      <p className="hint">
        {team.length} {team.length === 1 ? "Person" : "Personen"}. Ändert sich Logo oder Farbe, ändern sich alle Vorlagen mit.
      </p>
      <ul className="team-list">
        {team.map((p) => (
          <li key={p.id}>
            <button type="button" aria-current={p.id === active.id} onClick={() => dispatch({ type: "select", id: p.id })}>
              <span>{p.name || "Neue Person"}</span>
              <small>{p.role}</small>
            </button>
          </li>
        ))}
      </ul>
      <div className="team-actions">
        <button className="btn small" type="button" onClick={() => dispatch({ type: "addPerson" })}>Person hinzufügen</button>
        <button className="btn small ghost" type="button" disabled={team.length < 2} onClick={() => dispatch({ type: "removePerson", id: active.id })}>
          Ausgewählte entfernen
        </button>
      </div>
      <div className="editing">
        <h3>{active.name || "Neue Person"} bearbeiten</h3>
        <Field label="Name" value={active.name} onChange={set("name")} />
        <Field label="Funktion" value={active.role} onChange={set("role")} />
        <div className="row2">
          <Field label="Telefon Durchwahl" value={active.phone} onChange={set("phone")} />
          <Field label="Mobil" value={active.mobile} onChange={set("mobile")} />
        </div>
        <Field label="E-Mail" type="email" value={active.email} onChange={set("email")} />
      </div>
    </section>
  );
}
