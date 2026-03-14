package com.salesforce.tests;

import com.salesforce.pages.LoginPage;
import io.qameta.allure.Description;
import io.qameta.allure.Severity;
import io.qameta.allure.SeverityLevel;
import io.qameta.allure.Epic;
import io.qameta.allure.Feature;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.testng.Assert;
import org.testng.annotations.AfterTest;
import org.testng.annotations.BeforeTest;
import org.testng.annotations.Test;
import java.time.Duration;

@Epic("Salesforce Login Portal")
@Feature("Authentication Services")
public class InvalidLoginTest {
    private WebDriver driver;

    @BeforeTest
    public void setUp() {
        try {
            driver = new ChromeDriver();
            driver.manage().window().maximize();
            driver.manage().timeouts().pageLoadTimeout(Duration.ofSeconds(60));
            driver.get("https://login.salesforce.com/?locale=in");
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Test(priority = 2)
    @Severity(SeverityLevel.NORMAL)
    @Description("Verify invalid login strictly displays an error message containing invalid credential responses")
    public void testInvalidLogin() {
        try {
            LoginPage loginPage = new LoginPage(driver);
            loginPage.enterUsername("invaliduser@salesforce.com");
            loginPage.enterPassword("WrongPassword123!");
            loginPage.clickLogin();
            
            Assert.assertTrue(loginPage.isErrorMessageDisplayed());
        } catch (Exception e) {
            Assert.fail(e.getMessage());
        }
    }

    @AfterTest
    public void tearDown() {
        try {
            if (driver != null) {
                driver.quit();
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
