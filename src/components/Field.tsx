interface FieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}

export function Field({ label, value, onChange, type = "text" }: FieldProps) {
  return (
    <label className="field">
      {label}
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}
