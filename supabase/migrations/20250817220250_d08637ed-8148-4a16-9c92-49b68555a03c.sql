-- Insert sample products
INSERT INTO public.products (name, description, price, sale_price, category_id, images, stock_quantity, rating, review_count) 
SELECT 
  'Airpods Pro Cover Rabbit',
  'Airpods Pro এর জন্য কিউট র্যাবিট কভার। প্রিমিয়াম কোয়ালিটি সিলিকন দিয়ে তৈরি।',
  1399.00,
  999.00,
  (SELECT id FROM public.categories WHERE name = 'মোবাইল অ্যাক্সেসরিজ' LIMIT 1),
  ARRAY['/placeholder.svg'],
  50,
  4.8,
  124
WHERE NOT EXISTS (SELECT 1 FROM public.products WHERE name = 'Airpods Pro Cover Rabbit');

INSERT INTO public.products (name, description, price, sale_price, category_id, images, stock_quantity, rating, review_count) 
SELECT 
  'S09 mini smart watch',
  'স্মার্টওয়াচ S09 মিনি। ফিটনেস ট্র্যাকিং, কল রিসিভ এবং আরো অনেক ফিচার।',
  2500.00,
  1899.00,
  (SELECT id FROM public.categories WHERE name = 'ইলেকট্রনিক্স' LIMIT 1),
  ARRAY['/placeholder.svg'],
  30,
  4.5,
  87
WHERE NOT EXISTS (SELECT 1 FROM public.products WHERE name = 'S09 mini smart watch');

INSERT INTO public.products (name, description, price, sale_price, category_id, images, stock_quantity, rating, review_count) 
SELECT 
  'HOCO P9 PRO MAX Headphone',
  'হোকো P9 প্রো ম্যাক্স হেডফোন। পারফেক্ট সাউন্ড কোয়ালিটি এবং কমফোর্ট।',
  3500.00,
  2999.00,
  (SELECT id FROM public.categories WHERE name = 'ইলেকট্রনিক্স' LIMIT 1),
  ARRAY['/placeholder.svg'],
  25,
  4.7,
  156
WHERE NOT EXISTS (SELECT 1 FROM public.products WHERE name = 'HOCO P9 PRO MAX Headphone');

INSERT INTO public.products (name, description, price, sale_price, category_id, images, stock_quantity, rating, review_count) 
SELECT 
  'Transparent TWS Earbuds',
  'ট্রান্সপারেন্ট TWS ইয়ারবাড। ওয়্যারলেস এবং দেখতে খুবই আকর্ষণীয়।',
  1800.00,
  1299.00,
  (SELECT id FROM public.categories WHERE name = 'ইলেকট্রনিক্স' LIMIT 1),
  ARRAY['/placeholder.svg'],
  40,
  4.3,
  92
WHERE NOT EXISTS (SELECT 1 FROM public.products WHERE name = 'Transparent TWS Earbuds');

INSERT INTO public.products (name, description, price, sale_price, category_id, images, stock_quantity, rating, review_count) 
SELECT 
  'Wall Mount Hook Hanger',
  'দেয়ালে লাগানোর জন্য হ্যাঙ্গার। শক্তিশালী এবং দীর্ঘস্থায়ী।',
  399.00,
  299.00,
  (SELECT id FROM public.categories WHERE name = 'হোম অ্যাপ্লায়েন্স' LIMIT 1),
  ARRAY['/placeholder.svg'],
  100,
  4.4,
  203
WHERE NOT EXISTS (SELECT 1 FROM public.products WHERE name = 'Wall Mount Hook Hanger');

INSERT INTO public.products (name, description, price, sale_price, category_id, images, stock_quantity, rating, review_count) 
SELECT 
  'Car Vanish Handsfree',
  'গাড়ির জন্য ভ্যানিশ হ্যান্ডসফ্রি। ক্রিস্টাল ক্লিয়ার সাউন্ড কোয়ালিটি।',
  899.00,
  699.00,
  (SELECT id FROM public.categories WHERE name = 'মোবাইল অ্যাক্সেসরিজ' LIMIT 1),
  ARRAY['/placeholder.svg'],
  35,
  4.2,
  67
WHERE NOT EXISTS (SELECT 1 FROM public.products WHERE name = 'Car Vanish Handsfree');

INSERT INTO public.products (name, description, price, sale_price, category_id, images, stock_quantity, rating, review_count) 
SELECT 
  'Wireless Power Bank',
  'ওয়্যারলেস পাওয়ার ব্যাংক। ২০০০০ mAh ক্যাপাসিটি এবং ফাস্ট চার্জিং।',
  2200.00,
  1699.00,
  (SELECT id FROM public.categories WHERE name = 'ইলেকট্রনিক্স' LIMIT 1),
  ARRAY['/placeholder.svg'],
  45,
  4.6,
  134
WHERE NOT EXISTS (SELECT 1 FROM public.products WHERE name = 'Wireless Power Bank');

INSERT INTO public.products (name, description, price, sale_price, category_id, images, stock_quantity, rating, review_count) 
SELECT 
  'Fashionable T-Shirt',
  'ফ্যাশনেবল টি-শার্ট। ১০০% কটন এবং কমফোর্টেবল ফিট।',
  799.00,
  599.00,
  (SELECT id FROM public.categories WHERE name = 'ফ্যাশন' LIMIT 1),
  ARRAY['/placeholder.svg'],
  80,
  4.1,
  89
WHERE NOT EXISTS (SELECT 1 FROM public.products WHERE name = 'Fashionable T-Shirt');

-- Insert some promo codes
INSERT INTO public.promo_codes (code, discount_type, discount_value, min_order_amount, max_uses, is_active) 
VALUES 
  ('WELCOME10', 'percentage', 10.00, 500.00, 100, true),
  ('SAVE50', 'fixed', 50.00, 1000.00, 50, true),
  ('FIRSTORDER', 'percentage', 15.00, 800.00, 200, true)
ON CONFLICT (code) DO NOTHING;