type AdminProductFieldsProps = {
  productName?: string;
  stock?: number;
  price?: number;
  description?: string | null;
  imageUrl?: string | null;
  type?: string;
  showHiddenProductId?: boolean;
  productId?: string;
};

export function AdminProductFields({
  productName = '',
  stock = 1,
  price = 0,
  description = '',
  imageUrl = '',
  type = 'clothing',
  showHiddenProductId = false,
  productId = ''
}: AdminProductFieldsProps) {
  return (
    <>
      {showHiddenProductId ? <input type="hidden" name="productId" value={productId} /> : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-brown">Product name</label>
          <input name="productName" defaultValue={productName} placeholder="Silk Saree / Leather Bag / Gold Earrings" className="w-full rounded-2xl border border-line bg-white/80 px-4 py-3" />
        </div>
        <div>
          <label className="block text-sm font-medium text-brown">Stock</label>
          <input name="inStock" type="number" defaultValue={stock} className="w-full rounded-2xl border border-line bg-white/80 px-4 py-3" />
        </div>
        <div>
          <label className="block text-sm font-medium text-brown">Price</label>
          <input name="price" type="number" step="0.01" defaultValue={price} className="w-full rounded-2xl border border-line bg-white/80 px-4 py-3" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-brown">Description</label>
        <textarea name="description" defaultValue={description ?? ''} placeholder="Describe the item" className="min-h-28 w-full rounded-2xl border border-line bg-white/80 px-4 py-3" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-brown">Upload image</label>
          <input name="imageFile" type="file" accept="image/*" className="w-full rounded-2xl border border-dashed border-line bg-white/80 px-4 py-3" />
        </div>
        <div>
          <label className="block text-sm font-medium text-brown">Image URL fallback</label>
          <input name="imageUrl" defaultValue={imageUrl ?? ''} placeholder="/uploads/your-image.jpg" className="w-full rounded-2xl border border-line bg-white/80 px-4 py-3" />
        </div>
        <div>
          <label className="block text-sm font-medium text-brown">Type</label>
          <select name="type" defaultValue={type} className="w-full rounded-2xl border border-line bg-white/80 px-4 py-3">
            <option value="jewellery">jewellery</option>
            <option value="clothing">clothing</option>
            <option value="accessories">accessories</option>
            <option value="mufflers">mufflers</option>
            <option value="other">other</option>
          </select>
        </div>
      </div>
    </>
  );
}