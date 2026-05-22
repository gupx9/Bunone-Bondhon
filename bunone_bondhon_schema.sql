CREATE DATABASE IF NOT EXISTS bunone_bondhon;
USE bunone_bondhon;

CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone_no VARCHAR(20),
    user_address VARCHAR(255),
    role ENUM('customer','admin') DEFAULT 'customer',
    account_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    language_preference VARCHAR(20) DEFAULT 'en',
    theme_preference ENUM('dark','light') DEFAULT 'light'
);

CREATE TABLE products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(150) NOT NULL,
    in_stock INT DEFAULT 0,
    price DECIMAL(10,2) NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    type ENUM('jewellery','clothing','mufflers','other') NOT NULL
);

CREATE TABLE cart (
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    product_price DECIMAL(10,2) NOT NULL,
    confirm_cart BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (user_id, product_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

CREATE TABLE transactions (
    transaction_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total_price DECIMAL(12,2) NOT NULL,
    payment_method ENUM('cod','bkash','nagad','card','other') NOT NULL,
    confirm_payment BOOLEAN DEFAULT FALSE,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE transaction_items (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    transaction_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    product_price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (transaction_id) REFERENCES transactions(transaction_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);


INSERT INTO products (product_name, in_stock, price, description, image_url, type) VALUES
('Gold Necklace', 10, 1500.00, 'Elegant gold necklace for special occasions.', 'https://i.ibb.co.com/wF9b8XZ0/gold-necklace.jpg', 'jewellery'),
('Silver Ring', 25, 1200.00, 'Sterling silver ring with classic design.', 'https://i.ibb.co.com/ZpFBdV0K/silver-ring.jpg', 'jewellery'),
('Cotton T-Shirt', 50, 500.00, 'Comfortable cotton t-shirt available in all sizes.', 'https://i.ibb.co.com/LTKYXp5/cotton-tshirt.jpg', 'clothing'),
('Woolen Scarf', 20, 300.00, 'Soft woolen scarf for winter.', 'https://i.ibb.co.com/q3MHHZgL/woolen-scarf.jpg', 'mufflers'),
('Handmade Bag', 15, 800.00, 'Stylish handmade bag with durable materials.', 'https://i.ibb.co.com/9HKGxrX1/handmade-bag.jpg', 'other'),
('Traditional Saree', 15, 2800.00, 'Handwoven cotton saree with traditional patterns.', 'https://i.ibb.co.com/j9WkwZyK/traditional-saree.jpg', 'clothing'),
('Salwar Kameez', 20, 1800.00, 'Elegant embroidered salwar kameez set with dupatta.', 'https://i.ibb.co.com/1D275BJ/salwar-kameez.jpg', 'clothing'),
('Lehenga Skirt', 10, 4500.00, 'Designer lehenga choli with intricate zari work.', 'https://i.ibb.co.com/G3QdQcVv/lehenga-skirt.jpg', 'clothing'),
('Kurti', 25, 1200.00, 'Trendy kurti perfect for casual and festive wear.', 'https://i.ibb.co.com/9fRLWc8/kurti.jpg', 'clothing');

