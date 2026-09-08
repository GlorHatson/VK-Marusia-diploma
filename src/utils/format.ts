// src/utils/format.ts

export const formatRuntime = (minutes?: number): string => {
  if (!minutes) return '—';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours > 0 ? `${hours} ч ` : ''}${mins} мин`;
};

export const formatCurrency = (value?: number | null): string => {
  if (!value) return '—';
  return new Intl.NumberFormat('ru-RU').format(value) + ' руб.';
};