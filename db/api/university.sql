CREATE OR REPLACE FUNCTION university_create(universityName text) RETURNS VOID AS $$
DECLARE
BEGIN
    INSERT INTO university (name) VALUES (universityName);
END;
$$ LANGUAGE plpgsql;

