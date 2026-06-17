import type { MouseEvent, ReactNode } from 'react'

interface FieldProps {
  label: string
  value: string | number
  onChange: (value: string) => void
  type?: 'text' | 'number' | 'date' | 'email'
  placeholder?: string
}

export function Field({ label, value, onChange, type = 'text', placeholder }: FieldProps) {
  // Open the native date picker when clicking anywhere in the field, not just the icon.
  function handleClick(e: MouseEvent<HTMLInputElement>) {
    if (type !== 'date') return
    try {
      e.currentTarget.showPicker()
    } catch {
      /* showPicker unsupported — fall back to default behaviour */
    }
  }

  return (
    <label className="field">
      <span>{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        step={type === 'number' ? 'any' : undefined}
        onClick={handleClick}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  )
}

export function FieldRow({ children }: { children: ReactNode }) {
  return <div className="field-row">{children}</div>
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="card">
      <h2>{title}</h2>
      {children}
    </section>
  )
}
