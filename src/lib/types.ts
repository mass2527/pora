type Primitive = undefined | null | boolean | number | bigint | string | symbol;
// https://github.com/Microsoft/TypeScript/issues/29729
type LiteralUnion<LiteralType, BaseType extends Primitive> =
  | LiteralType
  | (BaseType & Record<never, never>);

export type StringLiteralUnion<LiteralType> = LiteralUnion<LiteralType, string>;
