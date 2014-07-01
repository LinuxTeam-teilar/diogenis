CREATE OR REPLACE FUNCTION department_create(name text, universityId int) RETURNS VOID AS $$
DECLARE
BEGIN
    INSERT INTO department (name, university) VALUES (name, universityId);
END;
$$ LANGUAGE plpgsql;

