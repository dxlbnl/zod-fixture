/* eslint-disable @typescript-eslint/no-explicit-any */
// No need to bundle the full zod library since we only use the typeNames
// to identify the schemas.

import type {
	EnumLike,
	ZodDiscriminatedUnionOption,
	ZodRawShape,
	ZodStringDef,
	ZodTypeAny,
} from 'zod';
import {
	ZodAny as TrueZodAny,
	ZodArray as TrueZodArray,
	ZodBigInt as TrueZodBigInt,
	ZodBoolean as TrueZodBoolean,
	ZodBranded as TrueZodBranded,
	ZodCatch as TrueZodCatch,
	ZodDate as TrueZodDate,
	ZodDefault as TrueZodDefault,
	ZodDiscriminatedUnion as TrueZodDiscriminatedUnion,
	ZodEffects as TrueZodEffects,
	ZodEnum as TrueZodEnum,
	ZodFunction as TrueZodFunction,
	ZodIntersection as TrueZodIntersection,
	ZodLazy as TrueZodLazy,
	ZodLiteral as TrueZodLiteral,
	ZodMap as TrueZodMap,
	ZodNaN as TrueZodNaN,
	ZodNativeEnum as TrueZodNativeEnum,
	ZodNever as TrueZodNever,
	ZodNull as TrueZodNull,
	ZodNullable as TrueZodNullable,
	ZodNumber as TrueZodNumber,
	ZodObject as TrueZodObject,
	ZodOptional as TrueZodOptional,
	ZodPipeline as TrueZodPipeline,
	ZodPromise as TrueZodPromise,
	ZodReadonly as TrueZodReadonly,
	ZodRecord as TrueZodRecord,
	ZodSet as TrueZodSet,
	ZodString as TrueZodString,
	ZodSymbol as TrueZodSymbol,
	ZodTuple as TrueZodTuple,
	ZodUndefined as TrueZodUndefined,
	ZodUnion as TrueZodUnion,
	ZodUnknown as TrueZodUnknown,
	ZodVoid as TrueZodVoid,
} from 'zod';

export const ZodString = TrueZodString;
export const ZodNumber = TrueZodNumber;
export const ZodNaN = TrueZodNaN;
export const ZodBigInt = TrueZodBigInt;
export const ZodBoolean = TrueZodBoolean;
export const ZodDate = TrueZodDate;
export const ZodSymbol = TrueZodSymbol;
export const ZodUndefined = TrueZodUndefined;
export const ZodNull = TrueZodNull;
export const ZodAny = TrueZodAny;
export const ZodUnknown = TrueZodUnknown;
export const ZodNever = TrueZodNever;
export const ZodVoid = TrueZodVoid;
export const ZodArray = TrueZodArray<ZodTypeAny>;
export const ZodObject = TrueZodObject<ZodRawShape>;
export const ZodUnion = TrueZodUnion<readonly [ZodTypeAny, ...ZodTypeAny[]]>;
export const ZodDiscriminatedUnion = TrueZodDiscriminatedUnion<
	string,
	ZodDiscriminatedUnionOption<string>[]
>;
export const ZodIntersection = TrueZodIntersection<ZodTypeAny, ZodTypeAny>;
export const ZodTuple = TrueZodTuple;
export const ZodRecord = TrueZodRecord;
export const ZodMap = TrueZodMap;
export const ZodSet = TrueZodSet;
export const ZodFunction = TrueZodFunction<
	TrueZodTuple<[], ZodTypeAny>,
	ZodTypeAny
>;
export const ZodLazy = TrueZodLazy<ZodTypeAny>;
export const ZodLiteral = TrueZodLiteral<unknown>;
export const ZodEnum = TrueZodEnum<[string, ...string[]]>;
export const ZodEffects = TrueZodEffects<ZodTypeAny>;
export const ZodNativeEnum = TrueZodNativeEnum<EnumLike>;
export const ZodOptional = TrueZodOptional<ZodTypeAny>;
export const ZodNullable = TrueZodNullable<ZodTypeAny>;
export const ZodDefault = TrueZodDefault<ZodTypeAny>;
export const ZodCatch = TrueZodCatch<ZodTypeAny>;
export const ZodPromise = TrueZodPromise<ZodTypeAny>;
export const ZodBranded = TrueZodBranded<ZodTypeAny, PropertyKey>;
export const ZodPipeline = TrueZodPipeline<ZodTypeAny, ZodTypeAny>;
export const ZodReadonly = TrueZodReadonly<ZodTypeAny>;

export enum ZodParsedType {
	function = 'function',
	number = 'number',
	string = 'string',
	nan = 'nan',
	integer = 'integer',
	float = 'float',
	boolean = 'boolean',
	date = 'date',
	bigint = 'bigint',
	symbol = 'symbol',
	undefined = 'undefined',
	null = 'null',
	array = 'array',
	object = 'object',
	unknown = 'unknown',
	promise = 'promise',
	void = 'void',
	never = 'never',
	map = 'map',
	set = 'set',
}

export const getParsedType = (data: any): ZodParsedType => {
	const type = typeof data as ZodParsedType;

	switch (type) {
		case ZodParsedType.undefined:
		case ZodParsedType.string:
		case ZodParsedType.boolean:
		case ZodParsedType.function:
		case ZodParsedType.bigint:
		case ZodParsedType.symbol:
			return type;

		case ZodParsedType.number:
			return isNaN(data) ? ZodParsedType.nan : ZodParsedType.number;

		case ZodParsedType.object:
			if (Array.isArray(data)) {
				return ZodParsedType.array;
			}
			if (data === null) {
				return ZodParsedType.null;
			}
			if (
				data.then &&
				typeof data.then === 'function' &&
				data.catch &&
				typeof data.catch === 'function'
			) {
				return ZodParsedType.promise;
			}
			if (typeof Map !== 'undefined' && data instanceof Map) {
				return ZodParsedType.map;
			}
			if (typeof Set !== 'undefined' && data instanceof Set) {
				return ZodParsedType.set;
			}
			if (typeof Date !== 'undefined' && data instanceof Date) {
				return ZodParsedType.date;
			}
			return ZodParsedType.object;

		default:
			return ZodParsedType.unknown;
	}
};

export const util = {
	objectKeys:
		typeof Object.keys === 'function'
			? (obj: any) => Object.keys(obj)
			: (object: any) => {
					const keys = [];
					for (const key in object) {
						if (Object.prototype.hasOwnProperty.call(object, key)) {
							keys.push(key);
						}
					}
					return keys;
				},
};

export type InferZodType<T extends { _output: unknown }> = T['_output'];
export type { ZodStringDef, ZodTypeAny };
/* eslint-enable @typescript-eslint/no-explicit-any */
