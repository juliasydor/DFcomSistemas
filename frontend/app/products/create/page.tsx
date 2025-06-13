import { CreateProductForm } from "@/components/create-product-form"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function CreateProductPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/">
            <Button
              variant="outline"
              size="sm"
              className="border-purple-500/50 text-purple-200 hover:bg-purple-500/10 backdrop-blur-sm"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Catalog
            </Button>
          </Link>
        </div>

        <div className="max-w-2xl mx-auto">
          <CreateProductForm />
        </div>
      </div>
    </div>
  )
}
