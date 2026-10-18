export const numberFormatter = new Intl.NumberFormat();

export function formatCurrency(value: number, currency = "USD") {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

/** `YYYY-MM` bucket label → short month name (e.g. `2026-03` → `Mar`). */
export function formatMonth(value: string) {
  const [year, month] = value.split("-");
  const date = new Date(Number(year), Number(month) - 1, 1);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString(undefined, { month: "short" });
}

/** 0..1 fraction → whole-percent string (e.g. `0.42` → `42%`). */
export function formatPercent(value: number) {
  return `${Math.round(value * 100)}%`;
}
