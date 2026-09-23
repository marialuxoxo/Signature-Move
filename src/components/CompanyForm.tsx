import type { Brand } from "../types";
import type { Action } from "../state/useAppState";
import { Field } from "./Field";

interface Props {
  brand: Brand;
  dispatch: React.Dispatch<Action>;
}

export function CompanyForm({ brand, dispatch }: Props) {
  const set = (key: keyof Brand) => (value: string) => dispatch({ type: "brand", patch: { [key]: value } });
  return (
    <section className="block" aria-labelledby="h-company">
      <h2 id="h-company">Firmendaten</h2>
      <p className="hint">Einmal eintragen, gilt für alle Mitarbeitenden.</p>
      <Field label="Firmenname" value={brand.name} onChange={set("name")} />
      <Field label="Zusatzzeile oder Claim" value={brand.claim} onChange={set("claim")} />
      <Field label="Straße und Hausnummer" value={brand.street} onChange={set("street")} />
      <div className="row2">
        <Field label="PLZ und Ort" value={brand.city} onChange={set("city")} />
        <Field label="Telefon Zentrale" value={brand.phone} onChange={set("phone")} />
      </div>
      <div className="row2">
        <Field label="Website" value={brand.web} onChange={set("web")} />
        <Field label="Notdienst (optional)" value={brand.emergency} onChange={set("emergency")} />
      </div>
      <Field label="Geschäftsführung" value={brand.ceo} onChange={set("ceo")} />
      <div className="row2">
        <Field label="Registergericht, HRB" value={brand.register} onChange={set("register")} />
        <Field label="USt-IdNr." value={brand.vat} onChange={set("vat")} />
      </div>
      <Field label="Bankverbindung (Briefkopf)" value={brand.bank} onChange={set("bank")} />
    </section>
  );
}
