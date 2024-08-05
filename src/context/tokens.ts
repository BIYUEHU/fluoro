// biome-ignore lint:
export class Tokens {
  public static readonly container = Symbol.for('fluoro.context.container')
  public static readonly tracker = Symbol.for('fluoro.context.tracker')
  public static readonly record = Symbol.for('fluoro.context.record')
}

export default Tokens
