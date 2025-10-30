-- Create event_registrations table to store user submissions
CREATE TABLE IF NOT EXISTS public.event_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id INTEGER NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  reason TEXT NOT NULL,
  accepted_rules BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(event_id, user_id)
);

-- Enable RLS
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;

-- Users can view their own registrations
CREATE POLICY "Users can view their own registrations"
ON public.event_registrations
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own registrations
CREATE POLICY "Users can insert their own registrations"
ON public.event_registrations
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create function to count registrations per event
CREATE OR REPLACE FUNCTION public.count_event_registrations(event_id_param INTEGER)
RETURNS INTEGER AS $$
  SELECT COUNT(*)::INTEGER FROM public.event_registrations WHERE event_id = event_id_param;
$$ LANGUAGE SQL STABLE;

-- Create index for better performance
CREATE INDEX idx_event_registrations_event_id ON public.event_registrations(event_id);
CREATE INDEX idx_event_registrations_user_id ON public.event_registrations(user_id);