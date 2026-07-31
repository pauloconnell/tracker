export function sanitizeCreate<T>(model: any, body: T): T {
  if (typeof body !== 'object' || body === null) {
    throw new Error('Invalid create payload');
  }

  const input = body as Record<string, any>;

  if (Object.keys(input).some((k) => k.startsWith('$'))) {
    throw new Error('Invalid create payload');
  }

  const allowed = Object.keys(model.schema.paths)?.filter(
    (key) => !key.startsWith('_') && key !== 'createdAt' && key !== 'updatedAt'
  );

  const sanitized: Record<string, any> = {};
  for (const key of allowed) {
    if (input[key] !== undefined) sanitized[key] = input[key];
  }

  return sanitized as T;
}
