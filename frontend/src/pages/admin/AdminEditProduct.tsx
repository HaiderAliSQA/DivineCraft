// frontend/src/pages/admin/AdminEditProduct.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useUpdateProductMutation } from '../../store/api/productsApi';
import { useUploadImagesMutation, useDeleteImageMutation } from '../../store/api/adminApi';
import { Category, CATEGORY_LABELS } from '../../types';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useAppSelector } from '../../store/store';
import { selectToken } from '../../store/authSlice';

const CATEGORIES = [
  'baby-collection',
  'home-decor',
  'kitchen-dining',
  'art-gifts',
  'furniture',
  'lighting',
  'storage-boxes',
  'religious-islamic-decor',
] as const;

const SUBCATEGORIES: Record<string, string[]> = {
  'baby-collection': ['Wooden Toys', 'Baby Decor', 'Baby Gift Sets', 'Nursery Accessories'],
  'home-decor': ['Decorative Vases', 'Decorative Jars', 'Wall Hangings', 'Table Décor', 'Decorative Plates', 'Decorative Bowls', 'Showpieces'],
  'kitchen-dining': ['Serving Trays', 'Fruit Baskets', 'Ash Trays', 'Coasters', 'Spice Boxes', 'Bowls', 'Kitchen Organizers'],
  'art-gifts': ['Gift Boxes', 'Jewelry Boxes', 'Handmade Gifts', 'Mini Musical Instruments', 'Decorative Crafts', 'Souvenirs'],
  'furniture': ['Side Tables', 'Nesting Tables', 'Coffee Tables', 'Stools', 'Plant Stands', 'Display Stands'],
  'lighting': ['Wooden Lamps', 'Table Lamps', 'Hanging Lanterns', 'Decorative Lanterns', 'Candle Holders'],
  'storage-boxes': ['Storage Boxes', 'Jewelry Boxes', 'Organizer Boxes', 'Wooden Chests', 'Keepsake Boxes'],
  'religious-islamic-decor': ['Islamic Wall Art', 'Arabic Calligraphy', 'Quran Stands (Rehal)', 'Islamic Decorative Pieces', 'Mosque Models', 'Ramadan & Eid Collection']
};

const productSchema = z.object({
  name: z.string().min(3, 'Name is required'),
  description: z.string().min(10, 'Description needs to be longer'),
  price: z.number().min(1, 'Price must be greater than 0'),
  compareAtPrice: z.number().optional().nullable(),
  category: z.string().min(1, 'Category is required'),
  subcategory: z.string().optional(),
  stock: z.number().min(0, 'Stock cannot be negative'),
  isVisible: z.boolean(),
  isFeatured: z.boolean(),
  isNewArrival: z.boolean(),
  isClearance: z.boolean().optional(),
  isDeal: z.boolean().optional(),
  isBundle: z.boolean().optional(),
  colors: z.string(),
  tags: z.string(),
  brand: z.string().optional(),
  compatibleModels: z.string(),
});

type ProductFormValues = z.infer<typeof productSchema>;

const AdminEditProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const token = useAppSelector(selectToken);
  
  const [updateProduct, { isLoading }] = useUpdateProductMutation();
  const [uploadImages, { isLoading: isUploading }] = useUploadImagesMutation();
  const [deleteImage] = useDeleteImageMutation();

  const [images, setImages] = useState<string[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
  });

  const watchedCategory = watch('category');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/products/admin/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const product = res.data.data;
        
        const matchedCategorySubcategories = SUBCATEGORIES[product.category] || [];
        const matchedSubcategory = (product.tags || []).find((tag: string) => 
          matchedCategorySubcategories.some((sub: string) => sub.toLowerCase() === tag.toLowerCase())
        ) || '';

        const productTags = product.tags || [];
        const isClearance = productTags.some((t: string) => t.toLowerCase() === 'clearance');
        const isDeal = productTags.some((t: string) => t.toLowerCase() === 'deal');
        const isBundle = productTags.some((t: string) => t.toLowerCase() === 'bundle');

        const filteredTags = productTags.filter((t: string) => {
          const lower = t.toLowerCase();
          return lower !== matchedSubcategory.toLowerCase() && 
                 lower !== 'clearance' && 
                 lower !== 'deal' && 
                 lower !== 'bundle';
        });

        reset({
          name: product.name,
          description: product.description,
          price: product.price,
          compareAtPrice: product.compareAtPrice || null,
          category: product.category as any,
          subcategory: matchedSubcategory,
          stock: product.stock,
          isVisible: product.isVisible,
          isFeatured: product.isFeatured,
          isNewArrival: product.isNewArrival,
          isClearance,
          isDeal,
          isBundle,
          colors: product.colors.join(', '),
          tags: filteredTags.join(', '),
          brand: product.brand || '',
          compatibleModels: (product.compatibleModels || []).join(', '),
        });
        
        setImages(product.images);
      } catch (err: any) {
        const msg = err?.response?.data?.message || err?.message || 'Failed to load product';
        console.error('Edit product fetch error:', err);
        toast.error(msg);
        navigate('/admin/products');
      } finally {
        setInitialLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, reset, token, navigate]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append('images', file);
    });

    try {
      const result = await uploadImages(formData).unwrap();
      if (result.success && result.data) {
        const newUrls = result.data.map((r: any) => r.url);
        setImages((prev) => [...prev, ...newUrls]);
        toast.success(`${newUrls.length} image(s) uploaded`);
      }
    } catch (err: any) {
      console.error('Upload error:', err);
      toast.error(err?.data?.message || 'Upload failed');
    }

    e.target.value = '';
  };

  const handleRemoveImage = async (url: string) => {
    // Remove from local state immediately so UI updates instantly
    setImages(prev => prev.filter(img => img !== url));

    // Extract full Cloudinary publicId including folder path
    // URL format: https://res.cloudinary.com/<cloud>/image/upload/v123/divinecraft/products/filename.webp
    // We need: divinecraft/products/filename (without extension)
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname; // e.g. /dssemvx6x/image/upload/v.../divinecraft/products/abc.webp
      // Split on '/upload/' to get everything after the version segment
      const afterUpload = pathname.split('/upload/')[1] ?? '';
      // Strip leading version segment (v123456789/)
      const withoutVersion = afterUpload.replace(/^v\d+\//, '');
      // Strip file extension
      const publicId = withoutVersion.replace(/\.[^/.]+$/, '');

      if (publicId) {
        await deleteImage(publicId).unwrap();
      }
    } catch {
      // Silently ignore Cloudinary delete errors — image is already removed from UI
    }
  };

  const onSubmit = async (data: ProductFormValues) => {
    if (images.length === 0) {
      toast.error('Please have at least one image');
      return;
    }

    const tagsArray = data.tags.split(',').map(t => t.trim()).filter(Boolean);
    if (data.subcategory) {
      if (!tagsArray.some(t => t.toLowerCase() === data.subcategory?.toLowerCase())) {
        tagsArray.push(data.subcategory);
      }
    }

    if (data.isClearance && !tagsArray.some(t => t.toLowerCase() === 'clearance')) {
      tagsArray.push('clearance');
    }
    if (data.isDeal && !tagsArray.some(t => t.toLowerCase() === 'deal')) {
      tagsArray.push('deal');
    }
    if (data.isBundle && !tagsArray.some(t => t.toLowerCase() === 'bundle')) {
      tagsArray.push('bundle');
    }

    const payload = {
      ...data,
      colors: data.colors.split(',').map(c => c.trim()).filter(Boolean),
      tags: tagsArray,
      compatibleModels: data.compatibleModels.split(',').map(m => m.trim()).filter(Boolean),
      images,
      sizes: [], // Fixed for accessories
      compareAtPrice: data.compareAtPrice || undefined,
    };

    delete (payload as any).subcategory;
    delete (payload as any).isClearance;
    delete (payload as any).isDeal;
    delete (payload as any).isBundle;

    try {
      await updateProduct({ id: id as string, data: payload as any }).unwrap();
      toast.success('Product updated successfully');
      navigate('/admin/products');
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to update product');
    }
  };

  if (initialLoading) {
    return <div className="p-12 text-center text-gray-400 font-dm animate-pulse">Loading product...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 font-dm">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-playfair text-white text-3xl font-semibold tracking-wide">Edit Product</h1>
          <p className="text-gray-300 mt-2 text-sm tracking-wider">Update product details</p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/admin/products')}
          className="text-gray-400 hover:text-fm-red transition-colors text-[13px] uppercase tracking-widest font-semibold"
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        {/* Core Info */}
        <div className="bg-navy-mid border border-navy-light p-8 shadow-sm">
          <h2 className="text-lg font-playfair text-white mb-6 border-b border-navy-light pb-3 font-semibold">Basic Details</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-[13px] font-semibold text-gray-300 mb-2 uppercase tracking-wide">Product Name</label>
              <input
                {...register('name')}
                type="text"
                className="w-full bg-navy-dark border border-navy-light text-white font-dm px-4 py-3 outline-none focus:border-electric"
              />
              {errors.name && <p className="text-fm-red text-xs mt-1.5">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-gray-300 mb-2 uppercase tracking-wide">Description</label>
              <textarea
                {...register('description')}
                rows={4}
                className="w-full bg-navy-dark border border-navy-light text-white font-dm px-4 py-3 outline-none focus:border-electric resize-y"
              />
              {errors.description && <p className="text-fm-red text-xs mt-1.5">{errors.description.message}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <label className="block text-[13px] font-semibold text-gray-300 mb-2 uppercase tracking-wide">Price (PKR)</label>
                <input
                  {...register('price', { valueAsNumber: true })}
                  type="number"
                  className="w-full bg-navy-dark border border-navy-light text-white font-dm px-4 py-3 outline-none focus:border-electric"
                />
                {errors.price && <p className="text-fm-red text-xs mt-1.5">{errors.price.message}</p>}
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-gray-300 mb-2 uppercase tracking-wide">Compare at Price</label>
                <input
                  {...register('compareAtPrice', { valueAsNumber: true })}
                  type="number"
                  className="w-full bg-navy-dark border border-navy-light text-white font-dm px-4 py-3 outline-none focus:border-electric"
                />
                {errors.compareAtPrice && <p className="text-fm-red text-xs mt-1.5">{errors.compareAtPrice.message}</p>}
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-gray-300 mb-2 uppercase tracking-wide">Stock Quantity</label>
                <input
                  {...register('stock', { valueAsNumber: true })}
                  type="number"
                  className="w-full bg-navy-dark border border-navy-light text-white font-dm px-4 py-3 outline-none focus:border-electric"
                />
                {errors.stock && <p className="text-fm-red text-xs mt-1.5">{errors.stock.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <label className="block text-[13px] font-semibold text-gray-300 mb-2 uppercase tracking-wide">Category *</label>
                <select
                  {...register('category')}
                  className="w-full bg-navy-dark border border-navy-light text-white font-dm px-4 py-3 outline-none focus:border-electric"
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{CATEGORY_LABELS[c as Category]}</option>)}
                </select>
                {errors.category && <p className="text-fm-red text-xs mt-1.5">{errors.category.message}</p>}
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-gray-300 mb-2 uppercase tracking-wide">Subcategory (Optional)</label>
                <select
                  {...register('subcategory')}
                  className="w-full bg-navy-dark border border-navy-light text-white font-dm px-4 py-3 outline-none focus:border-electric"
                >
                  <option value="">None</option>
                  {(SUBCATEGORIES[watchedCategory] || []).map(sub => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-gray-300 mb-2 uppercase tracking-wide">Brand</label>
                <input
                  {...register('brand')}
                  type="text"
                  className="w-full bg-navy-dark border border-navy-light text-white font-dm px-4 py-3 outline-none focus:border-electric"
                  placeholder="e.g. DiveneCraft, Local Artisan"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Media */}
        <div className="bg-navy-mid border border-navy-light p-8 shadow-sm">
          <h2 className="text-lg font-playfair text-white mb-6 border-b border-navy-light pb-3 font-semibold flex justify-between items-center">
            <span>Media (Images)</span>
            {isUploading && (
              <span className="text-sm text-[#FF5A36] font-bold animate-pulse uppercase tracking-widest flex items-center gap-1.5">
                ⚡ Uploading Images...
              </span>
            )}
          </h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-6 mb-4">
            {images.map((img, i) => (
              <div key={i} className="relative aspect-square rounded-sm border border-navy-light group overflow-hidden bg-white">
                <img src={img} alt="Product" className="w-full h-full object-contain p-2" />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(img)}
                  className="absolute top-1 right-1 bg-fm-red hover:bg-red-700 text-white rounded p-1.5 transition-colors shadow-md z-10"
                  title="Remove image"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            ))}

            {isUploading && (
              <div className="aspect-square flex flex-col items-center justify-center border border-dashed border-gray-500 rounded-sm bg-navy-dark animate-pulse">
                <div className="w-8 h-8 border-4 border-gray-600 border-t-[#FF5A36] rounded-full animate-spin mb-2"></div>
                <span className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Uploading...</span>
              </div>
            )}

             <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-navy-light rounded-sm hover:border-electric cursor-pointer transition-colors text-gray-400 hover:text-electric bg-navy-dark hover:bg-electric/10 relative">
              <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              <span className="text-[11px] uppercase tracking-widest font-bold">Upload</span>
              <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" disabled={isUploading} />
            </label>
          </div>
          {images.length === 0 && <p className="text-fm-red text-xs font-dm mt-2">At least one image is required.</p>}
        </div>

        {/* Attributes */}
        <div className="bg-navy-mid border border-navy-light p-8 shadow-sm">
          <h2 className="text-lg font-playfair text-white mb-6 border-b border-navy-light pb-3 font-semibold">Attributes & Compatibility</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-[13px] font-semibold text-gray-300 mb-2 uppercase tracking-wide">Colors (comma separated)</label>
              <input
                {...register('colors')}
                type="text"
                placeholder="black, silver, red"
                className="w-full bg-navy-dark border border-navy-light text-white font-dm px-4 py-3 outline-none focus:border-electric"
              />
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-gray-300 mb-2 uppercase tracking-wide">Compatibility (comma separated)</label>
              <input
                {...register('compatibleModels')}
                type="text"
                placeholder="e.g. Clay, Ceramic, Organic"
                className="w-full bg-navy-dark border border-navy-light text-white font-dm px-4 py-3 outline-none focus:border-electric"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-[13px] font-semibold text-gray-300 mb-2 uppercase tracking-wide">Tags (comma separated)</label>
            <input
              {...register('tags')}
              type="text"
              placeholder="e.g. handmade, organic, vintage"
              className="w-full bg-navy-dark border border-navy-light text-white font-dm px-4 py-3 outline-none focus:border-electric"
            />
          </div>

          <div className="flex flex-wrap gap-8 pt-6 border-t border-navy-light bg-navy-dark p-5 border">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" {...register('isVisible')} className="w-4 h-4 rounded-sm border-navy-light text-electric focus:ring-electric" />
              <span className="text-sm font-medium text-white group-hover:text-electric transition-colors">Visible to public</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" {...register('isFeatured')} className="w-4 h-4 rounded-sm border-navy-light text-electric focus:ring-electric" />
              <span className="text-sm font-medium text-white group-hover:text-electric transition-colors">Featured Product</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" {...register('isNewArrival')} className="w-4 h-4 rounded-sm border-navy-light text-electric focus:ring-electric" />
              <span className="text-sm font-medium text-white group-hover:text-electric transition-colors">New Arrival</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" {...register('isClearance')} className="w-4 h-4 rounded-sm border-navy-light text-electric focus:ring-electric" />
              <span className="text-sm font-medium text-white group-hover:text-electric transition-colors">Clearance Sale</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" {...register('isDeal')} className="w-4 h-4 rounded-sm border-navy-light text-electric focus:ring-electric" />
              <span className="text-sm font-medium text-white group-hover:text-electric transition-colors">Deal of the Week</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" {...register('isBundle')} className="w-4 h-4 rounded-sm border-navy-light text-electric focus:ring-electric" />
              <span className="text-sm font-medium text-white group-hover:text-electric transition-colors">Bundle Offer</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="px-8 py-3 bg-navy-mid border border-navy-light text-white font-dm text-[13px] uppercase tracking-widest font-medium hover:border-electric transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading || isUploading}
            className="w-48 bg-electric text-white font-dm text-[13px] tracking-widest uppercase font-medium hover:bg-electric-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm h-12"
          >
            {isLoading || isUploading ? 'Saving...' : 'Update Product'}
          </button>
        </div>

      </form>
    </div>
  );
};

export default AdminEditProduct;
