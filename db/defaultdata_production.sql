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

SELECT university_create('T.E.I. Thessalias');

SELECT department_create('ΤΜΗΜΑ ΜΗΧΑΝΙΚΩΝ ΠΛΗΡΟΦΟΡΙΚΗΣ ΤΕ', 1);
SELECT secretary_create('secry-cs', 'superpassword', 1);

SELECT department_create('ΤΜΗΜΑ ΛΟΓΙΣΤΙΚΗΣ ΚΑΙ ΧΡΗΜΑΤΟΟΙΚΟΝΟΜΙΚΗΣ', 1);
SELECT secretary_create('secry-account', 'superpassword', 2);

SELECT department_create('ΤΜΗΜΑ ΤΕΧΝΟΛΟΓΩΝ ΓΕΩΠΟΝΩΝ', 1);
SELECT secretary_create('secry-agric', 'superpassword', 3);

SELECT department_create('ΤΜΗΜΑ ΔΙΟΙΚΗΣΗΣ ΕΠΙΧΕΙΡΗΣΕΩΝ - ΔΙΟΙΚΗΣΗ ΕΠΙΧΕΙΡΗΣΕΩΝ', 1);
SELECT secretary_create('secry-business', 'superpassword', 4);

SELECT department_create('ΤΜΗΜΑ ΠΟΛΙΤΙΚΩΝ ΜΗΧΑΝΙΚΩΝ Τ.Ε. (ΤΡΙΚΑΛΑ)', 1);
SELECT secretary_create('secry-civil-trikala', 'superpassword', 5);

SELECT department_create('ΤΜΗΜΑ ΠΟΛΙΤΙΚΩΝ ΜΗΧΑΝΙΚΩΝ ΤΕ', 1);
SELECT secretary_create('secry-civil', 'superpassword', 6);

SELECT department_create('ΤΜΗΜΑ ΔΙΑΤΡΟΦΗΣ ΚΑΙ ΔΙΑΙΤΟΛΟΓΙΑΣ', 1);
SELECT secretary_create('secry-diet', 'superpassword', 7);

SELECT department_create('ΤΜΗΜΑ ΗΛΕΚΤΡΟΛΟΓΩΝ ΜΗΧΑΝΙΚΩΝ ΤΕ', 1);
SELECT secretary_create('secry-electr', 'superpassword', 8);

SELECT department_create('ΤΜΗΜΑ ΜΗΧΑΝΟΛΟΓΩΝ ΜΗΧΑΝΙΚΩΝ ΤΕ', 1);
SELECT secretary_create('secry-engin', 'superpassword', 9);

SELECT department_create('ΤΜΗΜΑ ΤΕΧΝΟΛΟΓΙΑΣ ΤΡΟΦΙΜΩΝ', 1);
SELECT secretary_create('secry-food', 'superpassword', 10);

SELECT department_create('ΤΜΗΜΑ ΔΑΣΟΠΟΝΙΑΣ & ΔΙΑΧΕΙΡΙΣΗΣ ΦΥΣΙΚΟΥ ΠΕΡΙΒΑΛΛΟΝΤΟΣ', 1);
SELECT secretary_create('secry-forest', 'superpassword', 11);

SELECT department_create('ΤΜΗΜΑ ΜΗΧΑΝΙΚΗΣ ΒΙΟΣΥΣΤΗΜΑΤΩΝ', 1);
SELECT secretary_create('secry-machine', 'superpassword', 12);

SELECT department_create('ΤΜΗΜΑ ΙΑΤΡΙΚΩΝ ΕΡΓΑΣΤΗΡΙΩΝ', 1);
SELECT secretary_create('secry-medlab', 'superpassword', 13);

SELECT department_create('ΤΜΗΜΑ ΝΟΣΗΛΕΥΤΙΚΗΣ', 1);
SELECT secretary_create('secry-nurse', 'superpassword', 14);

SELECT department_create('ΤΜΗΜΑ ΣΧΕΔΙΑΣΜΟΥ ΤΕΧΝΟΛΟΓΙΑΣ ΞΥΛΟΥ ΚΑΙ ΕΠΙΠΛΟΥ TE', 1);
SELECT secretary_create('secry-wood', 'superpassword', 15);

