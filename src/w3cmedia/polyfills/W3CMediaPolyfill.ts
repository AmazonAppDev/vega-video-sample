/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: MIT-0
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this
 * software and associated documentation files (the "Software"), to deal in the Software
 * without restriction, including without limitation the rights to use, copy, modify,
 * merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
 * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

// @ts-nocheck
//
import {
  HTMLMediaElement,
  MediaSource,
  requestMediaKeySystemAccess,
  TextTrackCue,
  VTTCue,
} from '@amazon-devices/react-native-w3cmedia';

class W3CMediaPolyfill {
  static install() {
    console.log('Installing W3CMedia polyfills');
    global.window.MediaSource = global.MediaSource = MediaSource;
    global.window.TextTrackCue = global.TextTrackCue = TextTrackCue;
    global.window.VTTCue = global.VTTCue = VTTCue;
    window.TextTrackCue = TextTrackCue;
    if (!window.TextTrackCue) {
      console.log('TextTrackCue not polyfilled');
    }
    window.VTTCue = VTTCue;
    if (!window.VTTCue) {
      console.log('VTTCue not polyfilled');
    }
    global.navigator.requestMediaKeySystemAccess = requestMediaKeySystemAccess;
    global.HTMLMediaElement = HTMLMediaElement;
    global.Node = {};
    global.Node.TEXT_NODE = 3;
    global.Node.CDATA_SECTION_NODE = 4;
  }
}

export default W3CMediaPolyfill;
