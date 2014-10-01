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

CREATE SEQUENCE seq_teacherIds;

CREATE TABLE teacher
(
    id                 int         primary key default nextval('seq_teacherIds'),
    name               text        not null,
    email              text        not null,
    password           text        not null,
    department         int         not null references department(id)
);

