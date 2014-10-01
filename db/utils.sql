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

CREATE OR REPLACE FUNCTION utils_create_json(table1 text, table2 text, table1Id int, table2Id int) RETURNS SETOF JSON AS $$
DECLARE
BEGIN
    RETURN QUERY EXECUTE '
    WITH root(' || quote_ident(table1) || ','|| quote_ident(table2) || ') AS (
        SELECT child.* FROM (
            SELECT row_to_json(' || quote_ident(table1) || '.*) AS ' || quote_ident(table1) ||
            ', row_to_json(' || quote_ident(table2) || '.*) AS ' || quote_ident(table2) ||
            ' FROM ' || quote_ident(table1) ||
            ' INNER JOIN ' || quote_ident(table2) || ' ON '
            || quote_ident(table1) || '.id = ' || table1Id || 'AND ' || quote_ident(table2) || '.id = ' || table2Id ||
        ') AS child
    ) SELECT row_to_json(root.*) AS json_data FROM root;
    ';
END;
$$ LANGUAGE plpgsql;

