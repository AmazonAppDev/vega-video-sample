const configureCalls: unknown[][] = [];

jest.mock('../../src/w3cmedia/shakaplayer/dist/shaka-player.compiled', () => {
  class Player {
    getNetworkingEngine() {
      return {
        clearAllRequestFilters: jest.fn(),
        clearAllResponseFilters: jest.fn(),
        registerRequestFilter: jest.fn(),
        registerResponseFilter: jest.fn(),
      };
    }
    configure(...args: unknown[]) {
      configureCalls.push(args);
    }
    load() {
      return Promise.resolve();
    }
    setTextTrackVisibility() {}
  }
  return {
    __esModule: true,
    default: {
      Player,
      polyfill: { installAll: jest.fn() },
      net: {
        NetworkingEngine: {
          unregisterScheme: jest.fn(),
          registerScheme: jest.fn(),
          PluginPriority: { APPLICATION: 3 },
          RequestType: { MANIFEST: 0, SEGMENT: 1, LICENSE: 2 },
        },
        HttpFetchPlugin: { isSupported: () => true, parse: jest.fn() },
      },
      config: { AutoShowText: { ALWAYS: 3 } },
    },
  };
});
jest.mock('../../src/w3cmedia/polyfills/DocumentPolyfill', () => ({
  install: jest.fn(),
}));
jest.mock('../../src/w3cmedia/polyfills/DOMParserPolyfill', () => ({
  install: jest.fn(),
}));
jest.mock('../../src/w3cmedia/polyfills/ElementPolyfill', () => ({
  install: jest.fn(),
}));
jest.mock('../../src/w3cmedia/polyfills/MiscPolyfill', () => ({
  install: jest.fn(),
}));
jest.mock('../../src/w3cmedia/polyfills/TextDecoderPolyfill', () => ({
  install: jest.fn(),
}));
jest.mock('../../src/w3cmedia/polyfills/W3CMediaPolyfill', () => ({
  install: jest.fn(),
}));

// jest.setup.ts replaces the player with a stub for the screen tests. This file tests the real one.
jest.unmock('../../src/w3cmedia/shakaplayer/ShakaPlayer');

import { ShakaPlayer } from '../../src/w3cmedia/shakaplayer/ShakaPlayer';

const widevineTitle = (secure: boolean) => ({
  uri: 'https://storage.googleapis.com/wvmedia/cenc/h264/tears/tears.mpd',
  drm_scheme: 'com.widevine.alpha',
  drm_license_uri:
    'https://proxy.uat.widevine.com/proxy?provider=widevine_test',
  secure,
});

const videoRobustness = (): string | undefined => {
  const drm = configureCalls
    .map(
      ([config]) =>
        config as {
          drm?: { advanced?: Record<string, { videoRobustness: string }> };
        },
    )
    .find((config) => typeof config === 'object' && config?.drm?.advanced);
  return drm?.drm?.advanced?.['com.widevine.alpha'].videoRobustness;
};

describe('ShakaPlayer DRM robustness', () => {
  beforeEach(() => {
    configureCalls.length = 0;
  });

  it('asks for the hardware secure path for a title with secure: true', () => {
    new ShakaPlayer(null, { secure: false, abrEnabled: false }).load(
      widevineTitle(true),
      false,
    );
    expect(videoRobustness()).toBe('HW_SECURE_ALL');
  });

  it('still accepts the string "true" for secure', () => {
    new ShakaPlayer(null, { secure: false, abrEnabled: false }).load(
      { ...widevineTitle(false), secure: 'true' },
      false,
    );
    expect(videoRobustness()).toBe('HW_SECURE_ALL');
  });

  it('keeps the software path for a title with secure: false', () => {
    new ShakaPlayer(null, { secure: false, abrEnabled: false }).load(
      widevineTitle(false),
      false,
    );
    expect(videoRobustness()).toBe('SW_SECURE_CRYPTO');
  });
});
