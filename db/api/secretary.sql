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

CREATE OR REPLACE FUNCTION secretary_auth(secretaryName text, passwordCandidate text, OUT success boolean,
                                                                                      OUT departmentId int) AS $$
DECLARE
    secretaryRecord record;
    department int;
BEGIN
    success := TRUE;

    SELECT INTO secretaryRecord * FROM secretary WHERE secretaryName = name;

    IF NOT FOUND THEN
        success := FALSE;
        RETURN;
    END IF;

    IF secretaryRecord.password != crypt(passwordCandidate, secretaryRecord.password) THEN
        success := FALSE;
        RETURN;
    END IF;

    departmentId := secretaryRecord.department;
END;
$$ LANGUAGE plpgsql;
