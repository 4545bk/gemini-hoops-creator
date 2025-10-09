-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'images',
  'images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']::text[]
);

-- Storage policies for images bucket
CREATE POLICY "Anyone can view images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'images');

CREATE POLICY "Authenticated users can upload images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'images' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Users can update their own images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'images' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'images' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );