using System;
using NOVAMart.Automation.Configuration;
using NOVAMart.Automation.Models;

namespace NOVAMart.Automation.Utilities
{
    public static class TestDataHelper
    {
        public static UserModel ValidUser => new UserModel
        {
            Email = TestConfiguration.Instance.TestUsername,
            Password = TestConfiguration.Instance.TestPassword,
            Name = "Alex Sharma"
        };

        public static UserModel AdminUser => new UserModel
        {
            Email = "lead.qa@novamart.internal",
            Password = "demo_hash_pwd_123",
            Name = "Lead QA Admin"
        };

        public static UserModel InvalidUser => new UserModel
        {
            Email = "invalid.user.qa@nonexistent-domain.com",
            Password = "WrongPassword_999!",
            Name = "Unknown"
        };

        public static CheckoutModel DefaultCheckout => new CheckoutModel
        {
            FullName = "Alex Sharma",
            Email = "alex.sharma@example.com",
            Phone = "9876543210",
            Address = "402 Silicon Heights, Tech Park Road",
            City = "Bengaluru",
            State = "Karnataka",
            PostalCode = "560100",
            PaymentMethod = "card",
            CardNumber = "4532 8920 1234 5678",
            CardExpiry = "12/28",
            CardCvv = "889"
        };

        public static string ValidSearchQuery => "NovaPods";
        public static string NoResultsQuery => "NonExistentUnobtainiumWidget999XYZ";
        public static string CategorySlug => "electronics";
        public static int MaxPriceFilter => 5000;
    }
}
