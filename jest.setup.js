// Mock chrome extension APIs
global.chrome = {
  runtime: {
    sendMessage: jest.fn(),
    onMessage: {
      addListener: jest.fn(),
      removeListener: jest.fn()
    }
  },
  storage: {
    local: {
      get: jest.fn(),
      set: jest.fn(),
      clear: jest.fn()
    }
  },
  webRequest: {
    onBeforeRequest: {
      addListener: jest.fn(),
      removeListener: jest.fn()
    },
    onHeadersReceived: {
      addListener: jest.fn(),
      removeListener: jest.fn()
    }
  },
  tabs: {
    query: jest.fn(),
    sendMessage: jest.fn()
  }
};

// Mock browser APIs
global.browser = {
  runtime: {
    sendMessage: jest.fn(),
    onMessage: {
      addListener: jest.fn(),
      removeListener: jest.fn()
    }
  },
  storage: {
    local: {
      get: jest.fn(),
      set: jest.fn(),
      clear: jest.fn()
    }
  },
  webRequest: {
    onBeforeRequest: {
      addListener: jest.fn(),
      removeListener: jest.fn()
    },
    onHeadersReceived: {
      addListener: jest.fn(),
      removeListener: jest.fn()
    }
  },
  tabs: {
    query: jest.fn(),
    sendMessage: jest.fn()
  }
};

// Mock console methods
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn()
};

// Mock URL and URLSearchParams
global.URL = class URL {
  constructor(url) {
    this.url = url;
  }
  toString() {
    return this.url;
  }
};

// Mock fetch
global.fetch = jest.fn();

// Mock performance API
global.performance = {
  now: jest.fn(() => Date.now())
};

// Mock setTimeout and setInterval
global.setTimeout = jest.fn((callback) => {
  callback();
  return 1;
});

global.setInterval = jest.fn((callback) => {
  callback();
  return 1;
});

// Mock clearTimeout and clearInterval
global.clearTimeout = jest.fn();
global.clearInterval = jest.fn();

// Mock Math.random
Math.random = jest.fn(() => 0.5);

// Mock Date
global.Date = class Date {
  constructor() {
    return new global.Date.RealDate();
  }
  static now() {
    return 1234567890;
  }
};
global.Date.RealDate = Date; 