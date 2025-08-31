import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Edit, Trash2, Plus, Upload, X, Link, Star, Eye, BarChart3 } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  sale_price?: number;
  category_id: string;
  stock_quantity: number;
  is_active: boolean;
  images: string[];
  rating: number;
  review_count: number;
  variants?: { // Added the new variants property
    colors?: string[];
    sizes?: string[];
  };
  category?: {
    name: string;
  };
}

interface Category {
  id: string;
  name: string;
}

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [variants, setVariants] = useState<{ colors: string[], sizes: string[] }>({ colors: [], sizes: [] }); // Added new state for variants
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    sale_price: 0,
    category_id: '',
    stock_quantity: 0,
    is_active: true,
    rating: 0,
    review_count: 0
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, searchTerm, activeTab]);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(name)
      `); // Fixed select query

    if (error) {
      toast({
        title: "পণ্য লোড করতে ব্যর্থ",
        description: error.message,
        variant: "destructive"
      });
    } else {
      setProducts(data as Product[] || []); // Cast data to Product[]
    }
    setLoading(false);
  };

  const fetchCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    
    if (data) {
      setCategories(data);
    }
  };

  const filterAndSortProducts = () => {
    let filtered = products;

    // Tab-based filtering
    if (activeTab === 'active') {
      filtered = filtered.filter(product => product.is_active);
    } else if (activeTab === 'inactive') {
      filtered = filtered.filter(product => !product.is_active);
    } else if (activeTab === 'lowStock') {
      filtered = filtered.filter(product => (product.stock_quantity || 0) <= 10);
    }

    // Search filtering
    if (searchTerm) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (images.length + files.length > 5) {
      toast({
        title: "সর্বোচ্চ সীমা অতিক্রম",
        description: "সর্বোচ্চ ৫টি ইমেজ যোগ করা যাবে।",
        variant: "destructive"
      });
      return;
    }
    
    const newImages = [...images];
    
    for (const file of Array.from(files)) {
      if (newImages.length >= 5) break;
      
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `product-${Date.now()}-${Math.random()}.${fileExt}`;
        
        const { data, error } = await supabase.storage
          .from('products')
          .upload(fileName, file);

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
          .from('products')
          .getPublicUrl(fileName);

        newImages.push(publicUrl);
      } catch (error) {
        console.error('Error uploading image:', error);
        toast({
          title: "ছবি আপলোড ব্যর্থ",
          description: "ছবি আপলোড করতে সমস্যা হয়েছে।",
          variant: "destructive"
        });
      }
    }
    
    setImages(newImages);
    e.target.value = '';
  };

  const addImageUrl = () => {
    if (!imageUrl.trim()) {
      toast({
        title: "URL প্রয়োজন",
        description: "অনুগ্রহ করে ইমেজ URL দিন।",
        variant: "destructive"
      });
      return;
    }

    if (images.length >= 5) {
      toast({
        title: "সর্বোচ্চ সীমা অতিক্রম",
        description: "সর্বোচ্চ ৫টি ইমেজ যোগ করা যাবে।",
        variant: "destructive"
      });
      return;
    }

    try {
      new URL(imageUrl);
      setImages([...images, imageUrl]);
      setImageUrl('');
      
      toast({
        title: "ইমেজ যোগ হয়েছে",
        description: "ইমেজ URL সফলভাবে যোগ করা হয়েছে।"
      });
    } catch {
      toast({
        title: "অবৈধ URL",
        description: "অনুগ্রহ করে বৈধ ইমেজ URL দিন।",
        variant: "destructive"
      });
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = {
        ...formData,
        sale_price: formData.sale_price > 0 ? formData.sale_price : null,
        images: images,
        rating: formData.rating || 0,
        review_count: formData.review_count || 0,
        variants: variants, // Added variants to the product data
      };

      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id);

        if (error) throw error;
        
        toast({
          title: "পণ্য আপডেট হয়েছে",
          description: "পণ্যের তথ্য সফলভাবে আপডেট করা হয়েছে।"
        });
      } else {
        const { error } = await supabase
          .from('products')
          .insert(productData);

        if (error) throw error;
        
        toast({
          title: "নতুন পণ্য যোগ হয়েছে",
          description: "নতুন পণ্য সফলভাবে যোগ করা হয়েছে।"
        });
      }

      resetForm();
      fetchProducts();
      setIsDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "ত্রুটি",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price,
      sale_price: product.sale_price || 0,
      category_id: product.category_id || '',
      stock_quantity: product.stock_quantity || 0,
      is_active: product.is_active,
      rating: product.rating || 0,
      review_count: product.review_count || 0
    });
    setImages(product.images || []);
    setVariants(product.variants || { colors: [], sizes: [] }); // Set variants for editing
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('আপনি কি এই পণ্যটি মুছে ফেলতে চান?')) return;

    const { error } = await supabase
      .from('products')
      .update({ is_active: false })
      .eq('id', id);

    if (error) {
      toast({
        title: "ত্রুটি",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "পণ্য মুছে ফেলা হয়েছে",
        description: "পণ্যটি সফলভাবে নিষ্ক্রিয় করা হয়েছে।"
      });
      fetchProducts();
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      sale_price: 0,
      category_id: '',
      stock_quantity: 0,
      is_active: true,
      rating: 0,
      review_count: 0
    });
    setEditingProduct(null);
    setImages([]);
    setImageUrl('');
    setVariants({ colors: [], sizes: [] }); // Reset variants state
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(<Star key="half" className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />);
    }
    
    return stars;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">পণ্য ব্যবস্থাপনা</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              নতুন পণ্য যোগ করুন
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? 'পণ্য সম্পাদনা করুন' : 'নতুন পণ্য যোগ করুন'}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">পণ্যের নাম *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="category">ক্যাটাগরি *</Label>
                  <Select 
                    value={formData.category_id} 
                    onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="ক্যাটাগরি নির্বাচন করুন" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">বিবরণ</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="price">মূল্য *</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="sale_price">ছাড়ের মূল্য</Label>
                  <Input
                    id="sale_price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.sale_price}
                    onChange={(e) => setFormData({ ...formData, sale_price: Number(e.target.value) })}
                  />
                </div>

                <div>
                  <Label htmlFor="stock">স্টক পরিমাণ</Label>
                  <Input
                    id="stock"
                    type="number"
                    min="0"
                    value={formData.stock_quantity}
                    onChange={(e) => setFormData({ ...formData, stock_quantity: Number(e.target.value) })}
                  />
                </div>
              </div>

              {/* Variants Section - New addition */}
              <h3 className="text-xl font-semibold mt-8 mb-4">Product Variations</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="colors">Colors (e.g. red, blue, green)</Label>
                  <Input
                    id="colors"
                    value={variants.colors.join(', ')}
                    onChange={(e) => setVariants({ ...variants, colors: e.target.value.split(',').map(c => c.trim()) })}
                  />
                </div>
                <div>
                  <Label htmlFor="sizes">Sizes (e.g. S, M, L, XL)</Label>
                  <Input
                    id="sizes"
                    value={variants.sizes.join(', ')}
                    onChange={(e) => setVariants({ ...variants, sizes: e.target.value.split(',').map(s => s.trim()) })}
                  />
                </div>
              </div>

              {/* Image Management Section */}
              <div className="space-y-4">
                <Label>পণ্যের ছবি (সর্বোচ্চ ৫টি)</Label>
                
                {/* File Upload */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <div className="text-center">
                    <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <div className="flex items-center justify-center">
                      <Input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileUpload}
                        disabled={images.length >= 5}
                        className="hidden"
                        id="file-upload"
                      />
                      <label
                        htmlFor="file-upload"
                        className={`cursor-pointer bg-primary text-primary-foreground px-4 py-2 rounded ${
                          images.length >= 5 ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        ফাইল নির্বাচন করুন
                      </label>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      একাধিক ছবি নির্বাচন করুন (PNG, JPG, WEBP)
                    </p>
                  </div>
                </div>

                {/* Image URL Input */}
                <div className="flex gap-2">
                  <div className="flex-1">
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                        <Link className="h-4 w-4" />
                      </span>
                      <Input
                        placeholder="অথবা ইমেজ URL যোগ করুন..."
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        disabled={images.length >= 5}
                        className="rounded-l-none"
                      />
                    </div>
                  </div>
                  <Button
                    type="button"
                    onClick={addImageUrl}
                    disabled={!imageUrl.trim() || images.length >= 5}
                    variant="outline"
                  >
                    যোগ করুন
                  </Button>
                </div>

                {/* Image Preview */}
                {images.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium">পূর্বরূপ ({images.length}/৫)</Label>
                    <div className="grid grid-cols-5 gap-2 mt-2">
                      {images.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image}
                            alt={`পণ্যের ছবি ${index + 1}`}
                            className="w-full h-16 object-cover rounded border"
                            onError={(e) => {
                              e.currentTarget.src = '/placeholder.svg';
                            }}
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute -top-1 -right-1 h-5 w-5 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeImage(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {images.length >= 5 && (
                  <p className="text-sm text-amber-600 bg-amber-50 p-2 rounded">
                    সর্বোচ্চ সীমা পৌঁছেছে। আরও ছবি যোগ করতে প্রথমে কিছু ছবি মুছে ফেলুন।
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <input
                  id="is_active"
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4"
                />
                <Label htmlFor="is_active">সক্রিয় পণ্য</Label>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  বাতিল
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'সেভ করা হচ্ছে...' : editingProduct ? 'আপডেট করুন' : 'যোগ করুন'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="relative w-full md:w-1/3">
          <Input
            placeholder="পণ্য অনুসন্ধান..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
          <TabsList>
            <TabsTrigger value="all">সব পণ্য</TabsTrigger>
            <TabsTrigger value="active">সক্রিয়</TabsTrigger>
            <TabsTrigger value="inactive">নিষ্ক্রিয়</TabsTrigger>
            <TabsTrigger value="lowStock">কম স্টক</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-blue-800">মোট পণ্য</h3>
              <p className="text-2xl font-bold text-blue-900">{products.length}</p>
            </div>
            <BarChart3 className="h-8 w-8 text-blue-600" />
          </div>
        </Card>
        
        <Card className="p-4 bg-green-50 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-green-800">সক্রিয় পণ্য</h3>
              <p className="text-2xl font-bold text-green-900">
                {products.filter(p => p.is_active).length}
              </p>
            </div>
            <Eye className="h-8 w-8 text-green-600" />
          </div>
        </Card>
        
        <Card className="p-4 bg-amber-50 border-amber-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-amber-800">কম স্টক</h3>
              <p className="text-2xl font-bold text-amber-900">
                {products.filter(p => (p.stock_quantity || 0) <= 10).length}
              </p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
            </svg>
          </div>
        </Card>
        
        <Card className="p-4 bg-purple-50 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-purple-800">গড় রেটিং</h3>
              <p className="text-2xl font-bold text-purple-900">
                {products.length > 0 
                  ? (products.reduce((sum, p) => sum + (p.rating || 0), 0) / products.length).toFixed(1)
                  : '0.0'}
              </p>
            </div>
            <Star className="h-8 w-8 text-purple-600 fill-purple-600" />
          </div>
        </Card>
      </div>

      <div className="grid gap-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2">লোড হচ্ছে...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {searchTerm || activeTab !== 'all' ? 'কোন পণ্য পাওয়া যায়নি' : 'কোন পণ্য যোগ করা হয়নি'}
          </div>
        ) : (
          filteredProducts.map((product) => (
            <Card key={product.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg">{product.name}</h3>
                    <Badge variant={product.is_active ? "default" : "secondary"}>
                      {product.is_active ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                    </Badge>
                    {product.stock_quantity <= 10 && (
                      <Badge variant="destructive" className="bg-amber-500">
                        কম স্টক
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                    {product.description}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <span className="font-medium">মূল্য: ৳{product.price.toFixed(2)}</span>
                    {product.sale_price && product.sale_price > 0 && (
                      <span className="text-green-600 font-medium">ছাড়: ৳{product.sale_price.toFixed(2)}</span>
                    )}
                    <span className={product.stock_quantity <= 10 ? "text-amber-600 font-medium" : ""}>
                      স্টক: {product.stock_quantity}
                    </span>
                    <span>ক্যাটাগরি: {product.category?.name || 'N/A'}</span>
                    
                    {product.rating > 0 && (
                      <div className="flex items-center">
                        {renderStars(product.rating)}
                        <span className="ml-1 text-muted-foreground">
                          ({product.rating.toFixed(1)})
                        </span>
                      </div>
                    )}
                    
                    {product.review_count > 0 && (
                      <span className="text-muted-foreground">
                        {product.review_count}টি রিভিউ
                      </span>
                    )}
                  </div>
                  
                  {product.images && product.images.length > 0 && (
                    <div className="flex gap-2 mt-2">
                      {product.images.slice(0, 4).map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`${product.name} ${index + 1}`}
                          className="w-12 h-12 object-cover rounded border"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder.svg';
                          }}
                        />
                      ))}
                      {product.images.length > 4 && (
                        <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-xs border">
                          +{product.images.length - 4}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2 self-end md:self-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(product)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(product.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
