// OOP Question Bank (108 Questions)
export const OOP_QUESTIONS = [
  {
    "subject": "OOP",
    "topic": "Classes",
    "subtopic": "Class Definition",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What is a Class in Object-Oriented Programming?",
    "options": [
      "A user-defined blueprint or prototype from which objects are instantiated, defining state (fields) and behavior (methods)",
      "An instance of an object stored in RAM",
      "A C-style struct with only public variables",
      "A dynamic array of pointers"
    ],
    "correctAnswerIndex": 0,
    "explanation": "A class represents the abstract type definition specifying the data attributes and executable methods that its instantiated objects will possess.",
    "tags": [
      "OOP",
      "Classes",
      "Object Oriented Programming",
      "Java",
      "C++",
      "GATE"
    ],
    "examRelevance": "GATE CS, Software Engineering & Architecture Exams",
    "placementRelevance": "Amazon, Microsoft, Adobe, Atlassian Technical Interview"
  },
  {
    "subject": "OOP",
    "topic": "Classes",
    "subtopic": "Static vs Instance Members",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What is the difference between a `static` member variable and an instance member variable in Java/C++?",
    "options": [
      "Static members belong to the class itself and are shared by all instances in a single memory location; instance members exist uniquely per object",
      "Static variables cannot be modified",
      "Instance variables are stored in CPU registers",
      "Static variables must be private"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Only one copy of a static member exists in the class metadata space, shared across all instantiated objects of that class.",
    "tags": [
      "OOP",
      "Classes",
      "Object Oriented Programming",
      "Java",
      "C++",
      "GATE"
    ],
    "examRelevance": "GATE CS, Software Engineering & Architecture Exams",
    "placementRelevance": "Amazon, Microsoft, Adobe, Atlassian Technical Interview"
  },
  {
    "subject": "OOP",
    "topic": "Classes",
    "subtopic": "Constructors",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What is the primary purpose of a Constructor method in a class?",
    "options": [
      "To initialize the state of newly allocated objects and allocate necessary internal resources at instantiation time",
      "To destroy objects when out of scope",
      "To return a boolean indicating creation status",
      "To convert objects to JSON"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Constructors execute automatically during object instantiation (e.g. `new Class()`) to initialize field values into a valid initial state.",
    "tags": [
      "OOP",
      "Classes",
      "Object Oriented Programming",
      "Java",
      "C++",
      "GATE"
    ],
    "examRelevance": "GATE CS, Software Engineering & Architecture Exams",
    "placementRelevance": "Amazon, Microsoft, Adobe, Atlassian Technical Interview"
  },
  {
    "subject": "OOP",
    "topic": "Classes",
    "subtopic": "Default Constructor",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "In Java and C++, when does the compiler automatically provide a no-argument Default Constructor?",
    "options": [
      "Only when the developer defines ZERO explicit constructors in the class",
      "Always, regardless of defined constructors",
      "Only if all fields are public",
      "Only for abstract classes"
    ],
    "correctAnswerIndex": 0,
    "explanation": "If any parameterized constructor is explicitly declared, the compiler suppresses the generation of the automatic default no-arg constructor.",
    "tags": [
      "OOP",
      "Classes",
      "Object Oriented Programming",
      "Java",
      "C++",
      "GATE"
    ],
    "examRelevance": "GATE CS, Software Engineering & Architecture Exams",
    "placementRelevance": "Amazon, Microsoft, Adobe, Atlassian Technical Interview"
  },
  {
    "subject": "OOP",
    "topic": "Classes",
    "subtopic": "Copy Constructor in C++",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is the purpose of a Copy Constructor in C++ (e.g. `MyClass(const MyClass &other)`)?",
    "options": [
      "To initialize a new object as an exact deep copy of an existing object, preventing shallow pointer aliasing and double-free errors",
      "To copy code into ROM",
      "To instantiate a subclass",
      "To duplicate threads"
    ],
    "correctAnswerIndex": 0,
    "explanation": "A copy constructor defines how resources (like dynamically allocated heap pointers) are duplicated when passing objects by value or copying.",
    "tags": [
      "OOP",
      "Classes",
      "Object Oriented Programming",
      "Java",
      "C++",
      "GATE"
    ],
    "examRelevance": "GATE CS, Software Engineering & Architecture Exams",
    "placementRelevance": "Amazon, Microsoft, Adobe, Atlassian Technical Interview"
  },
  {
    "subject": "OOP",
    "topic": "Classes",
    "subtopic": "Destructors and RAII",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "In C++, how does the RAII (Resource Acquisition Is Initialization) idiom utilize Destructors?",
    "options": [
      "Resources (file handles, memory, mutexes) acquired in constructor are automatically released in the destructor when the object leaves scope",
      "Destructors prevent garbage collection",
      "Destructors reboot the operating system",
      "RAII replaces constructors with malloc()"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Stack-allocated object destructors execute deterministically when unwinding scopes, guaranteeing zero resource leaks even during exceptions.",
    "tags": [
      "OOP",
      "Classes",
      "Object Oriented Programming",
      "Java",
      "C++",
      "GATE"
    ],
    "examRelevance": "GATE CS, Software Engineering & Architecture Exams",
    "placementRelevance": "Amazon, Microsoft, Adobe, Atlassian Technical Interview"
  },
  {
    "subject": "OOP",
    "topic": "Classes",
    "subtopic": "Inner Classes vs Static Nested Classes",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "In Java, what is the key difference between a non-static Inner Class and a Static Nested Class?",
    "options": [
      "A non-static inner class holds an implicit hidden reference to the enclosing outer class instance; a static nested class does not",
      "Static nested classes cannot have methods",
      "Inner classes cannot access outer class private fields",
      "They are identical"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Non-static inner classes require an active outer instance and can leak outer class memory; static nested classes are standalone namespaces.",
    "tags": [
      "OOP",
      "Classes",
      "Object Oriented Programming",
      "Java",
      "C++",
      "GATE"
    ],
    "examRelevance": "GATE CS, Software Engineering & Architecture Exams",
    "placementRelevance": "Amazon, Microsoft, Adobe, Atlassian Technical Interview"
  },
  {
    "subject": "OOP",
    "topic": "Classes",
    "subtopic": "Final / Sealed Classes",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What effect does declaring a class as `final` (Java) or `sealed` (C#) have?",
    "options": [
      "The class cannot be extended / subclassed by any other class",
      "The class fields are immutable",
      "The class cannot be instantiated",
      "The class methods are private"
    ],
    "correctAnswerIndex": 0,
    "explanation": "`final` prohibits inheritance, protecting critical system classes (like `java.lang.String`) from subclass tampering or behavior overriding.",
    "tags": [
      "OOP",
      "Classes",
      "Object Oriented Programming",
      "Java",
      "C++",
      "GATE"
    ],
    "examRelevance": "GATE CS, Software Engineering & Architecture Exams",
    "placementRelevance": "Amazon, Microsoft, Adobe, Atlassian Technical Interview"
  },
  {
    "subject": "OOP",
    "topic": "Classes",
    "subtopic": "Singleton Class Implementation",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "How is a Thread-Safe Singleton Class created with Double-Checked Locking in Java?",
    "options": [
      "Private constructor, private volatile static instance variable, and synchronized block inside getInstance() after checking instance == null",
      "Public constructor with synchronized keyword",
      "Using an interface with static methods",
      "Marking all class fields static"
    ],
    "correctAnswerIndex": 0,
    "explanation": "`volatile` prevents CPU instruction reordering during instantiation, and double-checked locking avoids synchronizing on every subsequent read.",
    "tags": [
      "OOP",
      "Classes",
      "Object Oriented Programming",
      "Java",
      "C++",
      "GATE"
    ],
    "examRelevance": "GATE CS, Software Engineering & Architecture Exams",
    "placementRelevance": "Amazon, Microsoft, Adobe, Atlassian Technical Interview"
  },
  {
    "subject": "OOP",
    "topic": "Classes",
    "subtopic": "Class vs Struct in C++",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "In modern C++, what is the ONLY syntactic difference between a `class` and a `struct`?",
    "options": [
      "Members and base inheritance are `private` by default in a `class`, and `public` by default in a `struct`",
      "Structs cannot have member methods in C++",
      "Classes are allocated on heap; structs on stack",
      "Classes support polymorphism; structs do not"
    ],
    "correctAnswerIndex": 0,
    "explanation": "In C++, a struct is a full class in every feature (can have constructors, methods, virtual functions, inheritance); only default access is public.",
    "tags": [
      "OOP",
      "Classes",
      "Object Oriented Programming",
      "Java",
      "C++",
      "GATE"
    ],
    "examRelevance": "GATE CS, Software Engineering & Architecture Exams",
    "placementRelevance": "Amazon, Microsoft, Adobe, Atlassian Technical Interview"
  },
  {
    "subject": "OOP",
    "topic": "Classes",
    "subtopic": "Anonymous Classes",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is an Anonymous Class in Java?",
    "options": [
      "An inner class declared and instantiated in a single expression without a formal class name, typically implementing an interface or abstract class",
      "A class with no methods",
      "A class that cannot be loaded",
      "A class without fields"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Anonymous classes enable concise ad-hoc event listeners and callbacks, largely superseded by lambda expressions in Java 8+.",
    "tags": [
      "OOP",
      "Classes",
      "Object Oriented Programming",
      "Java",
      "C++",
      "GATE"
    ],
    "examRelevance": "GATE CS, Software Engineering & Architecture Exams",
    "placementRelevance": "Amazon, Microsoft, Adobe, Atlassian Technical Interview"
  },
  {
    "subject": "OOP",
    "topic": "Classes",
    "subtopic": "Virtual Destructors",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "Why MUST a C++ base class declare a `virtual` destructor if it contains virtual methods and is deleted via base pointer `Base* ptr = new Derived(); delete ptr;`?",
    "options": [
      "Without a virtual destructor, only the Base destructor executes, causing undefined behavior and resource leaks in the Derived subclass",
      "Derived classes cannot have destructors",
      "C++ prohibits deleting base pointers",
      "Virtual destructors make objects immutable"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Virtual dispatch in destructors ensures the destructor of the actual runtime object (Derived) executes first, followed by Base.",
    "tags": [
      "OOP",
      "Classes",
      "Object Oriented Programming",
      "Java",
      "C++",
      "GATE"
    ],
    "examRelevance": "GATE CS, Software Engineering & Architecture Exams",
    "placementRelevance": "Amazon, Microsoft, Adobe, Atlassian Technical Interview"
  },
  {
    "subject": "OOP",
    "topic": "Objects",
    "subtopic": "Object vs Class",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What is the relationship between an Object and a Class in object-oriented programming?",
    "options": [
      "An Object is a concrete, tangible runtime instance of a Class allocated in memory with distinct state",
      "An object is the source code file",
      "A class is an object with static methods",
      "They occupy identical memory spaces"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Classes define types; objects are concrete entities created at runtime residing on the heap with concrete field values.",
    "tags": [
      "OOP",
      "Objects",
      "Object Oriented Programming",
      "Java",
      "C++",
      "GATE"
    ],
    "examRelevance": "GATE CS, Software Engineering & Architecture Exams",
    "placementRelevance": "Amazon, Microsoft, Adobe, Atlassian Technical Interview"
  },
  {
    "subject": "OOP",
    "topic": "Objects",
    "subtopic": "Object Identity vs Equality",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What is the difference between Object Identity (`==` in Java) and Object Equality (`equals()` in Java)?",
    "options": [
      "Identity checks if two references point to the exact same memory address; Equality checks if the semantic state/values of the objects are equivalent",
      "Identity compares hash codes",
      "Equality is computed in CPU registers",
      "They are always identical"
    ],
    "correctAnswerIndex": 0,
    "explanation": "`==` tests reference pointer equivalence; `.equals()` is an overridable method that inspects logical field equality (e.g. String contents).",
    "tags": [
      "OOP",
      "Objects",
      "Object Oriented Programming",
      "Java",
      "C++",
      "GATE"
    ],
    "examRelevance": "GATE CS, Software Engineering & Architecture Exams",
    "placementRelevance": "Amazon, Microsoft, Adobe, Atlassian Technical Interview"
  },
  {
    "subject": "OOP",
    "topic": "Objects",
    "subtopic": "hashCode() and equals() Contract",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is the mandatory contract between `equals()` and `hashCode()` in Java?",
    "options": [
      "If two objects are equal according to equals(), they MUST return the exact same integer from hashCode()",
      "If hash codes are equal, objects must be equal",
      "hashCode() must return unique integers for all objects",
      "equals() must never return false"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Hash-based collections (HashMap/HashSet) use hashCode() to find bucket; if equal objects have different hashes, lookups fail.",
    "tags": [
      "OOP",
      "Objects",
      "Object Oriented Programming",
      "Java",
      "C++",
      "GATE"
    ],
    "examRelevance": "GATE CS, Software Engineering & Architecture Exams",
    "placementRelevance": "Amazon, Microsoft, Adobe, Atlassian Technical Interview"
  },
  {
    "subject": "OOP",
    "topic": "Objects",
    "subtopic": "Object Lifecycle in Java",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What are the sequential phases of an object lifecycle in garbage-collected runtimes like Java?",
    "options": [
      "Creation (instantiation/constructor) \u2192 In-Use (reachable) \u2192 Unreachable \u2192 Finalization (if any) \u2192 Deallocation (Garbage Collection)",
      "Loaded \u2192 Linked \u2192 Initialized \u2192 Destroyed",
      "Malloc \u2192 Free \u2192 Purge",
      "Allocated \u2192 Cached \u2192 Swapped"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Objects exist as long as they are reachable from GC Roots (stack frames, static fields); when unreachable, the garbage collector reclaims their memory.",
    "tags": [
      "OOP",
      "Objects",
      "Object Oriented Programming",
      "Java",
      "C++",
      "GATE"
    ],
    "examRelevance": "GATE CS, Software Engineering & Architecture Exams",
    "placementRelevance": "Amazon, Microsoft, Adobe, Atlassian Technical Interview"
  },
  {
    "subject": "OOP",
    "topic": "Objects",
    "subtopic": "Immutable Objects",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What are the characteristics of an Immutable Object (such as Java's `String` or Python's `tuple`)?",
    "options": [
      "Its internal state cannot be modified after creation; all fields are final/private, no setters exist, and methods return new instances",
      "It is stored in read-only hardware ROM",
      "It cannot be passed to methods",
      "It cannot have methods"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Immutable objects are inherently thread-safe, eliminate defensive copying, and can be safely shared across concurrent execution contexts.",
    "tags": [
      "OOP",
      "Objects",
      "Object Oriented Programming",
      "Java",
      "C++",
      "GATE"
    ],
    "examRelevance": "GATE CS, Software Engineering & Architecture Exams",
    "placementRelevance": "Amazon, Microsoft, Adobe, Atlassian Technical Interview"
  },
  {
    "subject": "OOP",
    "topic": "Objects",
    "subtopic": "Shallow Copy vs Deep Copy",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is the difference between a Shallow Copy and a Deep Copy of an object graph?",
    "options": [
      "A Shallow Copy duplicates the root object but copies references to nested objects; a Deep Copy recursively duplicates all referenced child objects",
      "Deep copy is faster",
      "Shallow copy creates two processes",
      "Deep copy only copies primitive numbers"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Mutating a nested object through a shallow copy mutates the original; deep copies create completely isolated clones of the entire object tree.",
    "tags": [
      "OOP",
      "Objects",
      "Object Oriented Programming",
      "Java",
      "C++",
      "GATE"
    ],
    "examRelevance": "GATE CS, Software Engineering & Architecture Exams",
    "placementRelevance": "Amazon, Microsoft, Adobe, Atlassian Technical Interview"
  },
  {
    "subject": "OOP",
    "topic": "Objects",
    "subtopic": "Garbage Collection Roots",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "In tracing garbage collection (Mark-and-Sweep), which of the following is considered a GC Root?",
    "options": [
      "Local variables in active thread stack frames, JNI pointers, and static class variables",
      "All objects in the old generation",
      "Unreferenced heap memory",
      "Weak references"
    ],
    "correctAnswerIndex": 0,
    "explanation": "A GC root is an object directly accessible outside the heap. Tracing traverses references outward from roots to find all reachable objects.",
    "tags": [
      "OOP",
      "Objects",
      "Object Oriented Programming",
      "Java",
      "C++",
      "GATE"
    ],
    "examRelevance": "GATE CS, Software Engineering & Architecture Exams",
    "placementRelevance": "Amazon, Microsoft, Adobe, Atlassian Technical Interview"
  },
  {
    "subject": "OOP",
    "topic": "Objects",
    "subtopic": "Weak vs Soft References",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "In Java reference types, when does the garbage collector reclaim an object referenced ONLY by a WeakReference?",
    "options": [
      "Eagerly, during the very next garbage collection cycle, regardless of available memory",
      "Only when an OutOfMemoryError is imminent",
      "Never, weak references prevent GC",
      "After 10 minutes"
    ],
    "correctAnswerIndex": 0,
    "explanation": "SoftReferences are cleared only when memory is low (ideal for caches); WeakReferences are cleared eagerly on the next GC run (ideal for WeakHashMaps).",
    "tags": [
      "OOP",
      "Objects",
      "Object Oriented Programming",
      "Java",
      "C++",
      "GATE"
    ],
    "examRelevance": "GATE CS, Software Engineering & Architecture Exams",
    "placementRelevance": "Amazon, Microsoft, Adobe, Atlassian Technical Interview"
  },
  {
    "subject": "OOP",
    "topic": "Objects",
    "subtopic": "Memory Layout of an Object",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "In 64-bit HotSpot JVM, what components make up the memory overhead of every object header (mark word + klass word)?",
    "options": [
      "12 to 16 bytes: Mark Word (hash, GC age, lock state) + Klass Word (metadata pointer) + padding to 8-byte alignment",
      "Zero bytes",
      "64 bytes",
      "4 bytes"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Every Java object has a 64-bit Mark Word and a Klass Word (32-bit with compressed OOPs or 64-bit), followed by instance fields and alignment padding.",
    "tags": [
      "OOP",
      "Objects",
      "Object Oriented Programming",
      "Java",
      "C++",
      "GATE"
    ],
    "examRelevance": "GATE CS, Software Engineering & Architecture Exams",
    "placementRelevance": "Amazon, Microsoft, Adobe, Atlassian Technical Interview"
  },
  {
    "subject": "OOP",
    "topic": "Objects",
    "subtopic": "Flyweight Pattern for Object Sharing",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "How does Java's `Integer.valueOf(int)` utilize the Flyweight pattern?",
    "options": [
      "Caches pre-instantiated Integer objects for values between -128 and 127 in an array, returning existing instances to conserve memory",
      "Allocates memory on stack",
      "Creates new Integer every time",
      "Converts integers to strings"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Autoboxing calls `valueOf()`; caching values in [-128, 127] avoids millions of redundant small object allocations.",
    "tags": [
      "OOP",
      "Objects",
      "Object Oriented Programming",
      "Java",
      "C++",
      "GATE"
    ],
    "examRelevance": "GATE CS, Software Engineering & Architecture Exams",
    "placementRelevance": "Amazon, Microsoft, Adobe, Atlassian Technical Interview"
  },
  {
    "subject": "OOP",
    "topic": "Objects",
    "subtopic": "Defensive Copying",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "Why should getters for mutable fields in an immutable class perform Defensive Copying (e.g. `return new Date(this.date.getTime())`)?",
    "options": [
      "Returning direct reference to a mutable internal object allows callers to modify private state from the outside",
      "To make code run faster",
      "To satisfy the compiler",
      "Because Java does not allow returning pointers"
    ],
    "correctAnswerIndex": 0,
    "explanation": "If an immutable class returns a direct reference to an internal mutable Date or List, external code can call `date.setTime()` or `list.clear()`, breaking immutability.",
    "tags": [
      "OOP",
      "Objects",
      "Object Oriented Programming",
      "Java",
      "C++",
      "GATE"
    ],
    "examRelevance": "GATE CS, Software Engineering & Architecture Exams",
    "placementRelevance": "Amazon, Microsoft, Adobe, Atlassian Technical Interview"
  },
  {
    "subject": "OOP",
    "topic": "Objects",
    "subtopic": "finalize() Deprecation",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "Why was the `Object.finalize()` method officially deprecated in Java 9+ and replaced with `AutoCloseable` / `Cleaner`?",
    "options": [
      "Finalizers introduce unpredictable execution timing, severe performance penalties, zombie object resurrection, and potential deadlocks",
      "It was never supported by JVM",
      "It corrupted RAM",
      "It was only for C++"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Finalization delays GC, has no guaranteed execution time, swallows exceptions, and can resurrect dead objects; try-with-resources provides deterministic cleanup.",
    "tags": [
      "OOP",
      "Objects",
      "Object Oriented Programming",
      "Java",
      "C++",
      "GATE"
    ],
    "examRelevance": "GATE CS, Software Engineering & Architecture Exams",
    "placementRelevance": "Amazon, Microsoft, Adobe, Atlassian Technical Interview"
  },
  {
    "subject": "OOP",
    "topic": "Inheritance",
    "subtopic": "Inheritance Definition",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What is the primary relationship modeled by class Inheritance in Object-Oriented Programming?",
    "options": [
      "An 'IS-A' relationship (e.g. Dog IS-A Animal) where subclass inherits state and behavior from superclass",
      "A 'HAS-A' relationship",
      "A 'USES-A' relationship",
      "A 'PART-OF' relationship"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Inheritance establishes an IS-A taxonomic relationship enabling code reuse and subtyping polymorphism.",
    "tags": [
      "OOP",
      "Inheritance",
      "Object Oriented Programming",
      "Java",
      "C++",
      "GATE"
    ],
    "examRelevance": "GATE CS, Software Engineering & Architecture Exams",
    "placementRelevance": "Amazon, Microsoft, Adobe, Atlassian Technical Interview"
  },
  {
    "subject": "OOP",
    "topic": "Inheritance",
    "subtopic": "Diamond Problem in C++",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is the 'Diamond Problem' in multiple inheritance, and how does C++ resolve it?",
    "options": [
      "Ambiguity when class D inherits from B and C, both inheriting from A; resolved using `virtual` base inheritance (`class B : virtual public A`)",
      "A memory leak in diamond shaped objects",
      "When a class has 4 base classes",
      "Resolved by deleting class A"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Virtual inheritance ensures only a single shared instance of base class A is included in the most derived class D, eliminating member ambiguity.",
    "tags": [
      "OOP",
      "Inheritance",
      "Object Oriented Programming",
      "Java",
      "C++",
      "GATE"
    ],
    "examRelevance": "GATE CS, Software Engineering & Architecture Exams",
    "placementRelevance": "Amazon, Microsoft, Adobe, Atlassian Technical Interview"
  },
  {
    "subject": "OOP",
    "topic": "Inheritance",
    "subtopic": "Why Java Disallows Multiple Class Inheritance",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "Why does Java prohibit multiple inheritance of Classes (allowing `extends` on only one class)?",
    "options": [
      "To eliminate method name collision ambiguities and the complexities of the Diamond Problem, favoring single inheritance + multiple interfaces",
      "Because Java bytecodes cannot support multiple pointers",
      "To make compiled JARs smaller",
      "Because C++ never allowed it"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Java designers deliberately avoided C++ multiple inheritance pitfalls; a class can extend only one superclass, but implement unlimited interfaces.",
    "tags": [
      "OOP",
      "Inheritance",
      "Object Oriented Programming",
      "Java",
      "C++",
      "GATE"
    ],
    "examRelevance": "GATE CS, Software Engineering & Architecture Exams",
    "placementRelevance": "Amazon, Microsoft, Adobe, Atlassian Technical Interview"
  },
  {
    "subject": "OOP",
    "topic": "Inheritance",
    "subtopic": "Composition vs Inheritance",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "Why does the Gang of Four (GoF) principle state 'Favor object composition over class inheritance'?",
    "options": [
      "Composition provides loose coupling, can be changed dynamically at runtime, and does not expose internal superclass implementation details",
      "Inheritance uses more RAM",
      "Composition runs faster on multi-core CPUs",
      "Inheritance is deprecated in modern languages"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Inheritance breaks encapsulation ('white-box reuse') and creates tight coupling; composition ('black-box HAS-A') allows swapping behaviors at runtime.",
    "tags": [
      "OOP",
      "Inheritance",
      "Object Oriented Programming",
      "Java",
      "C++",
      "GATE"
    ],
    "examRelevance": "GATE CS, Software Engineering & Architecture Exams",
    "placementRelevance": "Amazon, Microsoft, Adobe, Atlassian Technical Interview"
  },
  {
    "subject": "OOP",
    "topic": "Inheritance",
    "subtopic": "super Keyword in Java",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What is the role of the `super` keyword in Java subclasses?",
    "options": [
      "References the immediate parent class, used to invoke superclass constructors (`super()`) or overridden superclass methods (`super.method()`)",
      "Instantiates a superuser thread",
      "Deletes the parent class",
      "Converts subclass to parent class"
    ],
    "correctAnswerIndex": 0,
    "explanation": "`super(...)` calls the parent constructor (must be the first statement in subclass constructor) and accesses overridden parent methods.",
    "tags": [
      "OOP",
      "Inheritance",
      "Object Oriented Programming",
      "Java",
      "C++",
      "GATE"
    ],
    "examRelevance": "GATE CS, Software Engineering & Architecture Exams",
    "placementRelevance": "Amazon, Microsoft, Adobe, Atlassian Technical Interview"
  },
  {
    "subject": "OOP",
    "topic": "Inheritance",
    "subtopic": "Covariant Return Types",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What are Covariant Return Types in method overriding (supported in C++ and Java 5+)?",
    "options": [
      "An overriding method in a subclass is permitted to return a narrower (more specific subclass) type than the return type declared in the superclass",
      "Overriding methods can return completely unrelated types",
      "Return types must be void",
      "Return types must be generic"
    ],
    "correctAnswerIndex": 0,
    "explanation": "If superclass method returns `Number`, the overriding subclass method can return `Integer`; this is type-safe and eliminates client-side casting.",
    "tags": [
      "OOP",
      "Inheritance",
      "Object Oriented Programming",
      "Java",
      "C++",
      "GATE"
    ],
    "examRelevance": "GATE CS, Software Engineering & Architecture Exams",
    "placementRelevance": "Amazon, Microsoft, Adobe, Atlassian Technical Interview"
  },
  {
    "subject": "OOP",
    "topic": "Inheritance",
    "subtopic": "Method Overriding Rules",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "Which constraint must be respected when overriding a method in a subclass?",
    "options": [
      "The overriding method cannot have more restrictive access privileges (e.g. cannot change public to private) and cannot throw broader checked exceptions",
      "Must have different parameter types",
      "Must be static",
      "Must return void"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Liskov substitution requires the subclass to fulfill the superclass contract; restricting visibility or throwing unexpected broader exceptions violates subtyping.",
    "tags": [
      "OOP",
      "Inheritance",
      "Object Oriented Programming",
      "Java",
      "C++",
      "GATE"
    ],
    "examRelevance": "GATE CS, Software Engineering & Architecture Exams",
    "placementRelevance": "Amazon, Microsoft, Adobe, Atlassian Technical Interview"
  },
  {
    "subject": "OOP",
    "topic": "Inheritance",
    "subtopic": "Abstract Classes vs Interfaces",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What is a primary distinction between an Abstract Class and an Interface in Java?",
    "options": [
      "An abstract class can hold instance state (non-static mutable fields) and constructors; an interface cannot hold instance state",
      "Interfaces can have constructors",
      "Abstract classes support multiple inheritance",
      "Interfaces cannot have default methods"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Abstract classes can maintain instance variables and constructor state initialization; interfaces define behavioral contracts.",
    "tags": [
      "OOP",
      "Inheritance",
      "Object Oriented Programming",
      "Java",
      "C++",
      "GATE"
    ],
    "examRelevance": "GATE CS, Software Engineering & Architecture Exams",
    "placementRelevance": "Amazon, Microsoft, Adobe, Atlassian Technical Interview"
  },
  {
    "subject": "OOP",
    "topic": "Inheritance",
    "subtopic": "Object Slicing in C++",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "What is 'Object Slicing' in C++?",
    "options": [
      "Assigning a Derived class object to a Base class object by value, causing all Derived-specific member variables and methods to be chopped off/lost",
      "Dividing an object across two CPU threads",
      "Memory corruption during delete",
      "Converting an array to a vector"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Passing objects by value copies only `sizeof(Base)` bytes into the destination object, stripping away Derived members and vtable pointer.",
    "tags": [
      "OOP",
      "Inheritance",
      "Object Oriented Programming",
      "Java",
      "C++",
      "GATE"
    ],
    "examRelevance": "GATE CS, Software Engineering & Architecture Exams",
    "placementRelevance": "Amazon, Microsoft, Adobe, Atlassian Technical Interview"
  },
  {
    "subject": "OOP",
    "topic": "Inheritance",
    "subtopic": "Protected Access Modifier",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What does the `protected` access specifier allow in object-oriented class hierarchies?",
    "options": [
      "Accessibility to the declaring class, its subclasses, and (in Java) classes within the same package",
      "Accessible to all classes worldwide",
      "Accessible only to static methods",
      "Accessible to no one"
    ],
    "correctAnswerIndex": 0,
    "explanation": "`protected` exposes implementation details to subclasses for inheritance specialization while shielding them from general public callers.",
    "tags": [
      "OOP",
      "Inheritance",
      "Object Oriented Programming",
      "Java",
      "C++",
      "GATE"
    ],
    "examRelevance": "GATE CS, Software Engineering & Architecture Exams",
    "placementRelevance": "Amazon, Microsoft, Adobe, Atlassian Technical Interview"
  },
  {
    "subject": "OOP",
    "topic": "Inheritance",
    "subtopic": "Upcasting vs Downcasting",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is the difference between Upcasting and Downcasting in an inheritance hierarchy?",
    "options": [
      "Upcasting treats a subclass as superclass (always safe, implicit); Downcasting casts a superclass reference to a subclass (requires explicit runtime check)",
      "Downcasting is always safe",
      "Upcasting requires instanceof",
      "Upcasting creates a new object in memory"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Every Dog IS-AN Animal (upcast is unconditionally safe); an Animal might not be a Dog, so downcasting requires runtime type checking (`ClassCastException`).",
    "tags": [
      "OOP",
      "Inheritance",
      "Object Oriented Programming",
      "Java",
      "C++",
      "GATE"
    ],
    "examRelevance": "GATE CS, Software Engineering & Architecture Exams",
    "placementRelevance": "Amazon, Microsoft, Adobe, Atlassian Technical Interview"
  },
  {
    "subject": "OOP",
    "topic": "Inheritance",
    "subtopic": "Fragile Base Class Problem",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "What is the 'Fragile Base Class' problem in object-oriented architecture?",
    "options": [
      "Seemingly safe modifications to a base class can inadvertently break the behavior or invariants of subclasses without compilation warnings",
      "Base classes crashing on null pointers",
      "Memory corruption in root classes",
      "When a class has more than 5 subclasses"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Subclasses tightly depend on the internal implementation details of superclass methods; altering internal calling conventions breaks derived classes.",
    "tags": [
      "OOP",
      "Inheritance",
      "Object Oriented Programming",
      "Java",
      "C++",
      "GATE"
    ],
    "examRelevance": "GATE CS, Software Engineering & Architecture Exams",
    "placementRelevance": "Amazon, Microsoft, Adobe, Atlassian Technical Interview"
  },
  {
    "subject": "OOP",
    "topic": "Polymorphism",
    "subtopic": "Compile-Time vs Runtime Polymorphism",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What distinguishes Compile-Time (Static) Polymorphism from Runtime (Dynamic) Polymorphism?",
    "options": [
      "Compile-Time is resolved via Method Overloading / Templates at compile time; Runtime is resolved via Method Overriding using dynamic dispatch (vtable)",
      "Runtime polymorphism runs faster",
      "Compile-time polymorphism requires abstract classes",
      "They are identical in C++"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Overloading chooses method signature during compilation based on static types; overriding resolves method execution at runtime based on the actual object instance.",
    "tags": [
      "OOP",
      "Polymorphism",
      "Object Oriented Programming",
      "Java",
      "C++",
      "GATE"
    ],
    "examRelevance": "GATE CS, Software Engineering & Architecture Exams",
    "placementRelevance": "Amazon, Microsoft, Adobe, Atlassian Technical Interview"
  },
  {
    "subject": "OOP",
    "topic": "Polymorphism",
    "subtopic": "Virtual Method Table (vtable)",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "How does C++ and JVM implement Dynamic Method Dispatch for virtual methods?",
    "options": [
      "Each class with virtual methods has a vtable of function pointers; each object contains a hidden pointer (vptr) pointing to its class vtable",
      "Using hash maps in memory for every method call",
      "By recompiling code at runtime",
      "Using switch-case statements in hardware"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Calling `ptr->method()` dereferences the object's vptr to reach the class vtable, indexing the method slot to jump to the actual function in O(1) time.",
    "tags": [
      "OOP",
      "Polymorphism",
      "Object Oriented Programming",
      "Java",
      "C++",
      "GATE"
    ],
    "examRelevance": "GATE CS, Software Engineering & Architecture Exams",
    "placementRelevance": "Amazon, Microsoft, Adobe, Atlassian Technical Interview"
  },
  {
    "subject": "OOP",
    "topic": "Polymorphism",
    "subtopic": "Method Overloading Rules",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "In Java/C++, two methods in the same class are valid Overloads if they have the same name and:",
    "options": [
      "Different parameter lists (number, types, or order of parameters)",
      "Different return types only",
      "Different access modifiers only",
      "Different thrown exceptions only"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Method signature consists of method name and parameter types. Changing return type alone is NOT sufficient for overloading and produces a compiler error.",
    "tags": [
      "OOP",
      "Polymorphism",
      "Object Oriented Programming",
      "Java",
      "C++",
      "GATE"
    ],
    "examRelevance": "GATE CS, Software Engineering & Architecture Exams",
    "placementRelevance": "Amazon, Microsoft, Adobe, Atlassian Technical Interview"
  },
  {
    "subject": "OOP",
    "topic": "Polymorphism",
    "subtopic": "Dynamic Dispatch Example",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "Given `Animal a = new Dog(); a.makeSound();` where `makeSound()` is overridden in `Dog`, which method executes?",
    "options": [
      "The `Dog` class implementation of `makeSound()`",
      "The `Animal` class implementation",
      "A compilation error occurs",
      "Both methods execute sequentially"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Dynamic dispatch executes the method corresponding to the actual runtime instance on the heap (`Dog`), not the static reference variable type (`Animal`).",
    "tags": [
      "OOP",
      "Polymorphism",
      "Object Oriented Programming",
      "Java",
      "C++",
      "GATE"
    ],
    "examRelevance": "GATE CS, Software Engineering & Architecture Exams",
    "placementRelevance": "Amazon, Microsoft, Adobe, Atlassian Technical Interview"
  },
  {
    "subject": "OOP",
    "topic": "Polymorphism",
    "subtopic": "Static Method Hiding vs Overriding",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What happens if a subclass defines a static method with identical signature to a static method in its superclass?",
    "options": [
      "Method Hiding (not overriding): the method called depends strictly on the compile-time static reference type, not runtime object",
      "Dynamic polymorphism executes the subclass method",
      "A compiler error occurs",
      "The superclass method is deleted"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Static methods are bound at compile-time to class types. They do not participate in virtual table dynamic dispatch.",
    "tags": [
      "OOP",
      "Polymorphism",
      "Object Oriented Programming",
      "Java",
      "C++",
      "GATE"
    ],
    "examRelevance": "GATE CS, Software Engineering & Architecture Exams",
    "placementRelevance": "Amazon, Microsoft, Adobe, Atlassian Technical Interview"
  },
  {
    "subject": "OOP",
    "topic": "Polymorphism",
    "subtopic": "Pure Virtual Functions & Abstract Classes",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "In C++, how is an Abstract Class defined syntactically?",
    "options": [
      "By declaring at least one Pure Virtual Function (`virtual void func() = 0;`)",
      "By using the `abstract` keyword",
      "By making constructor private",
      "By inheriting from void"
    ],
    "correctAnswerIndex": 0,
    "explanation": "A pure virtual function (`= 0`) has no default implementation in the base class, making the class abstract and preventing instantiation.",
    "tags": [
      "OOP",
      "Polymorphism",
      "Object Oriented Programming",
      "Java",
      "C++",
      "GATE"
    ],
    "examRelevance": "GATE CS, Software Engineering & Architecture Exams",
    "placementRelevance": "Amazon, Microsoft, Adobe, Atlassian Technical Interview"
  },
  {
    "subject": "OOP",
    "topic": "Polymorphism",
    "subtopic": "Parametric Polymorphism (Generics)",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What form of polymorphism do Java Generics (`List<T>`) and C++ Templates (`std::vector<T>`) represent?",
    "options": [
      "Parametric Polymorphism (writing code that operates identically over different data types without sacrificing type safety)",
      "Ad-hoc polymorphism",
      "Subtyping polymorphism",
      "Coercion polymorphism"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Parametric polymorphism enables algorithms and data structures to be parameterized by types, providing compile-time type checking and code reuse.",
    "tags": [
      "OOP",
      "Polymorphism",
      "Object Oriented Programming",
      "Java",
      "C++",
      "GATE"
    ],
    "examRelevance": "GATE CS, Software Engineering & Architecture Exams",
    "placementRelevance": "Amazon, Microsoft, Adobe, Atlassian Technical Interview"
  },
  {
    "subject": "OOP",
    "topic": "Polymorphism",
    "subtopic": "Type Erasure in Java Generics",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "How does Java implement Generics under the hood, and what is Type Erasure?",
    "options": [
      "The compiler replaces generic type parameters with their bound (or Object) during compilation and inserts casts, leaving no generic type info in bytecode",
      "Generics create duplicate classes per type like C++ templates",
      "Generics are executed in Python",
      "Generics are stored in JVM registers"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Type erasure was chosen in Java 5 to maintain backwards compatibility with pre-generic bytecodes; `List<String>` and `List<Integer>` share the same class at runtime.",
    "tags": [
      "OOP",
      "Polymorphism",
      "Object Oriented Programming",
      "Java",
      "C++",
      "GATE"
    ],
    "examRelevance": "GATE CS, Software Engineering & Architecture Exams",
    "placementRelevance": "Amazon, Microsoft, Adobe, Atlassian Technical Interview"
  },
  {
    "subject": "OOP",
    "topic": "Polymorphism",
    "subtopic": "Duck Typing",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What is 'Duck Typing' in dynamically typed languages like Python and JavaScript?",
    "options": [
      "'If it walks like a duck and quacks like a duck, it is a duck' \u2014 an object's suitability is determined by the presence of methods/properties, not explicit inheritance",
      "Inheriting from a base Duck class",
      "Using static type annotations",
      "Converting objects to strings"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Dynamic polymorphism checks whether an object implements the required interface at the moment of method invocation, without requiring formal class hierarchy.",
    "tags": [
      "OOP",
      "Polymorphism",
      "Object Oriented Programming",
      "Java",
      "C++",
      "GATE"
    ],
    "examRelevance": "GATE CS, Software Engineering & Architecture Exams",
    "placementRelevance": "Amazon, Microsoft, Adobe, Atlassian Technical Interview"
  },
  {
    "subject": "OOP",
    "topic": "Polymorphism",
    "subtopic": "Ad-Hoc Polymorphism (Operator Overloading)",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "Operator Overloading (such as defining `+` for complex numbers or vectors in C++ or Python) is an example of:",
    "options": [
      "Ad-hoc Polymorphism",
      "Subtyping polymorphism",
      "Parametric polymorphism",
      "Inclusion polymorphism"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Ad-hoc polymorphism allows an operator or function to exhibit different behaviors depending on the specific types of its arguments.",
    "tags": [
      "OOP",
      "Polymorphism",
      "Object Oriented Programming",
      "Java",
      "C++",
      "GATE"
    ],
    "examRelevance": "GATE CS, Software Engineering & Architecture Exams",
    "placementRelevance": "Amazon, Microsoft, Adobe, Atlassian Technical Interview"
  },
  {
    "subject": "OOP",
    "topic": "Polymorphism",
    "subtopic": "Virtual Method Inlining Overhead",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "Why can compilers generally NOT inline a virtual method call during compilation?",
    "options": [
      "Because the target function address cannot be resolved until runtime due to dynamic dispatch (unless devirtualized by whole-program analysis)",
      "Inlining is forbidden for C++ methods",
      "Virtual methods have no machine code",
      "Virtual methods use too much RAM"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Inlining replaces call instructions with function bodies. Since the actual target depends on runtime vptr, standard compilers cannot inline virtual calls.",
    "tags": [
      "OOP",
      "Polymorphism",
      "Object Oriented Programming",
      "Java",
      "C++",
      "GATE"
    ],
    "examRelevance": "GATE CS, Software Engineering & Architecture Exams",
    "placementRelevance": "Amazon, Microsoft, Adobe, Atlassian Technical Interview"
  },
  {
    "subject": "OOP",
    "topic": "Polymorphism",
    "subtopic": "Multiple Dispatch",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "What is Single Dispatch (standard in Java/C++) vs Multiple Dispatch (Multimethods)?",
    "options": [
      "Single dispatch selects the method based on the runtime type of ONE object (the receiver `this`); Multiple dispatch selects based on runtime types of arguments too",
      "Single dispatch allows one method per class",
      "Multiple dispatch runs on multiple threads",
      "Single dispatch is for primitive types"
    ],
    "correctAnswerIndex": 0,
    "explanation": "In `a.collide(b)`, single dispatch chooses `collide` based on `a`'s runtime type. Double dispatch (Visitor Pattern) is needed to consider `b`'s type dynamically.",
    "tags": [
      "OOP",
      "Polymorphism",
      "Object Oriented Programming",
      "Java",
      "C++",
      "GATE"
    ],
    "examRelevance": "GATE CS, Software Engineering & Architecture Exams",
    "placementRelevance": "Amazon, Microsoft, Adobe, Atlassian Technical Interview"
  },
  {
    "subject": "OOP",
    "topic": "Encapsulation",
    "subtopic": "Encapsulation Definition",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What is the core definition of Encapsulation in Object-Oriented Programming?",
    "options": [
      "Bundling data (fields) and methods that operate on that data into a single unit (class) while restricting direct outside access to internal state (Information Hiding)",
      "Writing code that compiles on any OS",
      "Splitting code into multiple threads",
      "Inheriting methods from base class"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Encapsulation combines state and behavior into one entity and enforces access control via private fields and public methods (data hiding).",
    "tags": [
      "OOP",
      "Encapsulation",
      "Object Oriented Programming",
      "Java",
      "C++",
      "GATE"
    ],
    "examRelevance": "GATE CS, Software Engineering & Architecture Exams",
    "placementRelevance": "Amazon, Microsoft, Adobe, Atlassian Technical Interview"
  },
  {
    "subject": "OOP",
    "topic": "Encapsulation",
    "subtopic": "Information Hiding Benefits",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What is the primary architectural benefit of Information Hiding?",
    "options": [
      "Internal implementation details can be refactored or optimized without breaking external clients that rely on the public interface",
      "Programs consume 50% less RAM",
      "Eliminates need for testing",
      "Makes code run in parallel automatically"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Hiding implementation behind clean abstractions limits the ripple effect of changes: callers only depend on the stable public contract.",
    "tags": [
      "OOP",
      "Encapsulation",
      "Object Oriented Programming",
      "Java",
      "C++",
      "GATE"
    ],
    "examRelevance": "GATE CS, Software Engineering & Architecture Exams",
    "placementRelevance": "Amazon, Microsoft, Adobe, Atlassian Technical Interview"
  },
  {
    "subject": "OOP",
    "topic": "Encapsulation",
    "subtopic": "Access Modifiers Hierarchy",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "In Java, list the 4 access levels in order from MOST restrictive to LEAST restrictive:",
    "options": [
      "private \u2192 package-private (default) \u2192 protected \u2192 public",
      "private \u2192 protected \u2192 package-private \u2192 public",
      "public \u2192 protected \u2192 default \u2192 private",
      "default \u2192 private \u2192 protected \u2192 public"
    ],
    "correctAnswerIndex": 0,
    "explanation": "`private` (class only) < default (package only) < `protected` (package + subclasses) < `public` (accessible everywhere).",
    "tags": [
      "OOP",
      "Encapsulation",
      "Object Oriented Programming",
      "Java",
      "C++",
      "GATE"
    ],
    "examRelevance": "GATE CS, Software Engineering & Architecture Exams",
    "placementRelevance": "Amazon, Microsoft, Adobe, Atlassian Technical Interview"
  },
  {
    "subject": "OOP",
    "topic": "Encapsulation",
    "subtopic": "Getters and Setters Validation",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "Why are private fields paired with public getter and setter methods instead of declaring fields public?",
    "options": [
      "Setters allow enforcing validation invariants, maintaining read-only properties, and logging changes before mutating state",
      "Public fields cannot be serialized",
      "Getters make memory reads faster",
      "Compilers forbid public fields in Java"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Public fields allow external code to set invalid states (e.g. `age = -50`). Setters enforce business validation rules and maintain invariants.",
    "tags": [
      "OOP",
      "Encapsulation",
      "Object Oriented Programming",
      "Java",
      "C++",
      "GATE"
    ],
    "examRelevance": "GATE CS, Software Engineering & Architecture Exams",
    "placementRelevance": "Amazon, Microsoft, Adobe, Atlassian Technical Interview"
  },
  {
    "subject": "OOP",
    "topic": "Encapsulation",
    "subtopic": "Class Invariants",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is a Class Invariant in software engineering?",
    "options": [
      "A condition or rule that must always hold true for an object throughout its lifetime (established by constructor and preserved by methods)",
      "A variable that cannot be changed",
      "A static method that runs once",
      "A database constraint"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Encapsulation ensures that methods only transition an object from one valid invariant state to another valid state.",
    "tags": [
      "OOP",
      "Encapsulation",
      "Object Oriented Programming",
      "Java",
      "C++",
      "GATE"
    ],
    "examRelevance": "GATE CS, Software Engineering & Architecture Exams",
    "placementRelevance": "Amazon, Microsoft, Adobe, Atlassian Technical Interview"
  },
  {
    "subject": "OOP",
    "topic": "Encapsulation",
    "subtopic": "Tell, Don't Ask Principle",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What does the 'Tell, Don't Ask' design principle advocate?",
    "options": [
      "Tell objects what action to perform with their own data rather than asking them for their data and performing logic externally",
      "Ask objects for all getters before doing work",
      "Never write methods that return values",
      "Avoid using parameters"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Violating 'Tell, Don't Ask' by pulling data out via getters leads to anemic domain models where behavior is separated from the data it operates on.",
    "tags": [
      "OOP",
      "Encapsulation",
      "Object Oriented Programming",
      "Java",
      "C++",
      "GATE"
    ],
    "examRelevance": "GATE CS, Software Engineering & Architecture Exams",
    "placementRelevance": "Amazon, Microsoft, Adobe, Atlassian Technical Interview"
  },
  {
    "subject": "OOP",
    "topic": "Encapsulation",
    "subtopic": "Law of Demeter (Least Knowledge)",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What does the Law of Demeter (Principle of Least Knowledge) state regarding method invocations?",
    "options": [
      "A method of an object should only call methods on itself, its parameters, objects it creates, or its direct fields \u2014 avoid train wrecks like `a.getB().getC().doAction()`",
      "Classes should not have more than 5 methods",
      "Only call static methods",
      "Never pass objects to constructors"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Chained method calls (`a.getB().getC().doThing()`) tightly couple the caller to the entire internal structure of intermediate classes.",
    "tags": [
      "OOP",
      "Encapsulation",
      "Object Oriented Programming",
      "Java",
      "C++",
      "GATE"
    ],
    "examRelevance": "GATE CS, Software Engineering & Architecture Exams",
    "placementRelevance": "Amazon, Microsoft, Adobe, Atlassian Technical Interview"
  },
  {
    "subject": "OOP",
    "topic": "Encapsulation",
    "subtopic": "Friend Classes in C++",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "In C++, what does declaring a class or function as `friend` achieve?",
    "options": [
      "Grants that specific class or function access to the private and protected members of the declaring class",
      "Makes the class public globally",
      "Inherits all methods automatically",
      "Enables multithreading"
    ],
    "correctAnswerIndex": 0,
    "explanation": "`friend` selectively punches through encapsulation boundaries, often used for operator overloads (like `operator<<`) or tightly coupled helper classes.",
    "tags": [
      "OOP",
      "Encapsulation",
      "Object Oriented Programming",
      "Java",
      "C++",
      "GATE"
    ],
    "examRelevance": "GATE CS, Software Engineering & Architecture Exams",
    "placementRelevance": "Amazon, Microsoft, Adobe, Atlassian Technical Interview"
  },
  {
    "subject": "OOP",
    "topic": "Encapsulation",
    "subtopic": "Encapsulation vs Abstraction",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is the conceptual difference between Encapsulation and Abstraction?",
    "options": [
      "Abstraction focuses on WHAT an object does (interface); Encapsulation focuses on HOW it does it while hiding internal state (implementation)",
      "They are exact synonyms",
      "Encapsulation is for classes; abstraction is for interfaces only",
      "Abstraction is hiding data; encapsulation is hiding methods"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Abstraction hides complexity by showing only relevant high-level features; encapsulation hides internal data and bundles behavior to protect integrity.",
    "tags": [
      "OOP",
      "Encapsulation",
      "Object Oriented Programming",
      "Java",
      "C++",
      "GATE"
    ],
    "examRelevance": "GATE CS, Software Engineering & Architecture Exams",
    "placementRelevance": "Amazon, Microsoft, Adobe, Atlassian Technical Interview"
  },
  {
    "subject": "OOP",
    "topic": "Encapsulation",
    "subtopic": "Package-Private Scope in Java",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What is the accessibility of a class member declared without any access modifier (default) in Java?",
    "options": [
      "Accessible only to other classes within the same package",
      "Accessible to all classes everywhere",
      "Accessible only inside the class itself",
      "Accessible to subclasses in other packages"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Default (package-private) access restricts visibility to classes residing in the identical package directory, useful for modular library internals.",
    "tags": [
      "OOP",
      "Encapsulation",
      "Object Oriented Programming",
      "Java",
      "C++",
      "GATE"
    ],
    "examRelevance": "GATE CS, Software Engineering & Architecture Exams",
    "placementRelevance": "Amazon, Microsoft, Adobe, Atlassian Technical Interview"
  },
  {
    "subject": "OOP",
    "topic": "Encapsulation",
    "subtopic": "Private Constructors",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "When is a class constructor intentionally declared `private`?",
    "options": [
      "In utility classes with only static methods, in Singleton implementations, or when enforcing Factory Method instantiation",
      "To make the class abstract",
      "To prevent garbage collection",
      "To force inheritance"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Private constructors block external `new` instantiation, funneling creation through controlled static factory methods or singleton accessors.",
    "tags": [
      "OOP",
      "Encapsulation",
      "Object Oriented Programming",
      "Java",
      "C++",
      "GATE"
    ],
    "examRelevance": "GATE CS, Software Engineering & Architecture Exams",
    "placementRelevance": "Amazon, Microsoft, Adobe, Atlassian Technical Interview"
  },
  {
    "subject": "OOP",
    "topic": "Encapsulation",
    "subtopic": "Anemic Domain Model Anti-Pattern",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "What is the 'Anemic Domain Model' anti-pattern described by Martin Fowler?",
    "options": [
      "Classes that contain only data fields and public getters/setters with zero business logic, while logic is dumped into separate service classes",
      "Classes with no fields",
      "Classes with too many methods",
      "Classes that cannot be serialized"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Anemic models strip objects of their behavioral nature, turning OOP into procedural programming with glorified data structures.",
    "tags": [
      "OOP",
      "Encapsulation",
      "Object Oriented Programming",
      "Java",
      "C++",
      "GATE"
    ],
    "examRelevance": "GATE CS, Software Engineering & Architecture Exams",
    "placementRelevance": "Amazon, Microsoft, Adobe, Atlassian Technical Interview"
  },
  {
    "subject": "OOP",
    "topic": "Abstraction",
    "subtopic": "Abstraction Definition",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What is Abstraction in software design?",
    "options": [
      "Representing essential features of a system without including background implementation complexity or technical details",
      "Writing code in assembly language",
      "Creating classes with many variables",
      "Encrypting source code"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Abstraction manages complexity by presenting a simplified mental model (e.g. driving a car using steering wheel and pedals without needing engine details).",
    "tags": [
      "OOP",
      "Abstraction",
      "Object Oriented Programming",
      "Java",
      "C++",
      "GATE"
    ],
    "examRelevance": "GATE CS, Software Engineering & Architecture Exams",
    "placementRelevance": "Amazon, Microsoft, Adobe, Atlassian Technical Interview"
  },
  {
    "subject": "OOP",
    "topic": "Abstraction",
    "subtopic": "Abstract Method",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What is an Abstract Method in object-oriented programming?",
    "options": [
      "A method declared with a signature but with NO body/implementation, mandating that concrete subclasses must provide the implementation",
      "A method with no parameters",
      "A method that returns null",
      "A private method"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Abstract methods establish an interface contract; non-abstract subclasses cannot compile without implementing every inherited abstract method.",
    "tags": [
      "OOP",
      "Abstraction",
      "Object Oriented Programming",
      "Java",
      "C++",
      "GATE"
    ],
    "examRelevance": "GATE CS, Software Engineering & Architecture Exams",
    "placementRelevance": "Amazon, Microsoft, Adobe, Atlassian Technical Interview"
  },
  {
    "subject": "OOP",
    "topic": "Abstraction",
    "subtopic": "Hardware Abstraction Layer (HAL)",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is the purpose of a Hardware Abstraction Layer (HAL) in operating systems?",
    "options": [
      "Provides a consistent software API to the OS kernel hiding physical differences between different CPU architectures and motherboards",
      "Simulates hardware in software",
      "Overclocks CPU hardware",
      "Replaces BIOS"
    ],
    "correctAnswerIndex": 0,
    "explanation": "HAL isolates OS kernel logic from machine-specific hardware registers, allowing Windows or Linux to boot across diverse chipsets.",
    "tags": [
      "OOP",
      "Abstraction",
      "Object Oriented Programming",
      "Java",
      "C++",
      "GATE"
    ],
    "examRelevance": "GATE CS, Software Engineering & Architecture Exams",
    "placementRelevance": "Amazon, Microsoft, Adobe, Atlassian Technical Interview"
  },
  {
    "subject": "OOP",
    "topic": "Abstraction",
    "subtopic": "Leaky Abstractions",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "Joel Spolsky's 'Law of Leaky Abstractions' states that:",
    "options": [
      "All non-trivial abstractions, to some degree, leak underlying implementation details (e.g. network latency leaking through remote RPC calls)",
      "Abstractions use too much RAM",
      "Inheritance always causes memory leaks",
      "Software can never be abstracted"
    ],
    "correctAnswerIndex": 0,
    "explanation": "When underlying mechanisms fail or hit performance bottlenecks (e.g. NFS filesystem freezing on dropped Wi-Fi), the abstraction fails to conceal reality.",
    "tags": [
      "OOP",
      "Abstraction",
      "Object Oriented Programming",
      "Java",
      "C++",
      "GATE"
    ],
    "examRelevance": "GATE CS, Software Engineering & Architecture Exams",
    "placementRelevance": "Amazon, Microsoft, Adobe, Atlassian Technical Interview"
  },
  {
    "subject": "OOP",
    "topic": "Abstraction",
    "subtopic": "Facade Pattern for Abstraction",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "How does the Facade Design Pattern provide abstraction?",
    "options": [
      "Provides a unified, simplified high-level interface to a complex subsystem of multiple interdependent classes",
      "Creates duplicate objects",
      "Caches database queries",
      "Converts objects to JSON"
    ],
    "correctAnswerIndex": 0,
    "explanation": "The Facade shields client code from the chaotic inner workings of a multi-component subsystem, offering a clean, simple entryway.",
    "tags": [
      "OOP",
      "Abstraction",
      "Object Oriented Programming",
      "Java",
      "C++",
      "GATE"
    ],
    "examRelevance": "GATE CS, Software Engineering & Architecture Exams",
    "placementRelevance": "Amazon, Microsoft, Adobe, Atlassian Technical Interview"
  },
  {
    "subject": "OOP",
    "topic": "Abstraction",
    "subtopic": "Data Abstraction vs Control Abstraction",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is the difference between Data Abstraction and Control Abstraction?",
    "options": [
      "Data abstraction hides data representation behind Abstract Data Types (Stack, Map); Control abstraction hides execution flow behind functions and loops",
      "Data abstraction is for databases only",
      "Control abstraction uses hardware registers",
      "They are identical"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Data abstraction conceals how bits/structures are organized; control abstraction conceals assembly jumps, branch predictions, and function calls.",
    "tags": [
      "OOP",
      "Abstraction",
      "Object Oriented Programming",
      "Java",
      "C++",
      "GATE"
    ],
    "examRelevance": "GATE CS, Software Engineering & Architecture Exams",
    "placementRelevance": "Amazon, Microsoft, Adobe, Atlassian Technical Interview"
  },
  {
    "subject": "OOP",
    "topic": "Abstraction",
    "subtopic": "Abstract Factory vs Factory Method",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is the distinction between Factory Method and Abstract Factory patterns?",
    "options": [
      "Factory Method uses inheritance and creates ONE product via a method; Abstract Factory uses composition and creates FAMILIES of related products",
      "Factory Method creates interfaces",
      "Abstract Factory cannot use interfaces",
      "They are identical in GoF"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Abstract Factory is a factory of factories, providing an interface to produce families of related objects (e.g. DarkThemeButton, DarkThemeScrollbar).",
    "tags": [
      "OOP",
      "Abstraction",
      "Object Oriented Programming",
      "Java",
      "C++",
      "GATE"
    ],
    "examRelevance": "GATE CS, Software Engineering & Architecture Exams",
    "placementRelevance": "Amazon, Microsoft, Adobe, Atlassian Technical Interview"
  },
  {
    "subject": "OOP",
    "topic": "Abstraction",
    "subtopic": "Interfaces as Behavioral Abstraction",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "Why are interfaces considered the purest form of abstraction in Java/C#?",
    "options": [
      "They define purely WHAT operations can be performed (pure behavioral contract) without dictating HOW state is maintained or methods are executed",
      "Interfaces compile directly to machine code",
      "Interfaces can hold database connections",
      "Interfaces run faster than classes"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Interfaces decouple the caller from implementation entirely; any class that implements the interface satisfies the contract regardless of internals.",
    "tags": [
      "OOP",
      "Abstraction",
      "Object Oriented Programming",
      "Java",
      "C++",
      "GATE"
    ],
    "examRelevance": "GATE CS, Software Engineering & Architecture Exams",
    "placementRelevance": "Amazon, Microsoft, Adobe, Atlassian Technical Interview"
  },
  {
    "subject": "OOP",
    "topic": "Abstraction",
    "subtopic": "Levels of Abstraction in Architecture",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "In enterprise layered architecture (Presentation \u2192 Application \u2192 Domain \u2192 Infrastructure), why do layers communicate strictly through abstractions?",
    "options": [
      "To allow swapping infrastructure implementations (e.g. switching MySQL to MongoDB) without affecting core business domain rules",
      "To make programs execute in 1ms",
      "Because Java forces layering",
      "To reduce lines of code"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Domain logic depends only on abstract repository interfaces; concrete database drivers plug in at the infrastructure boundary without touching core logic.",
    "tags": [
      "OOP",
      "Abstraction",
      "Object Oriented Programming",
      "Java",
      "C++",
      "GATE"
    ],
    "examRelevance": "GATE CS, Software Engineering & Architecture Exams",
    "placementRelevance": "Amazon, Microsoft, Adobe, Atlassian Technical Interview"
  },
  {
    "subject": "OOP",
    "topic": "Abstraction",
    "subtopic": "Template Method Pattern",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "How does the Template Method pattern enforce algorithm structure through abstraction?",
    "options": [
      "Defines the invariant skeleton of an algorithm in a base class method, deferring specific variant steps to abstract methods overridden by subclasses",
      "Runs algorithms in parallel",
      "Replaces loops with recursion",
      "Generates source code dynamically"
    ],
    "correctAnswerIndex": 0,
    "explanation": "The template method is `final` and orchestrates step1(), step2(), step3(); subclasses override the individual abstract steps without altering overall flow.",
    "tags": [
      "OOP",
      "Abstraction",
      "Object Oriented Programming",
      "Java",
      "C++",
      "GATE"
    ],
    "examRelevance": "GATE CS, Software Engineering & Architecture Exams",
    "placementRelevance": "Amazon, Microsoft, Adobe, Atlassian Technical Interview"
  },
  {
    "subject": "OOP",
    "topic": "Abstraction",
    "subtopic": "Marker (Tagging) Interface",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What is a Marker Interface in Java (such as `Serializable` or `Cloneable`)?",
    "options": [
      "An interface with zero methods and zero constants, used to tag a class as having a specific capability or metadata recognized by the runtime",
      "An interface with only static methods",
      "An interface for GUI markers",
      "A deprecated feature"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Marker interfaces convey type metadata to the JVM or serialization libraries, indicating the class authorizes reflection-based byte serialization.",
    "tags": [
      "OOP",
      "Abstraction",
      "Object Oriented Programming",
      "Java",
      "C++",
      "GATE"
    ],
    "examRelevance": "GATE CS, Software Engineering & Architecture Exams",
    "placementRelevance": "Amazon, Microsoft, Adobe, Atlassian Technical Interview"
  },
  {
    "subject": "OOP",
    "topic": "Abstraction",
    "subtopic": "Functional Interface",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What defines a Functional Interface in Java (annotated with `@FunctionalInterface`)?",
    "options": [
      "An interface containing exactly ONE abstract method (Single Abstract Method - SAM), eligible to be implemented by Lambda Expressions",
      "An interface with only math functions",
      "An interface that cannot have default methods",
      "An interface without return values"
    ],
    "correctAnswerIndex": 0,
    "explanation": "SAM interfaces (like `Runnable`, `Callable`, `Comparator`, `Predicate`) can be concisely instantiated using lambda syntax `() -> ...`.",
    "tags": [
      "OOP",
      "Abstraction",
      "Object Oriented Programming",
      "Java",
      "C++",
      "GATE"
    ],
    "examRelevance": "GATE CS, Software Engineering & Architecture Exams",
    "placementRelevance": "Amazon, Microsoft, Adobe, Atlassian Technical Interview"
  },
  {
    "subject": "OOP",
    "topic": "Interfaces",
    "subtopic": "Interface Definition",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What is an Interface in Object-Oriented Programming?",
    "options": [
      "A reference type that defines a formal contract of method signatures that implementing classes must fulfill",
      "A class with all fields public",
      "A graphical user interface window",
      "A memory address in the BIOS"
    ],
    "correctAnswerIndex": 0,
    "explanation": "An interface specifies what a class must do, but not how it does it, decoupling caller expectations from concrete implementations.",
    "tags": [
      "OOP",
      "Interfaces",
      "Object Oriented Programming",
      "Java",
      "C++",
      "GATE"
    ],
    "examRelevance": "GATE CS, Software Engineering & Architecture Exams",
    "placementRelevance": "Amazon, Microsoft, Adobe, Atlassian Technical Interview"
  },
  {
    "subject": "OOP",
    "topic": "Interfaces",
    "subtopic": "Multiple Interface Implementation",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "Can a single class in Java implement multiple interfaces simultaneously?",
    "options": [
      "Yes, a class can implement any number of interfaces separated by commas (`implements A, B, C`)",
      "No, Java restricts to one interface only",
      "Only if interfaces have identical methods",
      "Only in Java 17+"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Java supports multiple inheritance of interface type, allowing a class to adhere to multiple distinct behavioral contracts.",
    "tags": [
      "OOP",
      "Interfaces",
      "Object Oriented Programming",
      "Java",
      "C++",
      "GATE"
    ],
    "examRelevance": "GATE CS, Software Engineering & Architecture Exams",
    "placementRelevance": "Amazon, Microsoft, Adobe, Atlassian Technical Interview"
  },
  {
    "subject": "OOP",
    "topic": "Interfaces",
    "subtopic": "Default Methods in Interfaces (Java 8)",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "Why did Java 8 introduce `default` methods with concrete bodies inside interfaces?",
    "options": [
      "To allow adding new methods to existing library interfaces (like `Collection.stream()`) without breaking existing classes that implemented the interface",
      "To replace abstract classes entirely",
      "To make interfaces run faster",
      "To enable private variables in interfaces"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Without default methods, adding a method to `java.util.List` would break every existing third-party implementation across the globe upon compilation.",
    "tags": [
      "OOP",
      "Interfaces",
      "Object Oriented Programming",
      "Java",
      "C++",
      "GATE"
    ],
    "examRelevance": "GATE CS, Software Engineering & Architecture Exams",
    "placementRelevance": "Amazon, Microsoft, Adobe, Atlassian Technical Interview"
  },
  {
    "subject": "OOP",
    "topic": "Interfaces",
    "subtopic": "Diamond Problem with Default Methods",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "If a Java class implements interfaces A and B, and both define a default method `void log()` with identical signature, what does the compiler mandate?",
    "options": [
      "The class MUST explicitly override `log()` to resolve the ambiguity (or delegate via `A.super.log()`)",
      "The compiler automatically picks interface A",
      "The class fails to compile and cannot be resolved",
      "Interface B is ignored"
    ],
    "correctAnswerIndex": 0,
    "explanation": "The Java compiler flags an ambiguity error; the developer must resolve it explicitly by overriding the method and choosing which default to invoke.",
    "tags": [
      "OOP",
      "Interfaces",
      "Object Oriented Programming",
      "Java",
      "C++",
      "GATE"
    ],
    "examRelevance": "GATE CS, Software Engineering & Architecture Exams",
    "placementRelevance": "Amazon, Microsoft, Adobe, Atlassian Technical Interview"
  },
  {
    "subject": "OOP",
    "topic": "Interfaces",
    "subtopic": "Static Methods in Interfaces",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "Can an interface in Java contain static methods, and how are they invoked?",
    "options": [
      "Yes, static methods can have bodies and are invoked strictly via the interface name (`InterfaceName.staticMethod()`), not via instance references",
      "No, interfaces cannot have static methods",
      "They are inherited by subclasses",
      "They must be synchronized"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Java 8 added static interface methods for utility operations relevant to the interface contract (e.g. `Comparator.comparing()`).",
    "tags": [
      "OOP",
      "Interfaces",
      "Object Oriented Programming",
      "Java",
      "C++",
      "GATE"
    ],
    "examRelevance": "GATE CS, Software Engineering & Architecture Exams",
    "placementRelevance": "Amazon, Microsoft, Adobe, Atlassian Technical Interview"
  },
  {
    "subject": "OOP",
    "topic": "Interfaces",
    "subtopic": "Private Methods in Interfaces (Java 9)",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is the purpose of `private` methods inside interfaces introduced in Java 9?",
    "options": [
      "To encapsulate shared helper logic between multiple `default` methods within the interface without exposing it to implementing classes",
      "To hide the interface from hackers",
      "To prevent class inheritance",
      "To store passwords"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Private interface methods allow refactoring redundant code from multiple default methods into clean private helper routines within the interface.",
    "tags": [
      "OOP",
      "Interfaces",
      "Object Oriented Programming",
      "Java",
      "C++",
      "GATE"
    ],
    "examRelevance": "GATE CS, Software Engineering & Architecture Exams",
    "placementRelevance": "Amazon, Microsoft, Adobe, Atlassian Technical Interview"
  },
  {
    "subject": "OOP",
    "topic": "Interfaces",
    "subtopic": "Interface Fields Constants",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "By default, all fields declared inside a Java interface are implicitly:",
    "options": [
      "`public static final` (constants)",
      "`private`",
      "`protected volatile`",
      "`transient`"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Every variable declared in an interface is automatically public, static, and final; interfaces cannot hold instance variables.",
    "tags": [
      "OOP",
      "Interfaces",
      "Object Oriented Programming",
      "Java",
      "C++",
      "GATE"
    ],
    "examRelevance": "GATE CS, Software Engineering & Architecture Exams",
    "placementRelevance": "Amazon, Microsoft, Adobe, Atlassian Technical Interview"
  },
  {
    "subject": "OOP",
    "topic": "Interfaces",
    "subtopic": "Constant Interface Anti-Pattern",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "Why is the 'Constant Interface' pattern (implementing an interface purely to import static constants without class qualification) an anti-pattern?",
    "options": [
      "It pollutes the class's public API with internal implementation constants and exposes them to all derived subclasses permanently",
      "It causes runtime NullPointerExceptions",
      "It slows down class loading",
      "Java 8 banned constants"
    ],
    "correctAnswerIndex": 0,
    "explanation": "As Joshua Bloch notes in Effective Java, constants are an implementation detail; putting them in an implemented interface leaks them into the public type API.",
    "tags": [
      "OOP",
      "Interfaces",
      "Object Oriented Programming",
      "Java",
      "C++",
      "GATE"
    ],
    "examRelevance": "GATE CS, Software Engineering & Architecture Exams",
    "placementRelevance": "Amazon, Microsoft, Adobe, Atlassian Technical Interview"
  },
  {
    "subject": "OOP",
    "topic": "Interfaces",
    "subtopic": "Dependency Inversion with Interfaces",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "In SOLID design, how do interfaces enable the Dependency Inversion Principle (DIP)?",
    "options": [
      "High-level business modules depend on abstract interfaces rather than concrete low-level implementations (both depend on abstractions)",
      "Modules must not use classes",
      "Interfaces must have only one method",
      "Dependencies are loaded from disk"
    ],
    "correctAnswerIndex": 0,
    "explanation": "DIP decouples modules: an OrderService depends on PaymentGateway interface, allowing Stripe, PayPal, or Mock gateways to be injected seamlessly.",
    "tags": [
      "OOP",
      "Interfaces",
      "Object Oriented Programming",
      "Java",
      "C++",
      "GATE"
    ],
    "examRelevance": "GATE CS, Software Engineering & Architecture Exams",
    "placementRelevance": "Amazon, Microsoft, Adobe, Atlassian Technical Interview"
  },
  {
    "subject": "OOP",
    "topic": "Interfaces",
    "subtopic": "C++ Pure Virtual Classes as Interfaces",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "How is an Interface represented in C++ since C++ lacks a dedicated `interface` keyword?",
    "options": [
      "As an Abstract Base Class containing ONLY pure virtual functions (`= 0`) and a virtual destructor, with no member variables",
      "Using the `extern` keyword",
      "Using templates only",
      "Using C structs with function pointers only"
    ],
    "correctAnswerIndex": 0,
    "explanation": "A C++ class with only pure virtual methods and no member state acts identically to an interface in other languages.",
    "tags": [
      "OOP",
      "Interfaces",
      "Object Oriented Programming",
      "Java",
      "C++",
      "GATE"
    ],
    "examRelevance": "GATE CS, Software Engineering & Architecture Exams",
    "placementRelevance": "Amazon, Microsoft, Adobe, Atlassian Technical Interview"
  },
  {
    "subject": "OOP",
    "topic": "Interfaces",
    "subtopic": "Cohesive Interface Design",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What characterizes a cohesive interface according to interface design best practices?",
    "options": [
      "It has a focused, single responsibility with a minimal set of closely related operations rather than being a bloated catch-all",
      "It contains at least 50 methods",
      "It has no methods",
      "It extends 10 other interfaces"
    ],
    "correctAnswerIndex": 0,
    "explanation": "High cohesion ensures clients only need to understand and implement methods relevant to their specific role.",
    "tags": [
      "OOP",
      "Interfaces",
      "Object Oriented Programming",
      "Java",
      "C++",
      "GATE"
    ],
    "examRelevance": "GATE CS, Software Engineering & Architecture Exams",
    "placementRelevance": "Amazon, Microsoft, Adobe, Atlassian Technical Interview"
  },
  {
    "subject": "OOP",
    "topic": "Interfaces",
    "subtopic": "Polymorphic Collection Typing",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "Why should variable declarations use interface types (e.g. `List<String> list = new ArrayList<>()`) instead of concrete classes (`ArrayList`)?",
    "options": [
      "Allows switching the underlying implementation (e.g. to LinkedList or CopyOnWriteArrayList) later without modifying the code that uses `list`",
      "ArrayList uses more memory than List",
      "Java forbids using concrete types in declarations",
      "List runs 2x faster"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Programming to interfaces rather than implementations maximizes flexibility, decoupling business code from specific data structure internals.",
    "tags": [
      "OOP",
      "Interfaces",
      "Object Oriented Programming",
      "Java",
      "C++",
      "GATE"
    ],
    "examRelevance": "GATE CS, Software Engineering & Architecture Exams",
    "placementRelevance": "Amazon, Microsoft, Adobe, Atlassian Technical Interview"
  },
  {
    "subject": "OOP",
    "topic": "SOLID",
    "subtopic": "S - Single Responsibility Principle (SRP)",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What is the formal definition of the Single Responsibility Principle (SRP) by Robert C. Martin?",
    "options": [
      "A class should have one, and only one, reason to change (meaning it is responsible to only one actor)",
      "A class should have only one method",
      "A program should have only one class",
      "A function can only take one parameter"
    ],
    "correctAnswerIndex": 0,
    "explanation": "SRP states that a class should encapsulate a single cohesive responsibility, ensuring requirements changes from different stakeholders affect different classes.",
    "tags": [
      "OOP",
      "SOLID",
      "Object Oriented Programming",
      "Java",
      "C++",
      "GATE"
    ],
    "examRelevance": "GATE CS, Software Engineering & Architecture Exams",
    "placementRelevance": "Amazon, Microsoft, Adobe, Atlassian Technical Interview"
  },
  {
    "subject": "OOP",
    "topic": "SOLID",
    "subtopic": "O - Open/Closed Principle (OCP)",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What does the Open/Closed Principle (OCP) mandate?",
    "options": [
      "Software entities (classes, modules, functions) should be OPEN for extension, but CLOSED for modification",
      "Source code must be open source",
      "Classes must be declared final",
      "Files must be closed after writing"
    ],
    "correctAnswerIndex": 0,
    "explanation": "New system behaviors should be added by writing new subclass or interface implementations, rather than editing and re-testing existing, working source code.",
    "tags": [
      "OOP",
      "SOLID",
      "Object Oriented Programming",
      "Java",
      "C++",
      "GATE"
    ],
    "examRelevance": "GATE CS, Software Engineering & Architecture Exams",
    "placementRelevance": "Amazon, Microsoft, Adobe, Atlassian Technical Interview"
  },
  {
    "subject": "OOP",
    "topic": "SOLID",
    "subtopic": "L - Liskov Substitution Principle (LSP)",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is the Liskov Substitution Principle (LSP) requirement in inheritance hierarchies?",
    "options": [
      "Subtypes must be substitutable for their base types without altering the correctness or intended behavior of the program",
      "All subclasses must override every method",
      "Subclasses must have identical field names",
      "Base classes cannot be abstract"
    ],
    "correctAnswerIndex": 0,
    "explanation": "If S is a subtype of T, objects of type T may be replaced with objects of type S without breaking assumptions (e.g. Square extending Rectangle violates LSP).",
    "tags": [
      "OOP",
      "SOLID",
      "Object Oriented Programming",
      "Java",
      "C++",
      "GATE"
    ],
    "examRelevance": "GATE CS, Software Engineering & Architecture Exams",
    "placementRelevance": "Amazon, Microsoft, Adobe, Atlassian Technical Interview"
  },
  {
    "subject": "OOP",
    "topic": "SOLID",
    "subtopic": "LSP Classic Square-Rectangle Violation",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "Why does making `Square` a subclass of `Rectangle` (where setWidth and setHeight can be called independently) violate LSP?",
    "options": [
      "In a Rectangle, setting width does not alter height; in Square, setting width must change height, violating caller expectations of Rectangle behavior",
      "Squares are not geometric shapes",
      "Square has fewer sides than rectangle",
      "Rectangle constructors cannot take 1 parameter"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Code expecting a Rectangle assumes `rect.setWidth(5); rect.setHeight(10); assert(rect.getArea() == 50)`. A Square breaks this invariant.",
    "tags": [
      "OOP",
      "SOLID",
      "Object Oriented Programming",
      "Java",
      "C++",
      "GATE"
    ],
    "examRelevance": "GATE CS, Software Engineering & Architecture Exams",
    "placementRelevance": "Amazon, Microsoft, Adobe, Atlassian Technical Interview"
  },
  {
    "subject": "OOP",
    "topic": "SOLID",
    "subtopic": "I - Interface Segregation Principle (ISP)",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What does the Interface Segregation Principle (ISP) state?",
    "options": [
      "Clients should not be forced to depend on interfaces they do not use (prefer many small, client-specific interfaces over one 'fat' general-purpose interface)",
      "All interfaces must be in separate files",
      "Interfaces must have only one method",
      "Classes cannot implement multiple interfaces"
    ],
    "correctAnswerIndex": 0,
    "explanation": "ISP prevents bloated interfaces that force implementing classes to write useless stub/dummy implementations for irrelevant methods.",
    "tags": [
      "OOP",
      "SOLID",
      "Object Oriented Programming",
      "Java",
      "C++",
      "GATE"
    ],
    "examRelevance": "GATE CS, Software Engineering & Architecture Exams",
    "placementRelevance": "Amazon, Microsoft, Adobe, Atlassian Technical Interview"
  },
  {
    "subject": "OOP",
    "topic": "SOLID",
    "subtopic": "D - Dependency Inversion Principle (DIP)",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What are the two core tenets of the Dependency Inversion Principle (DIP)?",
    "options": [
      "1. High-level modules should not depend on low-level modules; both should depend on abstractions. 2. Abstractions should not depend on details; details depend on abstractions",
      "Classes must depend on databases directly",
      "Invert all if-else conditions",
      "Eliminate all interfaces"
    ],
    "correctAnswerIndex": 0,
    "explanation": "DIP reverses traditional top-down procedural dependencies, establishing an abstract contract layer in between high-level logic and low-level I/O.",
    "tags": [
      "OOP",
      "SOLID",
      "Object Oriented Programming",
      "Java",
      "C++",
      "GATE"
    ],
    "examRelevance": "GATE CS, Software Engineering & Architecture Exams",
    "placementRelevance": "Amazon, Microsoft, Adobe, Atlassian Technical Interview"
  },
  {
    "subject": "OOP",
    "topic": "SOLID",
    "subtopic": "Dependency Injection (DI)",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "How does Dependency Injection (DI) implement the Dependency Inversion Principle in practice?",
    "options": [
      "Dependencies (collaborators) are passed (injected) into an object via constructor or setter, rather than the object instantiating them with `new`",
      "Dependencies are downloaded from the internet at runtime",
      "Using global static variables",
      "Recompiling code dynamically"
    ],
    "correctAnswerIndex": 0,
    "explanation": "DI hands control of dependency creation to an external injector or IoC container (e.g. Spring), enabling trivial unit testing with mock objects.",
    "tags": [
      "OOP",
      "SOLID",
      "Object Oriented Programming",
      "Java",
      "C++",
      "GATE"
    ],
    "examRelevance": "GATE CS, Software Engineering & Architecture Exams",
    "placementRelevance": "Amazon, Microsoft, Adobe, Atlassian Technical Interview"
  },
  {
    "subject": "OOP",
    "topic": "SOLID",
    "subtopic": "Inversion of Control (IoC)",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is the 'Hollywood Principle' ('Don't call us, we'll call you') associated with Inversion of Control?",
    "options": [
      "In a framework with IoC, the framework controls program execution flow and calls custom user code via hooks/callbacks, inverting control",
      "Movie streaming architectures",
      "Classes calling their own methods",
      "Code running only in Los Angeles"
    ],
    "correctAnswerIndex": 0,
    "explanation": "In traditional code, your code calls library APIs; in IoC frameworks (like Spring or React), the framework runs the loop and invokes your components.",
    "tags": [
      "OOP",
      "SOLID",
      "Object Oriented Programming",
      "Java",
      "C++",
      "GATE"
    ],
    "examRelevance": "GATE CS, Software Engineering & Architecture Exams",
    "placementRelevance": "Amazon, Microsoft, Adobe, Atlassian Technical Interview"
  },
  {
    "subject": "OOP",
    "topic": "SOLID",
    "subtopic": "Violating SRP God Object",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What software anti-pattern directly violates the Single Responsibility Principle by accumulating hundreds of unrelated responsibilities?",
    "options": [
      "God Object (Blob Class)",
      "Singleton",
      "Factory",
      "Adapter"
    ],
    "correctAnswerIndex": 0,
    "explanation": "A God Object knows too much or does too much, monopolizing central control and becoming an unmaintainable nightmare to test and refactor.",
    "tags": [
      "OOP",
      "SOLID",
      "Object Oriented Programming",
      "Java",
      "C++",
      "GATE"
    ],
    "examRelevance": "GATE CS, Software Engineering & Architecture Exams",
    "placementRelevance": "Amazon, Microsoft, Adobe, Atlassian Technical Interview"
  },
  {
    "subject": "OOP",
    "topic": "SOLID",
    "subtopic": "Violating OCP with Type Checking",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "Code littered with `switch (employee.type)` or `if (shape instanceof Circle)` statements that must be updated whenever a new type is added violates:",
    "options": [
      "Open/Closed Principle (OCP)",
      "Single Responsibility only",
      "DRY principle only",
      "KISS principle"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Every new type requires hunting down and modifying all existing switch-case statements; OCP replaces conditional checks with polymorphic method calls.",
    "tags": [
      "OOP",
      "SOLID",
      "Object Oriented Programming",
      "Java",
      "C++",
      "GATE"
    ],
    "examRelevance": "GATE CS, Software Engineering & Architecture Exams",
    "placementRelevance": "Amazon, Microsoft, Adobe, Atlassian Technical Interview"
  },
  {
    "subject": "OOP",
    "topic": "SOLID",
    "subtopic": "Design Smells",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "Which of the following is recognized as a primary symptom of rotting software design addressed by SOLID principles?",
    "options": [
      "Rigidity (hard to change), Fragility (changes break unrelated parts), and Immobility (hard to reuse components)",
      "Running out of hard drive space",
      "Slow CPU clock speed",
      "Using open source software"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Robert C. Martin identified Rigidity, Fragility, Immobility, and Viscosity as core design smells resulting from poor dependency management.",
    "tags": [
      "OOP",
      "SOLID",
      "Object Oriented Programming",
      "Java",
      "C++",
      "GATE"
    ],
    "examRelevance": "GATE CS, Software Engineering & Architecture Exams",
    "placementRelevance": "Amazon, Microsoft, Adobe, Atlassian Technical Interview"
  },
  {
    "subject": "OOP",
    "topic": "SOLID",
    "subtopic": "Contract-Driven Development",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "In Design by Contract (DbC), how do Preconditions and Postconditions relate to Liskov Substitution Principle?",
    "options": [
      "A subclass method can WEAKEN preconditions (accept broader inputs) and STRENGTHEN postconditions (guarantee narrower outputs), but never the reverse",
      "Preconditions must be identical always",
      "Postconditions must be void",
      "Subclasses cannot have preconditions"
    ],
    "correctAnswerIndex": 0,
    "explanation": "If a subclass demands more restrictive inputs than superclass (stronger precondition) or guarantees less (weaker postcondition), it breaks callers expecting the superclass.",
    "tags": [
      "OOP",
      "SOLID",
      "Object Oriented Programming",
      "Java",
      "C++",
      "GATE"
    ],
    "examRelevance": "GATE CS, Software Engineering & Architecture Exams",
    "placementRelevance": "Amazon, Microsoft, Adobe, Atlassian Technical Interview"
  },
  {
    "subject": "OOP",
    "topic": "Design Patterns",
    "subtopic": "GoF Pattern Categories",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What are the 3 overarching categories of the 23 Gang of Four (GoF) design patterns?",
    "options": [
      "Creational, Structural, and Behavioral",
      "Model, View, and Controller",
      "Front-end, Back-end, and Database",
      "Synchronous, Asynchronous, and Reactive"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Creational patterns manage object creation; Structural patterns compose classes/objects; Behavioral patterns orchestrate communication between objects.",
    "tags": [
      "OOP",
      "Design Patterns",
      "Object Oriented Programming",
      "Java",
      "C++",
      "GATE"
    ],
    "examRelevance": "GATE CS, Software Engineering & Architecture Exams",
    "placementRelevance": "Amazon, Microsoft, Adobe, Atlassian Technical Interview"
  },
  {
    "subject": "OOP",
    "topic": "Design Patterns",
    "subtopic": "Observer Pattern",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What is the intent of the Observer Design Pattern?",
    "options": [
      "Defines a one-to-many dependency between objects so that when one object changes state, all its registered dependents are notified automatically",
      "Observes network traffic for bugs",
      "Watches memory usage in background",
      "Prevents object creation"
    ],
    "correctAnswerIndex": 0,
    "explanation": "The Observer pattern (Subject-Observer / Pub-Sub) decouples the state holder from event listeners (e.g. event listeners in UI frameworks).",
    "tags": [
      "OOP",
      "Design Patterns",
      "Object Oriented Programming",
      "Java",
      "C++",
      "GATE"
    ],
    "examRelevance": "GATE CS, Software Engineering & Architecture Exams",
    "placementRelevance": "Amazon, Microsoft, Adobe, Atlassian Technical Interview"
  },
  {
    "subject": "OOP",
    "topic": "Design Patterns",
    "subtopic": "Strategy Pattern",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "How does the Strategy Design Pattern enable swapping algorithms at runtime?",
    "options": [
      "Encapsulates a family of algorithms into separate classes implementing a common interface, allowing client context to swap strategies dynamically",
      "Inherits from multiple base classes",
      "Compiles C++ code dynamically",
      "Uses switch-case statements"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Strategy defines an interface (`PaymentStrategy`), implemented by `CreditCardPayment`, `PayPalPayment`, and `CryptoPayment`, passed into context at runtime.",
    "tags": [
      "OOP",
      "Design Patterns",
      "Object Oriented Programming",
      "Java",
      "C++",
      "GATE"
    ],
    "examRelevance": "GATE CS, Software Engineering & Architecture Exams",
    "placementRelevance": "Amazon, Microsoft, Adobe, Atlassian Technical Interview"
  },
  {
    "subject": "OOP",
    "topic": "Design Patterns",
    "subtopic": "Decorator Pattern",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is the primary purpose of the Decorator Pattern (e.g. Java `new BufferedReader(new FileReader(...))` )?",
    "options": [
      "Attaches additional responsibilities and behavior to an object dynamically at runtime as an alternative to subclassing",
      "Formats text strings nicely",
      "Replaces class constructors",
      "Deletes obsolete objects"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Decorators wrap the target object and implement the same interface, layering on extra behaviors (buffering, compression, encryption) flexibly.",
    "tags": [
      "OOP",
      "Design Patterns",
      "Object Oriented Programming",
      "Java",
      "C++",
      "GATE"
    ],
    "examRelevance": "GATE CS, Software Engineering & Architecture Exams",
    "placementRelevance": "Amazon, Microsoft, Adobe, Atlassian Technical Interview"
  },
  {
    "subject": "OOP",
    "topic": "Design Patterns",
    "subtopic": "Adapter Pattern",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What does the Adapter Pattern accomplish in software integration?",
    "options": [
      "Converts the incompatible interface of an existing class into another interface that callers expect, enabling incompatible classes to collaborate",
      "Connects two network routers",
      "Translates English to Spanish",
      "Encrypts database queries"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Like a hardware wall socket adapter, the software Adapter wraps a legacy or third-party class and exposes the interface required by client code.",
    "tags": [
      "OOP",
      "Design Patterns",
      "Object Oriented Programming",
      "Java",
      "C++",
      "GATE"
    ],
    "examRelevance": "GATE CS, Software Engineering & Architecture Exams",
    "placementRelevance": "Amazon, Microsoft, Adobe, Atlassian Technical Interview"
  },
  {
    "subject": "OOP",
    "topic": "Design Patterns",
    "subtopic": "Proxy Pattern",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is the intent of the Proxy Design Pattern?",
    "options": [
      "Provides a surrogate or placeholder for another object to control access to it (e.g. Virtual Proxy for lazy loading, Security Proxy, Remote Proxy)",
      "Bypasses internet firewalls",
      "Duplicates data across servers",
      "Translates IP addresses"
    ],
    "correctAnswerIndex": 0,
    "explanation": "A Proxy controls access to the underlying real subject, performing lazy initialization, access permission verification, or remote network marshaling.",
    "tags": [
      "OOP",
      "Design Patterns",
      "Object Oriented Programming",
      "Java",
      "C++",
      "GATE"
    ],
    "examRelevance": "GATE CS, Software Engineering & Architecture Exams",
    "placementRelevance": "Amazon, Microsoft, Adobe, Atlassian Technical Interview"
  },
  {
    "subject": "OOP",
    "topic": "Design Patterns",
    "subtopic": "Composite Pattern",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What architectural structure is modeled by the Composite Design Pattern?",
    "options": [
      "Composes objects into tree structures to represent part-whole hierarchies, allowing clients to treat individual objects and compositions uniformly",
      "A queue of background jobs",
      "A circular linked list",
      "A flat relational table"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Leaf nodes and Composite nodes implement the same interface (e.g. `Graphic.draw()` works identically for a single Line or a Group containing 100 shapes).",
    "tags": [
      "OOP",
      "Design Patterns",
      "Object Oriented Programming",
      "Java",
      "C++",
      "GATE"
    ],
    "examRelevance": "GATE CS, Software Engineering & Architecture Exams",
    "placementRelevance": "Amazon, Microsoft, Adobe, Atlassian Technical Interview"
  },
  {
    "subject": "OOP",
    "topic": "Design Patterns",
    "subtopic": "Command Pattern",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "How does the Command Design Pattern facilitate Undo / Redo operations?",
    "options": [
      "Encapsulates a request as an object with `execute()` and `undo()` methods, storing execution parameters and state history in a command stack",
      "Reboots the application on undo",
      "Takes database snapshots on every click",
      "Uses OS virtual memory checkpoints"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Decoupling the invoker from the receiver into an executable object allows queueing commands, logging transactions, and pushing onto an undo history stack.",
    "tags": [
      "OOP",
      "Design Patterns",
      "Object Oriented Programming",
      "Java",
      "C++",
      "GATE"
    ],
    "examRelevance": "GATE CS, Software Engineering & Architecture Exams",
    "placementRelevance": "Amazon, Microsoft, Adobe, Atlassian Technical Interview"
  },
  {
    "subject": "OOP",
    "topic": "Design Patterns",
    "subtopic": "Builder Pattern",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "When is the Builder Pattern preferred over Telescoping Constructors for object creation?",
    "options": [
      "When constructing complex objects with many optional parameters, providing fluent method chaining and immutable final object construction",
      "When classes have no parameters",
      "When only one object will ever exist",
      "To replace inheritance"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Telescoping constructors (`User(a)`, `User(a,b)`, `User(a,b,c)`) are error-prone; Builder allows readable `new User.Builder().setName(...).setAge(...).build()`.",
    "tags": [
      "OOP",
      "Design Patterns",
      "Object Oriented Programming",
      "Java",
      "C++",
      "GATE"
    ],
    "examRelevance": "GATE CS, Software Engineering & Architecture Exams",
    "placementRelevance": "Amazon, Microsoft, Adobe, Atlassian Technical Interview"
  },
  {
    "subject": "OOP",
    "topic": "Design Patterns",
    "subtopic": "State Pattern vs Strategy Pattern",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "While State and Strategy share similar class diagrams, what is the crucial conceptual difference?",
    "options": [
      "In State pattern, the context transitions between different state objects automatically as its internal state changes; Strategy is configured by client",
      "Strategy uses abstract classes; State uses interfaces",
      "State pattern cannot have methods",
      "They are identical in purpose"
    ],
    "correctAnswerIndex": 0,
    "explanation": "In the State pattern (like a Vending Machine), states trigger transitions to next states internally; Strategy simply executes an algorithm chosen by the user.",
    "tags": [
      "OOP",
      "Design Patterns",
      "Object Oriented Programming",
      "Java",
      "C++",
      "GATE"
    ],
    "examRelevance": "GATE CS, Software Engineering & Architecture Exams",
    "placementRelevance": "Amazon, Microsoft, Adobe, Atlassian Technical Interview"
  },
  {
    "subject": "OOP",
    "topic": "Design Patterns",
    "subtopic": "Iterator Pattern",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What does the Iterator Design Pattern provide to collections?",
    "options": [
      "A standard way to access elements of an aggregate collection sequentially without exposing its underlying internal data structure (array, tree, list)",
      "Sorts the collection in ascending order",
      "Encrypts collection elements",
      "Reverses collection order"
    ],
    "correctAnswerIndex": 0,
    "explanation": "`hasNext()` and `next()` decouple traversal algorithms from concrete storage representations (whether balanced BST, linked list, or hash bucket array).",
    "tags": [
      "OOP",
      "Design Patterns",
      "Object Oriented Programming",
      "Java",
      "C++",
      "GATE"
    ],
    "examRelevance": "GATE CS, Software Engineering & Architecture Exams",
    "placementRelevance": "Amazon, Microsoft, Adobe, Atlassian Technical Interview"
  },
  {
    "subject": "OOP",
    "topic": "Design Patterns",
    "subtopic": "Chain of Responsibility",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "How does the Chain of Responsibility Pattern process incoming requests (e.g. HTTP Middleware / Servlet Filters)?",
    "options": [
      "Passes the request along a chain of potential handler objects; each handler decides either to process it or pass it to the next handler in line",
      "Broadcasts request to all objects simultaneously",
      "Puts requests in a database table",
      "Executes handlers in parallel threads"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Handlers link to a successor: an authentication filter inspects request, and if valid, delegates down the chain to logging filter and controller.",
    "tags": [
      "OOP",
      "Design Patterns",
      "Object Oriented Programming",
      "Java",
      "C++",
      "GATE"
    ],
    "examRelevance": "GATE CS, Software Engineering & Architecture Exams",
    "placementRelevance": "Amazon, Microsoft, Adobe, Atlassian Technical Interview"
  }
];
