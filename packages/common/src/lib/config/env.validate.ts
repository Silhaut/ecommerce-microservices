import type { ZodType } from 'zod';

export function createEnvValidator<T>(schema: ZodType<T>) {
  return (config: Record<string, unknown>): T => {
    const result = schema.safeParse(config);

    if (!result.success) {
      const issues = result.error.issues
        .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
        .join('; ');

      throw new Error(`Invalid environment configuration: ${issues}`);
    }

    return result.data;
  };
}
