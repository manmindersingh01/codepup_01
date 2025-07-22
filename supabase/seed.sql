-- Create admin user in auth.users table
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '00000000-0000-0000-0000-000000000001',
  'authenticated',
  'authenticated',
  'admin@aiassistant.com',
  crypt('admin123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
) ON CONFLICT (id) DO NOTHING;

-- Create admin profile
INSERT INTO public.profiles (id, email, role, full_name, subscription_tier, company) VALUES 
  ('00000000-0000-0000-0000-000000000001', 'admin@aiassistant.com', 'admin', 'Admin User', 'enterprise', 'AI Assistant Tool')
ON CONFLICT (id) DO UPDATE SET role = 'admin';

-- Create demo users
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES 
  (
    '00000000-0000-0000-0000-000000000000',
    '11111111-1111-1111-1111-111111111111',
    'authenticated',
    'authenticated',
    'demo@example.com',
    crypt('demo123', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '22222222-2222-2222-2222-222222222222',
    'authenticated',
    'authenticated',
    'user@example.com',
    crypt('user123', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
  )
ON CONFLICT (id) DO NOTHING;

-- Create demo user profiles
INSERT INTO public.profiles (id, email, role, full_name, subscription_tier, company) VALUES 
  ('11111111-1111-1111-1111-111111111111', 'demo@example.com', 'user', 'Demo User', 'pro', 'Demo Corp'),
  ('22222222-2222-2222-2222-222222222222', 'user@example.com', 'user', 'Regular User', 'basic', 'User LLC')
ON CONFLICT (id) DO NOTHING;

-- Insert AI tool categories
INSERT INTO public.categories (id, name, description, slug, is_active) VALUES 
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Content Generation', 'AI tools for creating written content, blogs, and marketing materials', 'content-generation', true),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Data Analysis', 'Advanced analytics and data processing AI tools', 'data-analysis', true),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Image Generation', 'AI-powered image creation and editing tools', 'image-generation', true),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Code Assistant', 'Programming and development AI assistants', 'code-assistant', true),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Customer Support', 'AI chatbots and customer service automation', 'customer-support', true)
ON CONFLICT (id) DO NOTHING;

-- Insert AI tools/products
INSERT INTO public.products (id, name, description, category_id, price, monthly_price, yearly_price, features, is_active, subscription_required, trial_days) VALUES 
  (
    '12345678-1234-1234-1234-123456789abc',
    'ContentMaster Pro',
    'Advanced AI content generation tool for blogs, articles, and marketing copy with SEO optimization',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    29.99,
    29.99,
    299.99,
    '["SEO Optimization", "Multi-language Support", "Plagiarism Check", "Content Templates", "Brand Voice Training"]',
    true,
    true,
    14
  ),
  (
    '23456789-2345-2345-2345-23456789abcd',
    'DataInsight AI',
    'Powerful data analysis and visualization tool with machine learning capabilities',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    49.99,
    49.99,
    499.99,
    '["Automated Reports", "Predictive Analytics", "Data Visualization", "API Integration", "Real-time Processing"]',
    true,
    true,
    7
  ),
  (
    '3456789a-3456-3456-3456-3456789abcde',
    'VisualCraft Studio',
    'Professional AI image generation and editing suite for designers and marketers',
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    39.99,
    39.99,
    399.99,
    '["High-res Generation", "Style Transfer", "Batch Processing", "Commercial License", "API Access"]',
    true,
    true,
    10
  ),
  (
    '456789ab-4567-4567-4567-456789abcdef',
    'CodeGenius Assistant',
    'Intelligent coding companion with code generation, debugging, and optimization features',
    'dddddddd-dddd-dddd-dddd-dddddddddddd',
    34.99,
    34.99,
    349.99,
    '["Multi-language Support", "Code Review", "Documentation Generation", "Testing Automation", "IDE Integration"]',
    true,
    true,
    7
  ),
  (
    '56789abc-5678-5678-5678-56789abcdef1',
    'SupportBot Enterprise',
    'Advanced AI customer support chatbot with natural language processing and CRM integration',
    'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
    79.99,
    79.99,
    799.99,
    '["24/7 Availability", "Multi-channel Support", "CRM Integration", "Analytics Dashboard", "Custom Training"]',
    true,
    true,
    14
  ),
  (
    '6789abcd-6789-6789-6789-6789abcdef12',
    'WriterPro Lite',
    'Essential writing assistant for bloggers and content creators',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    19.99,
    19.99,
    199.99,
    '["Grammar Check", "Style Suggestions", "Content Ideas", "Readability Score", "Basic Templates"]',
    true,
    true,
    7
  )
ON CONFLICT (id) DO NOTHING;

-- Insert sample cart items
INSERT INTO public.cart_items (user_id, product_id, quantity, subscription_type) VALUES 
  ('11111111-1111-1111-1111-111111111111', '12345678-1234-1234-1234-123456789abc', 1, 'monthly'),
  ('11111111-1111-1111-1111-111111111111', '23456789-2345-2345-2345-23456789abcd', 1, 'yearly'),
  ('22222222-2222-2222-2222-222222222222', '3456789a-3456-3456-3456-3456789abcde', 1, 'monthly')
ON CONFLICT (user_id, product_id) DO NOTHING;

-- Insert sample orders
INSERT INTO public.orders (id, user_id, total_amount, status, payment_method) VALUES 
  ('abcdef12-abcd-abcd-abcd-abcdef123456', '11111111-1111-1111-1111-111111111111', 549.98, 'completed', 'credit_card'),
  ('bcdef123-bcde-bcde-bcde-bcdef1234567', '22222222-2222-2222-2222-222222222222', 39.99, 'completed', 'paypal')
ON CONFLICT (id) DO NOTHING;

-- Insert sample order items
INSERT INTO public.order_items (order_id, product_id, quantity, price, subscription_type) VALUES 
  ('abcdef12-abcd-abcd-abcd-abcdef123456', '12345678-1234-1234-1234-123456789abc', 1, 29.99, 'monthly'),
  ('abcdef12-abcd-abcd-abcd-abcdef123456', '23456789-2345-2345-2345-23456789abcd', 1, 499.99, 'yearly'),
  ('bcdef123-bcde-bcde-bcde-bcdef1234567', '3456789a-3456-3456-3456-3456789abcde', 1, 39.99, 'monthly')
ON CONFLICT DO NOTHING;

-- Insert sample subscriptions
INSERT INTO public.subscriptions (user_id, product_id, order_id, status, subscription_type, starts_at, expires_at, trial_ends_at) VALUES 
  (
    '11111111-1111-1111-1111-111111111111', 
    '12345678-1234-1234-1234-123456789abc', 
    'abcdef12-abcd-abcd-abcd-abcdef123456', 
    'active', 
    'monthly', 
    NOW(), 
    NOW() + INTERVAL '1 month', 
    NOW() + INTERVAL '14 days'
  ),
  (
    '11111111-1111-1111-1111-111111111111', 
    '23456789-2345-2345-2345-23456789abcd', 
    'abcdef12-abcd-abcd-abcd-abcdef123456', 
    'active', 
    'yearly', 
    NOW(), 
    NOW() + INTERVAL '1 year', 
    NOW() + INTERVAL '7 days'
  ),
  (
    '22222222-2222-2222-2222-222222222222', 
    '3456789a-3456-3456-3456-3456789abcde', 
    'bcdef123-bcde-bcde-bcde-bcdef1234567', 
    'trial', 
    'monthly', 
    NOW(), 
    NOW() + INTERVAL '1 month', 
    NOW() + INTERVAL '10 days'
  )
ON CONFLICT (user_id, product_id) DO NOTHING;