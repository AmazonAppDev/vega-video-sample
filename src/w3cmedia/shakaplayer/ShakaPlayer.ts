/*
 * Copyright 2022 - 2023 Amazon.com, Inc. or its affiliates. All rights reserved.
 *
 * AMAZON PROPRIETARY/CONFIDENTIAL
 *
 * You may not use this file except in compliance with the terms and
 * conditions set forth in the accompanying LICENSE.TXT file.
 *
 * THESE MATERIALS ARE PROVIDED ON AN "AS IS" BASIS. AMAZON SPECIFICALLY
 * DISCLAIMS, WITH RESPECT TO THESE MATERIALS, ALL WARRANTIES, EXPRESS,
 * IMPLIED, OR STATUTORY, INCLUDING THE IMPLIED WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
 */

// @ts-nocheck
import { HTMLMediaElement } from '@amazon-devices/react-native-w3cmedia';
import { Platform } from 'react-native';
import { PlayerInterface } from '../PlayerInterface';
import shaka from './dist/shaka-player.compiled';

// import polyfills
import Document from '../polyfills/DocumentPolyfill';
import Element from '../polyfills/ElementPolyfill';
import MiscPolyfill from '../polyfills/MiscPolyfill';
import W3CMediaPolyfill from '../polyfills/W3CMediaPolyfill';

// install polyfills
Document.install();
Element.install();
W3CMediaPolyfill.install();
MiscPolyfill.install();

export interface ShakaPlayerSettings {
  secure: boolean;
  abrEnabled: boolean;
  abrMaxWidth?: number;
  abrMaxHeight?: number;
}

export class ShakaPlayer implements PlayerInterface {
  player: shaka.Player;
  private setting_: ShakaPlayerSettings;
  private mediaElement: HTMLMediaElement | null;
  constructor(
    mediaElement: HTMLMediaElement | null,
    setting: ShakaPlayerSettings,
  ) {
    this.mediaElement = mediaElement;
    this.setting_ = setting;
  }

  // Custom callbacks {{{
  // This whole section is a port from shakaplayer demo app
  /**
   * A prefix retrieved in a manifest response filter and used in a subsequent
   * license request filter.  Necessary for VDMS content.
   *
   * @type {string}
   */
  private lastUplynkPrefix: string = '';

  /**
   * A response filter for VDMS Uplynk manifest responses.
   * This allows us to get the license prefix that is necessary
   * to later generate a proper license response.
   *
   * @param {shaka.net.NetworkingEngine.RequestType} type
   * @param {shaka.extern.Response} response
   */
  uplynkResponseFilter(
    type: shaka.net.NetworkingEngine.RequestType,
    response: shaka.extern.Response,
  ): void {
    console.log(`sample:shaka: in the response filter type = ${type}`);
    if (type === shaka.net.NetworkingEngine.RequestType.MANIFEST) {
      console.log('sample:shaka: in the response filter MANIFEST');
      // Parse a custom header that contains a value needed to build a proper
      // license server URL.
      if (response.headers['x-uplynk-prefix']) {
        this.lastUplynkPrefix = response.headers['x-uplynk-prefix'];
        console.log(
          `sample:shaka: in the response filter update Prefix to ${this.lastUplynkPrefix}`,
        );
      } else {
        this.lastUplynkPrefix = '';
      }
    }
  }

  /**
   * A license request filter for VDMS Uplynk license requests.
   *
   * @param {shaka.net.NetworkingEngine.RequestType} type
   * @param {shaka.extern.Request} request
   */
  uplynkRequestFilter(
    type: shaka.net.NetworkingEngine.RequestType,
    request: shaka.extern.Request,
  ): void {
    console.log(`sample:shaka: in the request filter type = ${type}`);
    if (type === shaka.net.NetworkingEngine.RequestType.LICENSE) {
      console.log('sample:shaka: in the request filter LICENSE');
      // Modify the license request URL based on our cookie.
      if (request.uris[0].includes('wv') && this.lastUplynkPrefix) {
        console.log('sample:shaka: in the request filter LICENSE WV');
        request.uris[0] = this.lastUplynkPrefix.concat('/wv');
      } else if (request.uris[0].includes('ck') && this.lastUplynkPrefix) {
        request.uris[0] = this.lastUplynkPrefix.concat('/ck');
      } else if (request.uris[0].includes('pr') && this.lastUplynkPrefix) {
        console.log('sample:shaka: in the request filter LICENSE PR');
        request.uris[0] = this.lastUplynkPrefix.concat('/pr');
      }
    }
    console.log('sample:shaka: in the request filter END');
  }

  /**
   * @param {!Map.<string, string>} headers
   * @param {shaka.net.NetworkingEngine.RequestType} requestType
   * @param {shaka.extern.Request} request
   * @private
   */
  addLicenseRequestHeaders_(
    headers: Map<string, string>,
    requestType: shaka.net.NetworkingEngine.RequestType,
    request: shaka.extern.Request,
  ) {
    if (requestType !== shaka.net.NetworkingEngine.RequestType.LICENSE) {
      return;
    }

    // Add these to the existing headers.  Do not clobber them!
    // For PlayReady, there will already be headers in the request.
    headers.forEach((value, key) => {
      request.headers[key] = value;
    });
  }

  /**
   * @param {!Map.<string, string>} headers
   * @param {shaka.net.NetworkingEngine.RequestType} requestType
   * @param {shaka.extern.Request} request
   * @private
   */
  addManifestRequestHeaders_(
    headers: Map<string, string>,
    requestType: shaka.net.NetworkingEngine.RequestType,
    request: shaka.extern.Request,
  ) {
    if (
      requestType === shaka.net.NetworkingEngine.RequestType.MANIFEST ||
      requestType === shaka.net.NetworkingEngine.RequestType.SEGMENT
    ) {
      // Add these to the existing headers.  Do not clobber them!
      headers.forEach((value, key) => {
        request.headers[key] = value;
      });
    }
  }
  // End custom callbacks }}}

  load(content: any, _autoplay: boolean): void {
    shaka.polyfill.installAll();
    console.log('shakaplayer: unregistering scheme http and https');
    shaka.net.NetworkingEngine.unregisterScheme('http');
    shaka.net.NetworkingEngine.unregisterScheme('https');

    console.log('shakaplayer: registering scheme http and https');
    const httpFetchPluginSupported = shaka.net.HttpFetchPlugin.isSupported();
    console.log(`httpfetchplugin supported? ${httpFetchPluginSupported}`);

    shaka.net.NetworkingEngine.registerScheme(
      'http',
      shaka.net.HttpFetchPlugin.parse,
      shaka.net.NetworkingEngine.PluginPriority.APPLICATION,
      true,
    );

    shaka.net.NetworkingEngine.registerScheme(
      'https',
      shaka.net.HttpFetchPlugin.parse,
      shaka.net.NetworkingEngine.PluginPriority.APPLICATION,
      true,
    );

    console.log('shakaplayer: creating');
    this.player = new shaka.Player(this.mediaElement);
    console.log('shakaplayer: loading');

    // Registering the Custom filters for uplynk test streams.
    const netEngine = this.player.getNetworkingEngine();
    netEngine.clearAllRequestFilters();
    netEngine.clearAllResponseFilters();
    netEngine.registerRequestFilter(this.uplynkRequestFilter);
    netEngine.registerResponseFilter(this.uplynkResponseFilter);

    // This filter is needed for Axinom streams.
    if (content.hasOwnProperty('drm_license_header')) {
      let header_map: Map<string, string> = new Map();

      content.drm_license_header.map((values) => {
        console.log(
          `sample:shaka: got License header TAG: ${values[0]} DATA: ${values[1]}`,
        );
        header_map.set(values[0] as string, values[1] as string);
      });

      const filter = (
        type: shaka.net.NetworkingEngine.RequestType,
        request: shaka.extern.Request,
      ): void => {
        return this.addLicenseRequestHeaders_(header_map, type, request);
      };
      netEngine.registerRequestFilter(filter);
    }

    if (content.hasOwnProperty('manifest_header')) {
      let header_map: Map<string, string> = new Map();

      content.manifest_header.map((values) => {
        console.log(
          `sample:shaka: got Manifest header TAG: ${values[0]} DATA: ${values[1]}`,
        );
        header_map.set(values[0] as string, values[1] as string);
      });

      const filter = (
        type: shaka.net.NetworkingEngine.RequestType,
        request: shaka.extern.Request,
      ): void => {
        return this.addManifestRequestHeaders_(header_map, type, request);
      };
      netEngine.registerRequestFilter(filter);
    }
    // Need capabilities query support on native side about max
    // resolution supported by native side and dynamically
    // populate 'Max resolution' setting for ABR.
    if (!Platform.isTV) {
      console.log(
        'shakaplayer: For non-TV devices, max resolution is capped to FHD.',
      );
      this.setting_.abrMaxWidth = Math.min(
        1919,
        this.setting_.abrMaxWidth as number,
      );
      this.setting_.abrMaxHeight = Math.min(
        1079,
        this.setting_.abrMaxHeight as number,
      );
    }

    console.log(
      `ABR Max Resolution: ${this.setting_.abrMaxWidth} x ${this.setting_.abrMaxHeight}`,
    );

    this.player.configure({
      preferredVideoCodecs: [content.vcodec],
      preferredAudioCodecs: [content.acodec],
      streaming: {
        lowLatencyMode: false,
        inaccurateManifestTolerance: 0,
        rebufferingGoal: 0.01,
        bufferingGoal: 5,
        alwaysStreamText: true,
        retryParameters: {
          maxAttempts: 3,
        },
      },
      manifest: {
        dash: {
          disableXlinkProcessing: true,
        },
        hls: {
          sequenceMode: false,
        },
      },
      abr: {
        enabled: this.setting_.abrEnabled,
        restrictions: {
          minWidth: 320,
          minHeight: 240,
          maxWidth: this.setting_.abrMaxWidth,
          maxHeight: this.setting_.abrMaxHeight,
        },
      },
      autoShowText: shaka.config.AutoShowText.ALWAYS,
    });

    // Separating the drm configuration since Shaka seems to call drm operations even if they are not needed when drm configuration is present.
    if (content.drm_scheme !== null && content.drm_scheme !== '') {
      console.log(
        `shakaplayer: loading with ${content.drm_scheme} and ${content.drm_license_uri} and ${content.secure}`,
      );
      let signal_secure: string = 'SW_SECURE_CRYPTO';
      let audio_not_secure: string = 'SW_SECURE_CRYPTO';
      if (content.drm_scheme === 'com.microsoft.playready') {
        signal_secure = '150';
      }

      if (content.secure === 'true') {
        if (content.drm_scheme === 'com.microsoft.playready') {
          signal_secure = '3000';
        } else {
          signal_secure = 'HW_SECURE_ALL';
        }
      }

      console.log(
        `shakaplayer: loading with ${content.drm_scheme} and ${content.drm_license_uri} and ${signal_secure}`,
      );

      // For some reason, shaka does not like to use drm_scheme as a key for the map passed as object to configure call.
      // We are forced to create the map and then pass to configure call as in below.
      let server_map: Map<string, string> = {};
      server_map[content.drm_scheme as string] =
        content.drm_license_uri as string;
      this.player.configure('drm.servers', server_map);

      this.player.configure({
        drm: {
          advanced: {
            'com.widevine.alpha': {
              videoRobustness: signal_secure,
              audioRobustness: audio_not_secure,
              persistentStateRequired: false,
            },
            'com.microsoft.playready': {
              videoRobustness: signal_secure,
              audioRobustness: audio_not_secure,
              persistentStateRequired: false,
            },
          },
          preferredKeySystems: [content.drm_scheme],
        },
      });
    }

    this.internalLoad(content);
    console.log('shakaplayer: load() OUT');
  }
  private async internalLoad(content: any) {
    await this.player.load(content.uri);
    console.log('shakaplayer: setTextTrackVisibility');
    this.player.setTextTrackVisibility(true);
    console.log('shakaplayer: loaded');
  }
  play(): void {
    this.mediaElement?.play();
  }
  pause(): void {
    this.mediaElement?.pause();
  }
  seekBack(): void {
    const time = this.mediaElement.currentTime;
    console.log('shakaplayer: seekBack to ', time - 10);
    this.mediaElement.currentTime = time - 10;
  }
  seekFront(): void {
    const time = this.mediaElement.currentTime;
    console.log('shakaplayer: seekFront to ', time + 10);
    this.mediaElement.currentTime = time + 10;
  }

  unload(): void {
    console.log('shakaplayer:unload');
    this.player.detach();
    this.player.destroy();
    this.player = null;
  }
}
