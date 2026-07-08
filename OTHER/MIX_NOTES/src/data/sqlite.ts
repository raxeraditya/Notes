import type { Topic } from '../types';

export const sqliteTopics: Topic[] = [
  {
    id: 'sql-create-table',
    title: 'CREATE TABLE & Data Types',
    category: 'DDL',
    difficulty: 'beginner',
    summary: 'Define a table with columns, types, primary keys, and constraints.',
    definition:
      'CREATE TABLE defines a new table: its columns, their data types, and optional constraints. SQLite uses dynamic typing (type affinity), so a column declared INTEGER can still hold text, but the five affinities (INTEGER, TEXT, REAL, BLOB, NUMERIC) guide storage and comparison. Constraints like PRIMARY KEY, NOT NULL, UNIQUE, DEFAULT, and CHECK enforce data integrity at insert time.',
    syntax: 'CREATE TABLE name (col type [constraints], ...);',
    parameters: [
      { name: 'PRIMARY KEY', type: 'constraint', description: 'Uniquely identifies each row; implies NOT NULL and a unique index. INTEGER PRIMARY KEY is an alias for rowid (auto-incrementing).' },
      { name: 'NOT NULL', type: 'constraint', description: 'The column must have a value on every insert.' },
      { name: 'UNIQUE', type: 'constraint', description: 'No two rows may share the same value in this column.' },
      { name: 'DEFAULT', type: 'constraint', description: 'A value used when the column is omitted from an insert.' },
      { name: 'CHECK', type: 'constraint', description: 'A boolean expression that must be true for every row.' },
    ],
    returns: 'A new table in the database.',
    keyPoints: [
      'SQLite has 5 storage classes: INTEGER, TEXT, REAL, BLOB, and NULL.',
      'INTEGER PRIMARY KEY auto-increments if you omit it on insert.',
      'Use AUTOINCREMENT to guarantee IDs never reuse a deleted row\'s ID.',
      'Foreign keys are accepted syntactically but need PRAGMA foreign_keys=ON to enforce.',
      'IF NOT EXISTS prevents an error if the table already exists.',
    ],
    examples: [
      {
        title: 'Create a users table',
        description: 'Define columns with types, a primary key, and constraints.',
        code: `CREATE TABLE IF NOT EXISTS users (
    id    INTEGER PRIMARY KEY AUTOINCREMENT,
    name  TEXT    NOT NULL,
    email TEXT    NOT NULL UNIQUE,
    age   INTEGER CHECK (age >= 0),
    role  TEXT    NOT NULL DEFAULT 'user',
    created_at TEXT DEFAULT (datetime('now'))
);`,
        language: 'sql',
      },
      {
        title: 'Create a table with a foreign key',
        description: 'Link an orders table to users.',
        code: `CREATE TABLE IF NOT EXISTS orders (
    id      INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    amount  REAL    NOT NULL CHECK (amount > 0),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- enable foreign key enforcement (per connection)
PRAGMA foreign_keys = ON;`,
        language: 'sql',
      },
    ],
    related: ['sql-insert', 'sql-select', 'sql-alter-drop'],
  },
  {
    id: 'sql-insert',
    title: 'INSERT — Adding Rows',
    category: 'DML',
    difficulty: 'beginner',
    summary: 'Insert new rows with INSERT INTO, using explicit columns or defaults.',
    definition:
      'INSERT INTO adds one or more rows to a table. Specify the target columns to set only some of them (the rest take their DEFAULT or NULL). The VALUES clause lists the row(s) to insert. INSERT OR REPLACE overwrites an existing row on a PRIMARY KEY/UNIQUE conflict; INSERT OR IGNORE skips it.',
    syntax: 'INSERT INTO table (col1, col2) VALUES (v1, v2), (v3, v4);',
    parameters: [
      { name: 'OR REPLACE', type: 'conflict clause', description: 'Delete the existing conflicting row, then insert the new one.' },
      { name: 'OR IGNORE', type: 'conflict clause', description: 'Skip the row if it violates a UNIQUE or PRIMARY KEY constraint.' },
    ],
    returns: 'The number of rows inserted (changes() in the C API).',
    keyPoints: [
      'List columns explicitly so future ALTER TABLEs do not break your inserts.',
      'Omit the PRIMARY KEY column to let INTEGER PRIMARY KEY auto-increment.',
      'Multiple VALUES tuples insert several rows in one statement.',
      'INSERT OR REPLACE is an upsert primitive but deletes-then-inserts (new rowid).',
    ],
    examples: [
      {
        title: 'Insert single and multiple rows',
        description: 'Add one row, then several at once.',
        code: `INSERT INTO users (name, email, age) VALUES ('Ada', 'ada@x.com', 36);

INSERT INTO users (name, email, age) VALUES
    ('Linus', 'linus@x.com', 54),
    ('Grace', 'grace@x.com', 85);`,
        language: 'sql',
      },
      {
        title: 'INSERT OR IGNORE for upserts',
        description: 'Skip a row that would duplicate a unique email.',
        code: `INSERT OR IGNORE INTO users (name, email, age)
VALUES ('Ada', 'ada@x.com', 36);  -- skipped if email already exists

-- INSERT OR REPLACE: overwrites the existing row
INSERT OR REPLACE INTO users (id, name, email, age)
VALUES (1, 'Ada L.', 'ada@x.com', 37);`,
        language: 'sql',
      },
    ],
    related: ['sql-create-table', 'sql-select', 'sql-update-delete'],
  },
  {
    id: 'sql-select',
    title: 'SELECT — Querying Data',
    category: 'DQL',
    difficulty: 'beginner',
    summary: 'Choose columns, filter rows, sort, and limit with SELECT.',
    definition:
      'SELECT retrieves rows from one or more tables. The column list picks which columns to return (or * for all). WHERE filters rows by a condition. ORDER BY sorts the result. LIMIT caps the number of rows returned. DISTINCT removes duplicate rows from the result set.',
    syntax: 'SELECT col1, col2 FROM table WHERE cond ORDER BY col LIMIT n;',
    returns: 'A result set (rows and columns) from the database.',
    keyPoints: [
      'Use * to select all columns — convenient for exploration, avoid in production.',
      'WHERE filters before grouping; HAVING filters after GROUP BY.',
      'ORDER BY defaults to ascending; add DESC for descending.',
      'LIMIT n OFFSET m paginates — skip m rows, return the next n.',
      'Column aliases with AS rename output columns: SELECT age AS years.',
    ],
    examples: [
      {
        title: 'Basic select with filter and sort',
        description: 'Find adult users ordered by age.',
        code: `SELECT id, name, email, age
FROM users
WHERE age >= 18
ORDER BY age DESC
LIMIT 10;`,
        language: 'sql',
      },
      {
        title: 'DISTINCT and aliases',
        description: 'List unique roles and rename a column.',
        code: `SELECT DISTINCT role FROM users;

SELECT name AS full_name, age AS years
FROM users
ORDER BY full_name;`,
        language: 'sql',
      },
      {
        title: 'Pagination with LIMIT and OFFSET',
        description: 'Get the second page of 10 results.',
        code: `SELECT id, name FROM users
ORDER BY id
LIMIT 10 OFFSET 10;`,
        language: 'sql',
      },
    ],
    related: ['sql-create-table', 'sql-where-operators', 'sql-joins'],
  },
  {
    id: 'sql-where-operators',
    title: 'WHERE Clauses & Operators',
    category: 'DQL',
    difficulty: 'beginner',
    summary: 'Filter with =, <, >, LIKE, IN, BETWEEN, IS NULL, AND, OR, NOT.',
    definition:
      'The WHERE clause filters rows using a boolean expression. SQLite supports comparison operators (=, !=, <, <=, >, >=), pattern matching (LIKE, GLOB), set membership (IN), range (BETWEEN), null checks (IS NULL / IS NOT NULL), and logical combinators (AND, OR, NOT).',
    syntax: 'WHERE expr operator value [AND|OR expr2 ...]',
    returns: 'A boolean that is true for rows to include.',
    keyPoints: [
      'LIKE is case-insensitive for ASCII; % matches any sequence, _ matches one char.',
      'GLOB is case-sensitive and uses Unix shell wildcards (* and ?).',
      'IN (v1, v2, ...) matches any of a list; also works with a subquery.',
      'BETWEEN x AND y is inclusive on both ends.',
      'NULL never equals anything — use IS NULL / IS NOT NULL, never = NULL.',
    ],
    examples: [
      {
        title: 'Comparison and logical operators',
        description: 'Combine several conditions.',
        code: `SELECT name, age FROM users
WHERE age >= 18 AND age <= 65
  AND role = 'user'
ORDER BY age;`,
        language: 'sql',
      },
      {
        title: 'LIKE, IN, BETWEEN, and NULL',
        description: 'Pattern matching, set membership, range, and null checks.',
        code: `-- names starting with 'A'
SELECT name FROM users WHERE name LIKE 'A%';

-- role is one of these
SELECT * FROM users WHERE role IN ('admin', 'editor');

-- age between 18 and 30 (inclusive)
SELECT * FROM users WHERE age BETWEEN 18 AND 30;

-- users with no age set
SELECT * FROM users WHERE age IS NULL;`,
        language: 'sql',
      },
    ],
    related: ['sql-select', 'sql-joins', 'sql-aggregate'],
  },
  {
    id: 'sql-update-delete',
    title: 'UPDATE & DELETE',
    category: 'DML',
    difficulty: 'beginner',
    summary: 'Modify existing rows with UPDATE and remove them with DELETE.',
    definition:
      'UPDATE changes column values in rows that match a WHERE clause. DELETE removes rows that match a WHERE clause. Without a WHERE clause, UPDATE changes every row and DELETE empties the table. Always include a WHERE clause unless you truly mean to affect all rows.',
    syntax: 'UPDATE table SET col = value WHERE cond;\nDELETE FROM table WHERE cond;',
    returns: 'The number of rows changed or deleted.',
    keyPoints: [
      'Always include a WHERE clause — omitting it affects every row.',
      'SET can update multiple columns: SET a = 1, b = 2.',
      'Use a subquery in WHERE to target rows based on another table.',
      'DELETE removes rows but keeps the table; DROP TABLE removes the table.',
      'Wrap in a transaction (BEGIN / COMMIT) so you can ROLLBACK a mistake.',
    ],
    examples: [
      {
        title: 'Update specific rows',
        description: 'Change the role of one user.',
        code: `UPDATE users
SET role = 'admin', age = 37
WHERE email = 'ada@x.com';`,
        language: 'sql',
      },
      {
        title: 'Delete with a condition',
        description: 'Remove inactive users safely.',
        code: `DELETE FROM users
WHERE role = 'inactive'
  AND created_at < '2023-01-01';

-- delete all rows (dangerous!)
-- DELETE FROM users;`,
        language: 'sql',
      },
    ],
    related: ['sql-insert', 'sql-create-table', 'sql-transactions'],
  },
  {
    id: 'sql-joins',
    title: 'JOINs (INNER, LEFT, RIGHT, CROSS)',
    category: 'Joins',
    difficulty: 'intermediate',
    summary: 'Combine rows from two tables on a matching column.',
    definition:
      'A JOIN combines columns from two tables into one result set. INNER JOIN keeps only matching rows from both tables. LEFT JOIN keeps every left-table row, filling missing right columns with NULL. RIGHT JOIN is the reverse. CROSS JOIN is the Cartesian product (every left row paired with every right row). SQLite supports INNER, LEFT, and CROSS (RIGHT and FULL via workarounds).',
    syntax: 'SELECT ... FROM a JOIN b ON a.id = b.a_id;',
    parameters: [
      { name: 'ON', type: 'condition', description: 'The match predicate — usually an equality between keys.' },
      { name: 'USING', type: 'clause', description: 'Shorthand when both tables share the join column name: USING (id).' },
    ],
    returns: 'A joined result set with columns from both tables.',
    keyPoints: [
      'INNER JOIN drops rows that have no match in the other table.',
      'LEFT JOIN keeps all left rows; unmatched right columns are NULL.',
      'CROSS JOIN pairs every left row with every right row (no ON needed).',
      'Alias tables with AS to keep queries readable: users AS u.',
      'Multiple joins chain: FROM a JOIN b ON ... JOIN c ON ....',
    ],
    examples: [
      {
        title: 'INNER JOIN users and orders',
        description: 'List each user with their orders.',
        code: `SELECT u.name, o.id AS order_id, o.amount
FROM users AS u
INNER JOIN orders AS o ON u.id = o.user_id
ORDER BY u.name, o.id;`,
        language: 'sql',
      },
      {
        title: 'LEFT JOIN to find users with no orders',
        description: 'Keep all users, even those without orders.',
        code: `SELECT u.name, COUNT(o.id) AS order_count
FROM users AS u
LEFT JOIN orders AS o ON u.id = o.user_id
GROUP BY u.id, u.name
HAVING order_count = 0;`,
        language: 'sql',
      },
      {
        title: 'CROSS JOIN for combinations',
        description: 'Pair every size with every colour.',
        code: `SELECT s.name AS size, c.name AS colour
FROM sizes AS s
CROSS JOIN colours AS c;`,
        language: 'sql',
      },
    ],
    related: ['sql-select', 'sql-where-operators', 'sql-aggregate'],
  },
  {
    id: 'sql-aggregate',
    title: 'Aggregate Functions & GROUP BY',
    category: 'DQL',
    difficulty: 'intermediate',
    summary: 'Summarise rows with COUNT, SUM, AVG, MIN, MAX grouped by a column.',
    definition:
      'Aggregate functions collapse multiple rows into one value: COUNT counts rows, SUM adds numbers, AVG averages, MIN/MAX find extremes. GROUP BY partitions rows into groups and applies the aggregate per group. HAVING filters groups after aggregation (WHERE filters rows before).',
    syntax: 'SELECT col, agg(expr) FROM table GROUP BY col HAVING cond;',
    returns: 'One row per group (or one row total without GROUP BY).',
    keyPoints: [
      'COUNT(*) counts all rows; COUNT(col) counts non-NULL values in col.',
      'Columns in SELECT must appear in GROUP BY or inside an aggregate.',
      'HAVING filters groups; WHERE filters raw rows — they are not interchangeable.',
      'GROUP BY can group by multiple columns for nested grouping.',
      'GROUP_CONCAT joins values into a string (handy for lists).',
    ],
    examples: [
      {
        title: 'Count and average per group',
        description: 'Summarise orders by user.',
        code: `SELECT user_id,
       COUNT(*)        AS order_count,
       SUM(amount)     AS total_spent,
       AVG(amount)     AS avg_order,
       MIN(amount)     AS smallest,
       MAX(amount)     AS largest
FROM orders
GROUP BY user_id
ORDER BY total_spent DESC;`,
        language: 'sql',
      },
      {
        title: 'HAVING to filter groups',
        description: 'Keep only groups with a high total.',
        code: `SELECT user_id, SUM(amount) AS total
FROM orders
GROUP BY user_id
HAVING SUM(amount) > 100
ORDER BY total DESC;`,
        language: 'sql',
      },
      {
        title: 'Group by multiple columns',
        description: 'Nested grouping by role and age band.',
        code: `SELECT role,
       CASE WHEN age < 30 THEN 'under 30'
            WHEN age < 60 THEN '30-59'
            ELSE '60+' END AS age_band,
       COUNT(*) AS cnt
FROM users
GROUP BY role, age_band
ORDER BY role, age_band;`,
        language: 'sql',
      },
    ],
    related: ['sql-select', 'sql-where-operators', 'sql-joins'],
  },
  {
    id: 'sql-subqueries',
    title: 'Subqueries & CTEs',
    category: 'Advanced Queries',
    difficulty: 'advanced',
    summary: 'Nest queries inside queries, or factor them with WITH (common table expressions).',
    definition:
      'A subquery is a SELECT nested inside another query — in the WHERE, FROM, or SELECT clause. A Common Table Expression (CTE) is a named subquery declared with WITH that you can reference like a table. CTEs make complex queries readable and support recursion for tree/graph traversal.',
    syntax: 'WITH cte AS (SELECT ...) SELECT ... FROM cte;',
    returns: 'A result set derived from the subquery/CTE.',
    keyPoints: [
      'A scalar subquery returns one value; use it in a WHERE comparison.',
      'An IN (subquery) filters by membership in a subquery result.',
      'CTEs are read-only and exist only for the duration of the statement.',
      'A recursive CTE (WITH RECURSIVE) can traverse trees and graphs.',
      'Correlated subqueries reference the outer query — re-run per row.',
    ],
    examples: [
      {
        title: 'Subquery in WHERE',
        description: 'Find users who placed an order over 50.',
        code: `SELECT name FROM users
WHERE id IN (
    SELECT user_id FROM orders WHERE amount > 50
);`,
        language: 'sql',
      },
      {
        title: 'CTE for readability',
        description: 'Factor a subquery into a named block.',
        code: `WITH big_orders AS (
    SELECT user_id, COUNT(*) AS cnt
    FROM orders
    WHERE amount > 100
    GROUP BY user_id
)
SELECT u.name, b.cnt
FROM users u
JOIN big_orders b ON u.id = b.user_id
ORDER BY b.cnt DESC;`,
        language: 'sql',
      },
      {
        title: 'Recursive CTE for a hierarchy',
        description: 'Walk an employee-manager tree.',
        code: `WITH RECURSIVE org AS (
    SELECT id, name, manager_id, 0 AS depth
    FROM employees
    WHERE manager_id IS NULL
    UNION ALL
    SELECT e.id, e.name, e.manager_id, o.depth + 1
    FROM employees e
    JOIN org o ON e.manager_id = o.id
)
SELECT depth, name FROM org ORDER BY depth, name;`,
        language: 'sql',
      },
    ],
    related: ['sql-joins', 'sql-aggregate', 'sql-select'],
  },
  {
    id: 'sql-functions',
    title: 'Built-in Functions',
    category: 'Functions',
    difficulty: 'intermediate',
    summary: 'String, numeric, date, and NULL-handling functions built into SQLite.',
    definition:
      'SQLite ships scalar functions for text (UPPER, LOWER, LENGTH, SUBSTR, TRIM, REPLACE), numbers (ROUND, ABS, RANDOM), dates (DATE, DATETIME, STRFTIME, JULIANDAY), and NULL handling (COALESCE, IFNULL, NULLIF). Aggregate functions (COUNT, SUM, AVG, MIN, MAX, GROUP_CONCAT) work over groups.',
    syntax: "SELECT UPPER(name), LENGTH(name) FROM users;",
    returns: 'A scalar value (or an aggregate per group).',
    keyPoints: [
      'COALESCE(a, b, c) returns the first non-NULL argument — great for defaults.',
      'IFNULL(a, b) is the two-argument version of COALESCE.',
      "STRFTIME('%Y-%m-%d', date_col) formats dates flexibly.",
      'REPLACE(text, old, new) substitutes substrings.',
      'CAST(expr AS type) converts between storage classes.',
    ],
    examples: [
      {
        title: 'String functions',
        description: 'Transform and inspect text columns.',
        code: `SELECT
    UPPER(name)       AS upper_name,
    LOWER(email)      AS lower_email,
    LENGTH(name)      AS name_len,
    SUBSTR(name, 1, 3) AS prefix,
    TRIM('  hi  ')    AS trimmed;`,
        language: 'sql',
      },
      {
        title: 'NULL handling and dates',
        description: 'Provide defaults and format timestamps.',
        code: `SELECT
    COALESCE(age, 0)                       AS age_or_zero,
    IFNULL(nickname, name)                 AS display_name,
    DATE('now')                            AS today,
    STRFTIME('%Y-%m', created_at)          AS created_month,
    CAST(amount AS INTEGER)                AS rounded;`,
        language: 'sql',
      },
    ],
    related: ['sql-select', 'sql-aggregate', 'sql-where-operators'],
  },
  {
    id: 'sql-alter-drop',
    title: 'ALTER TABLE, DROP & INDEX',
    category: 'DDL',
    difficulty: 'intermediate',
    summary: 'Rename tables, add columns, create indexes, and drop objects.',
    definition:
      'ALTER TABLE modifies an existing table. SQLite supports renaming a table, adding a column, and (since 3.35) dropping a column or renaming a column. CREATE INDEX builds a B-tree index on one or more columns to speed up WHERE and JOIN. DROP TABLE and DROP INDEX permanently remove objects.',
    syntax: 'ALTER TABLE name RENAME TO new; ALTER TABLE name ADD COLUMN col type;\nCREATE INDEX idx ON table(col);',
    returns: 'None — these are DDL statements (schema changes).',
    keyPoints: [
      'SQLite ALTER TABLE is limited — it cannot drop columns or change types in older versions.',
      'Adding a column with NOT NULL requires a DEFAULT value for existing rows.',
      'Indexes speed up reads but slow down writes and use disk space.',
      'CREATE UNIQUE INDEX enforces uniqueness on the indexed columns.',
      'DROP TABLE is permanent — there is no undo outside a backup or transaction.',
    ],
    examples: [
      {
        title: 'Rename and add a column',
        description: 'Modify an existing table.',
        code: `ALTER TABLE users RENAME TO members;
ALTER TABLE members ADD COLUMN phone TEXT;
ALTER TABLE members RENAME COLUMN phone TO phone_number;`,
        language: 'sql',
      },
      {
        title: 'Create and drop an index',
        description: 'Speed up a common query, then remove an index.',
        code: `CREATE INDEX idx_users_email ON users(email);
CREATE UNIQUE INDEX idx_orders_user_amount ON orders(user_id, amount);

DROP INDEX idx_users_email;`,
        language: 'sql',
      },
    ],
    related: ['sql-create-table', 'sql-select', 'sql-where-operators'],
  },
  {
    id: 'sql-transactions',
    title: 'Transactions (BEGIN, COMMIT, ROLLBACK)',
    category: 'Transactions',
    difficulty: 'intermediate',
    summary: 'Group statements into an all-or-nothing unit with BEGIN/COMMIT/ROLLBACK.',
    definition:
      'A transaction is a sequence of statements that execute atomically — all succeed or none do. BEGIN starts a transaction; COMMIT saves the changes permanently; ROLLBACK undoes them. SQLite auto-commits by default (each statement is its own transaction); wrapping multiple statements in BEGIN makes them atomic and faster (one journal sync).',
    syntax: 'BEGIN; ...statements... COMMIT;  -- or ROLLBACK;',
    returns: 'None — controls transaction state.',
    keyPoints: [
      'Wrapping many inserts in one transaction is dramatically faster.',
      'ROLLBACK undoes all changes since BEGIN — your safety net for mistakes.',
      'SQLite supports SERIALIZABLE isolation (the default and only level).',
      'SAVEPOINT creates a nested, named rollback point within a transaction.',
      'If a connection closes without COMMIT, the transaction is rolled back.',
    ],
    examples: [
      {
        title: 'Atomic transfer with rollback',
        description: 'Move money between accounts — both updates or neither.',
        code: `BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
-- if anything went wrong, run ROLLBACK instead
COMMIT;`,
        language: 'sql',
      },
      {
        title: 'Savepoints for partial rollback',
        description: 'Roll back to a named point, not the whole transaction.',
        code: `BEGIN;
INSERT INTO orders (user_id, amount) VALUES (1, 50);
SAVEPOINT after_order;
INSERT INTO log (msg) VALUES ('order placed');
-- undo just the log insert
ROLLBACK TO after_order;
COMMIT;`,
        language: 'sql',
      },
    ],
    related: ['sql-update-delete', 'sql-insert', 'sql-create-table'],
  },
  {
    id: 'py-sqlite3-connect',
    title: 'Python sqlite3 — Connecting & Cursors',
    category: 'Python sqlite3',
    difficulty: 'beginner',
    summary: 'Open an in-memory or file database and run SQL through a cursor.',
    definition:
      'Python\'s standard library ships the `sqlite3` module — a self-contained, serverless SQL engine. `sqlite3.connect(path)` opens (or creates) a database file; `:memory:` creates a fresh in-memory database that vanishes when the connection closes. A `cursor` object executes SQL and fetches results. Every connection should be closed (use a context manager or try/finally).',
    syntax: 'import sqlite3\nconn = sqlite3.connect("db.sqlite")\ncur = conn.cursor()\ncur.execute("SQL")\nconn.close()',
    returns: 'A Connection object; cursor() returns a Cursor object.',
    keyPoints: [
      'Use ":memory:" for a fast, throwaway database in tests and demos.',
      'execute() runs one statement; executemany() runs a batch with parameters.',
      'fetchone(), fetchall(), or iteration retrieves result rows.',
      'Commit with conn.commit() — sqlite3 does not auto-commit DML by default.',
      'Use conn as a context manager (with conn:) for automatic commit/rollback.',
    ],
    examples: [
      {
        title: 'Create an in-memory database',
        description: 'Open, create a table, insert, and query.',
        code: `import sqlite3

conn = sqlite3.connect(":memory:")
cur = conn.cursor()

cur.execute("""
    CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, age INTEGER)
""")
cur.execute("INSERT INTO users (name, age) VALUES ('Ada', 36)")
conn.commit()

cur.execute("SELECT * FROM users")
print(cur.fetchall())   # [(1, 'Ada', 36)]
conn.close()`,
        language: 'python',
      },
      {
        title: 'Iterate over rows',
        description: 'Loop through results one at a time.',
        code: `import sqlite3

conn = sqlite3.connect(":memory:")
cur = conn.cursor()
cur.execute("CREATE TABLE nums (n INTEGER)")
cur.executemany("INSERT INTO nums VALUES (?)", [(i,) for i in range(5)])
conn.commit()

cur.execute("SELECT n FROM nums ORDER BY n")
for row in cur:
    print(row[0], end=" ")   # 0 1 2 3 4
conn.close()`,
        language: 'python',
      },
    ],
    related: ['py-sqlite3-params', 'py-sqlite3-orm'],
  },
  {
    id: 'py-sqlite3-params',
    title: 'Parameterized Queries (Preventing SQL Injection)',
    category: 'Python sqlite3',
    difficulty: 'intermediate',
    summary: 'Always use ? placeholders — never build SQL with f-strings or +.',
    definition:
      'Parameterized queries separate SQL text from data. Use `?` placeholders in the SQL string and pass values as a tuple/list to execute(). The sqlite3 library escapes the values safely, preventing SQL injection attacks. Never use string formatting (f-strings, %, +) to insert user data into SQL — it is a critical security vulnerability.',
    syntax: 'cur.execute("SELECT * FROM users WHERE name = ? AND age > ?", (name, age))',
    returns: 'The cursor, after executing the parameterized statement.',
    keyPoints: [
      'Use ? for every value that comes from outside your code.',
      'executemany(sql, list_of_tuples) runs the same statement efficiently for each row.',
      "Never do f\"SELECT ... WHERE name = '{name}'\" — that is an injection hole.",
      'Placeholders handle quoting, escaping, and type conversion for you.',
      'You can also use named placeholders: :name with a dict.',
    ],
    examples: [
      {
        title: 'Safe parameterized query',
        description: 'Filter by user-supplied values without injection risk.',
        code: `import sqlite3

conn = sqlite3.connect(":memory:")
cur = conn.cursor()
cur.execute("CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, age INTEGER)")
cur.executemany("INSERT INTO users (name, age) VALUES (?, ?)",
                [("Ada", 36), ("Linus", 54), ("Grace", 85)])
conn.commit()

search_name = "Ada"
min_age = 30
cur.execute("SELECT * FROM users WHERE name = ? AND age > ?", (search_name, min_age))
print(cur.fetchall())   # [(1, 'Ada', 36)]
conn.close()`,
        language: 'python',
      },
      {
        title: 'Named placeholders and executemany',
        description: 'Use :name placeholders with a dict for clarity.',
        code: `import sqlite3

conn = sqlite3.connect(":memory:")
cur = conn.cursor()
cur.execute("CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, age INTEGER)")

rows = [("Ada", 36), ("Linus", 54), ("Grace", 85)]
cur.executemany("INSERT INTO users (name, age) VALUES (:n, :a)",
                [{"n": n, "a": a} for n, a in rows])
conn.commit()
print(cur.execute("SELECT COUNT(*) FROM users").fetchone())  # (3,)
conn.close()`,
        language: 'python',
      },
    ],
    related: ['py-sqlite3-connect', 'py-sqlite3-orm'],
  },
  {
    id: 'py-sqlite3-orm',
    title: 'Row Factory & Pandas Integration',
    category: 'Python sqlite3',
    difficulty: 'intermediate',
    summary: 'Get dict-like rows with Row factory, and load query results into pandas.',
    definition:
      'By default sqlite3 returns rows as plain tuples. Setting `conn.row_factory = sqlite3.Row` returns rows that support both index and column-name access, like a dict. You can also pass a connection directly to `pandas.read_sql_query()` to load a query result into a DataFrame for analysis.',
    syntax: 'conn.row_factory = sqlite3.Row\nimport pandas as pd\ndf = pd.read_sql_query("SELECT * FROM users", conn)',
    returns: 'sqlite3.Row objects or a pandas DataFrame.',
    keyPoints: [
      'sqlite3.Row supports row["col"] and row["col"] — much clearer than tuples.',
      'pandas.read_sql_query(sql, conn) returns a DataFrame directly.',
      'pandas.read_sql_table is not supported for SQLite — use read_sql_query.',
      'df.to_sql("table", conn) writes a DataFrame back to the database.',
      'Always close the connection after reading into pandas.',
    ],
    examples: [
      {
        title: 'Row factory for named access',
        description: 'Access columns by name instead of index.',
        code: `import sqlite3

conn = sqlite3.connect(":memory:")
conn.row_factory = sqlite3.Row
cur = conn.cursor()
cur.execute("CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, age INTEGER)")
cur.execute("INSERT INTO users (name, age) VALUES ('Ada', 36)")
conn.commit()

cur.execute("SELECT * FROM users")
for row in cur:
    print(row["name"], row["age"])   # Ada 36
conn.close()`,
        language: 'python',
      },
      {
        title: 'Load into pandas and write back',
        description: 'Move data between SQLite and a DataFrame.',
        code: `import sqlite3
import pandas as pd

conn = sqlite3.connect(":memory:")
pd.DataFrame({"name": ["A", "B"], "age": [30, 40]}).to_sql("people", conn, index=False)

df = pd.read_sql_query("SELECT * FROM people WHERE age > 35", conn)
print(df)        # one row: B 40
conn.close()`,
        language: 'python',
      },
    ],
    related: ['py-sqlite3-connect', 'py-sqlite3-params', 'pd-io-read-write'],
  },
  {
    id: 'sql-pragmas',
    title: 'PRAGMA — Database Configuration',
    category: 'Advanced',
    difficulty: 'advanced',
    summary: 'Inspect and tune SQLite with PRAGMA statements.',
    definition:
      'PRAGMA is SQLite\'s configuration and introspection mechanism. PRAGMAS set options (foreign key enforcement, journal mode, cache size) or query metadata (table_info, index_list, database_list). Most PRAGMAS are per-connection and reset when the connection closes.',
    syntax: "PRAGMA name = value;  -- or  PRAGMA table_info(table);",
    returns: 'A setting change or a result set of metadata.',
    keyPoints: [
      'PRAGMA foreign_keys = ON enables foreign key enforcement (off by default!).',
      'PRAGMA journal_mode = WAL enables Write-Ahead Logging for better concurrency.',
      'PRAGMA table_info(table) lists columns, types, and constraints.',
      'PRAGMA user_version sets/gets a schema version integer for migrations.',
      'PRAGMA foreign_key_check verifies referential integrity across the database.',
    ],
    examples: [
      {
        title: 'Enable foreign keys and WAL mode',
        description: 'The two most common PRAGMAS for production.',
        code: `PRAGMA foreign_keys = ON;
PRAGMA journal_mode = WAL;`,
        language: 'sql',
      },
      {
        title: 'Inspect a table\'s schema',
        description: 'List columns and their properties.',
        code: `PRAGMA table_info(users);
-- returns: cid, name, type, notnull, dflt_value, pk`,
        language: 'sql',
      },
    ],
    related: ['sql-create-table', 'sql-transactions', 'py-sqlite3-connect'],
  },
];
