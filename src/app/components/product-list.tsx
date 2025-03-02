
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "./ui/skeleton"
import { Product } from "../lib/types"

interface ProductListProps {
  products: Product[]
  isLoading: boolean
}

export default function ProductList({ products, isLoading }: ProductListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-5 w-3/4" />
            </CardHeader>
            <CardContent className="pb-2">
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-5 w-20" />
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        {/* Initially show nothing, but show "No products found" if user has searched */}
        <p>{/* No products found */}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {products.map((product) => (
        <Card key={product.id}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{product.name}</CardTitle>
          </CardHeader>
          <CardContent className="pb-2">
            <p className="text-sm text-muted-foreground">{product.description}</p>
          </CardContent>
          <CardFooter>
            <p className="font-medium">${product.price.toFixed(2)}</p>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

