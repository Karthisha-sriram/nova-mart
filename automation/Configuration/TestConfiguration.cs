using System;
using System.IO;
using System.Text.Json;

namespace NOVAMart.Automation.Configuration
{
    public class TestConfiguration
    {
        private static TestConfiguration? _instance;
        public static TestConfiguration Instance => _instance ??= LoadConfiguration();

        public string BaseUrl { get; set; } = "http://localhost:3000";
        public string Browser { get; set; } = "Chrome";
        public bool Headless { get; set; } = true;
        public int ExplicitWaitSeconds { get; set; } = 10;
        public int ImplicitWaitSeconds { get; set; } = 5;
        public string TestUsername { get; set; } = "alex.sharma@example.com";
        public string TestPassword { get; set; } = "demo_hash_pwd_123";

        private static TestConfiguration LoadConfiguration()
        {
            var config = new TestConfiguration();

            // 1. Try to read from appsettings.json if present
            try
            {
                var configPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Configuration", "appsettings.json");
                if (!File.Exists(configPath))
                {
                    configPath = Path.Combine(Directory.GetCurrentDirectory(), "Configuration", "appsettings.json");
                }

                if (File.Exists(configPath))
                {
                    var json = File.ReadAllText(configPath);
                    using var doc = JsonDocument.Parse(json);
                    var root = doc.RootElement;

                    if (root.TryGetProperty("BaseUrl", out var baseUrlElem) && !string.IsNullOrWhiteSpace(baseUrlElem.GetString()))
                        config.BaseUrl = baseUrlElem.GetString()!;
                    if (root.TryGetProperty("Browser", out var browserElem) && !string.IsNullOrWhiteSpace(browserElem.GetString()))
                        config.Browser = browserElem.GetString()!;
                    if (root.TryGetProperty("Headless", out var headlessElem))
                        config.Headless = headlessElem.GetBoolean();
                    if (root.TryGetProperty("ExplicitWaitSeconds", out var explicitWaitElem))
                        config.ExplicitWaitSeconds = explicitWaitElem.GetInt32();
                    if (root.TryGetProperty("ImplicitWaitSeconds", out var implicitWaitElem))
                        config.ImplicitWaitSeconds = implicitWaitElem.GetInt32();
                    if (root.TryGetProperty("TestUsername", out var userElem) && !string.IsNullOrWhiteSpace(userElem.GetString()))
                        config.TestUsername = userElem.GetString()!;
                    if (root.TryGetProperty("TestPassword", out var passElem) && !string.IsNullOrWhiteSpace(passElem.GetString()))
                        config.TestPassword = passElem.GetString()!;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[Config] Notice: Could not read appsettings.json ({ex.Message}), using defaults and env vars.");
            }

            // 2. Overwrite with Environment Variables if defined (higher precedence)
            var envBaseUrl = Environment.GetEnvironmentVariable("BASE_URL");
            if (!string.IsNullOrWhiteSpace(envBaseUrl))
                config.BaseUrl = envBaseUrl.TrimEnd('/');

            var envBrowser = Environment.GetEnvironmentVariable("BROWSER");
            if (!string.IsNullOrWhiteSpace(envBrowser))
                config.Browser = envBrowser;

            var envHeadless = Environment.GetEnvironmentVariable("HEADLESS");
            if (!string.IsNullOrWhiteSpace(envHeadless) && bool.TryParse(envHeadless, out var parsedHeadless))
                config.Headless = parsedHeadless;

            var envUsername = Environment.GetEnvironmentVariable("TEST_USERNAME");
            if (!string.IsNullOrWhiteSpace(envUsername))
                config.TestUsername = envUsername;

            var envPassword = Environment.GetEnvironmentVariable("TEST_PASSWORD");
            if (!string.IsNullOrWhiteSpace(envPassword))
                config.TestPassword = envPassword;

            return config;
        }
    }
}
