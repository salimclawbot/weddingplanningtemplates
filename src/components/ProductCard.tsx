import Link from "next/link";
import { Product } from "@/lib/products";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="flex h-full flex-col rounded-2xl border border-rose-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-pink-400 hover:shadow-lg"
    >
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-xl font-semibold text-slate-900">{product.name}</h3>
        <span className="shrink-0 rounded-full bg-pink-50 px-3 py-1 text-sm font-semibold text-pink-600">
          ${product.price}
        </span>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-600">{product.description}</p>
      <ul className="mt-5 space-y-2 text-sm text-slate-700">
        {product.features.map((feature) => (
          <li key={feature} className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-pink-500" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <span className="mt-6 inline-flex text-sm font-semibold text-pink-600">View product →</span>
    </Link>
  );
}
