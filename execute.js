const { Builder, By, Key } = require("selenium-webdriver");
const chrome = require('selenium-webdriver/chrome');
const options = new chrome.Options();
options.excludeSwitches(['enable-logging']);

module.exports = async ({ usr, pwd }) => {
    const driver = await new Builder().forBrowser("chrome").setChromeOptions(options).build();
    await driver.get('https://sql.cankaya.edu.tr/Evaluation');

    const usernameInput = (await driver.findElements(By.id("UserName")))[0];
    await driver.executeScript("arguments[0].scrollIntoView(true);", usernameInput);
    await usernameInput?.click();
    await usernameInput?.sendKeys(usr);

    const passwordInput = (await driver.findElements(By.id("Password")))[0];
    await driver.executeScript("arguments[0].scrollIntoView(true);", passwordInput);
    await passwordInput?.click();
    await passwordInput?.sendKeys(pwd);

    await driver.sleep(1000);

    const submitButton = (await driver.findElements(By.className("btn btn-primary btn-block btn-flat")))[0];
    await driver.executeScript("arguments[0].scrollIntoView(true);", submitButton);
    await submitButton?.click();

    const surveys = await driver.findElements(By.className("btn btn-info"));
    for (let i = 0; i < surveys.length; i++) {
        const survey = (await driver.findElements(By.className("btn btn-info")))[i];
        await driver.executeScript("arguments[0].scrollIntoView(true);", survey);
        await survey?.click();

        const rows = await driver.findElements(By.className("table table-responsive"));
        await Promise.all(rows.map(async (row) => {
            const rowText = await row.getText();
            if (rowText.includes("0 1 2 3 4 5")) {
                let five = await row.findElement(By.css("input[value='5']"));
                await driver.executeScript("arguments[0].scrollIntoView(true);", five);
                await five?.click();
            }
        }));

        const sendSurvey = (await driver.findElements(By.id("submitButton")))[0];
        await driver.executeScript("arguments[0].scrollIntoView(true);", sendSurvey);
        await sendSurvey?.click();
    }
} 