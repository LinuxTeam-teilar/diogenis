--Copyright 2014 Antonis Tsiapaliokas <antonis.tsiapaliokas@kde.org>
--Copyright 2014 Giorgos Tsiapaliokas <giorgos.tsiapaliokas@kde.org>

--This program is free software; you can redistribute it and/or
--modify it under the terms of the GNU General Public License as
--published by the Free Software Foundation; either version 2 of
--the License, or (at your option) any later version.

--This program is distributed in the hope that it will be useful,
--but WITHOUT ANY WARRANTY; without even the implied warranty of
--MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
--GNU General Public License for more details.

--You should have received a copy of the GNU General Public License
--along with this program.  If not, see <http://www.gnu.org/licenses/>.

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

