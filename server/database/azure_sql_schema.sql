-- =========================================================================
-- NOVA MART - Microsoft Azure SQL Database / SQL Server Schema
-- Target: Azure SQL Database (General Purpose / Serverless / Hyperscale)
-- =========================================================================

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Users')
BEGIN
    CREATE TABLE Users (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        Email NVARCHAR(255) NOT NULL UNIQUE,
        PasswordHash NVARCHAR(500) NOT NULL,
        FullName NVARCHAR(150) NOT NULL,
        Phone NVARCHAR(20) NULL,
        Role NVARCHAR(50) DEFAULT 'customer',
        AvatarUrl NVARCHAR(1000) NULL,
        Street NVARCHAR(255) NULL,
        City NVARCHAR(100) NULL,
        State NVARCHAR(100) NULL,
        PostalCode NVARCHAR(20) NULL,
        CreatedAt DATETIME2 DEFAULT SYSUTCDATETIME()
    );
END;

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Categories')
BEGIN
    CREATE TABLE Categories (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        Slug NVARCHAR(100) NOT NULL UNIQUE,
        Name NVARCHAR(100) NOT NULL,
        Description NVARCHAR(500) NULL,
        ImageUrl NVARCHAR(1000) NOT NULL,
        IconName NVARCHAR(50) NULL,
        CreatedAt DATETIME2 DEFAULT SYSUTCDATETIME()
    );
END;

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Products')
BEGIN
    CREATE TABLE Products (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        Sku NVARCHAR(64) NOT NULL UNIQUE,
        Name NVARCHAR(255) NOT NULL,
        Slug NVARCHAR(255) NOT NULL UNIQUE,
        Description NVARCHAR(MAX) NOT NULL,
        CategoryId INT NOT NULL,
        Price DECIMAL(18,2) NOT NULL,
        DiscountPercent INT DEFAULT 0,
        Stock INT DEFAULT 50,
        Rating DECIMAL(3,2) DEFAULT 4.5,
        ReviewCount INT DEFAULT 0,
        ImageUrl NVARCHAR(1000) NOT NULL,
        AdditionalImages NVARCHAR(MAX) NULL, -- JSON array
        Specifications NVARCHAR(MAX) NULL,    -- JSON object
        Featured BIT DEFAULT 0,
        IsNew BIT DEFAULT 0,
        CreatedAt DATETIME2 DEFAULT SYSUTCDATETIME(),
        CONSTRAINT FK_Products_Categories FOREIGN KEY (CategoryId) REFERENCES Categories(Id) ON DELETE CASCADE,
        CONSTRAINT UQ_Products_Name UNIQUE (Name)
    );

    CREATE NONCLUSTERED INDEX IX_Products_CategoryId ON Products(CategoryId);
    CREATE NONCLUSTERED INDEX IX_Products_Price ON Products(Price);
    CREATE NONCLUSTERED INDEX IX_Products_Rating ON Products(Rating);
END;

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Cart')
BEGIN
    CREATE TABLE Cart (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        UserId INT NULL,
        SessionId NVARCHAR(100) NOT NULL UNIQUE,
        CreatedAt DATETIME2 DEFAULT SYSUTCDATETIME(),
        UpdatedAt DATETIME2 DEFAULT SYSUTCDATETIME(),
        CONSTRAINT FK_Cart_Users FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE SET NULL
    );
END;

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'CartItems')
BEGIN
    CREATE TABLE CartItems (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        CartId INT NOT NULL,
        ProductId INT NOT NULL,
        Quantity INT NOT NULL DEFAULT 1,
        CreatedAt DATETIME2 DEFAULT SYSUTCDATETIME(),
        CONSTRAINT FK_CartItems_Cart FOREIGN KEY (CartId) REFERENCES Cart(Id) ON DELETE CASCADE,
        CONSTRAINT FK_CartItems_Products FOREIGN KEY (ProductId) REFERENCES Products(Id) ON DELETE CASCADE,
        CONSTRAINT UQ_Cart_Product UNIQUE(CartId, ProductId)
    );
END;

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Orders')
BEGIN
    CREATE TABLE Orders (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        OrderNumber NVARCHAR(50) NOT NULL UNIQUE,
        UserId INT NULL,
        CustomerName NVARCHAR(150) NOT NULL,
        CustomerEmail NVARCHAR(255) NOT NULL,
        CustomerPhone NVARCHAR(20) NOT NULL,
        ShippingAddress NVARCHAR(MAX) NOT NULL,
        PaymentMethod NVARCHAR(50) NOT NULL,
        PaymentStatus NVARCHAR(50) DEFAULT 'Paid',
        Subtotal DECIMAL(18,2) NOT NULL,
        Discount DECIMAL(18,2) DEFAULT 0,
        ShippingFee DECIMAL(18,2) DEFAULT 0,
        Tax DECIMAL(18,2) DEFAULT 0,
        TotalAmount DECIMAL(18,2) NOT NULL,
        OrderStatus NVARCHAR(50) DEFAULT 'Processing',
        EstimatedDelivery NVARCHAR(100) NOT NULL,
        CreatedAt DATETIME2 DEFAULT SYSUTCDATETIME(),
        CONSTRAINT FK_Orders_Users FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE SET NULL
    );

    CREATE NONCLUSTERED INDEX IX_Orders_UserId ON Orders(UserId);
    CREATE NONCLUSTERED INDEX IX_Orders_Status ON Orders(OrderStatus);
END;

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'OrderItems')
BEGIN
    CREATE TABLE OrderItems (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        OrderId INT NOT NULL,
        ProductId INT NOT NULL,
        ProductName NVARCHAR(255) NOT NULL,
        Price DECIMAL(18,2) NOT NULL,
        Quantity INT NOT NULL,
        ImageUrl NVARCHAR(1000) NOT NULL,
        CreatedAt DATETIME2 DEFAULT SYSUTCDATETIME(),
        CONSTRAINT FK_OrderItems_Orders FOREIGN KEY (OrderId) REFERENCES Orders(Id) ON DELETE CASCADE,
        CONSTRAINT FK_OrderItems_Products FOREIGN KEY (ProductId) REFERENCES Products(Id)
    );
END;

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Reviews')
BEGIN
    CREATE TABLE Reviews (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        ProductId INT NOT NULL,
        UserId INT NULL,
        UserName NVARCHAR(150) NOT NULL,
        Rating INT NOT NULL CHECK (Rating BETWEEN 1 AND 5),
        Comment NVARCHAR(MAX) NOT NULL,
        VerifiedPurchase BIT DEFAULT 1,
        CreatedAt DATETIME2 DEFAULT SYSUTCDATETIME(),
        CONSTRAINT FK_Reviews_Products FOREIGN KEY (ProductId) REFERENCES Products(Id) ON DELETE CASCADE,
        CONSTRAINT FK_Reviews_Users FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE SET NULL
    );

    CREATE NONCLUSTERED INDEX IX_Reviews_ProductId ON Reviews(ProductId);
END;

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Wishlist')
BEGIN
    CREATE TABLE Wishlist (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        UserId INT NULL,
        SessionId NVARCHAR(100) NOT NULL,
        ProductId INT NOT NULL,
        CreatedAt DATETIME2 DEFAULT SYSUTCDATETIME(),
        CONSTRAINT FK_Wishlist_Users FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE,
        CONSTRAINT FK_Wishlist_Products FOREIGN KEY (ProductId) REFERENCES Products(Id) ON DELETE CASCADE,
        CONSTRAINT UQ_Wishlist_Session_Product UNIQUE(SessionId, ProductId)
    );
END;
