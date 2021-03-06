'use strict';

const { TypeUtils } = require('@applitools/eyes-common');
const { CorsIframeHandle } = require('@applitools/eyes-sdk-core');

const { VisualGridRunner } = require('./visualgrid/VisualGridRunner');
const { EyesSelenium } = require('./EyesSelenium');
const { EyesVisualGrid } = require('./EyesVisualGrid');
const { Configuration } = require('./config/Configuration');

/**
 * @ignore
 */
class EyesFactory {
  // noinspection JSAnnotator
  /**
   * Creates a new (possibly disabled) Eyes instance that interacts with the Eyes Server at the specified url.
   *
   * @param {string|boolean|VisualGridRunner} [serverUrl] - The Eyes server URL or set {@code true} if you want to use VisualGrid service (instead of 3rd argument).
   * @param {boolean} [isDisabled=false] - Set {@code true} to disable Applitools Eyes and use the webdriver directly.
   * @param {boolean} [isVisualGrid=false] - Set {@code true} if you want to use VisualGrid service.
   * @return {Eyes}
   */
  constructor(serverUrl, isDisabled, isVisualGrid) {
    let visualGridRunner;
    if (serverUrl instanceof VisualGridRunner) {
      isVisualGrid = true;
      visualGridRunner = serverUrl;
      serverUrl = undefined;
    } else if (TypeUtils.isBoolean(serverUrl)) {
      isVisualGrid = serverUrl;
      serverUrl = undefined;
    }

    if (isVisualGrid === true) {
      return new EyesVisualGrid(serverUrl, isDisabled, visualGridRunner);
    }

    return new EyesSelenium(serverUrl, isDisabled);
  }

  /**
   * For Selenium IDE initialization
   * @private
   */
  static fromBrowserInfo(serverUrl, isDisabled, config = {}) {
    const eyes = new EyesFactory(serverUrl, isDisabled, !!config.browser);
    if (config.browser) {
      const cfg = new Configuration();
      const browsers = Array.isArray(config.browser) ? config.browser : [config.browser];
      browsers.forEach(browser => {
        // If it quacks like a duck
        if (browser.name) {
          cfg.addBrowser(browser.width, browser.height, browser.name);
        } else if (browser.deviceName) {
          cfg.addDeviceEmulation(browser.deviceName, browser.screenOrientation);
        }
      });
      eyes.setConfiguration(cfg);
    }

    eyes._corsIframeHandle = CorsIframeHandle.BLANK;

    return eyes;
  }
}

exports.EyesFactory = EyesFactory;
