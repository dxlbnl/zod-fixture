import { describe, expect, test } from 'vitest';
import type { ZodTypeAny } from 'zod';
import { create } from '../src';
import { z } from 'zod';

test('throws on invalid schema type', () => {
	const zodType = {
		_def: {
			typeName: 'I_DONT_EXIST',
		},
	} as ZodTypeAny;
	expect(() => create(zodType)).toThrowError(zodType._def.typeName);
});

describe('create strings', () => {
	test('creates a string', () => {
		expect(create(z.string())).toBeTypeOf('string');
	});

	test('creates a nullable string', () => {
		expect(create(z.string().nullable())).toBeTypeOf('string');
		expect(create(z.string().nullish())).toBeTypeOf('string');
		expect(create(z.string().optional())).toBeTypeOf('string');
	});
});

describe('create numbers', () => {
	test('creates a number between 1 and 500', () => {
		const result = create(z.number());

		expect(result).toBeTypeOf('number');
		expect(result).toBeGreaterThanOrEqual(1);
		expect(result).toBeLessThanOrEqual(500);
	});

	test('creates a bigint between 1 and MAX_SAFE_INTEGER', () => {
		const result = create(z.bigint());

		expect(result).toBeTypeOf('bigint');
		expect(result).toBeGreaterThanOrEqual(1);
		expect(result).toBeLessThanOrEqual(Number.MAX_SAFE_INTEGER);
	});

	test('creates a nullable number', () => {
		expect(create(z.number().nullable())).toBeTypeOf('number');
		expect(create(z.number().nullish())).toBeTypeOf('number');
		expect(create(z.number().optional())).toBeTypeOf('number');
	});
});

describe('create booleans', () => {
	test('creates a boolean', () => {
		expect(create(z.boolean())).toBeTypeOf('boolean');
	});

	test('alternates between boolean values', () => {
		const one = create(z.boolean());
		const two = create(z.boolean());
		const three = create(z.boolean());
		const four = create(z.boolean());

		expect(one).not.toBe(two);
		expect(one).toBe(three);
		expect(two).toBe(four);
	});

	test('creates a nullable boolean', () => {
		expect(create(z.boolean().nullable())).toBeTypeOf('boolean');
		expect(create(z.boolean().nullish())).toBeTypeOf('boolean');
		expect(create(z.boolean().optional())).toBeTypeOf('boolean');
	});
});

describe('create dates', () => {
	const two_years = 31536000000 * 2;
	test('creates a date within a range of min plus 2 years from today', () => {
		const result = create(z.date());

		expect(result).toBeInstanceOf(Date);
		expect(result.getTime()).toBeGreaterThanOrEqual(
			new Date().getTime() - two_years,
		);
		expect(result.getTime()).toBeLessThanOrEqual(
			new Date().getTime() + two_years,
		);
	});

	test('creates a nullable date', () => {
		expect(create(z.date().nullable())).toBeInstanceOf(Date);
		expect(create(z.date().nullish())).toBeInstanceOf(Date);
		expect(create(z.date().optional())).toBeInstanceOf(Date);
	});
});

describe('create empty types', () => {
	test('creates an undefined', () => {
		expect(create(z.undefined())).toBeUndefined();
	});

	test('creates a null', () => {
		expect(create(z.null())).toBeNull();
	});

	test('creates a void', () => {
		const result = create(z.void());
		expect(result).toBeTypeOf('function');
		expect((result as unknown as () => void)()).toBeUndefined();
	});
});

describe('create catch-all types', () => {
	test('creates an any as null', () => {
		expect(create(z.any())).toBeNull();
	});

	test('creates an unknown as null', () => {
		expect(create(z.unknown())).toBeNull();
	});

	test('creates never as null', () => {
		expect(create(z.never())).toBeNull();
	});
});

describe('create objects', () => {
	test('creates an empty object', () => {
		expect(create(z.object({}))).toBeTypeOf('object');
	});

	test('creates a nullable empty object', () => {
		expect(create(z.object({}).nullable())).toBeTypeOf('object');
		expect(create(z.object({}).optional())).toBeTypeOf('object');
		expect(create(z.object({}).nullish())).toBeTypeOf('object');
	});

	test('creates a nested object', () => {
		const result = create(
			z.object({
				str: z.string(),
				nested: z.object({
					num: z.number(),
					date: z.date(),
				}),
			}),
		);
		expect(result).toBeTypeOf('object');
		expect(result.str).toBeTypeOf('string');
		expect(result.str).toContain('str');
		expect(result.nested.num).toBeTypeOf('number');
		expect(result.nested.date).toBeInstanceOf(Date);
	});

	test("creates an object with zod's api", () => {
		const BaseTeacher = z.object({ students: z.array(z.string()) });
		const HasID = z.object({ id: z.string() });
		const Teacher = BaseTeacher.merge(HasID);

		const result = create(Teacher);
		expect(result).toBeTypeOf('object');
		expect(result.id).toBeTypeOf('string');
		expect(result.id).toContain('id');
		expect(result.students).toHaveLength(3);
	});
});

describe('create records', () => {
	test('creates a record with 3 entries', () => {
		const result = create(z.record(z.number()));
		expect(Object.keys(result)).toHaveLength(3);
		expect(Object.keys(result)[0]).toBeTypeOf('string');
		expect(Object.values(result)[0]).toBeTypeOf('number');
	});

	test('creates a record with a defined key type', () => {
		const result = create(z.record(z.number(), z.string()));
		expect(Number(Object.keys(result)[0])).toBeTypeOf('number');
		expect(Object.values(result)[0]).toBeTypeOf('string');
	});
});

describe('create Maps', () => {
	test('creates a Map with 3 entries', () => {
		const result = create(z.map(z.string(), z.number()));
		expect(result.size).toBe(3);
		expect([...result.keys()][0]).toBeTypeOf('string');
		expect([...result.values()][0]).toBeTypeOf('number');
	});
});

describe('create Sets', () => {
	test('creates a Set with 3 entries', () => {
		const result = create(z.set(z.number()));
		expect(result.size).toBe(3);
		expect([...result.keys()][0]).toBeTypeOf('number');
		expect([...result.values()][0]).toBeTypeOf('number');
	});
});

describe('create arrays', () => {
	test('creates an array with the length of 3', () => {
		expect(create(z.array(z.string()))).toHaveLength(3);
		expect(create(z.number().array())).toHaveLength(3);
	});
});

describe('create tuples', () => {
	test('creates a tuple and preserves types', () => {
		const result = create(
			z.tuple([
				z.string(), // name
				z.number(), // jersey number
				z.object({
					pointsScored: z.number(),
				}), // statistics
			]),
		);
		expect(result).toHaveLength(3);
		expect(result[0]).toBeTypeOf('string');
		expect(result[1]).toBeTypeOf('number');
		expect(result[2]).toBeTypeOf('object');
		expect(result[2].pointsScored).toBeTypeOf('number');
	});
});

describe('create unions', () => {
	test('creates a union value', () => {
		expect(typeof create(z.union([z.string(), z.number()]))).toMatch(
			/^string|number$/,
		);
	});

	test('creates a union value with the or syntax', () => {
		expect(typeof create(z.string().or(z.number()))).toMatch(/^string|number$/);
	});

	test('creates a discriminated union', () => {
		const result = create(
			z.discriminatedUnion('type', [
				z.object({ type: z.literal('a'), a: z.string() }),
				z.object({ type: z.literal('b'), b: z.string() }),
			]),
		);
		expect(result.type).toBeTypeOf('string');
		expect(result.type).toMatch(/^a|b$/);
	});
});

describe('create enums', () => {
	test('using zod enums creates an enum and returns a random value', () => {
		expect(create(z.enum(['Salmon', 'Tuna', 'Trout']))).toMatch(
			/^Salmon|Tuna|Trout$/,
		);
	});

	test('using numeric native enums creates an enum and returns a random value', () => {
		enum Fruits {
			Apple,
			Banana,
		}

		expect(create(z.nativeEnum(Fruits))).toMatch(/^0|1|Apple|Banana$/);
	});

	test('using string native enums creates an enum and returns a random value', () => {
		enum Fruits {
			Apple = 'apple',
			Banana = 'banana',
			Cantaloupe = 3, // you can mix numerical and string enums
		}

		expect(create(z.nativeEnum(Fruits))).toMatch(
			/^apple|banana|Apple|Banana|Cantaloupe|3$/,
		);
	});

	test('using const native enums creates an enum and returns a random value', () => {
		const Fruits = {
			Apple: 'apple',
			Banana: 'banana',
			Cantaloupe: 3,
		} as const;

		expect(create(z.nativeEnum(Fruits))).toMatch(
			/^apple|banana|Apple|Banana|Cantaloupe|3$/,
		);
	});
});

describe('create literals', () => {
	test('creates a string literal and returns its value', () => {
		expect(create(z.literal('tuna'))).toBe('tuna');
	});
	test('creates a number literal and returns its value', () => {
		expect(create(z.literal(12))).toBe(12);
	});
	test('creates a boolean literal and returns its value', () => {
		expect(create(z.literal(true))).toBe(true);
	});
});
