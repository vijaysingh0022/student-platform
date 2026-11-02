// DBMS Question Bank (104 Questions)
export const DBMS_QUESTIONS = [
  {
    "subject": "DBMS",
    "topic": "ER Model",
    "subtopic": "Weak Entity Sets",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "In an ER diagram, how is a Weak Entity Set represented and how is it uniquely identified?",
    "options": [
      "Double rectangle; identified using a discriminator (partial key) plus the primary key of its identifying owner entity",
      "Dashed rectangle; identified by foreign key only",
      "Single rectangle with oval; identified by surrogate key",
      "Diamond with double border; identified by candidate key"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Weak entity sets lack a primary key of their own and require an identifying relationship (double diamond) with an owner entity set, using a partial key (discriminator).",
    "tags": [
      "DBMS",
      "ER Model",
      "Databases",
      "SQL",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, University Database Exams",
    "placementRelevance": "Oracle, Microsoft, Amazon, Salesforce OA"
  },
  {
    "subject": "DBMS",
    "topic": "ER Model",
    "subtopic": "Cardinality Ratios",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "In a 1:N relationship from Department to Employee, where should the foreign key be placed when converting to relational tables?",
    "options": [
      "In the Employee table referencing Department",
      "In the Department table referencing Employee",
      "In a separate junction table only",
      "In both tables mutually"
    ],
    "correctAnswerIndex": 0,
    "explanation": "The 'Many' side (Employee) holds the foreign key pointing to the primary key of the 'One' side (Department) to avoid null redundancy.",
    "tags": [
      "DBMS",
      "ER Model",
      "Databases",
      "SQL",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, University Database Exams",
    "placementRelevance": "Oracle, Microsoft, Amazon, Salesforce OA"
  },
  {
    "subject": "DBMS",
    "topic": "ER Model",
    "subtopic": "Specialization vs Generalization",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What is the top-down design process that designates sub-groupings within an entity set that have distinctive attributes?",
    "options": [
      "Specialization",
      "Generalization",
      "Aggregation",
      "Normalization"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Specialization is a top-down design approach identifying sub-entities with specialized attributes, whereas Generalization is a bottom-up synthesis.",
    "tags": [
      "DBMS",
      "ER Model",
      "Databases",
      "SQL",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, University Database Exams",
    "placementRelevance": "Oracle, Microsoft, Amazon, Salesforce OA"
  },
  {
    "subject": "DBMS",
    "topic": "ER Model",
    "subtopic": "Aggregation",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "In an ER diagram, when is Aggregation employed?",
    "options": [
      "When a relationship needs to be treated as a higher-level abstract entity to participate in another relationship",
      "When calculating SUM() or AVG() in SQL",
      "To merge two independent entity sets",
      "To eliminate weak entities"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Aggregation models relationships between relationships, wrapping an entity-relationship pair in a boundary box so another relationship can attach to it.",
    "tags": [
      "DBMS",
      "ER Model",
      "Databases",
      "SQL",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, University Database Exams",
    "placementRelevance": "Oracle, Microsoft, Amazon, Salesforce OA"
  },
  {
    "subject": "DBMS",
    "topic": "ER Model",
    "subtopic": "Total vs Partial Participation",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "How is Total Participation (every entity in the set must participate in at least one relationship instance) depicted in an ER diagram?",
    "options": [
      "Double line connecting entity set to the relationship",
      "Dashed line",
      "Bold font label",
      "Directed arrow"
    ],
    "correctAnswerIndex": 0,
    "explanation": "A double line denotes total participation (existence dependency); a single line denotes partial participation.",
    "tags": [
      "DBMS",
      "ER Model",
      "Databases",
      "SQL",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, University Database Exams",
    "placementRelevance": "Oracle, Microsoft, Amazon, Salesforce OA"
  },
  {
    "subject": "DBMS",
    "topic": "ER Model",
    "subtopic": "Multivalued Attributes",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "How is a multivalued attribute (such as an employee having multiple phone numbers) represented in standard Chen ER notation?",
    "options": [
      "Double oval",
      "Dashed oval",
      "Rectangle",
      "Hexagon"
    ],
    "correctAnswerIndex": 0,
    "explanation": "In Chen notation, a double oval indicates an attribute that can hold multiple values for a single entity instance.",
    "tags": [
      "DBMS",
      "ER Model",
      "Databases",
      "SQL",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, University Database Exams",
    "placementRelevance": "Oracle, Microsoft, Amazon, Salesforce OA"
  },
  {
    "subject": "DBMS",
    "topic": "ER Model",
    "subtopic": "Ternary Relationships",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "When mapping a Ternary Relationship between entities A, B, and C with cardinality (1:1:1) to relational tables, what forms the primary key of the relationship table?",
    "options": [
      "Any combination of two primary keys (e.g. {A_id, B_id}) forms a candidate key",
      "All three primary keys concatenated together",
      "Only A_id",
      "A surrogate auto-increment key is mandatory"
    ],
    "correctAnswerIndex": 0,
    "explanation": "In a 1:1:1 ternary relationship, any pair of foreign keys uniquely identifies the third entity, making each pair a candidate key.",
    "tags": [
      "DBMS",
      "ER Model",
      "Databases",
      "SQL",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, University Database Exams",
    "placementRelevance": "Oracle, Microsoft, Amazon, Salesforce OA"
  },
  {
    "subject": "DBMS",
    "topic": "ER Model",
    "subtopic": "Composite Attributes",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "How are composite attributes like 'Address' (street, city, zip) decomposed into relational database tables?",
    "options": [
      "Only the atomic leaf components (street, city, zip) are stored as separate table columns",
      "Stored as a single serialized string",
      "Stored in a separate table always",
      "Composite attributes are illegal in databases"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Relational databases enforce First Normal Form (1NF) requiring atomic column values; composite attributes flatten into their constituent simple attributes.",
    "tags": [
      "DBMS",
      "ER Model",
      "Databases",
      "SQL",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, University Database Exams",
    "placementRelevance": "Oracle, Microsoft, Amazon, Salesforce OA"
  },
  {
    "subject": "DBMS",
    "topic": "Relational Model",
    "subtopic": "Relational Algebra Operators",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "Which of the following relational algebra operators is NOT a fundamental (primitive) operator?",
    "options": [
      "Join (\u22c8)",
      "Selection (\u03c3)",
      "Projection (\u03c0)",
      "Cartesian Product (\u00d7)"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Natural Join is a derived operator defined as a composition of Cartesian Product (\u00d7), Selection (\u03c3), and Projection (\u03c0).",
    "tags": [
      "DBMS",
      "Relational Model",
      "Databases",
      "SQL",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, University Database Exams",
    "placementRelevance": "Oracle, Microsoft, Amazon, Salesforce OA"
  },
  {
    "subject": "DBMS",
    "topic": "Relational Model",
    "subtopic": "Tuple Relational Calculus",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "Tuple Relational Calculus (TRC) is classified as what type of query language?",
    "options": [
      "Declarative / Non-procedural (specifies WHAT data to retrieve without HOW)",
      "Procedural (specifies step-by-step evaluation)",
      "Imperative",
      "Object-oriented"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Relational Algebra is procedural; Relational Calculus (TRC and DRC) is declarative, describing the predicates the desired tuples must satisfy.",
    "tags": [
      "DBMS",
      "Relational Model",
      "Databases",
      "SQL",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, University Database Exams",
    "placementRelevance": "Oracle, Microsoft, Amazon, Salesforce OA"
  },
  {
    "subject": "DBMS",
    "topic": "Relational Model",
    "subtopic": "Integrity Constraints",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What does Entity Integrity constraint mandate in the relational model?",
    "options": [
      "No component of a Primary Key can be NULL",
      "Foreign keys must match primary keys",
      "Values must conform to column data types",
      "Check constraints cannot fail"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Entity integrity requires primary keys to be unique and non-null to distinguish every tuple uniquely in a relation.",
    "tags": [
      "DBMS",
      "Relational Model",
      "Databases",
      "SQL",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, University Database Exams",
    "placementRelevance": "Oracle, Microsoft, Amazon, Salesforce OA"
  },
  {
    "subject": "DBMS",
    "topic": "Relational Model",
    "subtopic": "Referential Integrity",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "If a child table has a Foreign Key referencing a parent table, which parent operation can violate Referential Integrity?",
    "options": [
      "DELETE a parent row or UPDATE its primary key",
      "INSERT a new parent row",
      "SELECT parent rows",
      "CREATE INDEX on parent table"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Deleting a parent row or altering its primary key can leave child foreign key references dangling (orphaned), violating referential integrity.",
    "tags": [
      "DBMS",
      "Relational Model",
      "Databases",
      "SQL",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, University Database Exams",
    "placementRelevance": "Oracle, Microsoft, Amazon, Salesforce OA"
  },
  {
    "subject": "DBMS",
    "topic": "Relational Model",
    "subtopic": "Relational Completeness",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "A database query language is termed 'Relationally Complete' if it has at least the expressive power of:",
    "options": [
      "Basic Relational Algebra or safe Tuple Relational Calculus (Codd's Theorem)",
      "Turing Machine",
      "C++ with SQL extensions",
      "First Order Logic with recursion"
    ],
    "correctAnswerIndex": 0,
    "explanation": "E.F. Codd proved the equivalence of Relational Algebra and Domain/Tuple Relational Calculus; a language matching this expressive power is relationally complete.",
    "tags": [
      "DBMS",
      "Relational Model",
      "Databases",
      "SQL",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, University Database Exams",
    "placementRelevance": "Oracle, Microsoft, Amazon, Salesforce OA"
  },
  {
    "subject": "DBMS",
    "topic": "Relational Model",
    "subtopic": "Division Operator",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "Which SQL query semantics corresponds directly to the Relational Algebra Division operator (R \u00f7 S)?",
    "options": [
      "Queries involving universal quantification: 'Find customers who bought ALL products in category X'",
      "Outer join queries",
      "Aggregate SUM() queries",
      "Intersection queries"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Relational division computes tuples in R that are associated with EVERY tuple in S ('for all' queries).",
    "tags": [
      "DBMS",
      "Relational Model",
      "Databases",
      "SQL",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, University Database Exams",
    "placementRelevance": "Oracle, Microsoft, Amazon, Salesforce OA"
  },
  {
    "subject": "DBMS",
    "topic": "Relational Model",
    "subtopic": "View Materialization",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What distinguishes a Materialized View from a standard Virtual View?",
    "options": [
      "Materialized views physically store the query results on disk and must be refreshed, while virtual views execute the query dynamically",
      "Virtual views use indexes",
      "Materialized views cannot be indexed",
      "Virtual views are stored on SSDs"
    ],
    "correctAnswerIndex": 0,
    "explanation": "A standard view is a saved query executed dynamically on invocation; a materialized view persists the result set on disk for fast read performance.",
    "tags": [
      "DBMS",
      "Relational Model",
      "Databases",
      "SQL",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, University Database Exams",
    "placementRelevance": "Oracle, Microsoft, Amazon, Salesforce OA"
  },
  {
    "subject": "DBMS",
    "topic": "Relational Model",
    "subtopic": "Degree vs Cardinality",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "In relational database terminology, what do 'Degree' and 'Cardinality' of a relation represent?",
    "options": [
      "Degree is the number of attributes (columns); Cardinality is the number of tuples (rows)",
      "Degree is rows; Cardinality is columns",
      "Both refer to total table bytes",
      "Degree is index count; Cardinality is table count"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Degree (arity) is column count; Cardinality is row count.",
    "tags": [
      "DBMS",
      "Relational Model",
      "Databases",
      "SQL",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, University Database Exams",
    "placementRelevance": "Oracle, Microsoft, Amazon, Salesforce OA"
  },
  {
    "subject": "DBMS",
    "topic": "Keys",
    "subtopic": "Superkey vs Candidate Key",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What is the formal relationship between a Superkey and a Candidate Key?",
    "options": [
      "A Candidate Key is a minimal Superkey (no proper subset is a superkey)",
      "A Superkey is a minimal candidate key",
      "They are identical concepts",
      "A superkey cannot contain the primary key"
    ],
    "correctAnswerIndex": 0,
    "explanation": "A superkey uniquely identifies tuples; a candidate key is irreducible, meaning removing any attribute destroys its uniqueness.",
    "tags": [
      "DBMS",
      "Keys",
      "Databases",
      "SQL",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, University Database Exams",
    "placementRelevance": "Oracle, Microsoft, Amazon, Salesforce OA"
  },
  {
    "subject": "DBMS",
    "topic": "Keys",
    "subtopic": "Primary Key Selection",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "From a set of multiple candidate keys in a relation, how many can be designated as the Primary Key?",
    "options": [
      "Exactly 1",
      "As many as needed",
      "Up to 5",
      "Zero if foreign keys exist"
    ],
    "correctAnswerIndex": 0,
    "explanation": "The database designer selects exactly one candidate key to be the primary key; the remaining candidate keys become alternate/secondary keys.",
    "tags": [
      "DBMS",
      "Keys",
      "Databases",
      "SQL",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, University Database Exams",
    "placementRelevance": "Oracle, Microsoft, Amazon, Salesforce OA"
  },
  {
    "subject": "DBMS",
    "topic": "Keys",
    "subtopic": "Surrogate Key",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is a Surrogate Key in database architecture?",
    "options": [
      "An artificially created sequential integer or UUID with no inherent business meaning, used purely as a unique identifier",
      "A primary key composed of multiple natural columns",
      "A foreign key pointing to itself",
      "An encrypted key"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Surrogate keys (like AUTO_INCREMENT IDs or UUIDs) decouple schema keys from changing business domain values.",
    "tags": [
      "DBMS",
      "Keys",
      "Databases",
      "SQL",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, University Database Exams",
    "placementRelevance": "Oracle, Microsoft, Amazon, Salesforce OA"
  },
  {
    "subject": "DBMS",
    "topic": "Keys",
    "subtopic": "Composite Primary Key",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "A composite primary key consists of:",
    "options": [
      "Two or more attributes that together uniquely identify a tuple",
      "A single key with multiple indexes",
      "A primary key and a foreign key in different tables",
      "An encrypted column"
    ],
    "correctAnswerIndex": 0,
    "explanation": "A composite key uses a combination of multiple columns where no single column alone is sufficient to guarantee uniqueness.",
    "tags": [
      "DBMS",
      "Keys",
      "Databases",
      "SQL",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, University Database Exams",
    "placementRelevance": "Oracle, Microsoft, Amazon, Salesforce OA"
  },
  {
    "subject": "DBMS",
    "topic": "Keys",
    "subtopic": "Foreign Key Nullability",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "Can a Foreign Key column contain NULL values in a relational database table?",
    "options": [
      "Yes, unless explicitly defined with NOT NULL constraint",
      "Never, all keys must be non-null",
      "Only if the referenced primary key is also null",
      "Only in MySQL, not PostgreSQL"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Foreign keys represent optional relationships by default; an employee might not yet be assigned to any department (Department_ID = NULL).",
    "tags": [
      "DBMS",
      "Keys",
      "Databases",
      "SQL",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, University Database Exams",
    "placementRelevance": "Oracle, Microsoft, Amazon, Salesforce OA"
  },
  {
    "subject": "DBMS",
    "topic": "Keys",
    "subtopic": "Prime vs Non-Prime Attributes",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "In relational normalization theory, what defines an attribute as 'Prime'?",
    "options": [
      "It is a member of at least one Candidate Key of the relation",
      "It is an integer column",
      "It cannot be null",
      "It is only part of the primary key"
    ],
    "correctAnswerIndex": 0,
    "explanation": "An attribute that appears in ANY candidate key is a prime attribute; attributes that appear in no candidate key are non-prime.",
    "tags": [
      "DBMS",
      "Keys",
      "Databases",
      "SQL",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, University Database Exams",
    "placementRelevance": "Oracle, Microsoft, Amazon, Salesforce OA"
  },
  {
    "subject": "DBMS",
    "topic": "Keys",
    "subtopic": "Natural Key vs Surrogate Trade-off",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is the main drawback of using a Natural Key (such as Social Security Number or Email) as the primary key?",
    "options": [
      "Business requirements or privacy laws may force natural values to change, requiring expensive cascading updates across all foreign keys",
      "Natural keys are slower to query than surrogate keys always",
      "Natural keys cannot be indexed",
      "They cause B+ tree corruption"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Primary keys should ideally be immutable; natural keys are subject to real-world mutations (email changes, regulatory shifts) causing cascading foreign key updates.",
    "tags": [
      "DBMS",
      "Keys",
      "Databases",
      "SQL",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, University Database Exams",
    "placementRelevance": "Oracle, Microsoft, Amazon, Salesforce OA"
  },
  {
    "subject": "DBMS",
    "topic": "Keys",
    "subtopic": "Unique Constraint vs Primary Key",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What is a key difference between a UNIQUE constraint and a PRIMARY KEY in standard SQL databases?",
    "options": [
      "A UNIQUE column can accept NULL values (usually one or more depending on RDBMS), whereas PRIMARY KEY strictly forbids NULLs",
      "A table can have multiple PRIMARY KEYs",
      "UNIQUE constraints do not create an underlying index",
      "PRIMARY KEY cannot be referenced by foreign keys"
    ],
    "correctAnswerIndex": 0,
    "explanation": "A table allows only one PRIMARY KEY (which enforces NOT NULL and UNIQUE), but can have multiple UNIQUE constraints (allowing NULLs).",
    "tags": [
      "DBMS",
      "Keys",
      "Databases",
      "SQL",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, University Database Exams",
    "placementRelevance": "Oracle, Microsoft, Amazon, Salesforce OA"
  },
  {
    "subject": "DBMS",
    "topic": "Functional Dependencies",
    "subtopic": "Armstrong's Axioms",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "Which of the following is NOT one of Armstrong's primary axioms for functional dependencies?",
    "options": [
      "Commutativity: If X \u2192 Y, then Y \u2192 X",
      "Reflexivity: If Y \u2286 X, then X \u2192 Y",
      "Augmentation: If X \u2192 Y, then XZ \u2192 YZ",
      "Transitivity: If X \u2192 Y and Y \u2192 Z, then X \u2192 Z"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Functional dependencies are directional (not symmetric); X \u2192 Y does not imply Y \u2192 X.",
    "tags": [
      "DBMS",
      "Functional Dependencies",
      "Databases",
      "SQL",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, University Database Exams",
    "placementRelevance": "Oracle, Microsoft, Amazon, Salesforce OA"
  },
  {
    "subject": "DBMS",
    "topic": "Functional Dependencies",
    "subtopic": "Attribute Closure",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What does the Attribute Closure X+ under a set of functional dependencies F represent?",
    "options": [
      "The set of all attributes functionally determined by X under F",
      "The candidate keys of relation X",
      "The primary key of X",
      "The transitive dependencies only"
    ],
    "correctAnswerIndex": 0,
    "explanation": "X+ is computed by starting with X and iteratively adding Y whenever W \u2192 Y and W is already a subset of the closure.",
    "tags": [
      "DBMS",
      "Functional Dependencies",
      "Databases",
      "SQL",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, University Database Exams",
    "placementRelevance": "Oracle, Microsoft, Amazon, Salesforce OA"
  },
  {
    "subject": "DBMS",
    "topic": "Functional Dependencies",
    "subtopic": "Trivial Functional Dependency",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "A functional dependency X \u2192 Y is called Trivial if and only if:",
    "options": [
      "Y is a subset of X (Y \u2286 X)",
      "X and Y are disjoint",
      "X is a candidate key",
      "Y is a single attribute"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Trivial dependencies like {A, B} \u2192 A always hold unconditionally by the reflexivity rule.",
    "tags": [
      "DBMS",
      "Functional Dependencies",
      "Databases",
      "SQL",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, University Database Exams",
    "placementRelevance": "Oracle, Microsoft, Amazon, Salesforce OA"
  },
  {
    "subject": "DBMS",
    "topic": "Functional Dependencies",
    "subtopic": "Canonical Cover",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "What are the two primary requirements of a Minimal (Canonical) Cover Fc of a set of functional dependencies F?",
    "options": [
      "Every dependency has a singleton right-hand side, no extraneous attributes exist on left or right, and no redundant FDs exist",
      "All attributes are prime",
      "F must be in BCNF",
      "Every FD has a candidate key on the left"
    ],
    "correctAnswerIndex": 0,
    "explanation": "A minimal cover is an equivalent, irreducible set of FDs with no extraneous attributes and no redundant dependencies.",
    "tags": [
      "DBMS",
      "Functional Dependencies",
      "Databases",
      "SQL",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, University Database Exams",
    "placementRelevance": "Oracle, Microsoft, Amazon, Salesforce OA"
  },
  {
    "subject": "DBMS",
    "topic": "Functional Dependencies",
    "subtopic": "Testing Candidate Key via Closure",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "Given relation R(A, B, C, D) and functional dependencies F = {A \u2192 B, B \u2192 C, C \u2192 D}. What is the candidate key of R?",
    "options": [
      "{A}",
      "{A, B}",
      "{D}",
      "{B, C}"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Computing A+: A+ = {A, B, C, D}. Since A+ contains all attributes of R and no proper subset of A can determine all attributes, {A} is the candidate key.",
    "tags": [
      "DBMS",
      "Functional Dependencies",
      "Databases",
      "SQL",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, University Database Exams",
    "placementRelevance": "Oracle, Microsoft, Amazon, Salesforce OA"
  },
  {
    "subject": "DBMS",
    "topic": "Functional Dependencies",
    "subtopic": "Extraneous Attributes",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "In dependency AB \u2192 C, under what condition is attribute B extraneous?",
    "options": [
      "If C can already be determined by A alone under F (i.e. C \u2208 A+)",
      "If B is non-prime",
      "If A is prime",
      "If C is null"
    ],
    "correctAnswerIndex": 0,
    "explanation": "An attribute in a functional dependency is extraneous if deleting it produces a set of dependencies with identical closure.",
    "tags": [
      "DBMS",
      "Functional Dependencies",
      "Databases",
      "SQL",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, University Database Exams",
    "placementRelevance": "Oracle, Microsoft, Amazon, Salesforce OA"
  },
  {
    "subject": "DBMS",
    "topic": "Functional Dependencies",
    "subtopic": "Lossless Join Decomposition",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "Decomposition of relation R into R1 and R2 is Lossless if and only if (R1 \u2229 R2) functionally determines:",
    "options": [
      "Either R1 or R2 (i.e. (R1 \u2229 R2) \u2192 R1 or (R1 \u2229 R2) \u2192 R2)",
      "Only R1 \u222a R2",
      "Neither relation",
      "Only the primary key of R"
    ],
    "correctAnswerIndex": 0,
    "explanation": "By the theorem of lossless-join decomposition, the common attributes must form a superkey of at least one of the decomposed relations.",
    "tags": [
      "DBMS",
      "Functional Dependencies",
      "Databases",
      "SQL",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, University Database Exams",
    "placementRelevance": "Oracle, Microsoft, Amazon, Salesforce OA"
  },
  {
    "subject": "DBMS",
    "topic": "Functional Dependencies",
    "subtopic": "Dependency Preservation",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "A decomposition is Dependency Preserving if:",
    "options": [
      "The union of projections of functional dependencies on each decomposed relation has the same closure as original F",
      "All candidate keys are preserved",
      "No null values appear in foreign keys",
      "Every table has equal columns"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Dependency preservation ensures consistency can be verified by inspecting individual tables without performing expensive joins.",
    "tags": [
      "DBMS",
      "Functional Dependencies",
      "Databases",
      "SQL",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, University Database Exams",
    "placementRelevance": "Oracle, Microsoft, Amazon, Salesforce OA"
  },
  {
    "subject": "DBMS",
    "topic": "Normalization",
    "subtopic": "1NF Requirement",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What is the strict requirement for a relation to be in First Normal Form (1NF)?",
    "options": [
      "Every attribute value must be atomic (no repeating groups, arrays, or nested relations)",
      "Must have no partial dependencies",
      "Must have no transitive dependencies",
      "Determinants must be candidate keys"
    ],
    "correctAnswerIndex": 0,
    "explanation": "1NF prohibits multi-valued attributes, arrays, and composite fields, ensuring all column domains contain atomic (indivisible) values.",
    "tags": [
      "DBMS",
      "Normalization",
      "Databases",
      "SQL",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, University Database Exams",
    "placementRelevance": "Oracle, Microsoft, Amazon, Salesforce OA"
  },
  {
    "subject": "DBMS",
    "topic": "Normalization",
    "subtopic": "2NF Definition",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "A relation is in Second Normal Form (2NF) if it is in 1NF and:",
    "options": [
      "Contains no partial dependencies (no non-prime attribute is functionally dependent on a proper subset of any candidate key)",
      "Contains no transitive dependencies",
      "All attributes are prime",
      "Every determinant is a superkey"
    ],
    "correctAnswerIndex": 0,
    "explanation": "2NF eliminates partial dependencies; if candidate key is composite {A, B}, an FD like A \u2192 C (where C is non-prime) violates 2NF.",
    "tags": [
      "DBMS",
      "Normalization",
      "Databases",
      "SQL",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, University Database Exams",
    "placementRelevance": "Oracle, Microsoft, Amazon, Salesforce OA"
  },
  {
    "subject": "DBMS",
    "topic": "Normalization",
    "subtopic": "3NF Condition",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "For a relation R to be in Third Normal Form (3NF), for every non-trivial functional dependency X \u2192 Y, either:",
    "options": [
      "X is a superkey OR Y is a prime attribute",
      "X is a candidate key and Y is non-prime",
      "X and Y are prime",
      "Y is a candidate key"
    ],
    "correctAnswerIndex": 0,
    "explanation": "3NF eliminates transitive dependencies (non-prime \u2192 non-prime), allowing X \u2192 Y if X is a superkey or Y is part of a candidate key.",
    "tags": [
      "DBMS",
      "Normalization",
      "Databases",
      "SQL",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, University Database Exams",
    "placementRelevance": "Oracle, Microsoft, Amazon, Salesforce OA"
  },
  {
    "subject": "DBMS",
    "topic": "Normalization",
    "subtopic": "BCNF Condition",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "For every non-trivial functional dependency X \u2192 Y in Boyce-Codd Normal Form (BCNF):",
    "options": [
      "X must strictly be a Superkey",
      "Y must be a prime attribute",
      "X and Y must be disjoint",
      "The table must have only 2 columns"
    ],
    "correctAnswerIndex": 0,
    "explanation": "BCNF is strictly stronger than 3NF; it removes 3NF's second exception, requiring the determinant X to be a superkey in every non-trivial FD.",
    "tags": [
      "DBMS",
      "Normalization",
      "Databases",
      "SQL",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, University Database Exams",
    "placementRelevance": "Oracle, Microsoft, Amazon, Salesforce OA"
  },
  {
    "subject": "DBMS",
    "topic": "Normalization",
    "subtopic": "3NF vs BCNF Trade-off",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "Why is 3NF often preferred over BCNF in production database system design?",
    "options": [
      "3NF always guarantees both Lossless Join and Dependency Preservation, whereas BCNF may not preserve all dependencies",
      "BCNF tables require more disk storage",
      "3NF allows null values",
      "BCNF queries are not supported by SQL"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Some relations cannot be decomposed into BCNF without losing functional dependencies; 3NF always guarantees dependency-preserving lossless decomposition.",
    "tags": [
      "DBMS",
      "Normalization",
      "Databases",
      "SQL",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, University Database Exams",
    "placementRelevance": "Oracle, Microsoft, Amazon, Salesforce OA"
  },
  {
    "subject": "DBMS",
    "topic": "Normalization",
    "subtopic": "4NF and Multivalued Dependencies",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "Fourth Normal Form (4NF) is designed to eliminate anomalies caused by:",
    "options": [
      "Non-trivial Multivalued Dependencies (MVDs: X \u21a0 Y)",
      "Partial dependencies",
      "Transitive dependencies",
      "Join dependencies"
    ],
    "correctAnswerIndex": 0,
    "explanation": "An MVD X \u21a0 Y states that X determines independent sets of values for Y and Z, causing Cartesian product redundancy that 4NF splits into separate tables.",
    "tags": [
      "DBMS",
      "Normalization",
      "Databases",
      "SQL",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, University Database Exams",
    "placementRelevance": "Oracle, Microsoft, Amazon, Salesforce OA"
  },
  {
    "subject": "DBMS",
    "topic": "Normalization",
    "subtopic": "5NF Join Dependency",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "Fifth Normal Form (5NF / Project-Join Normal Form) eliminates redundancy caused by:",
    "options": [
      "Join Dependencies that are not implied by candidate keys",
      "Multivalued dependencies only",
      "Transitive dependencies",
      "Composite foreign keys"
    ],
    "correctAnswerIndex": 0,
    "explanation": "5NF addresses relations that cannot be decomposed into 2 tables without loss of information, but can be decomposed losslessly into 3 or more tables.",
    "tags": [
      "DBMS",
      "Normalization",
      "Databases",
      "SQL",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, University Database Exams",
    "placementRelevance": "Oracle, Microsoft, Amazon, Salesforce OA"
  },
  {
    "subject": "DBMS",
    "topic": "Normalization",
    "subtopic": "Denormalization Trade-off",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "Why do high-throughput analytical and read-heavy systems intentionally Denormalize database schemas?",
    "options": [
      "To reduce expensive table JOIN operations and accelerate read query performance",
      "To save disk storage space",
      "To prevent SQL injection",
      "To ensure ACID compliance"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Joining 10 normalized tables introduces CPU and disk I/O bottlenecks; denormalization stores redundant pre-computed data to make read queries simple and fast.",
    "tags": [
      "DBMS",
      "Normalization",
      "Databases",
      "SQL",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, University Database Exams",
    "placementRelevance": "Oracle, Microsoft, Amazon, Salesforce OA"
  },
  {
    "subject": "DBMS",
    "topic": "SQL",
    "subtopic": "HAVING vs WHERE",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What is the difference between WHERE and HAVING clauses in an SQL query?",
    "options": [
      "WHERE filters rows before aggregation; HAVING filters groups after GROUP BY aggregation",
      "WHERE is used only with JOINs",
      "HAVING cannot use comparison operators",
      "They are identical in SQL standard"
    ],
    "correctAnswerIndex": 0,
    "explanation": "WHERE filters individual tuples before GROUP BY. HAVING filters aggregated group metrics (e.g. HAVING COUNT(*) > 5) after grouping.",
    "tags": [
      "DBMS",
      "SQL",
      "Databases",
      "SQL",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, University Database Exams",
    "placementRelevance": "Oracle, Microsoft, Amazon, Salesforce OA"
  },
  {
    "subject": "DBMS",
    "topic": "SQL",
    "subtopic": "Window Functions",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What distinguishes SQL Window Functions (like ROW_NUMBER() OVER (...)) from standard GROUP BY aggregations?",
    "options": [
      "Window functions compute metrics across a frame of rows without collapsing rows into a single output row",
      "Window functions run only on client side",
      "GROUP BY cannot use SUM()",
      "Window functions cannot use ORDER BY"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Unlike GROUP BY which aggregates multiple rows into one summary row, window functions preserve the individual row identities while computing partitioned values.",
    "tags": [
      "DBMS",
      "SQL",
      "Databases",
      "SQL",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, University Database Exams",
    "placementRelevance": "Oracle, Microsoft, Amazon, Salesforce OA"
  },
  {
    "subject": "DBMS",
    "topic": "SQL",
    "subtopic": "DENSE_RANK vs RANK",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "If three rows tie for rank 1, what rank value will the next subsequent row receive under RANK() vs DENSE_RANK()?",
    "options": [
      "RANK() assigns 4; DENSE_RANK() assigns 2",
      "RANK() assigns 2; DENSE_RANK() assigns 4",
      "Both assign 2",
      "Both assign 4"
    ],
    "correctAnswerIndex": 0,
    "explanation": "RANK() introduces gaps for tied ranks (1, 1, 1, 4), while DENSE_RANK() leaves no gaps (1, 1, 1, 2).",
    "tags": [
      "DBMS",
      "SQL",
      "Databases",
      "SQL",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, University Database Exams",
    "placementRelevance": "Oracle, Microsoft, Amazon, Salesforce OA"
  },
  {
    "subject": "DBMS",
    "topic": "SQL",
    "subtopic": "Subquery EXISTS vs IN",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "Why is `SELECT * FROM A WHERE EXISTS (SELECT 1 FROM B WHERE B.id = A.id)` generally preferred over `IN` with nullable columns?",
    "options": [
      "EXISTS short-circuits upon finding the first match and handles NULLs correctly without 3-valued logic pitfalls",
      "IN is deprecated in ANSI SQL",
      "EXISTS does not require an index",
      "IN queries cannot use WHERE"
    ],
    "correctAnswerIndex": 0,
    "explanation": "If the subquery for `NOT IN` returns even a single NULL value, the entire NOT IN evaluates to UNKNOWN (returning 0 rows); EXISTS handles nulls reliably.",
    "tags": [
      "DBMS",
      "SQL",
      "Databases",
      "SQL",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, University Database Exams",
    "placementRelevance": "Oracle, Microsoft, Amazon, Salesforce OA"
  },
  {
    "subject": "DBMS",
    "topic": "SQL",
    "subtopic": "CTE Common Table Expressions",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What is the syntax keyword used in SQL to define a Common Table Expression (CTE)?",
    "options": [
      "WITH",
      "DECLARE",
      "TEMP TABLE",
      "CREATE VIEW"
    ],
    "correctAnswerIndex": 0,
    "explanation": "WITH clause defines named temporary result sets (CTEs) that exist within the scope of a single execution statement.",
    "tags": [
      "DBMS",
      "SQL",
      "Databases",
      "SQL",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, University Database Exams",
    "placementRelevance": "Oracle, Microsoft, Amazon, Salesforce OA"
  },
  {
    "subject": "DBMS",
    "topic": "SQL",
    "subtopic": "UPSERT Syntax",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "In PostgreSQL and modern SQL standards, how is an 'UPSERT' (insert or update on conflict) statement written?",
    "options": [
      "INSERT INTO table VALUES (...) ON CONFLICT (id) DO UPDATE SET ...",
      "UPSERT INTO table ...",
      "MERGE INTO without ON",
      "INSERT OR REPLACE IF NOT EXISTS"
    ],
    "correctAnswerIndex": 0,
    "explanation": "PostgreSQL uses `ON CONFLICT (target) DO UPDATE SET ...` to handle atomic upsert operations.",
    "tags": [
      "DBMS",
      "SQL",
      "Databases",
      "SQL",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, University Database Exams",
    "placementRelevance": "Oracle, Microsoft, Amazon, Salesforce OA"
  },
  {
    "subject": "DBMS",
    "topic": "SQL",
    "subtopic": "COALESCE Function",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What does the SQL scalar function `COALESCE(col1, col2, 'default')` return?",
    "options": [
      "The first non-null argument in the parameter list",
      "The concatenation of all arguments",
      "The maximum value among arguments",
      "True if all arguments are null"
    ],
    "correctAnswerIndex": 0,
    "explanation": "COALESCE evaluates arguments in sequence and returns the first non-null expression; if all are null, it returns null.",
    "tags": [
      "DBMS",
      "SQL",
      "Databases",
      "SQL",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, University Database Exams",
    "placementRelevance": "Oracle, Microsoft, Amazon, Salesforce OA"
  },
  {
    "subject": "DBMS",
    "topic": "SQL",
    "subtopic": "Query Execution Order",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "What is the logical execution order of clauses in a standard SQL SELECT statement?",
    "options": [
      "FROM/JOIN \u2192 WHERE \u2192 GROUP BY \u2192 HAVING \u2192 SELECT \u2192 DISTINCT \u2192 ORDER BY \u2192 LIMIT",
      "SELECT \u2192 FROM \u2192 WHERE \u2192 GROUP BY \u2192 ORDER BY",
      "WHERE \u2192 FROM \u2192 SELECT \u2192 GROUP BY \u2192 LIMIT",
      "FROM \u2192 SELECT \u2192 WHERE \u2192 ORDER BY"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Logical query processing begins by assembling tables in FROM/JOIN, then filters rows (WHERE), groups them (GROUP BY), filters groups (HAVING), projects columns (SELECT), deduplicates (DISTINCT), sorts (ORDER BY), and limits (LIMIT).",
    "tags": [
      "DBMS",
      "SQL",
      "Databases",
      "SQL",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, University Database Exams",
    "placementRelevance": "Oracle, Microsoft, Amazon, Salesforce OA"
  },
  {
    "subject": "DBMS",
    "topic": "Joins",
    "subtopic": "Inner Join vs Left Join",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What rows are returned by a LEFT OUTER JOIN between table A and table B on A.id = B.id?",
    "options": [
      "All rows from table A, plus matched rows from table B (with NULLs for unmatched rows from B)",
      "Only rows that match in both tables",
      "All rows from table B and matching from A",
      "The Cartesian product of A and B"
    ],
    "correctAnswerIndex": 0,
    "explanation": "LEFT JOIN guarantees all left table tuples appear in the result set, filling right table columns with NULL when no join match exists.",
    "tags": [
      "DBMS",
      "Joins",
      "Databases",
      "SQL",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, University Database Exams",
    "placementRelevance": "Oracle, Microsoft, Amazon, Salesforce OA"
  },
  {
    "subject": "DBMS",
    "topic": "Joins",
    "subtopic": "Cross Join",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "If table A contains 10 rows and table B contains 20 rows, how many rows will `SELECT * FROM A CROSS JOIN B` produce?",
    "options": [
      "200 rows",
      "30 rows",
      "10 rows",
      "2 rows"
    ],
    "correctAnswerIndex": 0,
    "explanation": "CROSS JOIN computes the Cartesian Product, generating |A| * |B| = 10 * 20 = 200 rows.",
    "tags": [
      "DBMS",
      "Joins",
      "Databases",
      "SQL",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, University Database Exams",
    "placementRelevance": "Oracle, Microsoft, Amazon, Salesforce OA"
  },
  {
    "subject": "DBMS",
    "topic": "Joins",
    "subtopic": "Nested Loop Join",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is the time complexity of a basic Nested Loop Join between relation R (M pages) and relation S (N pages) without indexes?",
    "options": [
      "O(M * N) page I/Os",
      "O(M + N)",
      "O(M log N)",
      "O(1)"
    ],
    "correctAnswerIndex": 0,
    "explanation": "For every tuple/block in outer relation R, the entire inner relation S must be scanned, incurring M * N I/O operations.",
    "tags": [
      "DBMS",
      "Joins",
      "Databases",
      "SQL",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, University Database Exams",
    "placementRelevance": "Oracle, Microsoft, Amazon, Salesforce OA"
  },
  {
    "subject": "DBMS",
    "topic": "Joins",
    "subtopic": "Hash Join Algorithm",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "How does a Classic Hash Join operate in database query execution engines?",
    "options": [
      "Build phase: hashes smaller relation into an in-memory hash table on join key; Probe phase: streams larger relation probing the hash table",
      "Sorts both relations first",
      "Builds a B+ tree on disk",
      "Iterates over nested loops randomly"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Hash Join constructs a hash table on the join attribute for the smaller input (Build Phase), then scans the larger input probing for matches in O(M + N) time.",
    "tags": [
      "DBMS",
      "Joins",
      "Databases",
      "SQL",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, University Database Exams",
    "placementRelevance": "Oracle, Microsoft, Amazon, Salesforce OA"
  },
  {
    "subject": "DBMS",
    "topic": "Joins",
    "subtopic": "Sort-Merge Join",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "When is a Sort-Merge Join chosen over a Hash Join by the database cost-based query optimizer?",
    "options": [
      "When inputs are already sorted on the join key (e.g. from a B+ tree index) or output must be sorted",
      "When relations fit completely in CPU L1 cache",
      "Only on non-equi-joins (like A.id < B.id)",
      "When memory is unlimited"
    ],
    "correctAnswerIndex": 0,
    "explanation": "If both relations are already sorted on the join attribute, Sort-Merge Join executes in linear O(M + N) time with zero hash table overhead.",
    "tags": [
      "DBMS",
      "Joins",
      "Databases",
      "SQL",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, University Database Exams",
    "placementRelevance": "Oracle, Microsoft, Amazon, Salesforce OA"
  },
  {
    "subject": "DBMS",
    "topic": "Joins",
    "subtopic": "Self Join",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "In what scenario is a SELF JOIN typically required in database queries?",
    "options": [
      "When querying hierarchical relationships within the same table (such as Employee table joined to itself for Manager_ID = Employee_ID)",
      "To double the records in a table",
      "To join two different database instances",
      "When primary key is missing"
    ],
    "correctAnswerIndex": 0,
    "explanation": "A self-join joins a table to itself using table aliases to represent parent-child or hierarchical links within the same relation.",
    "tags": [
      "DBMS",
      "Joins",
      "Databases",
      "SQL",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, University Database Exams",
    "placementRelevance": "Oracle, Microsoft, Amazon, Salesforce OA"
  },
  {
    "subject": "DBMS",
    "topic": "Joins",
    "subtopic": "Full Outer Join",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What does a FULL OUTER JOIN between relations A and B return?",
    "options": [
      "All matching rows from both, plus unmatched rows from A (with NULLs) AND unmatched rows from B (with NULLs)",
      "Only non-matching rows",
      "The intersection only",
      "Same as an INNER JOIN"
    ],
    "correctAnswerIndex": 0,
    "explanation": "FULL OUTER JOIN combines the results of both LEFT and RIGHT outer joins, ensuring no tuples from either table are omitted.",
    "tags": [
      "DBMS",
      "Joins",
      "Databases",
      "SQL",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, University Database Exams",
    "placementRelevance": "Oracle, Microsoft, Amazon, Salesforce OA"
  },
  {
    "subject": "DBMS",
    "topic": "Joins",
    "subtopic": "Non-Equi Join",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "Which database join algorithm cannot be used directly for a Non-Equi Join (e.g. `ON A.date BETWEEN B.start AND B.end`)?",
    "options": [
      "Hash Join",
      "Nested Loop Join",
      "Block Nested Loop Join",
      "Index Nested Loop Join"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Hash functions map identical values to identical buckets; they cannot map inequality ranges, so Hash Join requires equality (`=`) predicates.",
    "tags": [
      "DBMS",
      "Joins",
      "Databases",
      "SQL",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, University Database Exams",
    "placementRelevance": "Oracle, Microsoft, Amazon, Salesforce OA"
  },
  {
    "subject": "DBMS",
    "topic": "Transactions",
    "subtopic": "Transaction States",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is the sequence of states a database transaction undergoes from initiation to completion?",
    "options": [
      "Active \u2192 Partially Committed \u2192 Committed (or Failed \u2192 Aborted)",
      "Pending \u2192 Running \u2192 Success",
      "Open \u2192 Querying \u2192 Closed",
      "Read \u2192 Write \u2192 Verified"
    ],
    "correctAnswerIndex": 0,
    "explanation": "A transaction enters Partially Committed state after the final statement executes; once recovery log records write to disk, it enters Committed.",
    "tags": [
      "DBMS",
      "Transactions",
      "Databases",
      "SQL",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, University Database Exams",
    "placementRelevance": "Oracle, Microsoft, Amazon, Salesforce OA"
  },
  {
    "subject": "DBMS",
    "topic": "Transactions",
    "subtopic": "Write-Ahead Logging (WAL)",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "What is the fundamental rule of Write-Ahead Logging (WAL) in database engine recovery?",
    "options": [
      "The log record describing a change must be flushed to non-volatile disk before the corresponding database data page is written to disk",
      "Data pages are written before log records",
      "Logs are written only at midnight",
      "Disk writes occur asynchronously without ordering"
    ],
    "correctAnswerIndex": 0,
    "explanation": "WAL ensures that if a crash occurs after updating buffer pool memory, the undo/redo log on persistent disk can recover or roll back uncommitted changes.",
    "tags": [
      "DBMS",
      "Transactions",
      "Databases",
      "SQL",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, University Database Exams",
    "placementRelevance": "Oracle, Microsoft, Amazon, Salesforce OA"
  },
  {
    "subject": "DBMS",
    "topic": "Transactions",
    "subtopic": "Serializability",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "A concurrent schedule is defined as Serializable if:",
    "options": [
      "Its outcome is equivalent to the outcome of some serial execution of the same transactions",
      "Transactions run simultaneously with zero locks",
      "All transactions commit within 1 millisecond",
      "No two queries read the same table"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Serializability is the gold standard of correctness: concurrent execution must produce identical database state to some non-overlapping serial order.",
    "tags": [
      "DBMS",
      "Transactions",
      "Databases",
      "SQL",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, University Database Exams",
    "placementRelevance": "Oracle, Microsoft, Amazon, Salesforce OA"
  },
  {
    "subject": "DBMS",
    "topic": "Transactions",
    "subtopic": "Conflict Serializability",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "Two operations in a schedule are in conflict if they belong to different transactions, access the same data item, and:",
    "options": [
      "At least one of the operations is a WRITE",
      "Both operations are READ",
      "Both operations are aborts",
      "They access different columns"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Read-Read operations never conflict because order does not affect final state; Read-Write, Write-Read, and Write-Write conflict.",
    "tags": [
      "DBMS",
      "Transactions",
      "Databases",
      "SQL",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, University Database Exams",
    "placementRelevance": "Oracle, Microsoft, Amazon, Salesforce OA"
  },
  {
    "subject": "DBMS",
    "topic": "Transactions",
    "subtopic": "Precedence Graph",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "How is a schedule proven to be Conflict Serializable using a Precedence (Serialization) Graph?",
    "options": [
      "The precedence graph contains NO directed cycles (is a DAG)",
      "The graph is fully connected",
      "All nodes have in-degree of 0",
      "The graph contains an Eulerian path"
    ],
    "correctAnswerIndex": 0,
    "explanation": "If the serialization graph (edges Ti -> Tj for conflicting operations) contains no directed cycle, the topological sort yields an equivalent serial schedule.",
    "tags": [
      "DBMS",
      "Transactions",
      "Databases",
      "SQL",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, University Database Exams",
    "placementRelevance": "Oracle, Microsoft, Amazon, Salesforce OA"
  },
  {
    "subject": "DBMS",
    "topic": "Transactions",
    "subtopic": "View Serializability",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "What is the relationship between Conflict Serializability and View Serializability?",
    "options": [
      "Every conflict serializable schedule is view serializable, but some view serializable schedules (with blind writes) are not conflict serializable",
      "They are identical sets",
      "View serializability is a subset of conflict serializability",
      "Conflict serializability is NP-complete to test"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Testing Conflict Serializability is polynomial O(V+E) via cycle check; View Serializability is NP-Complete and handles blind writes (writes without reading).",
    "tags": [
      "DBMS",
      "Transactions",
      "Databases",
      "SQL",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, University Database Exams",
    "placementRelevance": "Oracle, Microsoft, Amazon, Salesforce OA"
  },
  {
    "subject": "DBMS",
    "topic": "Transactions",
    "subtopic": "Cascadeless Schedule",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "What condition defines a Cascadeless Schedule?",
    "options": [
      "For every transaction Ti that reads a data item written by Tj, Tj must commit before the read operation occurs",
      "Transactions never abort",
      "No two transactions share locks",
      "Deadlocks are impossible"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Cascadeless schedules prevent cascading rollbacks by ensuring no transaction ever reads uncommitted dirty data from another transaction.",
    "tags": [
      "DBMS",
      "Transactions",
      "Databases",
      "SQL",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, University Database Exams",
    "placementRelevance": "Oracle, Microsoft, Amazon, Salesforce OA"
  },
  {
    "subject": "DBMS",
    "topic": "Transactions",
    "subtopic": "Strict Schedule",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "A schedule is Strict if for any data item written by Ti:",
    "options": [
      "No other transaction Tj can read or write that item until Ti commits or aborts",
      "All reads occur before writes",
      "No locks are used",
      "Tj can read immediately"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Strict schedules ensure simple recovery via undo logging: to restore an item on abort, the system simply restores its pre-image without cascading effects.",
    "tags": [
      "DBMS",
      "Transactions",
      "Databases",
      "SQL",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, University Database Exams",
    "placementRelevance": "Oracle, Microsoft, Amazon, Salesforce OA"
  },
  {
    "subject": "DBMS",
    "topic": "Concurrency",
    "subtopic": "Two-Phase Locking (2PL)",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What are the two phases in Strict Two-Phase Locking (Strict 2PL)?",
    "options": [
      "Growing Phase (locks acquired, none released) and Shrinking Phase (all exclusive locks held until commit/abort)",
      "Read phase and Write phase",
      "Validation phase and commit phase",
      "Optimistic and pessimistic phase"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Strict 2PL guarantees conflict serializability and prevents cascading rollbacks by holding all exclusive locks until transaction termination.",
    "tags": [
      "DBMS",
      "Concurrency",
      "Databases",
      "SQL",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, University Database Exams",
    "placementRelevance": "Oracle, Microsoft, Amazon, Salesforce OA"
  },
  {
    "subject": "DBMS",
    "topic": "Concurrency",
    "subtopic": "Deadlock Detection Wait-For Graph",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "In concurrency control, a deadlock among transactions is detected by:",
    "options": [
      "Finding a directed cycle in the Wait-For Graph (WFG)",
      "Measuring CPU utilization > 95%",
      "Counting total active transactions",
      "Checking if lock count exceeds memory"
    ],
    "correctAnswerIndex": 0,
    "explanation": "In a Wait-For Graph where directed edges Ti -> Tj denote Ti waiting for a lock held by Tj, a cycle signifies a circular wait deadlock.",
    "tags": [
      "DBMS",
      "Concurrency",
      "Databases",
      "SQL",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, University Database Exams",
    "placementRelevance": "Oracle, Microsoft, Amazon, Salesforce OA"
  },
  {
    "subject": "DBMS",
    "topic": "Concurrency",
    "subtopic": "Wait-Die vs Wound-Wait",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "In timestamp-based deadlock prevention, how does the 'Wound-Wait' non-preemptive strategy handle transaction Ti requesting a lock held by Tj?",
    "options": [
      "If Ti is older than Tj (timestamp Ti < Tj), Ti wounds (aborts) Tj; otherwise Ti waits",
      "Ti always dies",
      "Tj always dies",
      "Older transaction waits while younger preempts"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Wound-Wait is preemptive: older transactions wound (preempt/abort) younger transactions holding needed locks, preventing deadlocks.",
    "tags": [
      "DBMS",
      "Concurrency",
      "Databases",
      "SQL",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, University Database Exams",
    "placementRelevance": "Oracle, Microsoft, Amazon, Salesforce OA"
  },
  {
    "subject": "DBMS",
    "topic": "Concurrency",
    "subtopic": "Isolation Levels ANSI",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "Which anomaly is prevented by REPEATABLE READ isolation level that is allowed under READ COMMITTED?",
    "options": [
      "Non-Repeatable (Fuzzy) Read",
      "Dirty Read",
      "Phantom Read",
      "Write Skew"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Read Committed allows Non-Repeatable Reads (re-reading a row gets modified values from a newly committed transaction); Repeatable Read prevents this via shared row locks or snapshot views.",
    "tags": [
      "DBMS",
      "Concurrency",
      "Databases",
      "SQL",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, University Database Exams",
    "placementRelevance": "Oracle, Microsoft, Amazon, Salesforce OA"
  },
  {
    "subject": "DBMS",
    "topic": "Concurrency",
    "subtopic": "Phantom Read Anomaly",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is a Phantom Read in relational databases?",
    "options": [
      "A transaction re-executes a range query (e.g. WHERE age > 30) and discovers new rows inserted and committed by another transaction",
      "Reading data that is later rolled back",
      "Modifying data without a lock",
      "Deleting an entire database by mistake"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Phantom reads involve newly inserted tuples matching a predicate range, which row-level locks cannot protect without predicate locks or index range locks.",
    "tags": [
      "DBMS",
      "Concurrency",
      "Databases",
      "SQL",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, University Database Exams",
    "placementRelevance": "Oracle, Microsoft, Amazon, Salesforce OA"
  },
  {
    "subject": "DBMS",
    "topic": "Concurrency",
    "subtopic": "Optimistic Concurrency Control (OCC)",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What are the three sequential phases of Optimistic Concurrency Control (OCC)?",
    "options": [
      "Read Phase \u2192 Validation Phase \u2192 Write Phase",
      "Lock Phase \u2192 Process Phase \u2192 Unlock Phase",
      "Begin \u2192 Execute \u2192 Commit",
      "Check \u2192 Read \u2192 Abort"
    ],
    "correctAnswerIndex": 0,
    "explanation": "OCC assumes conflicts are rare: transactions read and write to local private copies, validate against concurrent commits in Validation phase, and copy to DB in Write phase.",
    "tags": [
      "DBMS",
      "Concurrency",
      "Databases",
      "SQL",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, University Database Exams",
    "placementRelevance": "Oracle, Microsoft, Amazon, Salesforce OA"
  },
  {
    "subject": "DBMS",
    "topic": "Concurrency",
    "subtopic": "Snapshot Isolation & MVCC",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "In Multi-Version Concurrency Control (MVCC), how do read transactions avoid blocking write transactions?",
    "options": [
      "Readers read a consistent historical snapshot (past version) of the row without acquiring read locks",
      "Readers write to a separate temporary table",
      "Writers queue behind readers",
      "MVCC turns off transaction logging"
    ],
    "correctAnswerIndex": 0,
    "explanation": "MVCC maintains multiple timestamped versions of each row. Readers view the version committed before their start timestamp, meaning 'readers never block writers, and writers never block readers'.",
    "tags": [
      "DBMS",
      "Concurrency",
      "Databases",
      "SQL",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, University Database Exams",
    "placementRelevance": "Oracle, Microsoft, Amazon, Salesforce OA"
  },
  {
    "subject": "DBMS",
    "topic": "Concurrency",
    "subtopic": "Write Skew Anomaly",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "Under Snapshot Isolation, what anomaly can occur that violates pure Serializability?",
    "options": [
      "Write Skew: Two concurrent transactions read overlapping data, make mutually consistent decisions independently, but violate a global invariant when both write",
      "Dirty Read",
      "Lost Update",
      "Dirty Write"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Classic example: On-call doctors. Both see 2 doctors on-call, both take leave simultaneously; each sees 1 doctor remaining locally, but both leave, leaving 0 on-call.",
    "tags": [
      "DBMS",
      "Concurrency",
      "Databases",
      "SQL",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, University Database Exams",
    "placementRelevance": "Oracle, Microsoft, Amazon, Salesforce OA"
  },
  {
    "subject": "DBMS",
    "topic": "Indexing",
    "subtopic": "Clustered vs Non-Clustered Index",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What is the fundamental architectural difference between a Clustered and a Non-Clustered Index?",
    "options": [
      "A Clustered Index dictates the physical on-disk storage order of the actual table rows; a table can have only ONE clustered index",
      "Non-clustered indexes store table rows directly",
      "Clustered indexes are stored in RAM only",
      "Non-clustered indexes cannot have duplicate keys"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Because physical data rows on disk can only be stored in one sorted sequence, a table allows only one clustered index (usually the Primary Key).",
    "tags": [
      "DBMS",
      "Indexing",
      "Databases",
      "SQL",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, University Database Exams",
    "placementRelevance": "Oracle, Microsoft, Amazon, Salesforce OA"
  },
  {
    "subject": "DBMS",
    "topic": "Indexing",
    "subtopic": "Covering Index",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is a 'Covering Index' in SQL query performance tuning?",
    "options": [
      "An index that contains all columns requested by a query, allowing the engine to satisfy the query entirely from the index without table lookup (Bookmark Lookup)",
      "An index covering all tables in a schema",
      "An index with 100% unique values",
      "An encrypted index"
    ],
    "correctAnswerIndex": 0,
    "explanation": "When an index includes both the WHERE filter columns and the SELECT projection columns, the engine eliminates the secondary random I/O of reading table data pages.",
    "tags": [
      "DBMS",
      "Indexing",
      "Databases",
      "SQL",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, University Database Exams",
    "placementRelevance": "Oracle, Microsoft, Amazon, Salesforce OA"
  },
  {
    "subject": "DBMS",
    "topic": "Indexing",
    "subtopic": "Index Selectivity",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "Why is creating an index on a boolean column (e.g. `is_active` with values true/false) generally inefficient?",
    "options": [
      "It has poor Selectivity (distinct values / total rows \u2248 0), prompting the optimizer to favor a sequential table scan over index seek",
      "B+ trees cannot store boolean types",
      "Boolean indexes consume 10x more storage",
      "Boolean columns cannot be queried with WHERE"
    ],
    "correctAnswerIndex": 0,
    "explanation": "High selectivity (close to 1.0, e.g. primary keys or emails) makes index traversal efficient. Low selectivity forces the optimizer to scan pages sequentially.",
    "tags": [
      "DBMS",
      "Indexing",
      "Databases",
      "SQL",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, University Database Exams",
    "placementRelevance": "Oracle, Microsoft, Amazon, Salesforce OA"
  },
  {
    "subject": "DBMS",
    "topic": "Indexing",
    "subtopic": "Composite Index Leftmost Prefix Rule",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "Given a composite index on columns `(A, B, C)`, which of the following WHERE clauses CANNOT utilize the index?",
    "options": [
      "WHERE B = 5 AND C = 10",
      "WHERE A = 1 AND B = 5",
      "WHERE A = 1",
      "WHERE A = 1 AND B = 5 AND C = 10"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Composite indexes order keys lexicographically by A, then B, then C. Without leading column A in the query predicate, the index cannot be traversed.",
    "tags": [
      "DBMS",
      "Indexing",
      "Databases",
      "SQL",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, University Database Exams",
    "placementRelevance": "Oracle, Microsoft, Amazon, Salesforce OA"
  },
  {
    "subject": "DBMS",
    "topic": "Indexing",
    "subtopic": "Bitmap Index",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "In Data Warehousing systems, why are Bitmap Indexes ideal for low-cardinality columns (e.g. Gender, Marital Status)?",
    "options": [
      "Bitmap vectors allow fast bitwise AND/OR operations in hardware to evaluate complex multi-attribute filter queries",
      "Bitmap indexes update faster on high-frequency OLTP writes",
      "Bitmaps consume zero disk space",
      "Bitmap indexes replace B+ trees entirely"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Each distinct column value has a bit vector where bit i represents row i. Bitwise boolean operations across multiple bitmaps execute in nanoseconds at CPU register speeds.",
    "tags": [
      "DBMS",
      "Indexing",
      "Databases",
      "SQL",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, University Database Exams",
    "placementRelevance": "Oracle, Microsoft, Amazon, Salesforce OA"
  },
  {
    "subject": "DBMS",
    "topic": "Indexing",
    "subtopic": "Hash Index Limitations",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is the primary limitation of a Hash Index compared to a B+ Tree Index?",
    "options": [
      "Hash indexes only support exact equality matches (`=`); they CANNOT support range queries (`<`, `>`, `BETWEEN`) or sorting",
      "Hash indexes are slower for single lookups",
      "Hash indexes use more memory",
      "Hash indexes cannot be created on integer columns"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Hash functions destroy ordering relationships; consecutive values hash to completely random buckets, making range scans impossible.",
    "tags": [
      "DBMS",
      "Indexing",
      "Databases",
      "SQL",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, University Database Exams",
    "placementRelevance": "Oracle, Microsoft, Amazon, Salesforce OA"
  },
  {
    "subject": "DBMS",
    "topic": "Indexing",
    "subtopic": "Dense vs Sparse Index",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is the difference between a Dense Index and a Sparse Index?",
    "options": [
      "A Dense Index contains an index entry for EVERY search key value in the table; a Sparse Index contains entries for only some records (e.g. one per data block)",
      "Sparse indexes use more disk space",
      "Dense indexes only work on unclustered files",
      "Sparse indexes cannot be searched with binary search"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Sparse indexes require records to be physically sorted on disk; they store one index entry per disk block, saving significant index memory.",
    "tags": [
      "DBMS",
      "Indexing",
      "Databases",
      "SQL",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, University Database Exams",
    "placementRelevance": "Oracle, Microsoft, Amazon, Salesforce OA"
  },
  {
    "subject": "DBMS",
    "topic": "Indexing",
    "subtopic": "Index Cost on Writes",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What is the primary trade-off of adding multiple indexes to an OLTP database table?",
    "options": [
      "Accelerates SELECT query read speeds, but significantly slows down INSERT, UPDATE, and DELETE write throughput",
      "Increases network latency",
      "Causes automatic database restarts",
      "Disables transactions"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Every INSERT, DELETE, or key UPDATE must synchronously modify every corresponding B+ tree index structure on disk, adding write I/O overhead.",
    "tags": [
      "DBMS",
      "Indexing",
      "Databases",
      "SQL",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, University Database Exams",
    "placementRelevance": "Oracle, Microsoft, Amazon, Salesforce OA"
  },
  {
    "subject": "DBMS",
    "topic": "B+ Trees",
    "subtopic": "Leaf Node Structure",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What critical property distinguishes a B+ Tree from a standard B-Tree?",
    "options": [
      "In a B+ Tree, ALL data pointers/records reside exclusively in the leaf nodes, which are linked together in a bidirectional sequential linked list",
      "B+ Trees have binary branching factor (2 children)",
      "Internal nodes store actual table data in B+ Trees",
      "B+ Trees are unbalanced"
    ],
    "correctAnswerIndex": 0,
    "explanation": "B+ Trees store records exclusively at leaf nodes and link leaves sequentially, enabling rapid range scans without backtracking through internal nodes.",
    "tags": [
      "DBMS",
      "B+ Trees",
      "Databases",
      "SQL",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, University Database Exams",
    "placementRelevance": "Oracle, Microsoft, Amazon, Salesforce OA"
  },
  {
    "subject": "DBMS",
    "topic": "B+ Trees",
    "subtopic": "Fan-out & Height",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "Why do database storage engines prefer B+ Trees with high fan-out (order 100-500) over Binary Search Trees (fan-out 2)?",
    "options": [
      "High fan-out keeps tree height extremely low (typically 3-4 levels for millions of rows), minimizing expensive disk page I/O seeks",
      "B+ trees require no sorting",
      "Binary search trees cannot be stored on disk",
      "B+ trees use less RAM"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Disk seek operations are millisecond-scale bottlenecks. A B+ tree with fan-out 200 holds 8,000,000 rows in just 3 levels, requiring only 3 disk reads.",
    "tags": [
      "DBMS",
      "B+ Trees",
      "Databases",
      "SQL",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, University Database Exams",
    "placementRelevance": "Oracle, Microsoft, Amazon, Salesforce OA"
  },
  {
    "subject": "DBMS",
    "topic": "B+ Trees",
    "subtopic": "Node Split Condition",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "When inserting a key into a B+ Tree node of maximum order M that is already full (has M - 1 keys), what occurs?",
    "options": [
      "The node splits into two nodes of ceil((M-1)/2) keys, and the middle key is copied/promoted to the parent node",
      "The tree is rebuilt from scratch",
      "The oldest key is discarded",
      "An overflow bucket is created in RAM"
    ],
    "correctAnswerIndex": 0,
    "explanation": "B+ trees maintain balance dynamically by splitting overflowing nodes and promoting the middle key up to the parent level.",
    "tags": [
      "DBMS",
      "B+ Trees",
      "Databases",
      "SQL",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, University Database Exams",
    "placementRelevance": "Oracle, Microsoft, Amazon, Salesforce OA"
  },
  {
    "subject": "DBMS",
    "topic": "B+ Trees",
    "subtopic": "Minimum Node Occupancy",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "In a B+ Tree of order M, what is the minimum number of keys that any non-root internal node must contain?",
    "options": [
      "ceil(M / 2) - 1 keys",
      "M - 1 keys",
      "1 key",
      "M / 4 keys"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Standard B+ tree definition enforces that non-root nodes must remain at least half full: min keys = ceil(M / 2) - 1.",
    "tags": [
      "DBMS",
      "B+ Trees",
      "Databases",
      "SQL",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, University Database Exams",
    "placementRelevance": "Oracle, Microsoft, Amazon, Salesforce OA"
  },
  {
    "subject": "DBMS",
    "topic": "B+ Trees",
    "subtopic": "Range Scan Efficiency",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "How does a B+ Tree execute a range query like `WHERE age BETWEEN 20 AND 30` in optimal time?",
    "options": [
      "Traverses tree in O(log N) to find leaf node for 20, then follows sequential leaf linked list pointers until reaching 30",
      "Performs tree search from root for every integer between 20 and 30",
      "Scans the entire table sequentially",
      "Uses a separate hash table"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Because leaf nodes form a contiguous doubly-linked list sorted by key, a range query requires only one initial root-to-leaf seek followed by a flat linear scan.",
    "tags": [
      "DBMS",
      "B+ Trees",
      "Databases",
      "SQL",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, University Database Exams",
    "placementRelevance": "Oracle, Microsoft, Amazon, Salesforce OA"
  },
  {
    "subject": "DBMS",
    "topic": "B+ Trees",
    "subtopic": "Fill Factor in B+ Tree",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is the purpose of setting a B+ Tree index Fill Factor (e.g. 80%) during index creation?",
    "options": [
      "Leaves free space in data pages to accommodate future INSERTs without immediately triggering expensive page splits",
      "Compresses data on disk",
      "Limits memory usage of buffer pool",
      "Enforces non-null constraints"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Leaving 20% cushion space per page prevents immediate page splits when random keys are inserted, reducing disk fragmentation.",
    "tags": [
      "DBMS",
      "B+ Trees",
      "Databases",
      "SQL",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, University Database Exams",
    "placementRelevance": "Oracle, Microsoft, Amazon, Salesforce OA"
  },
  {
    "subject": "DBMS",
    "topic": "B+ Trees",
    "subtopic": "Search Time Complexity",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What is the worst-case time complexity to search for a key in a balanced B+ Tree holding N keys?",
    "options": [
      "O(log_M N) where M is node fan-out",
      "O(N)",
      "O(1)",
      "O(N log N)"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Because the tree height is log_M(N) and binary search inside a node takes log2(M), total search time is strictly logarithmic O(log N).",
    "tags": [
      "DBMS",
      "B+ Trees",
      "Databases",
      "SQL",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, University Database Exams",
    "placementRelevance": "Oracle, Microsoft, Amazon, Salesforce OA"
  },
  {
    "subject": "DBMS",
    "topic": "B+ Trees",
    "subtopic": "Root Node Split",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "Under what unique circumstance does the height of a B+ Tree increase by 1?",
    "options": [
      "When the ROOT node becomes full and splits, creating a new root with 2 children and 1 key",
      "When any leaf node splits",
      "When the table exceeds 1 GB",
      "When deletion occurs"
    ],
    "correctAnswerIndex": 0,
    "explanation": "B+ trees grow from the bottom up. Only when a split propagates all the way to the root does the root itself split, increasing tree height for all nodes uniformly.",
    "tags": [
      "DBMS",
      "B+ Trees",
      "Databases",
      "SQL",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, University Database Exams",
    "placementRelevance": "Oracle, Microsoft, Amazon, Salesforce OA"
  },
  {
    "subject": "DBMS",
    "topic": "ACID",
    "subtopic": "Atomicity Definition",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What does the 'Atomicity' property in ACID database transactions guarantee?",
    "options": [
      "All operations in the transaction succeed and commit completely, or all fail and the database rolls back to its pre-transaction state ('All or Nothing')",
      "Transactions run in parallel without conflict",
      "Data is encrypted in memory",
      "Database survives power outages"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Atomicity ensures transactions are indivisible units of work; any partial failure triggers a complete rollback.",
    "tags": [
      "DBMS",
      "ACID",
      "Databases",
      "SQL",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, University Database Exams",
    "placementRelevance": "Oracle, Microsoft, Amazon, Salesforce OA"
  },
  {
    "subject": "DBMS",
    "topic": "ACID",
    "subtopic": "Consistency Definition",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What does 'Consistency' in ACID ensure regarding database state?",
    "options": [
      "A transaction transforms the database from one valid state satisfying all schema rules, constraints, and triggers to another valid state",
      "All replicas update within 1 second",
      "No two queries run at the same time",
      "Memory matches disk byte for byte"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Consistency enforces that every transaction leaves all defined integrity constraints (foreign keys, check constraints, uniqueness) valid upon commit.",
    "tags": [
      "DBMS",
      "ACID",
      "Databases",
      "SQL",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, University Database Exams",
    "placementRelevance": "Oracle, Microsoft, Amazon, Salesforce OA"
  },
  {
    "subject": "DBMS",
    "topic": "ACID",
    "subtopic": "Isolation Definition",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What is the primary role of the 'Isolation' property in ACID?",
    "options": [
      "Prevents concurrent transactions from seeing each other's uncommitted or intermediate states",
      "Guarantees data is saved to solid state drives",
      "Replicates data to multiple regions",
      "Validates SQL syntax"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Isolation ensures concurrent transaction executions appear as if each had exclusive control of the entire database.",
    "tags": [
      "DBMS",
      "ACID",
      "Databases",
      "SQL",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, University Database Exams",
    "placementRelevance": "Oracle, Microsoft, Amazon, Salesforce OA"
  },
  {
    "subject": "DBMS",
    "topic": "ACID",
    "subtopic": "Durability Definition",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What does 'Durability' in ACID guarantee once a transaction commits?",
    "options": [
      "Its changes are permanently recorded in non-volatile storage and will survive subsequent system crashes or power failures",
      "Data can never be deleted by future queries",
      "The database runs with zero downtime",
      "RAM cache is never cleared"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Durability ensures committed updates persist on non-volatile media (via transaction log flushing / fsync).",
    "tags": [
      "DBMS",
      "ACID",
      "Databases",
      "SQL",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, University Database Exams",
    "placementRelevance": "Oracle, Microsoft, Amazon, Salesforce OA"
  },
  {
    "subject": "DBMS",
    "topic": "ACID",
    "subtopic": "Shadow Paging Technique",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "How does Shadow Paging achieve Atomicity and Durability without write-ahead logging?",
    "options": [
      "Maintains two page tables: current page table and shadow page table. On commit, the pointer to current page table atomically replaces the shadow pointer",
      "Duplicates entire hard drives",
      "Uses battery-backed RAM only",
      "Runs all queries twice"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Shadow paging writes modified pages to new disk blocks and updates the current page table; committing simply requires an atomic pointer swap to the new page table.",
    "tags": [
      "DBMS",
      "ACID",
      "Databases",
      "SQL",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, University Database Exams",
    "placementRelevance": "Oracle, Microsoft, Amazon, Salesforce OA"
  },
  {
    "subject": "DBMS",
    "topic": "ACID",
    "subtopic": "Two-Phase Commit (2PC)",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "In distributed database transactions across multiple independent nodes, what protocol guarantees Atomicity across all nodes?",
    "options": [
      "Two-Phase Commit Protocol (2PC: Prepare phase and Commit phase)",
      "Paxos Consensus only",
      "Raft Election",
      "Gossip Protocol"
    ],
    "correctAnswerIndex": 0,
    "explanation": "2PC uses a coordinator: Phase 1 (Prepare) asks all cohorts if they can commit; if all vote YES, Phase 2 instructs all cohorts to Commit; otherwise all abort.",
    "tags": [
      "DBMS",
      "ACID",
      "Databases",
      "SQL",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, University Database Exams",
    "placementRelevance": "Oracle, Microsoft, Amazon, Salesforce OA"
  },
  {
    "subject": "DBMS",
    "topic": "ACID",
    "subtopic": "Compensating Transactions",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "In distributed microservice architectures using the Saga pattern instead of 2PC, how is Atomicity achieved if step 4 fails?",
    "options": [
      "Executing Compensating Transactions in reverse order to semantically undo previously committed steps (e.g. refunding payment)",
      "Killing the database container",
      "Rolling back disk blocks remotely",
      "Using shared locks across HTTP requests"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Sagas cannot use ACID locks across distributed services; each completed local transaction has a matching compensating transaction that reverts its business effect.",
    "tags": [
      "DBMS",
      "ACID",
      "Databases",
      "SQL",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, University Database Exams",
    "placementRelevance": "Oracle, Microsoft, Amazon, Salesforce OA"
  },
  {
    "subject": "DBMS",
    "topic": "ACID",
    "subtopic": "fsync System Call",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "Why must database engines explicitly call `fsync()` on transaction logs to guarantee Durability?",
    "options": [
      "OS write() calls only write data into the kernel file system page cache; fsync() forces the physical disk controller to flush cache to non-volatile storage",
      "fsync encrypts the log file",
      "fsync verifies database syntax",
      "fsync releases table locks"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Without fsync, data buffered in volatile OS kernel page cache would be lost during an immediate power outage, violating ACID Durability.",
    "tags": [
      "DBMS",
      "ACID",
      "Databases",
      "SQL",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, University Database Exams",
    "placementRelevance": "Oracle, Microsoft, Amazon, Salesforce OA"
  },
  {
    "subject": "DBMS",
    "topic": "Recovery",
    "subtopic": "ARIES Recovery Algorithm",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "What are the three core phases of the industry-standard ARIES database recovery algorithm?",
    "options": [
      "Analysis Phase \u2192 Redo Phase (Repeating history) \u2192 Undo Phase (Rolling back active transactions)",
      "Scan Phase \u2192 Lock Phase \u2192 Flush Phase",
      "Read Phase \u2192 Validate Phase \u2192 Write Phase",
      "Backup Phase \u2192 Restore Phase \u2192 Reindex Phase"
    ],
    "correctAnswerIndex": 0,
    "explanation": "ARIES first analyzes the log to find dirty pages and active transactions, redoes all logged changes to repeat history up to the crash, and undos uncommitted transactions.",
    "tags": [
      "DBMS",
      "Recovery",
      "Databases",
      "SQL",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, University Database Exams",
    "placementRelevance": "Oracle, Microsoft, Amazon, Salesforce OA"
  },
  {
    "subject": "DBMS",
    "topic": "Recovery",
    "subtopic": "Checkpoints Purpose",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is the primary operational purpose of Checkpointing in database transaction log recovery?",
    "options": [
      "Flushes dirty pages to disk and records a known consistent checkpoint in the log, bounding how far back the log must be scanned during recovery",
      "Deletes all tables from disk",
      "Creates an offsite tape backup",
      "Terminates all active user connections"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Checkpoints limit recovery time: during crash recovery, the engine only needs to scan the log starting from the last valid checkpoint rather than from system inception.",
    "tags": [
      "DBMS",
      "Recovery",
      "Databases",
      "SQL",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, University Database Exams",
    "placementRelevance": "Oracle, Microsoft, Amazon, Salesforce OA"
  },
  {
    "subject": "DBMS",
    "topic": "Recovery",
    "subtopic": "Fuzzy Checkpointing",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "How does a Fuzzy Checkpoint avoid freezing high-throughput transaction processing during execution?",
    "options": [
      "Records the dirty page table and transaction table at checkpoint time without waiting for all dirty pages to finish flushing to disk",
      "Pauses all user queries for 10 seconds",
      "Writes checkpoint data to a temporary file",
      "Only runs during scheduled maintenance"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Fuzzy checkpointing does not block concurrent transactions; it logs current dirty page IDs and LSNs, allowing page flushing to occur asynchronously.",
    "tags": [
      "DBMS",
      "Recovery",
      "Databases",
      "SQL",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, University Database Exams",
    "placementRelevance": "Oracle, Microsoft, Amazon, Salesforce OA"
  },
  {
    "subject": "DBMS",
    "topic": "Recovery",
    "subtopic": "Log Sequence Number (LSN)",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is a Log Sequence Number (LSN) and how is it used on database data pages?",
    "options": [
      "A monotonically increasing 64-bit integer. Each data page stores the LSN of the most recent log record that updated it (PageLSN)",
      "The primary key of the table",
      "The thread ID of the writer",
      "The timestamp of table creation"
    ],
    "correctAnswerIndex": 0,
    "explanation": "PageLSN allows the recovery engine to determine whether a given logged change is already present on disk during the Redo phase, ensuring idempotency.",
    "tags": [
      "DBMS",
      "Recovery",
      "Databases",
      "SQL",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, University Database Exams",
    "placementRelevance": "Oracle, Microsoft, Amazon, Salesforce OA"
  },
  {
    "subject": "DBMS",
    "topic": "Recovery",
    "subtopic": "Idempotence in Recovery",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "Why MUST the REDO operation during database recovery be Idempotent?",
    "options": [
      "Executing the REDO operation multiple times (e.g. if a second crash occurs during recovery) must produce the exact same database state as executing it once",
      "It runs 10x faster",
      "It uses no RAM",
      "It avoids writing to log files"
    ],
    "correctAnswerIndex": 0,
    "explanation": "If the database crashes during recovery, the recovery process restarts. Idempotent redo guarantees re-executing logged actions does not corrupt data.",
    "tags": [
      "DBMS",
      "Recovery",
      "Databases",
      "SQL",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, University Database Exams",
    "placementRelevance": "Oracle, Microsoft, Amazon, Salesforce OA"
  },
  {
    "subject": "DBMS",
    "topic": "Recovery",
    "subtopic": "Steal / No-Force Policy",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "In database buffer management, what does the modern 'Steal / No-Force' policy mean?",
    "options": [
      "STEAL: buffer pool can flush an uncommitted transaction's dirty page to disk; NO-FORCE: a transaction can commit without immediately flushing its dirty data pages to disk",
      "Transactions can steal locks; forces all pages on commit",
      "Steal deletes pages; No-force disables logging",
      "Memory cannot be reclaimed"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Steal maximizes buffer pool efficiency (requires Undo logging for rollback); No-Force avoids random write disk bottlenecks on commit (requires Redo logging).",
    "tags": [
      "DBMS",
      "Recovery",
      "Databases",
      "SQL",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, University Database Exams",
    "placementRelevance": "Oracle, Microsoft, Amazon, Salesforce OA"
  },
  {
    "subject": "DBMS",
    "topic": "Recovery",
    "subtopic": "Compensation Log Record (CLR)",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "What is a Compensation Log Record (CLR) written during transaction undo/rollback in ARIES?",
    "options": [
      "A log record that logs the undo of an action so that undone actions are NEVER undone again if recovery restarts",
      "A record of financial transactions",
      "A checkpoint record",
      "A user audit log"
    ],
    "correctAnswerIndex": 0,
    "explanation": "CLRs prevent repeating undo work if a crash occurs mid-recovery; they contain an UndoneLSN pointer pointing to the next operation to undo.",
    "tags": [
      "DBMS",
      "Recovery",
      "Databases",
      "SQL",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, University Database Exams",
    "placementRelevance": "Oracle, Microsoft, Amazon, Salesforce OA"
  },
  {
    "subject": "DBMS",
    "topic": "Recovery",
    "subtopic": "Point-in-Time Recovery (PITR)",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "How is Point-in-Time Recovery (PITR) performed to recover a database after an accidental `DROP TABLE` command at 14:32:00?",
    "options": [
      "Restore the most recent full base backup, then replay archived write-ahead logs stopping strictly at 14:31:59",
      "Run an UNDROP statement from memory",
      "Restart the database server with safe flag",
      "Reinstall database software"
    ],
    "correctAnswerIndex": 0,
    "explanation": "PITR restores a snapshot base backup taken prior to the disaster, then rolls forward through archived WAL records up to the exact transaction timestamp before the accident.",
    "tags": [
      "DBMS",
      "Recovery",
      "Databases",
      "SQL",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, University Database Exams",
    "placementRelevance": "Oracle, Microsoft, Amazon, Salesforce OA"
  }
];
