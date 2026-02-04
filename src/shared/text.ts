export const normalizeBase = (base: string) => base.split('-')[0]

export const normalizeInput = (value: string) =>
  value.replace(/\s+/g, '').replace(/[・／/、,]/g, '').trim()

export const splitMeaningInput = (value: string) =>
  value
    .split(/[・／/、,\\s]+/)
    .map((part) => normalizeInput(part))
    .filter(Boolean)
