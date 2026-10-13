import { z } from 'zod';
import { createEnvValidator } from './env.validate';

describe('createEnvValidator', () => {
  const schema = z.object({
    PORT: z.coerce.number().int().positive(),
    NODE_ENV: z.enum(['development', 'test', 'production']),
  });
  const validate = createEnvValidator(schema);

  it('returns the parsed, coerced config when valid', () => {
    const result = validate({ PORT: '3000', NODE_ENV: 'development' });

    expect(result).toEqual({ PORT: 3000, NODE_ENV: 'development' });
  });

  it('throws with the offending field names when invalid', () => {
    expect(() => validate({ PORT: '-1', NODE_ENV: 'nope' })).toThrow(
      /PORT.*NODE_ENV|NODE_ENV.*PORT/,
    );
  });
});
