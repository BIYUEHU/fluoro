import { Modules, type ModuleExport, type Context, type Service } from '../src'

describe('Modules', () => {
  let modules: Modules
  let mockContext: jest.Mocked<Context>

  beforeEach(() => {
    mockContext = {
      extends: jest.fn().mockReturnThis(),
      emit: jest.fn(),
      on: jest.fn(),
      get: jest.fn(),
      provide: jest.fn(),
      inject: jest.fn()
    } as unknown as jest.Mocked<Context>

    modules = new Modules(mockContext)
  })

  describe('load', () => {
    test('loads a function module', () => {
      const mockModule = jest.fn()
      modules.load(mockModule)
      expect(mockContext.emit).toHaveBeenCalledWith('ready_module', { instance: mockModule })
    })

    test('loads a class module', () => {
      class TestModule {}
      modules.load(TestModule)
      expect(mockContext.emit).toHaveBeenCalledWith('ready_module', { instance: TestModule })
    })

    test('loads a module with main function', () => {
      const mockModule: ModuleExport = {
        main: jest.fn()
      }
      modules.load(mockModule)
      expect(mockContext.emit).toHaveBeenCalledWith('ready_module', { instance: mockModule })
    })

    test('loads a module with Main class', () => {
      const mockModule: ModuleExport = {
        Main: class TestMain {}
      }
      modules.load(mockModule)
      expect(mockContext.emit).toHaveBeenCalledWith('ready_module', { instance: mockModule })
    })
  })

  test('unload emits dispose_module event', () => {
    const mockModule = jest.fn()
    modules.unload(mockModule)
    expect(mockContext.emit).toHaveBeenCalledWith('dispose_module', { instance: mockModule })
  })

  test('service registers a service with the context', () => {
    const mockService = {
      start: jest.fn(),
      stop: jest.fn()
    } as unknown as Service

    modules.service('testService', mockService)

    expect(mockContext.provide).toHaveBeenCalledWith('testService', mockService)
    expect(mockContext.on).toHaveBeenCalledTimes(2)
  })

  test('complex module register', () => {})
})
