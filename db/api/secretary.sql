CREATE OR REPLACE FUNCTION secretary_create(secretaryName text, secretaryPassword text, departmentId int) RETURNS VOID AS $$
DECLARE
BEGIN
    PERFORM name FROM secretary WHERE name = secretaryName;
    IF FOUND THEN
        RAISE EXCEPTION 'secretary already exists!';
    END IF;

    INSERT INTO secretary (name, password, department) VALUES (secretaryName, crypt(secretaryPassword, gen_salt('md5')), departmentId);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION secretary_auth(secretaryName text, passwordCandidate text) RETURNS BOOLEAN AS $$
DECLARE
    secretaryPassword text;
BEGIN
    SELECT INTO secretaryPassword password FROM secretary WHERE secretaryName = name;

    IF NOT FOUND THEN
        RETURN FALSE;
    END IF;

    IF secretaryPassword != crypt(passwordCandidate, secretaryPassword) THEN
        RETURN FALSE;
    END IF;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;
