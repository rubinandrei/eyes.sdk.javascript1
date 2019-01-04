'use strict';

require('chromedriver');
const { Builder } = require('selenium-webdriver');
const { BatchInfo } = require('@applitools/eyes-sdk-core');
const { Eyes, Target, RenderingConfiguration } = require('../index'); // Should be replaced to `@applitools/eyes-rendering` if used outside of the package

let /** @type {WebDriver} */ webDriver;
describe('EyesRendering', function () {
  this.timeout(5 * 60 * 1000);

  before(async function () {
    webDriver = await new Builder().forBrowser('chrome').build();
  });

  it('VisualGridTestPage', async function () {
    await webDriver.get('https://applitools.github.io/demo/TestPages/VisualGridTestPage');

    const eyes = new Eyes();
    eyes.setBatch(new BatchInfo('EyesRenderingBatch'));

    // eyes.setProxy('http://127.0.0.1:8888');

    try {
      const renderingConfiguration = new RenderingConfiguration();
      renderingConfiguration.setTestName('Open Concurrency with Batch 2');
      renderingConfiguration.setAppName('RenderingGridIntegration');
      renderingConfiguration.addBrowser(800, 600, RenderingConfiguration.BrowserType.CHROME);
      renderingConfiguration.addBrowser(700, 500, RenderingConfiguration.BrowserType.CHROME);
      renderingConfiguration.addBrowser(400, 300, RenderingConfiguration.BrowserType.CHROME);

      await eyes.open(webDriver, renderingConfiguration);

      await eyes.check('tedt', Target.window());

      await eyes.closeAndPrintResults(false);
    } catch (err) {
      throw err;
    }
  });

  after(async function () {
    if (webDriver != null) {
      await webDriver.quit();
    }
  });
});