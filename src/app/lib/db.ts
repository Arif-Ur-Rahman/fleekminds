import mysql from "mysql2/promise"

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || "localhost",
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "",
  database: process.env.MYSQL_DATABASE || "product_search",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

export async function executeQuery(query: string, params: any[] = []) {
  try {
    const [results] = await pool.execute(query, params)
    return results
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

// Initialize the database with sample data if needed
export async function initializeDatabase() {
  try {
    // Create products table if it doesn't exist
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL
      )
    `)

    // Check if we have products already
    const [existingProducts] = await pool.execute("SELECT COUNT(*) as count FROM products")
    const count = (existingProducts as any)[0].count

    // If no products, insert sample data
    if (count === 0) {
      const sampleProducts = [
        { name: "Smartphone X", description: "Latest smartphone with advanced features", price: 999.99 },
        { name: "Laptop Pro", description: "High-performance laptop for professionals", price: 1499.99 },
        { name: "Wireless Headphones", description: "Noise-cancelling wireless headphones", price: 199.99 },
        { name: "Smart Watch", description: "Fitness and health tracking smartwatch", price: 249.99 },
        { name: "Tablet Ultra", description: "10-inch tablet with high-resolution display", price: 399.99 },
        { name: "Bluetooth Speaker", description: "Portable speaker with rich sound", price: 79.99 },
        { name: "Digital Camera", description: "Professional-grade digital camera", price: 699.99 },
        { name: "Gaming Console", description: "Next-generation gaming console", price: 499.99 },
        { name: "Wireless Mouse", description: "Ergonomic wireless mouse", price: 39.99 },
        { name: "External Hard Drive", description: "2TB external hard drive", price: 89.99 },
        { name: "Smart Home Hub", description: "Control your smart home devices", price: 129.99 },
        { name: "Wireless Earbuds", description: "True wireless earbuds with charging case", price: 149.99 },
      ]

      for (const product of sampleProducts) {
        await executeQuery("INSERT INTO products (name, description, price) VALUES (?, ?, ?)", [
          product.name,
          product.description,
          product.price,
        ])
      }
    }

    console.log("Database initialized successfully")
  } catch (error) {
    console.error("Error initializing database:", error)
    throw error
  }
}

