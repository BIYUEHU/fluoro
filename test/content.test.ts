import { Context, Tokens, Events, Modules } from '../src/'

declare module '../src/' {
  interface Context {
    testMethod: unknown
    testProp: unknown
    customProp: unknown
    parentMethod: () => void
  }
}

describe('Context', () => {
  let ctx: Context

  beforeEach(() => {
    ctx = new Context()
  })

  test('constructor initializes correctly', () => {
    expect(ctx.root).toBe(ctx)
    expect(ctx.parent).toBeNull()
    expect(ctx.get('events')).toBeInstanceOf(Events)
    expect(ctx.get('modules')).toBeInstanceOf(Modules)
  })

  test('get method returns correct value', () => {
    const testObj = { test: 'value' }
    ctx.provide('testProp', testObj)
    expect(ctx.get('testProp')).toBe(testObj)
  })

  test('inject method sets property correctly', () => {
    const testObj = { test: 'value' }
    ctx.provide('testProp', testObj)
    ctx.inject('testProp')
    expect(ctx.testProp).toBe(testObj)
  })

  test('provide method sets value in container', () => {
    const testObj = { test: 'value' }
    ctx.provide('testProp', testObj)
    expect(ctx[Tokens.container].get('testProp')).toBe(testObj)
  })

  test('mixin method adds properties from provided object', () => {
    const testObj = {
      testMethod() {},
      testProp: 'value'
    }
    ctx.provide('testObj', testObj)
    ctx.mixin('testObj', ['testMethod', 'testProp'])
    expect(ctx.testMethod).toBeInstanceOf(Function)
    expect(ctx.testProp).toBe('value')
  })

  test('extends method creates new context with correct properties', () => {
    const extendedContext = ctx.extends(undefined, 'extended')
    expect(extendedContext.identity).toBe('extended')
    expect(extendedContext.parent).toBe(ctx)
    expect(extendedContext.root).toBe(ctx.root)
    // expect(extendedContext.customProp).toBe('value')
  })

  test('extends method creates proxy that delegates to parent', () => {
    const parentMethod = jest.fn()
    ctx.parentMethod = parentMethod
    const extendedContext = ctx.extends()
    extendedContext.parentMethod()
    expect(parentMethod).toHaveBeenCalled()
  })

  test('context children isolates', () => {
    const ctx1 = ctx.extends(undefined, 'child1')
    const rootObj = {}
    ctx.provide('customProp', rootObj)
    ctx.inject('customProp')
    const child1Obj = {}
    ctx1.provide('testProp', child1Obj)
    ctx1.inject('testProp')
    const ctx2 = ctx1.extends(undefined, 'child2')
    const child2Obj = { testMethod() {} }
    ctx2.provide('testMethod', child2Obj)
    ctx2.mixin('testMethod', ['testMethod'])
    expect(ctx1.customProp).toBe(ctx.customProp)
    expect(ctx1.testProp).toBe(child1Obj)
    // expect(ctx2.testProp).toBeUndefined()
    expect(ctx.testProp).toBeUndefined()
    expect(ctx.get('testProp')).toBeUndefined()
    expect(ctx[Tokens.container].get('testProp')).toBeUndefined()
    expect(ctx1[Tokens.container].get('testProp')).toBe(child1Obj)
    expect(ctx2.testMethod).toBeInstanceOf(Function)
    expect(ctx1.testMethod).toBeUndefined()
    expect(ctx.testMethod).toBeUndefined()
  })
})
