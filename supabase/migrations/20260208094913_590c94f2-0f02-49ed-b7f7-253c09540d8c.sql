-- CORRECCIÓN DE SEGURIDAD: Funciones con search_path fijo

-- 1. Corregir generate_stream_key
CREATE OR REPLACE FUNCTION public.generate_stream_key()
RETURNS TEXT AS $$
BEGIN
  RETURN 'tamv_' || encode(gen_random_bytes(16), 'hex');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 2. Corregir set_stream_key
CREATE OR REPLACE FUNCTION public.set_stream_key()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.stream_key IS NULL THEN
    NEW.stream_key := public.generate_stream_key();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 3. Corregir register_bookpi_event
CREATE OR REPLACE FUNCTION public.register_bookpi_event(
  p_entity_type TEXT,
  p_entity_id UUID,
  p_action TEXT,
  p_actor_id UUID,
  p_data JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
  v_prev_hash TEXT;
  v_block_number INTEGER;
  v_data_hash TEXT;
  v_new_id UUID;
BEGIN
  SELECT data_hash, block_number INTO v_prev_hash, v_block_number
  FROM public.bookpi_ledger
  ORDER BY block_number DESC
  LIMIT 1;
  
  v_block_number := COALESCE(v_block_number, 0) + 1;
  v_data_hash := encode(sha256(convert_to(p_entity_id::TEXT || p_action || now()::TEXT, 'UTF8')), 'hex');
  
  INSERT INTO public.bookpi_ledger (
    entity_type, entity_id, action, actor_id, 
    data_hash, prev_hash, block_number
  ) VALUES (
    p_entity_type, p_entity_id::TEXT, p_action, p_actor_id,
    v_data_hash, v_prev_hash, v_block_number
  ) RETURNING id INTO v_new_id;
  
  RETURN v_new_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 4. Reemplazar políticas permisivas con autenticación adecuada
DROP POLICY IF EXISTS "Sistema inserta eventos" ON public.isabella_events;
CREATE POLICY "Sistema inserta eventos autenticado" ON public.isabella_events 
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL OR auth.role() = 'service_role');