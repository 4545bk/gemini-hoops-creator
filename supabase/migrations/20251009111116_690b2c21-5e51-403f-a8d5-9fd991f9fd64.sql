-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Create credits table
CREATE TABLE public.credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  balance BIGINT NOT NULL DEFAULT 30000, -- Start with 30000 (300 credits = 3 free generations)
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS on credits
ALTER TABLE public.credits ENABLE ROW LEVEL SECURITY;

-- Credits policies
CREATE POLICY "Users can view their own credits"
  ON public.credits FOR SELECT
  USING (auth.uid() = user_id);

-- Create generation categories enum
CREATE TYPE generation_category AS ENUM (
  'nba_player',
  'baseball_player',
  'footballer',
  'meme',
  'wedding',
  'boyfriend',
  'girlfriend',
  'sketch',
  'paint',
  'graduation',
  'famous_location',
  'with_celebrity',
  'custom'
);

-- Create generations table
CREATE TABLE public.generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  category generation_category NOT NULL,
  prompt TEXT NOT NULL,
  image_url TEXT,
  original_image_url TEXT,
  metadata JSONB DEFAULT '{}',
  cost BIGINT NOT NULL DEFAULT 10000, -- 100 credits per generation
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on generations
ALTER TABLE public.generations ENABLE ROW LEVEL SECURITY;

-- Generations policies
CREATE POLICY "Users can view their own generations"
  ON public.generations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own generations"
  ON public.generations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create payment status enum
CREATE TYPE payment_status AS ENUM ('pending', 'approved', 'declined');

-- Create payments table
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount NUMERIC(10, 2) NOT NULL,
  receipt_url TEXT NOT NULL,
  status payment_status NOT NULL DEFAULT 'pending',
  credit_amount BIGINT NOT NULL DEFAULT 1000000, -- 10000 credits for 25 birr
  telegram_message_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on payments
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Payments policies
CREATE POLICY "Users can view their own payments"
  ON public.payments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own payments"
  ON public.payments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create trigger function for profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert profile
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  
  -- Insert initial credits (30000 = 300 credits = 3 free generations)
  INSERT INTO public.credits (user_id, balance)
  VALUES (NEW.id, 30000);
  
  RETURN NEW;
END;
$$;

-- Create trigger for new users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Add updated_at triggers
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER credits_updated_at
  BEFORE UPDATE ON public.credits
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();