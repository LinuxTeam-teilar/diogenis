CREATE OR REPLACE FUNCTION university_create(name text) RETURNS VOID AS $$
DECLARE
BEGIN
    INSERT INTO university (name) VALUES (name);
END;
$$ LANGUAGE plpgsql;

