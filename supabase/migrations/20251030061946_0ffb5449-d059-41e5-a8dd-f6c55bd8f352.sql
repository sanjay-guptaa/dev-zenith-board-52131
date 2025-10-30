-- Fix search_path security warning for count_event_registrations function
DROP FUNCTION IF EXISTS public.count_event_registrations(INTEGER);

CREATE OR REPLACE FUNCTION public.count_event_registrations(event_id_param INTEGER)
RETURNS INTEGER 
LANGUAGE SQL 
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*)::INTEGER FROM public.event_registrations WHERE event_id = event_id_param;
$$;