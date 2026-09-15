namespace NOVAMart.Automation.Models
{
    public class UserModel
    {
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string ConfirmPassword { get; set; } = string.Empty;
    }

    public class ProductModel
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int DiscountPercent { get; set; }
        public string Slug { get; set; } = string.Empty;
    }

    public class CheckoutModel
    {
        public string FullName { get; set; } = "Alex Morgan";
        public string Email { get; set; } = "alex.morgan@testdomain.com";
        public string Phone { get; set; } = "9876543210";
        public string Address { get; set; } = "742 Evergreen Terrace";
        public string City { get; set; } = "Mumbai";
        public string State { get; set; } = "Maharashtra";
        public string PostalCode { get; set; } = "400001";
        public string PaymentMethod { get; set; } = "card"; // card, upi, cod
        public string CardNumber { get; set; } = "4532 8920 1234 5678";
        public string CardExpiry { get; set; } = "12/28";
        public string CardCvv { get; set; } = "889";
    }

    public class OrderConfirmationModel
    {
        public string OrderNumber { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public decimal TotalAmount { get; set; }
    }
}
