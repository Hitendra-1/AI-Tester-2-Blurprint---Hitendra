package com.vwo.tests;

import com.vwo.pages.LoginPage;
import io.qameta.allure.Epic;
import io.qameta.allure.Feature;
import io.qameta.allure.Severity;
import io.qameta.allure.SeverityLevel;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.testng.Assert;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

@Epic("VWO Authentication")
@Feature("Login functionality")
public class ValidLoginTest {
    private WebDriver driver;

    @BeforeMethod
    public void setup() {
        try {
            driver = new ChromeDriver();
            driver.manage().window().maximize();
            driver.get("https://app.vwo.com/#/login");
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Test
    @Severity(SeverityLevel.BLOCKER)
    public void testValidLogin() {
        try {
            LoginPage loginPage = new LoginPage(driver);
            loginPage.login("valid_user@vwo.com", "CorrectPassword123");
            Assert.assertTrue(driver.getCurrentUrl().contains("dashboard"));
        } catch (Exception e) {
            Assert.fail(e.getMessage());
        }
    }

    @AfterMethod
    public void teardown() {
        try {
            if (driver != null) {
                driver.quit();
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
