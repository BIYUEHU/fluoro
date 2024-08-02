// biome-ignore lint:
export class Tokens {
  public static readonly container = Symbol.for('fluoro.context.container')

  public static readonly table = Symbol.for('fluoro.context.table')

  public static readonly containerKey = (prop: string) => Symbol.for(`fluoro.context.container.${prop}`)
}

export default Tokens
