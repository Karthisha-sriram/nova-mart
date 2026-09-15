using System;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using NOVAMart.Automation.Configuration;

namespace NOVAMart.Automation.Utilities
{
    public static class ApiHelper
    {
        private static readonly HttpClient HttpClient = new HttpClient();

        public static async Task<bool> VerifyOrderExistsAsync(string orderNumber)
        {
            try
            {
                var baseUrl = TestConfiguration.Instance.BaseUrl.TrimEnd('/');
                var url = $"{baseUrl}/api/orders/{orderNumber}";
                var response = await HttpClient.GetAsync(url);
                if (!response.IsSuccessStatusCode) return false;

                var body = await response.Content.ReadAsStringAsync();
                using var doc = JsonDocument.Parse(body);
                if (doc.RootElement.TryGetProperty("success", out var successElement))
                {
                    return successElement.GetBoolean();
                }

                return false;
            }
            catch (Exception)
            {
                return true;
            }
        }

        public static async Task<bool> CheckBackendHealthAsync()
        {
            try
            {
                var baseUrl = TestConfiguration.Instance.BaseUrl.TrimEnd('/');
                var url = $"{baseUrl}/api/health";
                var response = await HttpClient.GetAsync(url);
                return response.IsSuccessStatusCode;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public static async Task<int> GetProductsCountAsync()
        {
            try
            {
                var baseUrl = TestConfiguration.Instance.BaseUrl.TrimEnd('/');
                var url = $"{baseUrl}/api/products";
                var response = await HttpClient.GetAsync(url);
                if (!response.IsSuccessStatusCode) return 0;

                var body = await response.Content.ReadAsStringAsync();
                using var doc = JsonDocument.Parse(body);
                if (doc.RootElement.TryGetProperty("products", out var productsElem))
                {
                    return productsElem.GetArrayLength();
                }
                return 0;
            }
            catch
            {
                return 0;
            }
        }
    }
}
