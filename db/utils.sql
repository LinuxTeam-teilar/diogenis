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

