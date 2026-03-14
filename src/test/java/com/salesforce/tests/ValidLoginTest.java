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
public class ValidLoginTest {
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

    @Test(priority = 1)
    @Severity(SeverityLevel.CRITICAL)
    @Description("Verify valid login accepts proper credentials and navigates successfully")
    public void testValidLogin() {
        try {
            LoginPage loginPage = new LoginPage(driver);
            loginPage.enterUsername("validuser@salesforce.com");
            loginPage.enterPassword("ValidPassword123!");
            loginPage.clickLogin();
            
            String currentUrl = driver.getCurrentUrl();
            Assert.assertTrue(currentUrl.contains("lightning.force.com") || currentUrl.contains("home/home.jsp"));
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
