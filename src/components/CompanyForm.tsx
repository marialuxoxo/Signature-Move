import type { Brand } from "../types";
import type { Action } from "../state/useAppState";
import { Field } from "./Field";
import { Section } from "./Section";

interface Props {
  brand: Brand;
  dispatch: React.Dispatch<Action>;
}

export function CompanyForm({ brand, dispatch }: Props) {
  const set = (key: keyof Brand) => (value: string) => dispatch({ type: "brand", patch: { [key]: value } });
  const summary = brand.name ? [brand.name, brand.city.replace(/^\d+\s*/, "")].filter(Boolean).join(", ") : "Noch keine Firmendaten";

  return (
    <Section step={2} title="Firmendaten" summary={summary}>
      <p className="step-intro">Einmal eintragen, gilt fürs ganze Team.</p>
      <div className="group">
        <h3 className="group-title">Anschrift und Kontakt</h3>
        <Field label="Firmenname" value={brand.name} onChange={set("name")} />
        <Field label="Zusatzzeile oder Claim" value={brand.claim} onChange={set("claim")} />
        <Field label="Straße und Hausnummer" value={brand.street} onChange={set("street")} />
        <Field label="PLZ und Ort" value={brand.city} onChange={set("city")} />
        <div className="row2">
          <Field label="Telefon Zentrale" value={brand.phone} onChange={set("phone")} />
          <Field label="Notdienst (optional)" value={brand.emergency} onChange={set("emergency")} />
        </div>
        <Field label="Website" value={brand.web} onChange={set("web")} />
      </div>
      <div className="group">
        <h3 className="group-title">Pflichtangaben</h3>
        <Field label="Geschäftsführung" value={brand.ceo} onChange={set("ceo")} />
        <Field label="Registergericht und HRB" value={brand.register} onChange={set("register")} />
        <Field label="USt-IdNr." value={brand.vat} onChange={set("vat")} />
        <Field label="Bankverbindung (Briefkopf)" value={brand.bank} onChange={set("bank")} />
      </div>
    </Section>
  );
}
