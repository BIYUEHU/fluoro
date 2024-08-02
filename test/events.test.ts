import { Events } from '../src/context/events'

describe('Events', () => {
  let events: Events

  beforeEach(() => {
    events = new Events()
  })

  test('emit should call registered listeners', () => {
    const mockCallback = jest.fn()
    events.on('ready', mockCallback)
    events.emit('ready')
    expect(mockCallback).toHaveBeenCalled()
  })

  test('parallel should call all listeners asynchronously', async () => {
    const mockCallback1 = jest.fn()
    const mockCallback2 = jest.fn()
    events.on('error', mockCallback1)
    events.on('error', mockCallback2)
    events.parallel('error', new Error('Test error')).then()
    expect(mockCallback1).toHaveBeenCalledWith(expect.any(Error))
    expect(mockCallback2).toHaveBeenCalledWith(expect.any(Error))
  })

  test('once should only call the listener one time', () => {
    const mockCallback = jest.fn()
    events.once('dispose', mockCallback)
    events.emit('dispose')
    events.emit('dispose')
    expect(mockCallback).toHaveBeenCalledTimes(1)
  })

  test('off should remove a specific listener', () => {
    const mockCallback = jest.fn()
    events.on('ready', mockCallback)
    events.off('ready', mockCallback)
    events.emit('ready')
    expect(mockCallback).not.toHaveBeenCalled()
  })

  test('offAll should remove all listeners for an event type', () => {
    const mockCallback1 = jest.fn()
    const mockCallback2 = jest.fn()
    events.on('ready', mockCallback1)
    events.on('ready', mockCallback2)
    events.offAll('ready')
    events.emit('ready')
    expect(mockCallback1).not.toHaveBeenCalled()
    expect(mockCallback2).not.toHaveBeenCalled()
  })
})
