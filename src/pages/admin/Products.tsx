import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  Smartphone, 
  Image as ImageIcon,
  AlertCircle
} from 'lucide-react';
import { adminService, categoryService, brandService } from '../../api/services';
import { Product, Category, Brand } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { handleImageError } from '../../utils/imageFallback';
import { useToast } from '../../context/ToastContext';

export const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>();
  const [selectedBrand, setSelectedBrand] = useState<number | undefined>();
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { showToast } = useToast();

  const emptyForm = {
    name: '',
    slug: '',
    sku: '',
    description: '',
    categoryId: 1,
    brandId: 1,
    price: 49999,
    originalPrice: 59999,
    stockQuantity: 25,
    screenSize: '6.7 inch Super Retina XDR AMOLED',
    resolution: '2796 x 1290 pixels',
    processor: 'Snapdragon 8 Gen 3',
    ram: '12GB',
    storage: '256GB',
    rearCamera: '50MP + 48MP + 12MP',
    frontCamera: '32MP',
    battery: '5000 mAh 100W Fast Charging',
    operatingSystem: 'Android 15',
    color: 'Titanium Black',
    is5G: true,
    featured: true,
    newArrival: true,
    active: true,
    images: [
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600'
    ]
  };

  const [formData, setFormData] = useState<any>(emptyForm);

  useEffect(() => {
    loadMetadata();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [page, search, selectedCategory, selectedBrand]);

  const loadMetadata = async () => {
    try {
      const [cats, brs] = await Promise.all([
        categoryService.getAll(),
        brandService.getAll()
      ]);
      setCategories(cats);
      setBrands(brs);
    } catch (err) {
      console.error(err);
    }
  };

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await adminService.getAllProducts({
        page,
        size: 10,
        search: search.trim() || undefined,
        categoryId: selectedCategory,
        brandId: selectedBrand
      });
      setProducts(res.content || []);
      setTotalPages(res.totalPages || 0);
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to fetch products', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setFormData({
      ...emptyForm,
      categoryId: categories[0]?.id || 1,
      brandId: brands[0]?.id || 1
    });
    setShowModal(true);
  };

  const handleOpenEdit = (prod: any) => {
    setEditingProduct(prod);
    const imgList = Array.isArray(prod.images)
      ? prod.images.map((img: any) => (typeof img === 'string' ? img : img?.imageUrl || ''))
      : [prod.mainImageUrl || 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600'];

    setFormData({
      name: prod.name,
      slug: prod.slug,
      sku: prod.sku,
      description: prod.description,
      categoryId: prod.categoryId,
      brandId: prod.brandId,
      price: prod.price,
      originalPrice: prod.originalPrice,
      stockQuantity: prod.stockQuantity,
      screenSize: prod.screenSize || prod.display || '',
      resolution: prod.resolution || '',
      processor: prod.processor || '',
      ram: prod.ram || '',
      storage: prod.storage || '',
      rearCamera: prod.rearCamera || prod.camera || '',
      frontCamera: prod.frontCamera || '',
      battery: prod.battery || '',
      operatingSystem: prod.operatingSystem || prod.os || '',
      color: prod.color || '',
      is5G: prod.is5g ?? prod.is5G ?? true,
      featured: prod.isFeatured ?? prod.featured ?? true,
      newArrival: prod.isLatest ?? prod.newArrival ?? true,
      active: prod.active ?? true,
      images: imgList.length > 0 ? imgList : ['https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600']
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await adminService.updateProduct(editingProduct.id, formData);
        showToast('Product updated successfully', 'success');
      } else {
        await adminService.createProduct(formData);
        showToast('Product added to catalog', 'success');
      }
      setShowModal(false);
      loadProducts();
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to save product', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await adminService.deleteProduct(id);
      showToast('Product deleted from store', 'info');
      loadProducts();
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to delete product', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Smartphone Catalog</h1>
          <p className="text-xs text-gray-400 mt-1">Manage mobile models, specifications, pricing & inventory</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2.5 rounded-xl text-xs transition shadow flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-gray-800/80 border border-gray-700/80 p-4 rounded-2xl flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search phones by name, SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
          />
        </div>

        <select
          value={selectedCategory || ''}
          onChange={(e) => setSelectedCategory(e.target.value ? Number(e.target.value) : undefined)}
          className="bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-blue-500"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <select
          value={selectedBrand || ''}
          onChange={(e) => setSelectedBrand(e.target.value ? Number(e.target.value) : undefined)}
          className="bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-blue-500"
        >
          <option value="">All Brands</option>
          {brands.map((b) => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-gray-800/80 border border-gray-700/80 rounded-2xl overflow-hidden shadow-lg">
        {loading ? (
          <div className="p-12 text-center text-gray-400 text-xs">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center text-gray-400 text-xs">No products matched the filter criteria.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-gray-400 bg-gray-900/50 border-b border-gray-700/80">
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">Brand & Category</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/50">
                {products.map((prod) => (
                  <tr key={prod.id} className="hover:bg-gray-750/30 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            typeof prod.images?.[0] === 'string'
                              ? prod.images[0]
                              : prod.images?.[0]?.imageUrl || prod.mainImageUrl || 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=200'
                          }
                          alt={prod.name}
                          className="w-10 h-10 object-contain bg-gray-900 p-1 rounded-lg border border-gray-700 flex-shrink-0"
                          onError={(e) => handleImageError(e, 'phone')}
                        />
                        <div>
                          <div className="font-bold text-white line-clamp-1">{prod.name}</div>
                          <span className="text-[10px] text-gray-400 font-mono">SKU: {prod.sku}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-gray-200 font-medium">{prod.brandName}</div>
                      <div className="text-[10px] text-gray-400">{prod.categoryName}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-emerald-400">{formatCurrency(prod.price)}</div>
                      {prod.originalPrice > prod.price && (
                        <span className="text-[10px] text-gray-500 line-through">{formatCurrency(prod.originalPrice)}</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        prod.stockQuantity > 5 
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' 
                          : prod.stockQuantity > 0 
                          ? 'bg-amber-950 text-amber-400 border border-amber-800'
                          : 'bg-rose-950 text-rose-400 border border-rose-800'
                      }`}>
                        {prod.stockQuantity} in stock
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {prod.active !== false ? (
                        <span className="text-emerald-400 flex items-center gap-1 font-semibold text-[11px]">
                          <Check className="w-3.5 h-3.5" /> Active
                        </span>
                      ) : (
                        <span className="text-gray-500 flex items-center gap-1 text-[11px]">
                          <X className="w-3.5 h-3.5" /> Inactive
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(prod)}
                          className="p-1.5 text-gray-400 hover:text-blue-400 rounded-lg hover:bg-gray-700 transition"
                          title="Edit product"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(prod.id)}
                          className="p-1.5 text-gray-400 hover:text-rose-400 rounded-lg hover:bg-gray-700 transition"
                          title="Delete product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 bg-gray-900/50 border-t border-gray-700/80 flex items-center justify-between text-xs text-gray-400">
            <span>Page {page + 1} of {totalPages}</span>
            <div className="flex gap-2">
              <button
                disabled={page === 0}
                onClick={() => setPage(page - 1)}
                className="px-3 py-1 rounded bg-gray-800 text-gray-300 disabled:opacity-40"
              >
                Prev
              </button>
              <button
                disabled={page >= totalPages - 1}
                onClick={() => setPage(page + 1)}
                className="px-3 py-1 rounded bg-gray-800 text-gray-300 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-gray-800 border border-gray-700 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-4 my-8 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-white">
              {editingProduct ? 'Edit Product Specifications' : 'Add New Smartphone to Catalog'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 font-semibold mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 font-semibold mb-1">SKU / Code *</label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 font-semibold mb-1">Category *</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: Number(e.target.value) })}
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 font-semibold mb-1">Brand *</label>
                  <select
                    value={formData.brandId}
                    onChange={(e) => setFormData({ ...formData, brandId: Number(e.target.value) })}
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    {brands.map((b) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-400 font-semibold mb-1">Price (₹ INR) *</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 font-semibold mb-1">Original MRP (₹)</label>
                  <input
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 font-semibold mb-1">Stock Units *</label>
                  <input
                    type="number"
                    required
                    value={formData.stockQuantity}
                    onChange={(e) => setFormData({ ...formData, stockQuantity: Number(e.target.value) })}
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Hardware Specifications */}
              <div className="border-t border-gray-700 pt-3 space-y-3">
                <span className="font-bold text-blue-400 uppercase tracking-wider block text-[11px]">
                  Hardware & Network Specs
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-gray-400 mb-1">RAM</label>
                    <input
                      type="text"
                      value={formData.ram}
                      onChange={(e) => setFormData({ ...formData, ram: e.target.value })}
                      placeholder="e.g. 12GB"
                      className="w-full bg-gray-900 border border-gray-700 rounded-xl px-2.5 py-1.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">Storage</label>
                    <input
                      type="text"
                      value={formData.storage}
                      onChange={(e) => setFormData({ ...formData, storage: e.target.value })}
                      placeholder="e.g. 256GB"
                      className="w-full bg-gray-900 border border-gray-700 rounded-xl px-2.5 py-1.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">Processor</label>
                    <input
                      type="text"
                      value={formData.processor}
                      onChange={(e) => setFormData({ ...formData, processor: e.target.value })}
                      placeholder="e.g. Snapdragon 8 Gen 3"
                      className="w-full bg-gray-900 border border-gray-700 rounded-xl px-2.5 py-1.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">Rear Camera</label>
                    <input
                      type="text"
                      value={formData.rearCamera}
                      onChange={(e) => setFormData({ ...formData, rearCamera: e.target.value })}
                      placeholder="e.g. 50MP + 48MP"
                      className="w-full bg-gray-900 border border-gray-700 rounded-xl px-2.5 py-1.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">Battery</label>
                    <input
                      type="text"
                      value={formData.battery}
                      onChange={(e) => setFormData({ ...formData, battery: e.target.value })}
                      placeholder="e.g. 5000 mAh"
                      className="w-full bg-gray-900 border border-gray-700 rounded-xl px-2.5 py-1.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">Operating System</label>
                    <input
                      type="text"
                      value={formData.operatingSystem}
                      onChange={(e) => setFormData({ ...formData, operatingSystem: e.target.value })}
                      placeholder="e.g. Android 15"
                      className="w-full bg-gray-900 border border-gray-700 rounded-xl px-2.5 py-1.5 text-white"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-gray-400 font-semibold mb-1">Primary Image URL</label>
                <input
                  type="text"
                  value={formData.images[0] || ''}
                  onChange={(e) => setFormData({ ...formData, images: [e.target.value] })}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-400 font-semibold mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex flex-wrap gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-gray-300">
                  <input
                    type="checkbox"
                    checked={formData.is5G}
                    onChange={(e) => setFormData({ ...formData, is5G: e.target.checked })}
                    className="rounded bg-gray-900 border-gray-700 text-blue-600"
                  />
                  5G Ready
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-gray-300">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="rounded bg-gray-900 border-gray-700 text-blue-600"
                  />
                  Featured on Homepage
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-gray-300">
                  <input
                    type="checkbox"
                    checked={formData.newArrival}
                    onChange={(e) => setFormData({ ...formData, newArrival: e.target.checked })}
                    className="rounded bg-gray-900 border-gray-700 text-blue-600"
                  />
                  New Arrival
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-700 text-gray-300 font-semibold rounded-xl hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
