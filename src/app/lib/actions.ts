"use server"

import { executeQuery, initializeDatabase } from "@/lib/db"
import type { Product } from "./types"

// Initialize the database on first import
let initialized = false
async function ensureInitialized() {
  if (!initialized) {
    await initializeDatabase()
    initialized = true
  }
}

export async function searchProducts(query: string): Promise<Product[]> {
  await ensureInitialized()

  if (!query || query.length < 3) {
    return []
  }

  try {
    const searchTerm = `%${query}%`
    const results = (await executeQuery(
      `SELECT * FROM products 
       WHERE name LIKE ? OR description LIKE ? 
       LIMIT 10`,
      [searchTerm, searchTerm],
    )) as Product[]

    return results
  } catch (error) {
    console.error("Error searching products:", error)
    throw new Error("Failed to search products")
  }
}

