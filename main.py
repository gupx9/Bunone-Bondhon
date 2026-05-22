from flask import Flask, render_template, request, redirect, url_for, session, flash
from flask_mysqldb import MySQL
import MySQLdb.cursors
import re
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

#inirializing flask
app = Flask(__name__)
#importing sql from flask (connection)
mysql = MySQL(app)

app.secret_key = "pieu"

#for hosting
# app.config['MYSQL_HOST'] = 'fdb1034.awardspace.net' #server 
# app.config['MYSQL_USER'] = '4668724_bb' #default
# app.config['MYSQL_PASSWORD'] = ';dsWlF3U2Z%9/Tk8'  #default
# app.config['MYSQL_PORT'] = 3306
# app.config['MYSQL_DB'] = '4668724_bb' #db_name
# app.config['MYSQL_CURSORCLASS'] = 'DictCursor' #start n end before every query

#for localhost
app.config['MYSQL_HOST'] = 'localhost' #server 
app.config['MYSQL_USER'] = 'root' #default
app.config['MYSQL_PASSWORD'] = ''  #default
app.config['MYSQL_PORT'] = 3306
app.config['MYSQL_DB'] = 'bunone_bondhon' #db_name
app.config['MYSQL_CURSORCLASS'] = 'DictCursor' #start n end before every query

@app.route("/") #default front end starts (initialize)

def home():
    #index page set to login
    if "user_id" in session:
        return redirect(url_for("index"))
    return redirect(url_for("login"))

@app.route("/register",methods=["POST","GET"]) #jei page open korbo (navigate)
def register():
    if request.method == "POST":
        role = request.form["role"]
        name = request.form["name"]
        email =  request.form["email"]
        password = request.form["password"]
        phone_no = request.form.get("phone_no", "")
        user_address = request.form.get("user_address", "")

        #exe obj
        cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        cursor.execute("SELECT * FROM users WHERE email=%s",(email,))
        #fetchone - first row, fetchall - full rows
        table_with_matched_email = cursor.fetchone()

        if table_with_matched_email:
            flash("ID already exists. Please continue to login.","danger")
            return render_template("register.html")

        else:
            hashed_password = generate_password_hash(password)
            cursor.execute(
            "INSERT INTO users (name, email, password, phone_no, user_address, role) VALUES (%s, %s, %s, %s, %s, %s)",
            (name, email, hashed_password, phone_no, user_address, role))

        mysql.connection.commit()       
        cursor.close()
        flash("Registration successful! Please login.", "success")
        return redirect(url_for("login"))

    return render_template("register.html")



@app.route("/login",methods=["POST","GET"]) #jei page open korbo (navigate)
def login():
    if request.method == "POST":
        email =  request.form["email"]
        password = request.form["password"]
        #exe obj
        cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        cursor.execute("SELECT * FROM users WHERE email=%s",(email,))
        #fetchone - first row, fetchall - full rows
        user_with_matched_email = cursor.fetchone()
        cursor.close()

        if user_with_matched_email:
            if check_password_hash(user_with_matched_email["password"], password):
                #password matched
                session["name"] = user_with_matched_email["name"]
                session["role"] = user_with_matched_email["role"]
                session["user_id"] = user_with_matched_email["user_id"]
                session['theme'] = user_with_matched_email['theme_preference']
                flash("Login successful!", "success")

                #check for admin
                if user_with_matched_email["role"] == "admin":
                    return redirect(url_for("admin_dashboard"))
                else:
                    return redirect(url_for("index"))
            
            else:
                flash("Invalid password.", "danger")

        else:
            flash("No account found with that email.", "danger")

    return render_template("login.html")

#for user
@app.route("/index",methods=["POST","GET"]) #jei page open korbo (navigate)
def index():
    #if user is logged in
    if "user_id" not in session:
        flash("Please login first", "danger")
        return redirect(url_for("login"))
    
    sort_by = request.args.get("sort_by", "default")
    
    #fetch the products table
    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    cursor.execute("SELECT * FROM products")
    if sort_by == "name":
        cursor.execute("SELECT * FROM products ORDER BY product_name ASC")
    elif sort_by == "price_low":
        cursor.execute("SELECT * FROM products ORDER BY price ASC")
    elif sort_by == "price_high":
        cursor.execute("SELECT * FROM products ORDER BY price DESC")
    else:
        cursor.execute("SELECT * FROM products")
    products = cursor.fetchall()
    cursor.close()
    
    return render_template("index.html", products=products, sort_by=sort_by)

#dark-light toggle func
@app.route('/toggle_theme', methods=['POST'])
def toggle_theme():
    if 'user_id' not in session:
        return redirect(url_for('login'))

    user_id = session['user_id']

    # get current theme from session (default = light)
    current_theme = session.get('theme', 'light')
    if current_theme == 'light':
        new_theme = 'dark'
    else:
        new_theme = 'light'

    # insert in db
    cursor = mysql.connection.cursor()
    cursor.execute("UPDATE users SET theme_preference=%s WHERE user_id=%s", (new_theme, user_id))
    mysql.connection.commit()
    cursor.close()

    #set the new theme
    session['theme'] = new_theme

    return redirect(request.referrer or url_for('index'))

#my cart
@app.route("/cart")
def cart():
    # Check if user is logged in
    if "user_id" not in session:
        flash("Please login first", "danger")
        return redirect(url_for("login"))
    
    user_id = session["user_id"]
    
    # Get cart items from database
    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    cursor.execute("""
        SELECT c.*, p.product_name, p.price 
        FROM cart c 
        JOIN products p ON c.product_id = p.product_id 
        WHERE c.user_id = %s
    """, (user_id,))
    cart_items = cursor.fetchall()
    
    # Calculate total price
    total = 0
    for item in cart_items:
        total += item["price"] * item["quantity"]
    
    cursor.close()
    return render_template("cart.html", cart_items=cart_items, total=total)

#for adding items to cart
@app.route("/add_to_cart", methods=["POST"])
def add_to_cart():
    # Check if user is logged in
    if "user_id" not in session:
        flash("Please login first", "danger")
        return redirect(url_for("login"))
    
    # Get form data
    product_id = request.form["product_id"]
    quantity = int(request.form["quantity"])
    user_id = session["user_id"]
    
    # if product exists and get its price
    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    cursor.execute("SELECT * FROM products WHERE product_id = %s", (product_id,))
    product = cursor.fetchone()
    
    if not product:
        flash("Product not found", "danger")
        return redirect(url_for("index"))
    
    # Check if enough stock is available
    if quantity > product["in_stock"]:
        flash(f"Only {product['in_stock']} items available in stock", "danger")
        return redirect(url_for("index"))
    
    # Check if product is already in cart
    cursor.execute("SELECT * FROM cart WHERE user_id = %s AND product_id = %s", (user_id, product_id))
    existing_item = cursor.fetchone()
    
    if existing_item:
        # Update quantity if product already in cart
        new_quantity = existing_item["quantity"] + quantity
        cursor.execute("UPDATE cart SET quantity = %s WHERE user_id = %s AND product_id = %s", 
                      (new_quantity, user_id, product_id))
    else:
        # Add new item to cart
        cursor.execute("INSERT INTO cart (user_id, product_id, quantity) VALUES (%s, %s, %s)",
                      (user_id, product_id, quantity))
    
    # DECREASE STOCK - This is crucial!
    cursor.execute("UPDATE products SET in_stock = in_stock - %s WHERE product_id = %s", 
                  (quantity, product_id))
    
    mysql.connection.commit()
    cursor.close()
    
    flash(f"{product['product_name']} added to cart!", "success")
    return redirect(url_for("index"))

#for removing items from cart
@app.route("/update_cart_quantity", methods=["POST"])
def update_cart_quantity():
    if "user_id" not in session:
        flash("Please login first", "danger")
        return redirect(url_for("login"))

    user_id = session["user_id"]
    product_id = request.form["product_id"]
    action = request.form["action"]

    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)

    # Get current cart + product info
    cursor.execute("""
        SELECT c.quantity, p.in_stock, p.product_name
        FROM cart c 
        JOIN products p ON c.product_id = p.product_id
        WHERE c.user_id = %s AND c.product_id = %s
    """, (user_id, product_id))
    cart_item = cursor.fetchone()

    if not cart_item:
        flash("Item not found in cart", "danger")
        cursor.close()
        return redirect(url_for("cart"))

    # Handle Add Onex
    if action == "add":
        if cart_item["in_stock"] <= 0:
            flash("No more stock available", "danger")
        else:
            cursor.execute("UPDATE cart SET quantity = quantity + 1 WHERE user_id = %s AND product_id = %s",
                           (user_id, product_id))
            cursor.execute("UPDATE products SET in_stock = in_stock - 1 WHERE product_id = %s",
                           (product_id,))
            flash(f"One {cart_item['product_name']} added", "success")

    # Handle Remove One
    elif action == "remove":
        if cart_item["quantity"] > 1:
            cursor.execute("UPDATE cart SET quantity = quantity - 1 WHERE user_id = %s AND product_id = %s",
                           (user_id, product_id))
            cursor.execute("UPDATE products SET in_stock = in_stock + 1 WHERE product_id = %s",
                           (product_id,))
            flash(f"One {cart_item['product_name']} removed", "success")
        else:
            cursor.execute("DELETE FROM cart WHERE user_id = %s AND product_id = %s",
                           (user_id, product_id))
            cursor.execute("UPDATE products SET in_stock = in_stock + 1 WHERE product_id = %s",
                           (product_id,))
            flash(f"{cart_item['product_name']} removed from cart", "success")

    mysql.connection.commit()
    cursor.close()
    return redirect(url_for("cart"))


#for removing cart index
@app.route("/remove_from_cart_index", methods=["POST"])
def remove_from_cart_index():
    if "user_id" not in session:
        flash("Please login first", "danger")
        return redirect(url_for("login"))
    
    product_id = request.form["product_id"]
    quantity = int(request.form["quantity"])
    user_id = session["user_id"]
    
    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    
    # Check if product exists in cart
    cursor.execute("SELECT * FROM cart WHERE user_id = %s AND product_id = %s", (user_id, product_id))
    cart_item = cursor.fetchone()
    
    if cart_item:
        # Calculate new quantity
        new_quantity = max(0, cart_item["quantity"] - quantity)
        
        if new_quantity > 0:
            # Update quantity in cart
            cursor.execute("UPDATE cart SET quantity = %s WHERE user_id = %s AND product_id = %s", 
                          (new_quantity, user_id, product_id))
            # Increase stock by the removed quantity
            cursor.execute("UPDATE products SET in_stock = in_stock + %s WHERE product_id = %s", 
                          (quantity, product_id))
        else:
            # Remove item completely if quantity becomes 0
            cursor.execute("DELETE FROM cart WHERE user_id = %s AND product_id = %s", (user_id, product_id))
            # Increase stock by the full quantity
            cursor.execute("UPDATE products SET in_stock = in_stock + %s WHERE product_id = %s", 
                          (cart_item["quantity"], product_id))
        
        mysql.connection.commit()
        flash("Item removed from cart", "success")
    else:
        flash("Item not found in cart", "danger")
    
    cursor.close()
    return redirect(url_for("index"))


@app.route("/logout")
def logout():
    session.clear()  # Clear all session data
    flash("You have been logged out successfully", "info")
    return redirect(url_for("login"))  #as rerouting. no .html

# Add this import at the top of your file
from datetime import datetime

# Add this route after your existing routes
@app.route("/process_payment", methods=["POST"])
def process_payment():
    if "user_id" not in session:
        flash("Please login first", "danger")
        return redirect(url_for("login"))
    
    user_id = session["user_id"]
    payment_method = request.form["payment_method"]
    
    # Get cart items and calculate total
    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    cursor.execute("""
        SELECT c.*, p.product_name, p.price 
        FROM cart c 
        JOIN products p ON c.product_id = p.product_id 
        WHERE c.user_id = %s
    """, (user_id,))
    cart_items = cursor.fetchall()
    
    if not cart_items:
        flash("Your cart is empty", "danger")
        return redirect(url_for("cart"))
    
    # Calculate total price
    total = 0
    for item in cart_items:
        total += item["price"] * item["quantity"]
    
    try:
        # Create a new transaction
        cursor.execute(
            "INSERT INTO transactions (user_id, total_price, payment_method, confirm_payment) VALUES (%s, %s, %s, %s)",
            (user_id, total, payment_method, True)
        )
        transaction_id = cursor.lastrowid
        
        # Add items to transaction_items table
        for item in cart_items:
            cursor.execute(
                "INSERT INTO transaction_items (transaction_id, product_id, quantity, product_price) VALUES (%s, %s, %s, %s)",
                (transaction_id, item["product_id"], item["quantity"], item["price"])
            )
        
        # Clear the cart
        cursor.execute("DELETE FROM cart WHERE user_id = %s", (user_id,))
        
        mysql.connection.commit()
        cursor.close()
        
        flash("Payment successful! Your order has been placed.", "success")
        return redirect(url_for("index"))
        
    except Exception as e:
        mysql.connection.rollback()
        cursor.close()
        flash("An error occurred during payment processing. Please try again.", "danger")
        return redirect(url_for("cart"))
    
@app.route("/order_history")
def order_history():
    # Check if user is logged in
    if "user_id" not in session:
        flash("Please login first", "danger")
        return redirect(url_for("login"))
    
    user_id = session["user_id"]
    
    # Get all transactions for the user with their items
    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    
    # Get transactions grouped by date
    cursor.execute("""
        SELECT 
            DATE(order_date) as order_date,
            COUNT(*) as order_count,
            SUM(total_price) as daily_total
        FROM transactions 
        WHERE user_id = %s 
        GROUP BY DATE(order_date) 
        ORDER BY order_date DESC
    """, (user_id,))
    orders_by_date = cursor.fetchall()
    
    # Get all transactions with their items
    cursor.execute("""
        SELECT 
            t.transaction_id,
            t.order_date,
            t.total_price,
            t.payment_method,
            ti.product_id,
            ti.quantity,
            ti.product_price,
            p.product_name
        FROM transactions t
        JOIN transaction_items ti ON t.transaction_id = ti.transaction_id
        JOIN products p ON ti.product_id = p.product_id
        WHERE t.user_id = %s
        ORDER BY t.order_date DESC, t.transaction_id
    """, (user_id,))
    
    transaction_items = cursor.fetchall()
    cursor.close()
    
    # Organize items by transaction and date
    transactions_by_date = {}
    for item in transaction_items:
        date_key = item['order_date'].strftime('%Y-%m-%d')
        transaction_id = item['transaction_id']
        
        if date_key not in transactions_by_date:
            transactions_by_date[date_key] = {}
        
        if transaction_id not in transactions_by_date[date_key]:
            transactions_by_date[date_key][transaction_id] = {
                'order_date': item['order_date'],
                'total_price': item['total_price'],
                'payment_method': item['payment_method'],
                'items': []
            }
        
        transactions_by_date[date_key][transaction_id]['items'].append({
            'product_id': item['product_id'],
            'product_name': item['product_name'],
            'quantity': item['quantity'],
            'product_price': item['product_price'],
            'subtotal': item['quantity'] * item['product_price']
        })
    
    return render_template("order_history.html", 
                         orders_by_date=orders_by_date,
                         transactions_by_date=transactions_by_date)
# ---------- Admin ----------
@app.route("/admin_dashboard")
def admin_dashboard():
    if "role" not in session or session["role"] != "admin":
        flash("Admin access required", "danger")
        return redirect(url_for("index"))

    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    cursor.execute("SELECT * FROM products ORDER BY product_id")
    products = cursor.fetchall()

    # Include username from users table
    cursor.execute("""
        SELECT t.transaction_id, t.user_id, u.name, t.order_date, t.total_price,
               t.payment_method, t.confirm_payment,
               ti.product_id, ti.quantity, ti.product_price,
               p.product_name
        FROM transactions t
        JOIN users u ON t.user_id = u.user_id
        JOIN transaction_items ti ON t.transaction_id = ti.transaction_id
        JOIN products p ON ti.product_id = p.product_id
        ORDER BY t.order_date DESC
    """)
    rows = cursor.fetchall()
    cursor.close()

    transactions = {}
    for item in rows:
        tid = item['transaction_id']
        if tid not in transactions:
            transactions[tid] = {
                'transaction_id': tid,
                'user_id': item['user_id'],
                'name': item['name'],   #  store username
                'order_date': item['order_date'],
                'total_price': item['total_price'],
                'payment_method': item['payment_method'],
                'confirm_payment': item['confirm_payment'],
                'items': []
            }
        transactions[tid]['items'].append({
            'product_id': item['product_id'],
            'product_name': item['product_name'],
            'quantity': item['quantity'],
            'product_price': item['product_price'],
            'subtotal': item['quantity'] * item['product_price']  #  add subtotal
        })

    transactions_list = list(transactions.values())
    return render_template("admin_dashboard.html",
                           products=products,
                           transactions=transactions_list)


@app.route("/update_product/<int:product_id>", methods=["POST"])
def update_product(product_id):
    if "role" not in session or session["role"] != "admin":
        flash("Admin access required", "danger")
        return redirect(url_for("index"))

    product_name = request.form["product_name"]
    in_stock = int(request.form["in_stock"])
    price = float(request.form["price"])
    description = request.form.get("description", "")
    image_url = request.form.get("image_url", "")
    product_type = request.form["type"]

    cursor = mysql.connection.cursor()
    try:
        cursor.execute("""
            UPDATE products
            SET product_name=%s, in_stock=%s, price=%s, description=%s, image_url=%s, type=%s
            WHERE product_id=%s
        """, (product_name, in_stock, price, description, image_url, product_type, product_id))
        mysql.connection.commit()
        flash("Product updated successfully!", "success")
    except Exception as e:
        mysql.connection.rollback()
        flash(f"Error updating product: {str(e)}", "danger")
    finally:
        cursor.close()

    return redirect(url_for("admin_dashboard"))

#ending (last e thakbe)
if __name__ == "__main__":
    app.run(debug=True)







