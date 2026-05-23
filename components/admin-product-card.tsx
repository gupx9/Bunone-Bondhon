import Image from 'next/image';
import { AdminModal } from '@/components/admin-modal';
import { AdminProductFields } from '@/components/admin-product-fields';
import { updateProduct } from '@/app/actions';

type AdminProductCardProps = {
  product: {
    id: bigint;
    productName: string;
    description: string | null;
    price: unknown;
    inStock: number;
    type: string;
    imageUrl: string | null;
  };
};

function money(value: unknown) {
  return `৳${Number(value).toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function AdminProductCard({ product }: AdminProductCardProps) {
  const imageSrc = product.imageUrl || '/uploads/placeholder-product.jpg';

  return (
    <article className="surface overflow-hidden">
      <div className="grid gap-0 lg:grid-cols-[14rem_minmax(0,1fr)]">
        <div className="relative min-h-56 bg-gradient-to-br from-gold/20 via-white to-maroon/10 lg:min-h-full">
          <Image
            src={imageSrc}
            alt={product.productName}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 14rem, 100vw"
            unoptimized
          />
        </div>

        <div className="flex h-full flex-col gap-4 p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="font-display text-2xl text-brown">{product.productName}</h2>
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-brown/70">
                {product.description ?? 'Handcrafted with care.'}
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-maroon/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-maroon">
              {product.type}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm font-semibold text-brown/75">
            <span className="rounded-full bg-gold/10 px-3 py-1 text-gold">{money(product.price)}</span>
            <span className="rounded-full bg-brown/5 px-3 py-1">Stock: {product.inStock}</span>
          </div>

          <div className="mt-auto flex justify-end">
            <AdminModal title={`Edit ${product.productName}`} triggerLabel="Edit product" panelClassName="surface w-full max-w-3xl max-h-[90vh] overflow-y-auto p-5 sm:p-6">
              <form action={updateProduct} className="space-y-4">
                <AdminProductFields
                  showHiddenProductId
                  productId={product.id.toString()}
                  productName={product.productName}
                  stock={product.inStock}
                  price={Number(product.price)}
                  description={product.description ?? ''}
                  imageUrl={product.imageUrl ?? ''}
                  type={product.type}
                />
                <div className="flex justify-end pt-2">
                  <button type="submit" className="button-primary">Save changes</button>
                </div>
              </form>
            </AdminModal>
          </div>
        </div>
      </div>
    </article>
  );
}