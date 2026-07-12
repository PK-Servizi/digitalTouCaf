export function unwrapApiValue(value) {
  if (value == null) return value;
  if (Array.isArray(value)) return value;
  if (typeof value !== 'object') return value;

  if ('data' in value) return unwrapApiValue(value.data);
  if ('items' in value) return unwrapApiValue(value.items);
  if ('result' in value) return unwrapApiValue(value.result);

  return value;
}

export function unwrapApiList(value) {
  const unwrapped = unwrapApiValue(value);
  return Array.isArray(unwrapped) ? unwrapped : [];
}
