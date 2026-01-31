-- Function to increment view count safely
CREATE OR REPLACE FUNCTION increment_view_count(tool_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE tools
  SET view_count = view_count + 1
  WHERE id = tool_id;
END;
$$;

-- Function to increment hunt count
CREATE OR REPLACE FUNCTION increment_hunt_count(tool_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE tools
  SET hunt_count = hunt_count + 1
  WHERE id = tool_id;
END;
$$;

-- Function to decrement hunt count
CREATE OR REPLACE FUNCTION decrement_hunt_count(tool_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE tools
  SET hunt_count = GREATEST(0, hunt_count - 1)
  WHERE id = tool_id;
END;
$$;
