"use client"

import { useState, useEffect } from "react"
import ProductList from "./product-list"
import { Loader2 } from "lucide-react"
import { Input } from "./ui/input"
import { Product } from "../lib/types"
import { useDebounce } from "../lib/hooks"
import { searchProducts } from "../lib/actions"

export default function ProductSearch() {
  const [query, setQuery] = useState("")
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const debouncedQuery = useDebounce(query, 300)

  useEffect(() => {
    async function fetchProducts() {
      if (debouncedQuery.length < 3) {
        setProducts([])
        return
      }

      setIsLoading(true)
      try {
        const results = await searchProducts(debouncedQuery)
        setProducts(results)
      } catch (error) {
        console.error("Error searching products:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [debouncedQuery])

  return (
    <div className="space-y-6">
      <div className="relative">
        <Input
          type="search"
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>

      {query.length > 0 && query.length < 3 && (
        <p className="text-sm text-muted-foreground text-center">Please enter at least 3 characters to search</p>
      )}

      <ProductList products={products} isLoading={isLoading} />
    </div>
  )
}

