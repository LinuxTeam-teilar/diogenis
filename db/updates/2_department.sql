CREATE OR REPLACE FUNCTION update2() RETURNS VOID AS $$
DECLARE
BEGIN
    PERFORM column_name FROM information_schema.columns
    WHERE table_name='department' AND column_name='islocked';

    IF NOT FOUND THEN
        RAISE NOTICE 'Modifing department table';
        ALTER TABLE department
        ADD COLUMN isLocked boolean NOT NULL DEFAULT false;
    END IF;

END;
$$ LANGUAGE plpgsql;

SELECT update2();

CREATE OR REPLACE FUNCTION isDepartmentLocked(departmentId int) RETURNS BOOLEAN AS $$
DECLARE
    lockedDepartment boolean;
BEGIN
    SELECT isLocked INTO lockedDepartment FROM department
    WHERE id = departmentId;

    RETURN lockedDepartment;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION changeDepartmentLock(departmentId int, newLockedStatus boolean) RETURNS BOOLEAN AS $$
DECLARE
BEGIN
    PERFORM * FROM department
    WHERE id = departmentId;

    IF NOT FOUND THEN
        RETURN FALSE;
    END IF;

    UPDATE department SET isLocked = newLockedStatus WHERE
    id = departmentId;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;
