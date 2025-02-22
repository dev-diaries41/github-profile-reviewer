import { Page } from "puppeteer";

export function getRandomFromArray(arr: any[]) {
    return arr[Math.floor(Math.random() * arr.length)];
}

interface DeviceInfo {
  screen_resolution: string;
  available_screen_resolution: string;
  system_version: string;
  brand_model: string;
  system_lang: string;
  timezone: string;
  timezoneOffset: number;
  user_agent: string;
  list_plugin: string;
  canvas_code: string;
  webgl_vendor: string;
  webgl_renderer: string;
  audio: number;
  platform: string;
  web_timezone: string;
  device_name: string;
  fingerprint: string;
  device_id: string;
  related_device_ids: string;
}


export function getRandomUserAgent() {
  const mobileUserAgents = [
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1', // iPhone 14 (iOS 17 - Safari)
    'Mozilla/5.0 (Linux; Android 13; SM-S911U) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.5845.163 Mobile Safari/537.36', // Samsung Galaxy S23 (Android 13 - Chrome)
    'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.5993.89 Mobile Safari/537.36', // Google Pixel 8 (Android 14 - Chrome)
    'Mozilla/5.0 (Linux; Android 13; LE2115) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.5845.163 Mobile Safari/537.36', // OnePlus 11 (Android 13 - Chrome)
    'Mozilla/5.0 (Linux; Android 13; HUAWEI P60 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.5845.163 Mobile Safari/537.36', // Huawei P60 Pro (Android 13 - Chrome)
    'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1', // iPad Pro 12.9 (iPadOS 17 - Safari)
    'Mozilla/5.0 (Linux; Android 13; Xiaomi 13 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.5845.163 Mobile Safari/537.36', // Xiaomi 13 Pro (Android 13 - Chrome)
    'Mozilla/5.0 (Linux; Android 13; Xperia 1 V) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.5845.163 Mobile Safari/537.36', // Sony Xperia 1 V (Android 13 - Chrome)
    'Mozilla/5.0 (Linux; Android 13; SM-F946U) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/20.0 Chrome/116.0.5845.163 Mobile Safari/537.36', // Samsung Galaxy Z Fold 5 (Android 13 - Samsung Internet)
    'Mozilla/5.0 (Linux; Android 14; Pixel Fold) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.5993.89 Mobile Safari/537.36', // Google Pixel Fold (Android 14 - Chrome)
    // Additional mobile user agents
    'Mozilla/5.0 (Linux; Android 14; SM-G998B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.6000.88 Mobile Safari/537.36', // Samsung Galaxy S21 Ultra (Android 14 - Chrome)
    'Mozilla/5.0 (Linux; Android 13; OnePlus 10 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.5938.62 Mobile Safari/537.36', // OnePlus 10 Pro (Android 13 - Chrome)
    'Mozilla/5.0 (Linux; Android 14; Vivo X90 Pro+) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.5993.89 Mobile Safari/537.36', // Vivo X90 Pro+ (Android 14 - Chrome)
    'Mozilla/5.0 (Linux; Android 13; Galaxy Note 20 Ultra) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.5845.163 Mobile Safari/537.36', // Galaxy Note 20 Ultra (Android 13 - Chrome)
    'Mozilla/5.0 (Linux; Android 13; Redmi Note 12 Pro+) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.5845.163 Mobile Safari/537.36', // Redmi Note 12 Pro+ (Android 13 - Chrome)
    'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1', // iPhone 13 (iOS 16 - Safari)
    'Mozilla/5.0 (Linux; Android 14; Galaxy Z Flip 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.5993.89 Mobile Safari/537.36', // Galaxy Z Flip 5 (Android 14 - Chrome)
    'Mozilla/5.0 (Linux; Android 13; Realme GT 3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.5938.62 Mobile Safari/537.36', // Realme GT 3 (Android 13 - Chrome)
    'Mozilla/5.0 (Linux; Android 14; Motorola Edge 40) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.5993.89 Mobile Safari/537.36', // Motorola Edge 40 (Android 14 - Chrome)
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/117.0.5938.62 Mobile/15E148 Safari/604.1', // iPhone 14 (iOS 17 - Chrome)
  ];

  const desktopUserAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.5993.89 Safari/537.36', // Windows 10 - Chrome
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.5993.89 Safari/537.36', // macOS Ventura - Chrome
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.5993.89 Safari/537.36', // Linux - Chrome
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Firefox/118.0', // Windows 10 - Firefox
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15', // macOS Ventura - Safari
    'Mozilla/5.0 (Windows NT 11.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.6000.88 Safari/537.36', // Windows 11 - Chrome
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Firefox/118.0', // macOS Sonoma - Firefox
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15', // Linux - Safari
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:118.0) Gecko/20100101 Firefox/118.0', // Windows 10 - Firefox
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.6000.88 Safari/537.36', // macOS Sonoma - Chrome
  ];

  const userAgents = [...mobileUserAgents, ...desktopUserAgents];
  return userAgents[Math.floor(Math.random() * userAgents.length)];
}

export async function spoofFingerPrint(page: Page, deviceInfo: DeviceInfo): Promise<void> {
  // Set the viewport size to match the available screen resolution
  const [width, height] = deviceInfo.available_screen_resolution.split('x').map(Number);
  await page.setViewport({ width, height });

  // Override the user agent string to spoof the browser fingerprint
  await page.setUserAgent(deviceInfo.user_agent);

  // Set the timezone
  await page.evaluate((timezone) => {
    Object.defineProperty(Intl.DateTimeFormat.prototype, 'resolvedOptions', {
      value: () => ({ timeZone: timezone }),
    });
  }, deviceInfo.timezone);

  // Override the language setting (for navigator.language and others)
  await page.evaluate((lang) => {
    Object.defineProperty(navigator, 'language', {
      value: lang,
    });
    Object.defineProperty(navigator, 'languages', {
      value: [lang],
    });
  }, deviceInfo.system_lang);

  // Spoof the system version, device name, and brand model in the navigator object
  await page.evaluate((systemVersion, deviceName, brandModel) => {
    Object.defineProperty(navigator, 'userAgent', {
      value: `${navigator.userAgent} ${systemVersion}`,
    });
    Object.defineProperty(navigator, 'platform', {
      value: brandModel,
    });
    Object.defineProperty(navigator, 'deviceMemory', {
      value: 8, // Assuming an 8GB device memory (you can change this based on requirements)
    });
  }, deviceInfo.system_version, deviceInfo.device_name, deviceInfo.brand_model);

  // Spoof WebGL properties for the fingerprint
  await page.evaluate((webglVendor, webglRenderer) => {
    const fakeWebGLContext = {
      getParameter: (param: number) => {
        if (param === 37445) return webglVendor; // Example for WebGL Vendor spoofing
        if (param === 37446) return webglRenderer; // Example for WebGL Renderer spoofing
        return null;
      },
    };

    // We need to cast the fakeWebGLContext to WebGLRenderingContext
    const fakeWebGLRenderingContext = fakeWebGLContext as WebGLRenderingContext;

    // Store the original getContext method
    const originalGetContext = HTMLCanvasElement.prototype.getContext;

    // Override the getContext method
    HTMLCanvasElement.prototype.getContext.apply = function (contextId: string, options?: CanvasRenderingContext2DSettings) {
      // Ensure that the correct context is returned
      if (contextId === 'webgl' || contextId === 'experimental-webgl') {
        return fakeWebGLRenderingContext;  // Return the spoofed WebGL context
      }
      // For other contexts (like 2d), call the original getContext
      return originalGetContext.apply(this, arguments as any);
    };
  }, deviceInfo.webgl_vendor, deviceInfo.webgl_renderer);

  // Spoof the canvas fingerprint
  await page.evaluate((canvasCode) => {
    const originalToDataURL = HTMLCanvasElement.prototype.toDataURL;
    HTMLCanvasElement.prototype.toDataURL = function () {
      return canvasCode; // Return the spoofed canvas code
    };
  }, deviceInfo.canvas_code);

  // Set the audio properties (this may not always be easily spoofed in a browser)
  await page.evaluate((audio) => {
    Object.defineProperty(navigator, 'mediaDevices', {
      value: {
        enumerateDevices: async () => {
          return [
            { kind: 'audioinput', deviceId: 'audio-device-id', label: 'Audio Device', groupId: '' },
          ];
        },
      },
    });
  }, deviceInfo.audio);

  // Set the device fingerprint
  await page.evaluate((fingerprint) => {
    Object.defineProperty(navigator, 'fingerprint', {
      value: fingerprint,
    });
  }, deviceInfo.fingerprint);

  // Set the device ID and related device IDs
  await page.evaluate((deviceId, relatedDeviceIds) => {
    Object.defineProperty(navigator, 'deviceId', {
      value: deviceId,
    });
    Object.defineProperty(navigator, 'relatedDeviceIds', {
      value: relatedDeviceIds,
    });
  }, deviceInfo.device_id, deviceInfo.related_device_ids);
}


export function generateRandomDeviceInfo(): DeviceInfo {
  // Helper functions for random selection
  const randomElement = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

  const screenResolutions = [
    '1920x1080', '1366x768', '1280x720', '2560x1440', '3840x2160',
    '360x640', '720x1280', '1080x1920', '1440x2560', '1536x864'
  ];

  const systemVersions = [
    'Android 10', 'Android 11', 'Android 12', 'iOS 14', 'iOS 15', 'Windows 10', 'macOS 11', 'macOS 12'
  ];

  const deviceModels = [
    'Samsung Galaxy S10', 'Google Pixel 5', 'iPhone 12', 'iPhone 13', 'OnePlus 9', 'MacBook Pro 13"', 'Dell XPS 13', 'Surface Pro 7'
  ];

  const userAgents =  Array.from({length: 30}, (_, index) => getRandomUserAgent())

  const languages = ['en-US', 'en-GB', 'es-ES', 'fr-FR', 'de-DE', 'zh-CN', 'ja-JP'];
  const timezones = ['America/New_York', 'Europe/London', 'Asia/Tokyo', 'Europe/Berlin', 'Australia/Sydney', 'America/Los_Angeles'];
  const webglVendors = ['Google Inc.', 'Intel Inc.', 'NVIDIA Corporation', 'AMD', 'Apple Inc.'];
  const webglRenderers = [
    'ANGLE (Intel(R) HD Graphics 620 Direct3D11 vs_5_0 ps_5_0)', 'WebKit WebGL', 'Google Inc. – ANGLE (NVIDIA GeForce GTX 1650 Direct3D11 vs_5_0 ps_5_0)',
    'Apple Inc. – Apple M1', 'Intel Inc. – Intel Iris Plus Graphics 645', 'AMD – AMD Radeon Pro 5300M'
  ];

  const canvasCodes = [
    'data:image/png;base64,abcdef...', 'data:image/jpeg;base64,xyz123...', 'data:image/png;base64,123456...', 'data:image/jpeg;base64,qwerty...'
  ];

  const platforms = ['Android', 'iOS', 'Windows', 'macOS', 'Linux'];

  // Generate the random DeviceInfo
  const deviceInfo: DeviceInfo = {
    screen_resolution: randomElement(screenResolutions),
    available_screen_resolution: randomElement(screenResolutions),
    system_version: randomElement(systemVersions),
    brand_model: randomElement(deviceModels),
    system_lang: randomElement(languages),
    timezone: randomElement(timezones),
    timezoneOffset: new Date().getTimezoneOffset(),
    user_agent: randomElement(userAgents),
    list_plugin: 'flash',
    canvas_code: randomElement(canvasCodes),
    webgl_vendor: randomElement(webglVendors),
    webgl_renderer: randomElement(webglRenderers),
    audio: Math.floor(Math.random() * 2), // Simulating audio presence (1 for true, 0 for false)
    platform: randomElement(platforms),
    web_timezone: randomElement(timezones),
    device_name: randomElement(deviceModels),
    fingerprint: Math.random().toString(36).substring(2, 15),
    device_id: Math.random().toString(36).substring(2, 15),
    related_device_ids: Math.random().toString(36).substring(2, 15),
  };

  return deviceInfo;
}
