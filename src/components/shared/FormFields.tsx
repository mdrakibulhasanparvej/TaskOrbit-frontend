import type {
  HTMLInputAutoCompleteAttribute,
  HTMLInputTypeAttribute,
} from "react";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type InputMode =
  | "email"
  | "search"
  | "tel"
  | "text"
  | "url"
  | "none"
  | "numeric"
  | "decimal";

type InputValue<TType extends HTMLInputTypeAttribute> = TType extends "number"
  ? number | undefined
  : string;

interface FormFieldProps<TType extends HTMLInputTypeAttribute = "text"> {
  id: string;
  label: string;
  isInvalid: boolean;
  value: InputValue<TType>;
  onChange: (value: InputValue<TType>) => void;
  onBlur: () => void;
  errors?: Array<{ message?: string } | undefined>;
  disabled?: boolean;
  type?: HTMLInputTypeAttribute;
  autoComplete?: HTMLInputAutoCompleteAttribute;
  inputMode?: InputMode;
  min?: string | number;
  step?: string | number;
  className?: string;
}

export function FormField<TType extends HTMLInputTypeAttribute = "text">({
  id,
  label,
  value,
  onBlur,
  onChange,
  isInvalid,
  errors,
  disabled = false,
  type = "text" as TType,
  autoComplete,
  inputMode,
  min,
  step,
  className,
}: FormFieldProps<TType>) {
  return (
    <Field data-invalid={isInvalid} className={className}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Input
        id={id}
        name={id}
        type={type}
        autoComplete={autoComplete}
        inputMode={inputMode}
        min={min}
        step={step}
        value={value ?? ""}
        onBlur={onBlur}
        onChange={(e) => {
          const inputValue = e.target.value;
          const nextValue =
            type === "number"
              ? inputValue === ""
                ? undefined
                : Number(inputValue)
              : inputValue;
          onChange(nextValue as InputValue<TType>);
        }}
        aria-invalid={isInvalid}
        disabled={disabled}
      />
      {isInvalid && <FieldError errors={errors} />}
    </Field>
  );
}

type NumberFieldProps = Omit<FormFieldProps<"number">, "type">;

export function NumberField(props: NumberFieldProps) {
  return <FormField<"number"> {...props} type="number" />;
}

export function getDirtyFields<T extends Record<string, unknown>>(
  values: T,
  isDirty: (field: keyof T) => boolean,
): Partial<T> {
  return Object.fromEntries(
    Object.entries(values).filter(([field]) => isDirty(field as keyof T)),
  ) as Partial<T>;
}
