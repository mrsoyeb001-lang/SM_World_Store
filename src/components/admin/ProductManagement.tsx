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
import { Checkbox } from '@/components/ui/checkbox';
import { Edit, Trash2, Plus, Upload, X, Link, Star, Eye, BarChart3, Tag, Palette, Ruler } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  sale_price?: number;
  category_ids: string[];
  categories?: Category[];
  stock_quantity: number;
  is_active: boolean;
  images: string[];
  rating: number;
  review_count: number;
  sizes: string[];
  colors: string[];
  tags: string[];
}

interface Category {
  id: string;
  name: string;
  description?: string;
}

interface Size {
  id: string;
  name: string;
}

interface Color {
  id: string;
  name: string;
  hex_code: string;
}

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [newTag, setNewTag] = useState('');
  const [newSize, setNewSize] = useState('');
  const [newColor, setNewColor] = useState({ name: '', hex_code: '#3b82f6' });
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [showSizeDialog, setShowSizeDialog] = useState(false);
  const [showColorDialog, setShowColorDialog] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    sale_price: 0,
    category_ids: [] as string[],
    stock_quantity: 0,
    is_active: true,
    rating: 0,
    review_count: 0,
    sizes: [] as string[],
    colors: [] as string[],
    tags: [] as string[],
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchSizes();
    fetchColors();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, activeTab]);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories:product_categories (category:categories (*))
      `)
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "পণ্য লোড করতে ব্যর্থ",
        description: error.message,
        variant: "destructive"
      });
    } else {
      // Transform the data to match our Product interface
      const transformedData = data?.map(item => ({
        ...item,
        categories: item.categories?.map(pc => pc.category),
        category_ids: item.categories?.map(pc => pc.category.id) || []
      })) || [];
      
      setProducts(transformedData);
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

  const fetchSizes = async () => {
    const { data } = await supabase
      .from('sizes')
      .select('*')
      .order('name');
    
    if (data) {
      setSizes(data);
    }
  };

  const fetchColors = async () => {
    const { data } = await supabase
      .from('colors')
      .select('*')
      .order('name');
    
    if (data) {
      setColors(data);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    // Tab-based filtering
    if (activeTab === 'active') {
      filtered = filtered.filter(product => product.is_active);
    } else if (activeTab === 'inactive') {
      filtered = filtered.filter(product => !product.is_active);
    } else if (activeTab === 'lowStock') {
      filtered = filtered.filter(product => product.stock_quantity <= 10);
    }

    // Search filtering
    if (searchTerm) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.categories?.some(cat => cat.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        product.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredProducts(filtered);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Check if adding new files would exceed the limit
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
    // Clear the input
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

    // Simple URL validation
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
      // First, create/update the product
      const productData = {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        sale_price: formData.sale_price > 0 ? formData.sale_price : null,
        stock_quantity: formData.stock_quantity,
        is_active: formData.is_active,
        rating: formData.rating || 0,
        review_count: formData.review_count || 0,
        images: images,
        sizes: formData.sizes,
        colors: formData.colors,
        tags: formData.tags
      };

      let productId;

      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id);

        if (error) throw error;
        productId = editingProduct.id;
        
        toast({
          title: "পণ্য আপডেট হয়েছে",
          description: "পণ্যের তথ্য সফলভাবে আপডেট করা হয়েছে।"
        });
      } else {
        const { data, error } = await supabase
          .from('products')
          .insert(productData)
          .select()
          .single();

        if (error) throw error;
        productId = data.id;
        
        toast({
          title: "নতুন পণ্য যোগ হয়েছে",
          description: "নতুন পণ্য সফলভাবে যোগ করা হয়েছে।"
        });
      }

      // Then, update product categories
      if (productId) {
        // First, remove existing categories
        await supabase
          .from('product_categories')
          .delete()
          .eq('product_id', productId);

        // Then, add new categories
        if (formData.category_ids.length > 0) {
          const categoryRelations = formData.category_ids.map(category_id => ({
            product_id: productId,
            category_id
          }));

          const { error } = await supabase
            .from('product_categories')
            .insert(categoryRelations);

          if (error) throw error;
        }
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
      category_ids: product.category_ids || [],
      stock_quantity: product.stock_quantity || 0,
      is_active: product.is_active,
      rating: product.rating || 0,
      review_count: product.review_count || 0,
      sizes: product.sizes || [],
      colors: product.colors || [],
      tags: product.tags || []
    });
    setImages(product.images || []);
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
      category_ids: [],
      stock_quantity: 0,
      is_active: true,
      rating: 0,
      review_count: 0,
      sizes: [],
      colors: [],
      tags: []
    });
    setEditingProduct(null);
    setImages([]);
    setImageUrl('');
    setNewTag('');
  };

  const addTag = () => {
    if (!newTag.trim()) return;
    
    if (formData.tags.includes(newTag)) {
      toast({
        title: "ট্যাগ ইতিমধ্যে আছে",
        description: "এই ট্যাগটি ইতিমধ্যে যোগ করা হয়েছে।",
        variant: "destructive"
      });
      return;
    }
    
    setFormData({
      ...formData,
      tags: [...formData.tags, newTag.trim()]
    });
    setNewTag('');
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const addNewCategory = async () => {
    if (!newCategory.name.trim()) {
      toast({
        title: "ক্যাটাগরির নাম প্রয়োজন",
        variant: "destructive"
      });
      return;
    }

    const { data, error } = await supabase
      .from('categories')
      .insert([{ name: newCategory.name, description: newCategory.description }])
      .select()
      .single();

    if (error) {
      toast({
        title: "ক্যাটাগরি তৈরি করতে সমস্যা",
        description: error.message,
        variant: "destructive"
      });
    } else {
      setCategories([...categories, data]);
      setNewCategory({ name: '', description: '' });
      setShowCategoryDialog(false);
      toast({
        title: "ক্যাটাগরি যোগ হয়েছে",
        description: "নতুন ক্যাটাগরি সফলভাবে তৈরি করা হয়েছে।"
      });
    }
  };

  const addNewSize = async () => {
    if (!newSize.trim()) {
      toast({
        title: "সাইজের নাম প্রয়োজন",
        variant: "destructive"
      });
      return;
    }

    const { data, error } = await supabase
      .from('sizes')
      .insert([{ name: newSize }])
      .select()
      .single();

    if (error) {
      toast({
        title: "সাইজ তৈরি করতে সমস্যা",
        description: error.message,
        variant: "destructive"
      });
    } else {
      setSizes([...sizes, data]);
      setNewSize('');
      setShowSizeDialog(false);
      toast({
        title: "সাইজ যোগ হয়েছে",
        description: "নতুন সাইজ সফলভাবে তৈরি করা হয়েছে।"
      });
    }
  };

  const addNewColor = async () => {
    if (!newColor.name.trim()) {
      toast({
        title: "কালারের নাম প্রয়োজন",
        variant: "destructive"
      });
      return;
    }

    const { data, error } = await supabase
      .from('colors')
      .insert([{ name: newColor.name, hex_code: newColor.hex_code }])
      .select()
      .single();

    if (error) {
      toast({
        title: "কালার তৈরি করতে সমস্যা",
        description: error.message,
        variant: "destructive"
      });
    } else {
      setColors([...colors, data]);
      setNewColor({ name: '', hex_code: '#3b82f6' });
      setShowColorDialog(false);
      toast({
        title: "কালার যোগ হয়েছে",
        description: "নতুন কালার সফলভাবে তৈরি করা হয়েছে।"
      });
    }
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
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
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
                  <div className="flex gap-2">
                    <Select 
                      value="" 
                      onValueChange={(value) => {
                        if (!formData.category_ids.includes(value)) {
                          setFormData({
                            ...formData,
                            category_ids: [...formData.category_ids, value]
                          });
                        }
                      }}
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
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowCategoryDialog(true)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {formData.category_ids.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.category_ids.map(catId => {
                        const category = categories.find(c => c.id === catId);
                        return category ? (
                          <Badge 
                            key={catId} 
                            variant="secondary"
                            className="flex items-center gap-1"
                          >
                            {category.name}
                            <X 
                              className="w-3 h-3 cursor-pointer" 
                              onClick={() => setFormData({
                                ...formData,
                                category_ids: formData.category_ids.filter(id => id !== catId)
                              })} 
                            />
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  )}
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="rating">রেটিং (0-5)</Label>
                  <Input
                    id="rating"
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                  />
                  {formData.rating > 0 && (
                    <div className="flex items-center mt-2">
                      {renderStars(formData.rating)}
                      <span className="ml-2 text-sm text-muted-foreground">
                        ({formData.rating.toFixed(1)})
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="review_count">রিভিউ সংখ্যা</Label>
                  <Input
                    id="review_count"
                    type="number"
                    min="0"
                    value={formData.review_count}
                    onChange={(e) => setFormData({ ...formData, review_count: Number(e.target.value) })}
                  />
                </div>
              </div>

              {/* Sizes Section */}
              <div className="space-y-2">
                <Label>সাইজ</Label>
                <div className="flex gap-2">
                  <div className="grid grid-cols-2 gap-2 flex-1">
                    {sizes.map(size => (
                      <div key={size.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`size-${size.id}`}
                          checked={formData.sizes.includes(size.name)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFormData({
                                ...formData,
                                sizes: [...formData.sizes, size.name]
                              });
                            } else {
                              setFormData({
                                ...formData,
                                sizes: formData.sizes.filter(s => s !== size.name)
                              });
                            }
                          }}
                        />
                        <label
                          htmlFor={`size-${size.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {size.name}
                        </label>
                      </div>
                    ))}
                  </div>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowSizeDialog(true)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Colors Section */}
              <div className="space-y-2">
                <Label>কালার</Label>
                <div className="flex gap-2">
                  <div className="grid grid-cols-2 gap-2 flex-1">
                    {colors.map(color => (
                      <div key={color.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`color-${color.id}`}
                          checked={formData.colors.includes(color.name)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFormData({
                                ...formData,
                                colors: [...formData.colors, color.name]
                              });
                            } else {
                              setFormData({
                                ...formData,
                                colors: formData.colors.filter(c => c !== color.name)
                              });
                            }
                          }}
                        />
                        <label
                          htmlFor={`color-${color.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
                        >
                          <div 
                            className="w-4 h-4 rounded-full border" 
                            style={{ backgroundColor: color.hex_code }}
                          />
                          {color.name}
                        </label>
                      </div>
                    ))}
                  </div>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowColorDialog(true)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Tags Section */}
              <div className="space-y-2">
                <Label htmlFor="tags">ট্যাগ</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="ট্যাগ যোগ করুন..."
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                  />
                  <Button type="button" onClick={addTag}>
                    যোগ করুন
                  </Button>
                </div>
                
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags.map((tag, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {tag}
                        <X 
                          className="w-3 h-3 cursor-pointer" 
                          onClick={() => removeTag(tag)} 
                        />
                      </Badge>
                    ))}
                  </div>
                )}
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

      {/* Category Creation Dialog */}
      <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>নতুন ক্যাটাগরি তৈরি করুন</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="categoryName">ক্যাটাগরির নাম</Label>
              <Input
                id="categoryName"
                value={newCategory.name}
                onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="categoryDescription">বিবরণ (ঐচ্ছিক)</Label>
              <Textarea
                id="categoryDescription"
                value={newCategory.description}
                onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                rows={3}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowCategoryDialog(false)}>
                বাতিল
              </Button>
              <Button onClick={addNewCategory}>
                তৈরি করুন
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Size Creation Dialog */}
      <Dialog open={showSizeDialog} onOpenChange={setShowSizeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>নতুন সাইজ তৈরি করুন</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="sizeName">সাইজের নাম</Label>
              <Input
                id="sizeName"
                value={newSize}
                onChange={(e) => setNewSize(e.target.value)}
                placeholder="যেমন: M, L, XL, 38, 40 ইত্যাদি"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowSizeDialog(false)}>
                বাতিল
              </Button>
              <Button onClick={addNewSize}>
                তৈরি করুন
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Color Creation Dialog */}
      <Dialog open={showColorDialog} onOpenChange={setShowColorDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>নতুন কালার তৈরি করুন</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="colorName">কালারের নাম</Label>
              <Input
                id="colorName"
                value={newColor.name}
                onChange={(e) => setNewColor({...newColor, name: e.target.value})}
                placeholder="যেমন: লাল, নীল, সবুজ"
              />
            </div>
            <div>
              <Label htmlFor="colorHex">কালারের কোড</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="colorHex"
                  type="color"
                  value={newColor.hex_code}
                  onChange={(e) => setNewColor({...newColor, hex_code: e.target.value})}
                  className="w-12 h-12 p-1"
                />
                <Input
                  value={newColor.hex_code}
                  onChange={(e) => setNewColor({...newColor, hex_code: e.target.value})}
                  className="flex-1"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowColorDialog(false)}>
                বাতিল
              </Button>
              <Button onClick={addNewColor}>
                তৈরি করুন
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Search and Filter Section */}
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
              d="M8-- Products table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  sale_price DECIMAL(10,2),
  stock_quantity INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  images TEXT[],
  rating DECIMAL(2,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  sizes TEXT[],
  colors TEXT[],
  tags TEXT[],
  created_at TIMESTAMP DEFAULT NOW()
);

-- Categories table
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Product-Categories relationship table
CREATE TABLE product_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(product_id, category_id)
);

-- Sizes table
CREATE TABLE sizes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Colors table
CREATE TABLE colors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  hex_code TEXT NOT NULL DEFAULT '#000000',
  created_at TIMESTAMP DEFAULT NOW()
);v
