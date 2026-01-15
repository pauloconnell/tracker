export function sanitizeUpdate(model: any, body: Record<string, any>) {
   // Block MongoDB operators
   if (Object.keys(body).some((k) => k.startsWith('$'))) {
      throw new Error('Invalid update payload');
   }

   // Extract allowed fields from schema
   const allowed = Object.keys(model.schema.paths).filter(
      (key) =>
         !key.startsWith('_') && // ignore _id, __v
         key !== 'createdAt' &&
         key !== 'updatedAt'
   );

   // Identify numeric fields from the schema
   const numericFields = Object.entries(model.schema.paths)
      .filter(([_, path]: any) => path.instance === 'Number')
      .map(([key]) => key);

   // Build sanitized object
   const sanitized: Record<string, any> = {};

   for (const key of allowed) {
      if (!(key in body)) continue;
      let value = body[key];
      // Normalize numeric fields ->mongodb will blow up if it tries to convert 'null' to a number
      if (numericFields.includes(key)) {
         if (value === '' || value === null || value === 'null') {
            value = undefined; // ignore this field in update
         } else {
            value = Number(value);
         }
      }
      sanitized[key] = value;
   }

   return sanitized;
}
