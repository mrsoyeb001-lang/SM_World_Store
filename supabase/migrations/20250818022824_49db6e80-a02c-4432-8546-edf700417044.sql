-- Add affiliate system settings to site settings
UPDATE settings 
SET value = jsonb_set(
  COALESCE(value, '{}'),
  '{affiliate_system}',
  '{"enabled": true, "commission_rate": 0.05}'
)
WHERE key = 'site_settings';

-- Add social media settings
UPDATE settings 
SET value = jsonb_set(
  jsonb_set(
    jsonb_set(
      jsonb_set(
        COALESCE(value, '{}'),
        '{social}',
        '{}'
      ),
      '{social,facebook}',
      '""'
    ),
    '{social,instagram}',
    '""'
  ),
  '{social,twitter}',
  '""'
)
WHERE key = 'site_settings';

-- If no settings exist, create default settings
INSERT INTO settings (key, value, description)
VALUES (
  'site_settings',
  '{
    "payment_methods": {
      "bkash": {"enabled": true, "number": "", "instructions": "Send Money করুন এই নম্বরে এবং Transaction ID দিন।"},
      "nagad": {"enabled": true, "number": "", "instructions": "Send Money করুন এই নম্বরে এবং Transaction ID দিন।"},
      "rocket": {"enabled": true, "number": "", "instructions": "Send Money করুন এই নম্বরে এবং Transaction ID দিন।"},
      "cash_on_delivery": {"enabled": true, "fee": 0}
    },
    "shipping": {"default_rate": 60, "free_shipping_threshold": 1000},
    "contact": {"phone": "", "email": "", "address": "", "website": ""},
    "site": {"name": "Badhons World", "description": "আপনার পছন্দের পণ্যের দোকান", "footer_text": "© 2024 Badhons World. সকল অধিকার সংরক্ষিত।"},
    "social": {"facebook": "", "instagram": "", "twitter": "", "youtube": ""},
    "affiliate_system": {"enabled": true, "commission_rate": 0.05}
  }',
  'Site configuration settings including payment, shipping, contact, and affiliate system'
)
ON CONFLICT (key) DO NOTHING;