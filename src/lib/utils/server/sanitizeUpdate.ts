export function sanitizeUpdate<T extends Record<string, any>>(
  model: any,
  body: Partial<T>
): Partial<T> {
  if (Object.keys(body).some((k) => k.startsWith('$'))) {
    throw new Error('Invalid update payload');
  }

  const allowed = Object.keys(model.schema.paths).filter(
    (key) => !key.startsWith('_') && key !== 'createdAt' && key !== 'updatedAt'
  );

  const numericFields = Object.entries(model.schema.paths)
    .filter(([_, path]: any) => path.instance === 'Number')
    .map(([key]) => key);

  const sanitized: Partial<T> = {};

  for (const key of allowed) {
    if (!(key in body)) continue;
    let value = body[key as keyof T];
    if (numericFields.includes(key)) {
      if (value === '' || value === null || value === 'null') continue;
      const num = Number(value);
      if (Number.isNaN(num)) continue;
      value = num as T[keyof T];
    }
    sanitized[key as keyof T] = value;
  }

  return sanitized;
}
