'use strict';

require('chromedriver'); // eslint-disable-line node/no-unpublished-require
const { Builder, Capabilities, By } = require('selenium-webdriver');
const { ConsoleLogHandler } = require('@applitools/eyes-sdk-core');
const { Eyes, Target, SeleniumConfiguration, BrowserType } = require('../index'); // should be replaced to '@applitools/eyes-selenium'

(async () => {
  // Open a Chrome browser.
  const driver = new Builder()
    .withCapabilities(Capabilities.chrome())
    .build();

  // Initialize the eyes SDK and set your private API key.
  const eyes = new Eyes(undefined, undefined, true);
  // eyes.setApiKey('Your API Key');
  eyes.setLogHandler(new ConsoleLogHandler(false));

  try {
    const configuration = new SeleniumConfiguration();
    configuration.addBrowser(800, 600, BrowserType.CHROME);

    // Start the test and set the browser's viewport size to 800x600.
    await eyes.open(driver, 'Eyes VisualGrid Examples', 'My first Javascript test!', undefined, configuration);

    // Navigate the browser to the "hello world!" web-site.
    await driver.get('https://applitools.com/helloworld');

    // Visual checkpoint #1.
    await eyes.check('Main Page', Target.window());

    // Click the "Click me!" button.
    await driver.findElement(By.css('button')).click();

    // Visual checkpoint #2.
    await eyes.check('Click!', Target.window());

    // End the test.
    await eyes.close();
  } catch (err) {
    console.error(err);  // eslint-disable-line no-console
  } finally {
    // Close the browser.
    await driver.quit();

    // If the test was aborted before eyes.close was called ends the test as aborted.
    await eyes.abortIfNotClosed();
  }
})();
