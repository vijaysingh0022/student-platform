// Programming Question Bank (104 Questions)
export const PROGRAMMING_QUESTIONS = [
  {
    "subject": "PROGRAMMING",
    "topic": "C & C++ Programming",
    "subtopic": "Pointers, Memory & OOP",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "In C, what is the value of sizeof(char*) on a standard 64-bit architecture?",
    "options": [
      "4 bytes",
      "8 bytes",
      "1 byte",
      "16 bytes"
    ],
    "correctAnswerIndex": 1,
    "explanation": "On 64-bit architectures, any memory pointer is 8 bytes (64 bits) wide regardless of the pointee type.",
    "tags": [
      "PROGRAMMING",
      "C & C++ Programming",
      "C",
      "C++",
      "Java",
      "Python",
      "Technical Interview",
      "GATE"
    ],
    "examRelevance": "GATE CS/IT, University Coding Exams, Placement Technical MCQs",
    "placementRelevance": "Amazon, Microsoft, Google, Adobe, Cisco, Oracle Technical Assessments"
  },
  {
    "subject": "PROGRAMMING",
    "topic": "C & C++ Programming",
    "subtopic": "Pointers, Memory & OOP",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "What does the 'free()' function in C do with the pointer passed to it?",
    "options": [
      "Deallocates heap memory associated with the address but leaves the pointer as a dangling pointer",
      "Sets the pointer variable to NULL",
      "Zeros out all contents in memory",
      "Frees the variable from the stack frame"
    ],
    "correctAnswerIndex": 0,
    "explanation": "free(ptr) releases heap memory block back to the allocator, but does NOT reset ptr to NULL, resulting in a dangling pointer unless explicitly assigned.",
    "tags": [
      "PROGRAMMING",
      "C & C++ Programming",
      "C",
      "C++",
      "Java",
      "Python",
      "Technical Interview",
      "GATE"
    ],
    "examRelevance": "GATE CS/IT, University Coding Exams, Placement Technical MCQs",
    "placementRelevance": "Amazon, Microsoft, Google, Adobe, Cisco, Oracle Technical Assessments"
  },
  {
    "subject": "PROGRAMMING",
    "topic": "C & C++ Programming",
    "subtopic": "Pointers, Memory & OOP",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "In C++, what is the difference between malloc() and the 'new' operator?",
    "options": [
      "'new' invokes the object constructor and returns a typed pointer, whereas malloc() merely allocates raw uninitialized bytes",
      "'new' is a C library function; malloc is a C++ keyword",
      "malloc() handles operator overloading",
      "There is no difference in modern C++"
    ],
    "correctAnswerIndex": 0,
    "explanation": "operator new allocates memory and invokes constructors with proper type-safety; malloc() only allocates raw bytes and does not run constructors.",
    "tags": [
      "PROGRAMMING",
      "C & C++ Programming",
      "C",
      "C++",
      "Java",
      "Python",
      "Technical Interview",
      "GATE"
    ],
    "examRelevance": "GATE CS/IT, University Coding Exams, Placement Technical MCQs",
    "placementRelevance": "Amazon, Microsoft, Google, Adobe, Cisco, Oracle Technical Assessments"
  },
  {
    "subject": "PROGRAMMING",
    "topic": "C & C++ Programming",
    "subtopic": "Pointers, Memory & OOP",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "What is Undefined Behavior in C when attempting to write to a string literal like char *s = 'Hello'; s[0] = 'h'?",
    "options": [
      "Compilation error",
      "Segmentation fault / Undefined behavior because string literals reside in read-only memory",
      "Reallocates string on stack",
      "Works as expected in modern compilers"
    ],
    "correctAnswerIndex": 1,
    "explanation": "String literals in C/C++ are stored in the read-only data segment (.rodata). Modifying them causes undefined behavior, typically a SIGSEGV runtime crash.",
    "tags": [
      "PROGRAMMING",
      "C & C++ Programming",
      "C",
      "C++",
      "Java",
      "Python",
      "Technical Interview",
      "GATE"
    ],
    "examRelevance": "GATE CS/IT, University Coding Exams, Placement Technical MCQs",
    "placementRelevance": "Amazon, Microsoft, Google, Adobe, Cisco, Oracle Technical Assessments"
  },
  {
    "subject": "PROGRAMMING",
    "topic": "C & C++ Programming",
    "subtopic": "Pointers, Memory & OOP",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "In C, what does the keyword 'volatile' tell the compiler?",
    "options": [
      "The variable may be modified by hardware or external threads, so do not optimize reads/writes into registers",
      "The variable cannot be changed after initialization",
      "The variable is stored strictly in cache memory",
      "The variable has static duration across translation units"
    ],
    "correctAnswerIndex": 0,
    "explanation": "volatile informs the optimizer that the variable's value may change at any time without any action being taken by the code the compiler finds nearby, preventing register caching.",
    "tags": [
      "PROGRAMMING",
      "C & C++ Programming",
      "C",
      "C++",
      "Java",
      "Python",
      "Technical Interview",
      "GATE"
    ],
    "examRelevance": "GATE CS/IT, University Coding Exams, Placement Technical MCQs",
    "placementRelevance": "Amazon, Microsoft, Google, Adobe, Cisco, Oracle Technical Assessments"
  },
  {
    "subject": "PROGRAMMING",
    "topic": "C & C++ Programming",
    "subtopic": "Pointers, Memory & OOP",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "What is pointer arithmetic result of (ptr + 2) if ptr is an int* pointing to address 0x1000 on a machine where sizeof(int) == 4?",
    "options": [
      "0x1002",
      "0x1008",
      "0x1004",
      "0x1016"
    ],
    "correctAnswerIndex": 1,
    "explanation": "Pointer arithmetic scales offsets by sizeof(type): 0x1000 + 2 * 4 = 0x1000 + 8 = 0x1008.",
    "tags": [
      "PROGRAMMING",
      "C & C++ Programming",
      "C",
      "C++",
      "Java",
      "Python",
      "Technical Interview",
      "GATE"
    ],
    "examRelevance": "GATE CS/IT, University Coding Exams, Placement Technical MCQs",
    "placementRelevance": "Amazon, Microsoft, Google, Adobe, Cisco, Oracle Technical Assessments"
  },
  {
    "subject": "PROGRAMMING",
    "topic": "C & C++ Programming",
    "subtopic": "Pointers, Memory & OOP",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "In C++, what is a virtual destructor and why is it essential in polymorphic base classes?",
    "options": [
      "Ensures derived class destructors are properly called when deleting a derived object through a base class pointer",
      "Speeds up destructor execution at compile time",
      "Prevents private variables from being accessed",
      "Allocates virtual memory for destructor stack frame"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Without a virtual base destructor, deleting a derived instance via a Base* only invokes Base's destructor, causing resource/memory leaks in the derived class.",
    "tags": [
      "PROGRAMMING",
      "C & C++ Programming",
      "C",
      "C++",
      "Java",
      "Python",
      "Technical Interview",
      "GATE"
    ],
    "examRelevance": "GATE CS/IT, University Coding Exams, Placement Technical MCQs",
    "placementRelevance": "Amazon, Microsoft, Google, Adobe, Cisco, Oracle Technical Assessments"
  },
  {
    "subject": "PROGRAMMING",
    "topic": "C & C++ Programming",
    "subtopic": "Pointers, Memory & OOP",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "What is RAII (Resource Acquisition Is Initialization) in C++?",
    "options": [
      "A design idiom where resource lifetime is tied to object lifetime, releasing resources automatically in destructors",
      "A syntax for declaring pointers in header files",
      "An algorithm to detect memory leaks at compile time",
      "A compiler optimization flag"
    ],
    "correctAnswerIndex": 0,
    "explanation": "RAII binds acquisition of resources (files, memory, locks) to constructor and release to destructor (stack unwinding guarantee).",
    "tags": [
      "PROGRAMMING",
      "C & C++ Programming",
      "C",
      "C++",
      "Java",
      "Python",
      "Technical Interview",
      "GATE"
    ],
    "examRelevance": "GATE CS/IT, University Coding Exams, Placement Technical MCQs",
    "placementRelevance": "Amazon, Microsoft, Google, Adobe, Cisco, Oracle Technical Assessments"
  },
  {
    "subject": "PROGRAMMING",
    "topic": "C & C++ Programming",
    "subtopic": "Pointers, Memory & OOP",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is the difference between 'std::unique_ptr' and 'std::shared_ptr' in C++11?",
    "options": [
      "std::unique_ptr represents exclusive ownership with zero overhead; std::shared_ptr maintains a reference-counted control block",
      "unique_ptr can be copied; shared_ptr cannot",
      "shared_ptr has no memory overhead",
      "unique_ptr uses garbage collection"
    ],
    "correctAnswerIndex": 0,
    "explanation": "std::unique_ptr cannot be copied (only moved), giving exclusive ownership with zero overhead; std::shared_ptr uses an atomic reference counter.",
    "tags": [
      "PROGRAMMING",
      "C & C++ Programming",
      "C",
      "C++",
      "Java",
      "Python",
      "Technical Interview",
      "GATE"
    ],
    "examRelevance": "GATE CS/IT, University Coding Exams, Placement Technical MCQs",
    "placementRelevance": "Amazon, Microsoft, Google, Adobe, Cisco, Oracle Technical Assessments"
  },
  {
    "subject": "PROGRAMMING",
    "topic": "C & C++ Programming",
    "subtopic": "Pointers, Memory & OOP",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "In C, what does the 'static' specifier mean when applied to a global function or variable?",
    "options": [
      "Restricts the linkage and visibility of the symbol strictly to the current translation unit (.c file)",
      "Stores the variable in CPU register",
      "Prevents modification of the variable value",
      "Exports the function to dynamic linker"
    ],
    "correctAnswerIndex": 0,
    "explanation": "A static global variable or function has internal linkage, hiding it from other translation units during linking.",
    "tags": [
      "PROGRAMMING",
      "C & C++ Programming",
      "C",
      "C++",
      "Java",
      "Python",
      "Technical Interview",
      "GATE"
    ],
    "examRelevance": "GATE CS/IT, University Coding Exams, Placement Technical MCQs",
    "placementRelevance": "Amazon, Microsoft, Google, Adobe, Cisco, Oracle Technical Assessments"
  },
  {
    "subject": "PROGRAMMING",
    "topic": "C & C++ Programming",
    "subtopic": "Pointers, Memory & OOP",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is a memory leak?",
    "options": [
      "Allocating memory on the heap and losing all references to it without releasing it via free() / delete",
      "Exceeding the stack memory limit via deep recursion",
      "Accessing memory beyond array bounds",
      "Passing null pointer to a function"
    ],
    "correctAnswerIndex": 0,
    "explanation": "A memory leak happens when heap memory is allocated but never freed, while all pointers to that memory are lost.",
    "tags": [
      "PROGRAMMING",
      "C & C++ Programming",
      "C",
      "C++",
      "Java",
      "Python",
      "Technical Interview",
      "GATE"
    ],
    "examRelevance": "GATE CS/IT, University Coding Exams, Placement Technical MCQs",
    "placementRelevance": "Amazon, Microsoft, Google, Adobe, Cisco, Oracle Technical Assessments"
  },
  {
    "subject": "PROGRAMMING",
    "topic": "C & C++ Programming",
    "subtopic": "Pointers, Memory & OOP",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "What does 'std::move' do in C++11?",
    "options": [
      "Unconditionally casts its argument to an rvalue reference, enabling move semantics without copying bytes",
      "Physically copies the bytes into another memory location",
      "Spawns a thread to move data asynchronously",
      "Frees the source object immediately"
    ],
    "correctAnswerIndex": 0,
    "explanation": "std::move performs a static_cast to an rvalue reference (T&&), signaling to move constructors/assignment operators that the resource can be transferred.",
    "tags": [
      "PROGRAMMING",
      "C & C++ Programming",
      "C",
      "C++",
      "Java",
      "Python",
      "Technical Interview",
      "GATE"
    ],
    "examRelevance": "GATE CS/IT, University Coding Exams, Placement Technical MCQs",
    "placementRelevance": "Amazon, Microsoft, Google, Adobe, Cisco, Oracle Technical Assessments"
  },
  {
    "subject": "PROGRAMMING",
    "topic": "C & C++ Programming",
    "subtopic": "Pointers, Memory & OOP",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "In C, what is the output of printf('%d', sizeof(struct { char a; int b; })) on standard 32/64-bit x86?",
    "options": [
      "5",
      "8",
      "4",
      "12"
    ],
    "correctAnswerIndex": 1,
    "explanation": "Due to struct alignment and padding, 3 padding bytes are added after the 1-byte char to align the 4-byte int on a 4-byte boundary, totaling 8 bytes.",
    "tags": [
      "PROGRAMMING",
      "C & C++ Programming",
      "C",
      "C++",
      "Java",
      "Python",
      "Technical Interview",
      "GATE"
    ],
    "examRelevance": "GATE CS/IT, University Coding Exams, Placement Technical MCQs",
    "placementRelevance": "Amazon, Microsoft, Google, Adobe, Cisco, Oracle Technical Assessments"
  },
  {
    "subject": "PROGRAMMING",
    "topic": "C & C++ Programming",
    "subtopic": "Pointers, Memory & OOP",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "What is an inline function in C++?",
    "options": [
      "A hint to the compiler to substitute the function body directly at call sites to eliminate function call overhead",
      "A function that executes in an isolated thread",
      "A function declared inside a lambda expression",
      "A function that can only be called once"
    ],
    "correctAnswerIndex": 0,
    "explanation": "The 'inline' keyword suggests the compiler replace function calls with the actual function code inline, avoiding stack frame push/pop overhead.",
    "tags": [
      "PROGRAMMING",
      "C & C++ Programming",
      "C",
      "C++",
      "Java",
      "Python",
      "Technical Interview",
      "GATE"
    ],
    "examRelevance": "GATE CS/IT, University Coding Exams, Placement Technical MCQs",
    "placementRelevance": "Amazon, Microsoft, Google, Adobe, Cisco, Oracle Technical Assessments"
  },
  {
    "subject": "PROGRAMMING",
    "topic": "C & C++ Programming",
    "subtopic": "Pointers, Memory & OOP",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is a double free vulnerability?",
    "options": [
      "Calling free() or delete twice on the same allocated heap memory pointer, corrupting heap allocator metadata",
      "Allocating twice as much memory as needed",
      "Freeing memory from two different CPU cores simultaneously",
      "Calling delete[] on a single object pointer"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Double free occurs when free() is invoked on an already freed memory address, which can corrupt the free-list structures and lead to severe security exploits.",
    "tags": [
      "PROGRAMMING",
      "C & C++ Programming",
      "C",
      "C++",
      "Java",
      "Python",
      "Technical Interview",
      "GATE"
    ],
    "examRelevance": "GATE CS/IT, University Coding Exams, Placement Technical MCQs",
    "placementRelevance": "Amazon, Microsoft, Google, Adobe, Cisco, Oracle Technical Assessments"
  },
  {
    "subject": "PROGRAMMING",
    "topic": "C & C++ Programming",
    "subtopic": "Pointers, Memory & OOP",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "In C, which header file provides standard fixed-width integer types like int32_t, uint64_t, and int8_t?",
    "options": [
      "<stdint.h>",
      "<stdlib.h>",
      "<limits.h>",
      "<stddef.h>"
    ],
    "correctAnswerIndex": 0,
    "explanation": "<stdint.h> (or <cstdint> in C++) defines exact-width integer types like int32_t and uint64_t across platforms.",
    "tags": [
      "PROGRAMMING",
      "C & C++ Programming",
      "C",
      "C++",
      "Java",
      "Python",
      "Technical Interview",
      "GATE"
    ],
    "examRelevance": "GATE CS/IT, University Coding Exams, Placement Technical MCQs",
    "placementRelevance": "Amazon, Microsoft, Google, Adobe, Cisco, Oracle Technical Assessments"
  },
  {
    "subject": "PROGRAMMING",
    "topic": "C & C++ Programming",
    "subtopic": "Pointers, Memory & OOP",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What does the 'const' qualifier before a member function in C++ indicate (e.g. int get() const;)?",
    "options": [
      "The member function promises not to modify any non-mutable member variables of the calling object",
      "The function returns a constant pointer",
      "The function cannot be overridden in derived classes",
      "The function must be evaluated at compile time"
    ],
    "correctAnswerIndex": 0,
    "explanation": "A const member function cannot modify any non-static, non-mutable member variables and can be invoked on const instances.",
    "tags": [
      "PROGRAMMING",
      "C & C++ Programming",
      "C",
      "C++",
      "Java",
      "Python",
      "Technical Interview",
      "GATE"
    ],
    "examRelevance": "GATE CS/IT, University Coding Exams, Placement Technical MCQs",
    "placementRelevance": "Amazon, Microsoft, Google, Adobe, Cisco, Oracle Technical Assessments"
  },
  {
    "subject": "PROGRAMMING",
    "topic": "C & C++ Programming",
    "subtopic": "Pointers, Memory & OOP",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "In C++, what is the difference between pass-by-reference (&) and pass-by-value?",
    "options": [
      "Pass-by-reference avoids copying the object by passing an alias to the original memory, while pass-by-value makes a full copy",
      "Pass-by-value is faster for large structures",
      "Pass-by-reference creates a copy on the heap",
      "There is no difference in C++20"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Pass-by-reference operates directly on caller's object without invoking copy constructors, making it much more efficient for complex objects.",
    "tags": [
      "PROGRAMMING",
      "C & C++ Programming",
      "C",
      "C++",
      "Java",
      "Python",
      "Technical Interview",
      "GATE"
    ],
    "examRelevance": "GATE CS/IT, University Coding Exams, Placement Technical MCQs",
    "placementRelevance": "Amazon, Microsoft, Google, Adobe, Cisco, Oracle Technical Assessments"
  },
  {
    "subject": "PROGRAMMING",
    "topic": "C & C++ Programming",
    "subtopic": "Pointers, Memory & OOP",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What happens during a stack overflow in a program?",
    "options": [
      "The call stack exceeds its allocated memory limit, usually due to excessive or infinite recursion",
      "Heap memory runs out of space",
      "Variables in main() are overwritten by heap pointers",
      "The CPU cache registers overflow"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Stack overflow occurs when program call stack pointer extends beyond the stack memory boundary, typically due to deep/infinite recursion.",
    "tags": [
      "PROGRAMMING",
      "C & C++ Programming",
      "C",
      "C++",
      "Java",
      "Python",
      "Technical Interview",
      "GATE"
    ],
    "examRelevance": "GATE CS/IT, University Coding Exams, Placement Technical MCQs",
    "placementRelevance": "Amazon, Microsoft, Google, Adobe, Cisco, Oracle Technical Assessments"
  },
  {
    "subject": "PROGRAMMING",
    "topic": "C & C++ Programming",
    "subtopic": "Pointers, Memory & OOP",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "What is an abstract class in C++?",
    "options": [
      "A class containing at least one pure virtual function (= 0), which cannot be instantiated directly",
      "A class with all private members",
      "A class defined inside a function scope",
      "A class that does not have any constructors"
    ],
    "correctAnswerIndex": 0,
    "explanation": "A class with at least one pure virtual function (virtual void f() = 0;) is abstract and cannot be instantiated.",
    "tags": [
      "PROGRAMMING",
      "C & C++ Programming",
      "C",
      "C++",
      "Java",
      "Python",
      "Technical Interview",
      "GATE"
    ],
    "examRelevance": "GATE CS/IT, University Coding Exams, Placement Technical MCQs",
    "placementRelevance": "Amazon, Microsoft, Google, Adobe, Cisco, Oracle Technical Assessments"
  },
  {
    "subject": "PROGRAMMING",
    "topic": "Java Core & JVM",
    "subtopic": "Object Oriented, Concurrency & Collections",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "In Java, what is the key difference between String, StringBuilder, and StringBuffer?",
    "options": [
      "String is immutable; StringBuilder is mutable and non-thread-safe; StringBuffer is mutable and thread-safe (synchronized)",
      "String is mutable; StringBuffer is immutable",
      "StringBuilder is synchronized across threads",
      "They all share identical performance characteristics"
    ],
    "correctAnswerIndex": 0,
    "explanation": "String objects are immutable; StringBuilder provides mutable sequences without thread overhead; StringBuffer synchronizes methods for thread safety.",
    "tags": [
      "PROGRAMMING",
      "Java Core & JVM",
      "C",
      "C++",
      "Java",
      "Python",
      "Technical Interview",
      "GATE"
    ],
    "examRelevance": "GATE CS/IT, University Coding Exams, Placement Technical MCQs",
    "placementRelevance": "Amazon, Microsoft, Google, Adobe, Cisco, Oracle Technical Assessments"
  },
  {
    "subject": "PROGRAMMING",
    "topic": "Java Core & JVM",
    "subtopic": "Object Oriented, Concurrency & Collections",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "Why is String immutable in Java?",
    "options": [
      "For security, caching hash codes, String Pool optimization, and multi-threaded safety",
      "To prevent strings from taking heap space",
      "Because Java does not support character arrays",
      "Due to JVM bytecode limitations"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Immutability allows String Pool reuse, thread-safety without locks, and caching of hashCode() for fast HashMap lookup.",
    "tags": [
      "PROGRAMMING",
      "Java Core & JVM",
      "C",
      "C++",
      "Java",
      "Python",
      "Technical Interview",
      "GATE"
    ],
    "examRelevance": "GATE CS/IT, University Coding Exams, Placement Technical MCQs",
    "placementRelevance": "Amazon, Microsoft, Google, Adobe, Cisco, Oracle Technical Assessments"
  },
  {
    "subject": "PROGRAMMING",
    "topic": "Java Core & JVM",
    "subtopic": "Object Oriented, Concurrency & Collections",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is the difference between '==' and '.equals()' when comparing objects in Java?",
    "options": [
      "'==' compares memory references (addresses), while '.equals()' compares object state/value equivalence",
      "'==' compares values; .equals() compares addresses",
      "They are identical in all classes",
      ".equals() cannot be overridden"
    ],
    "correctAnswerIndex": 0,
    "explanation": "'==' tests referential equality; .equals() is designed to test logical equality (e.g. String contents).",
    "tags": [
      "PROGRAMMING",
      "Java Core & JVM",
      "C",
      "C++",
      "Java",
      "Python",
      "Technical Interview",
      "GATE"
    ],
    "examRelevance": "GATE CS/IT, University Coding Exams, Placement Technical MCQs",
    "placementRelevance": "Amazon, Microsoft, Google, Adobe, Cisco, Oracle Technical Assessments"
  },
  {
    "subject": "PROGRAMMING",
    "topic": "Java Core & JVM",
    "subtopic": "Object Oriented, Concurrency & Collections",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "In Java garbage collection, what are the three main generations of the heap?",
    "options": [
      "Young Generation (Eden, S0, S1), Old (Tenured) Generation, and Metaspace",
      "Stack, Heap, and Code Segment",
      "Primary, Secondary, and Tertiary buffers",
      "L1, L2, and L3 caches"
    ],
    "correctAnswerIndex": 0,
    "explanation": "HotSpot JVM divides heap into Young Generation (Eden and Survivor spaces) for short-lived objects and Old/Tenured Generation for long-lived objects.",
    "tags": [
      "PROGRAMMING",
      "Java Core & JVM",
      "C",
      "C++",
      "Java",
      "Python",
      "Technical Interview",
      "GATE"
    ],
    "examRelevance": "GATE CS/IT, University Coding Exams, Placement Technical MCQs",
    "placementRelevance": "Amazon, Microsoft, Google, Adobe, Cisco, Oracle Technical Assessments"
  },
  {
    "subject": "PROGRAMMING",
    "topic": "Java Core & JVM",
    "subtopic": "Object Oriented, Concurrency & Collections",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is the contract between 'hashCode()' and 'equals()' in Java?",
    "options": [
      "If two objects are equal according to equals(), they must produce the same hashCode(); unequal objects may share hash codes",
      "If two objects have the same hashCode(), they must be equal",
      "hashCode() is only required if equals() returns false",
      "There is no contract between them"
    ],
    "correctAnswerIndex": 0,
    "explanation": "If o1.equals(o2) is true, then o1.hashCode() == o2.hashCode() MUST be true to ensure correct operation in hash-based collections.",
    "tags": [
      "PROGRAMMING",
      "Java Core & JVM",
      "C",
      "C++",
      "Java",
      "Python",
      "Technical Interview",
      "GATE"
    ],
    "examRelevance": "GATE CS/IT, University Coding Exams, Placement Technical MCQs",
    "placementRelevance": "Amazon, Microsoft, Google, Adobe, Cisco, Oracle Technical Assessments"
  },
  {
    "subject": "PROGRAMMING",
    "topic": "Java Core & JVM",
    "subtopic": "Object Oriented, Concurrency & Collections",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "What happens if a class does not implement Serializable in Java and an attempt is made to serialize it?",
    "options": [
      "A NotSerializableException is thrown at runtime",
      "The object is serialized with null fields",
      "The compiler throws a syntax error",
      "JVM automatically implements serialization"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Java object serialization requires classes to implement the marker interface java.io.Serializable, else NotSerializableException is thrown.",
    "tags": [
      "PROGRAMMING",
      "Java Core & JVM",
      "C",
      "C++",
      "Java",
      "Python",
      "Technical Interview",
      "GATE"
    ],
    "examRelevance": "GATE CS/IT, University Coding Exams, Placement Technical MCQs",
    "placementRelevance": "Amazon, Microsoft, Google, Adobe, Cisco, Oracle Technical Assessments"
  },
  {
    "subject": "PROGRAMMING",
    "topic": "Java Core & JVM",
    "subtopic": "Object Oriented, Concurrency & Collections",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is the difference between 'final', 'finally', and 'finalize' in Java?",
    "options": [
      "'final' is a keyword for constants/immutability; 'finally' is a block in exception handling; 'finalize' was a deprecated cleanup method in Object",
      "'final' handles exceptions",
      "'finally' prevents method overriding",
      "All three are exception handlers"
    ],
    "correctAnswerIndex": 0,
    "explanation": "final restricts modification/inheritance; finally guarantees code execution after try/catch; finalize() was an Object lifecycle hook deprecated in Java 9+.",
    "tags": [
      "PROGRAMMING",
      "Java Core & JVM",
      "C",
      "C++",
      "Java",
      "Python",
      "Technical Interview",
      "GATE"
    ],
    "examRelevance": "GATE CS/IT, University Coding Exams, Placement Technical MCQs",
    "placementRelevance": "Amazon, Microsoft, Google, Adobe, Cisco, Oracle Technical Assessments"
  },
  {
    "subject": "PROGRAMMING",
    "topic": "Java Core & JVM",
    "subtopic": "Object Oriented, Concurrency & Collections",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "In Java, can a constructor be private?",
    "options": [
      "Yes, commonly used in Singleton design patterns and utility classes to prevent direct instantiation",
      "No, constructors must always be public",
      "Only in abstract classes",
      "Only if the class implements Cloneable"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Private constructors restrict instantiation from outside the class, a core technique in Singleton and factory patterns.",
    "tags": [
      "PROGRAMMING",
      "Java Core & JVM",
      "C",
      "C++",
      "Java",
      "Python",
      "Technical Interview",
      "GATE"
    ],
    "examRelevance": "GATE CS/IT, University Coding Exams, Placement Technical MCQs",
    "placementRelevance": "Amazon, Microsoft, Google, Adobe, Cisco, Oracle Technical Assessments"
  },
  {
    "subject": "PROGRAMMING",
    "topic": "Java Core & JVM",
    "subtopic": "Object Oriented, Concurrency & Collections",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What does the 'transient' keyword mean in Java?",
    "options": [
      "Specifies that a field should not be serialized when saving the object's state",
      "Makes a variable accessible across threads without locking",
      "Defines a short-lived local variable",
      "Marks a method as asynchronous"
    ],
    "correctAnswerIndex": 0,
    "explanation": "The 'transient' modifier indicates that a member variable should be skipped by Java's default serialization mechanism.",
    "tags": [
      "PROGRAMMING",
      "Java Core & JVM",
      "C",
      "C++",
      "Java",
      "Python",
      "Technical Interview",
      "GATE"
    ],
    "examRelevance": "GATE CS/IT, University Coding Exams, Placement Technical MCQs",
    "placementRelevance": "Amazon, Microsoft, Google, Adobe, Cisco, Oracle Technical Assessments"
  },
  {
    "subject": "PROGRAMMING",
    "topic": "Java Core & JVM",
    "subtopic": "Object Oriented, Concurrency & Collections",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "What is the difference between HashMap and ConcurrentHashMap in Java?",
    "options": [
      "ConcurrentHashMap achieves thread-safety via lock striping / CAS without locking the entire map, unlike Collections.synchronizedMap()",
      "HashMap is thread-safe; ConcurrentHashMap is not",
      "ConcurrentHashMap allows null keys while HashMap does not",
      "ConcurrentHashMap cannot be used in multithreaded environments"
    ],
    "correctAnswerIndex": 0,
    "explanation": "ConcurrentHashMap permits concurrent reads and segment-level or node-level CAS writes, avoiding whole-table lock bottlenecks.",
    "tags": [
      "PROGRAMMING",
      "Java Core & JVM",
      "C",
      "C++",
      "Java",
      "Python",
      "Technical Interview",
      "GATE"
    ],
    "examRelevance": "GATE CS/IT, University Coding Exams, Placement Technical MCQs",
    "placementRelevance": "Amazon, Microsoft, Google, Adobe, Cisco, Oracle Technical Assessments"
  },
  {
    "subject": "PROGRAMMING",
    "topic": "Java Core & JVM",
    "subtopic": "Object Oriented, Concurrency & Collections",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is the Diamond Problem and how does Java 8 solve it with default methods in interfaces?",
    "options": [
      "If two interfaces provide conflicting default implementations of the same method signature, the compiler forces the implementing class to explicitly override it",
      "By choosing the method from the first listed interface",
      "By throwing a runtime exception",
      "Java does not support default methods"
    ],
    "correctAnswerIndex": 0,
    "explanation": "When multiple interfaces declare the same default method, the compiler generates a conflict error, requiring the class to override and resolve the ambiguity.",
    "tags": [
      "PROGRAMMING",
      "Java Core & JVM",
      "C",
      "C++",
      "Java",
      "Python",
      "Technical Interview",
      "GATE"
    ],
    "examRelevance": "GATE CS/IT, University Coding Exams, Placement Technical MCQs",
    "placementRelevance": "Amazon, Microsoft, Google, Adobe, Cisco, Oracle Technical Assessments"
  },
  {
    "subject": "PROGRAMMING",
    "topic": "Java Core & JVM",
    "subtopic": "Object Oriented, Concurrency & Collections",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "What is the purpose of the Java 'ClassLoader'?",
    "options": [
      "Dynamically loading compiled Java .class bytecode files into the JVM runtime memory at execution time",
      "Compiling Java source files to machine assembly",
      "Garbage collecting unused objects",
      "Formatting terminal print statements"
    ],
    "correctAnswerIndex": 0,
    "explanation": "ClassLoader is responsible for loading class bytecodes from disk or network into JVM memory during class loading phase.",
    "tags": [
      "PROGRAMMING",
      "Java Core & JVM",
      "C",
      "C++",
      "Java",
      "Python",
      "Technical Interview",
      "GATE"
    ],
    "examRelevance": "GATE CS/IT, University Coding Exams, Placement Technical MCQs",
    "placementRelevance": "Amazon, Microsoft, Google, Adobe, Cisco, Oracle Technical Assessments"
  },
  {
    "subject": "PROGRAMMING",
    "topic": "Java Core & JVM",
    "subtopic": "Object Oriented, Concurrency & Collections",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is the difference between checked and unchecked exceptions in Java?",
    "options": [
      "Checked exceptions inherit from Exception (excluding RuntimeException) and must be declared or caught; unchecked exceptions inherit from RuntimeException",
      "Checked exceptions cannot be caught in try-catch",
      "Unchecked exceptions are checked by the compiler",
      "All exceptions in Java are checked"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Checked exceptions are enforced by compiler (IOException, SQLException); unchecked exceptions (NullPointerException, ArrayIndexOutOfBounds) happen at runtime.",
    "tags": [
      "PROGRAMMING",
      "Java Core & JVM",
      "C",
      "C++",
      "Java",
      "Python",
      "Technical Interview",
      "GATE"
    ],
    "examRelevance": "GATE CS/IT, University Coding Exams, Placement Technical MCQs",
    "placementRelevance": "Amazon, Microsoft, Google, Adobe, Cisco, Oracle Technical Assessments"
  },
  {
    "subject": "PROGRAMMING",
    "topic": "Java Core & JVM",
    "subtopic": "Object Oriented, Concurrency & Collections",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "In Java multithreading, what is the effect of calling 'Thread.join()'?",
    "options": [
      "Causes the calling thread to pause execution until the thread on which join() was invoked terminates",
      "Kills the target thread immediately",
      "Merges two threads into a single operating system thread",
      "Shares CPU registers between both threads"
    ],
    "correctAnswerIndex": 0,
    "explanation": "t.join() blocks the calling thread until thread 't' finishes execution.",
    "tags": [
      "PROGRAMMING",
      "Java Core & JVM",
      "C",
      "C++",
      "Java",
      "Python",
      "Technical Interview",
      "GATE"
    ],
    "examRelevance": "GATE CS/IT, University Coding Exams, Placement Technical MCQs",
    "placementRelevance": "Amazon, Microsoft, Google, Adobe, Cisco, Oracle Technical Assessments"
  },
  {
    "subject": "PROGRAMMING",
    "topic": "Java Core & JVM",
    "subtopic": "Object Oriented, Concurrency & Collections",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What does the 'volatile' keyword guarantee in Java memory model?",
    "options": [
      "Visibility: reads and writes to the variable are directly flushed to main memory, preventing thread-local caching",
      "Atomicity of compound operations like count++",
      "Mutual exclusion locking like synchronized",
      "Prevention of deadlocks automatically"
    ],
    "correctAnswerIndex": 0,
    "explanation": "In Java, volatile guarantees visibility of updates across threads and prevents instruction reordering, but does NOT provide compound operation atomicity.",
    "tags": [
      "PROGRAMMING",
      "Java Core & JVM",
      "C",
      "C++",
      "Java",
      "Python",
      "Technical Interview",
      "GATE"
    ],
    "examRelevance": "GATE CS/IT, University Coding Exams, Placement Technical MCQs",
    "placementRelevance": "Amazon, Microsoft, Google, Adobe, Cisco, Oracle Technical Assessments"
  },
  {
    "subject": "PROGRAMMING",
    "topic": "Java Core & JVM",
    "subtopic": "Object Oriented, Concurrency & Collections",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "What is the difference between Callable and Runnable interfaces in Java?",
    "options": [
      "Callable can return a value and throw checked exceptions, while Runnable's run() method returns void and cannot throw checked exceptions",
      "Runnable can return an integer exit code",
      "Callable can only be run on single core",
      "They are identical functional interfaces"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Callable<V> has V call() throws Exception; Runnable has void run() without return values or checked exceptions.",
    "tags": [
      "PROGRAMMING",
      "Java Core & JVM",
      "C",
      "C++",
      "Java",
      "Python",
      "Technical Interview",
      "GATE"
    ],
    "examRelevance": "GATE CS/IT, University Coding Exams, Placement Technical MCQs",
    "placementRelevance": "Amazon, Microsoft, Google, Adobe, Cisco, Oracle Technical Assessments"
  },
  {
    "subject": "PROGRAMMING",
    "topic": "Java Core & JVM",
    "subtopic": "Object Oriented, Concurrency & Collections",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is autoboxing and unboxing in Java?",
    "options": [
      "Automatic conversion between primitive types (e.g. int) and their corresponding wrapper object classes (e.g. Integer)",
      "Compiling bytecode into machine code",
      "Serializing objects to JSON",
      "Boxing pointers in memory envelopes"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Autoboxing is the automatic compilation-level conversion of primitives into their wrapper classes (int -> Integer) and vice-versa (unboxing).",
    "tags": [
      "PROGRAMMING",
      "Java Core & JVM",
      "C",
      "C++",
      "Java",
      "Python",
      "Technical Interview",
      "GATE"
    ],
    "examRelevance": "GATE CS/IT, University Coding Exams, Placement Technical MCQs",
    "placementRelevance": "Amazon, Microsoft, Google, Adobe, Cisco, Oracle Technical Assessments"
  },
  {
    "subject": "PROGRAMMING",
    "topic": "Java Core & JVM",
    "subtopic": "Object Oriented, Concurrency & Collections",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "Which garbage collector in Java 11+ is designed for low latency (< 10ms pauses) on large heaps (multi-gigabyte to terabyte)?",
    "options": [
      "ZGC (Z Garbage Collector) and Shenandoah",
      "Serial GC",
      "Parallel Mark Sweep",
      "Classic Mark-Compact"
    ],
    "correctAnswerIndex": 0,
    "explanation": "ZGC and Shenandoah perform nearly all GC work concurrently with running application threads, keeping pause times under 10ms.",
    "tags": [
      "PROGRAMMING",
      "Java Core & JVM",
      "C",
      "C++",
      "Java",
      "Python",
      "Technical Interview",
      "GATE"
    ],
    "examRelevance": "GATE CS/IT, University Coding Exams, Placement Technical MCQs",
    "placementRelevance": "Amazon, Microsoft, Google, Adobe, Cisco, Oracle Technical Assessments"
  },
  {
    "subject": "PROGRAMMING",
    "topic": "Java Core & JVM",
    "subtopic": "Object Oriented, Concurrency & Collections",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is the purpose of 'Optional<T>' introduced in Java 8?",
    "options": [
      "To provide a type-level representation of an optional value, reducing NullPointerExceptions by encouraging explicit handling",
      "To make variables optional in method parameters",
      "To compress data before saving to disk",
      "To create nullable database columns"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Optional<T> represents the presence or absence of a value, replacing null checks with functional methods like .map(), .orElse().",
    "tags": [
      "PROGRAMMING",
      "Java Core & JVM",
      "C",
      "C++",
      "Java",
      "Python",
      "Technical Interview",
      "GATE"
    ],
    "examRelevance": "GATE CS/IT, University Coding Exams, Placement Technical MCQs",
    "placementRelevance": "Amazon, Microsoft, Google, Adobe, Cisco, Oracle Technical Assessments"
  },
  {
    "subject": "PROGRAMMING",
    "topic": "Java Core & JVM",
    "subtopic": "Object Oriented, Concurrency & Collections",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "What is reflection in Java?",
    "options": [
      "The ability of a running program to examine, inspect, and modify its own classes, methods, and fields at runtime",
      "Reflecting graphics on canvas",
      "Reversing string byte order",
      "Mirroring database tables automatically"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Java Reflection allows inspection and invocation of classes, constructors, methods, and fields dynamically at runtime via java.lang.reflect.",
    "tags": [
      "PROGRAMMING",
      "Java Core & JVM",
      "C",
      "C++",
      "Java",
      "Python",
      "Technical Interview",
      "GATE"
    ],
    "examRelevance": "GATE CS/IT, University Coding Exams, Placement Technical MCQs",
    "placementRelevance": "Amazon, Microsoft, Google, Adobe, Cisco, Oracle Technical Assessments"
  },
  {
    "subject": "PROGRAMMING",
    "topic": "Java Core & JVM",
    "subtopic": "Object Oriented, Concurrency & Collections",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What does the '@FunctionalInterface' annotation enforce in Java?",
    "options": [
      "That the interface contains exactly one abstract method, making it eligible for lambda expressions",
      "That the interface has no methods",
      "That all methods inside are pure functions",
      "That the interface cannot be extended"
    ],
    "correctAnswerIndex": 0,
    "explanation": "@FunctionalInterface validates that the interface has precisely one abstract method (SAM), allowing clean lambda usage.",
    "tags": [
      "PROGRAMMING",
      "Java Core & JVM",
      "C",
      "C++",
      "Java",
      "Python",
      "Technical Interview",
      "GATE"
    ],
    "examRelevance": "GATE CS/IT, University Coding Exams, Placement Technical MCQs",
    "placementRelevance": "Amazon, Microsoft, Google, Adobe, Cisco, Oracle Technical Assessments"
  },
  {
    "subject": "PROGRAMMING",
    "topic": "Java Core & JVM",
    "subtopic": "Object Oriented, Concurrency & Collections",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "What is the ForkJoinPool in Java?",
    "options": [
      "An ExecutorService implementation designed for divide-and-conquer parallelism using work-stealing algorithms",
      "A connection pool for JDBC databases",
      "A thread pool for handling HTTP requests in Tomcat",
      "A memory pool for the Java Metaspace"
    ],
    "correctAnswerIndex": 0,
    "explanation": "ForkJoinPool uses work-stealing where idle threads steal tasks from busy thread deques, maximizing multi-core throughput on recursive split tasks.",
    "tags": [
      "PROGRAMMING",
      "Java Core & JVM",
      "C",
      "C++",
      "Java",
      "Python",
      "Technical Interview",
      "GATE"
    ],
    "examRelevance": "GATE CS/IT, University Coding Exams, Placement Technical MCQs",
    "placementRelevance": "Amazon, Microsoft, Google, Adobe, Cisco, Oracle Technical Assessments"
  },
  {
    "subject": "PROGRAMMING",
    "topic": "Python Core & Internals",
    "subtopic": "Language Architecture & Data Structures",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "In Python, what is the Global Interpreter Lock (GIL)?",
    "options": [
      "A mutex that prevents multiple native threads from executing Python bytecodes simultaneously in CPython",
      "A security feature that prevents unauthorized script execution",
      "A mechanism that locks file access in multi-process apps",
      "A database lock used by SQLite in Python"
    ],
    "correctAnswerIndex": 0,
    "explanation": "CPython's GIL ensures only one OS thread executes Python bytecode at a time, simplifying memory management but limiting CPU-bound multithreading.",
    "tags": [
      "PROGRAMMING",
      "Python Core & Internals",
      "C",
      "C++",
      "Java",
      "Python",
      "Technical Interview",
      "GATE"
    ],
    "examRelevance": "GATE CS/IT, University Coding Exams, Placement Technical MCQs",
    "placementRelevance": "Amazon, Microsoft, Google, Adobe, Cisco, Oracle Technical Assessments"
  },
  {
    "subject": "PROGRAMMING",
    "topic": "Python Core & Internals",
    "subtopic": "Language Architecture & Data Structures",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "What is the difference between a Python list and a Python tuple?",
    "options": [
      "Lists are mutable and have dynamic resizing overhead; tuples are immutable, memory-efficient, and can be used as dictionary keys",
      "Tuples are mutable; lists are immutable",
      "Lists cannot contain heterogeneous elements",
      "Tuples cannot be indexed"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Lists are mutable and over-allocated for dynamic append; tuples are fixed-size, immutable, hashable (if elements are hashable), and take less memory.",
    "tags": [
      "PROGRAMMING",
      "Python Core & Internals",
      "C",
      "C++",
      "Java",
      "Python",
      "Technical Interview",
      "GATE"
    ],
    "examRelevance": "GATE CS/IT, University Coding Exams, Placement Technical MCQs",
    "placementRelevance": "Amazon, Microsoft, Google, Adobe, Cisco, Oracle Technical Assessments"
  },
  {
    "subject": "PROGRAMMING",
    "topic": "Python Core & Internals",
    "subtopic": "Language Architecture & Data Structures",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What does the 'yield' keyword do inside a Python function?",
    "options": [
      "Turns the function into a generator that produces values lazily one at a time, preserving execution state between calls",
      "Terminates the program immediately",
      "Yields CPU time to other operating system processes",
      "Returns a completed list of all items"
    ],
    "correctAnswerIndex": 0,
    "explanation": "'yield' creates a generator function, suspending execution and yielding control and a value back to caller until next() is called.",
    "tags": [
      "PROGRAMMING",
      "Python Core & Internals",
      "C",
      "C++",
      "Java",
      "Python",
      "Technical Interview",
      "GATE"
    ],
    "examRelevance": "GATE CS/IT, University Coding Exams, Placement Technical MCQs",
    "placementRelevance": "Amazon, Microsoft, Google, Adobe, Cisco, Oracle Technical Assessments"
  },
  {
    "subject": "PROGRAMMING",
    "topic": "Python Core & Internals",
    "subtopic": "Language Architecture & Data Structures",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "What is the difference between 'is' and '==' in Python?",
    "options": [
      "'is' checks identity (memory address via id()); '==' checks value equality",
      "'is' checks value equality; '==' checks memory address",
      "They are completely interchangeable",
      "'is' can only be used on integers"
    ],
    "correctAnswerIndex": 0,
    "explanation": "'is' verifies that two references point to the exact same object in memory, while '==' tests whether their contents evaluate as equal.",
    "tags": [
      "PROGRAMMING",
      "Python Core & Internals",
      "C",
      "C++",
      "Java",
      "Python",
      "Technical Interview",
      "GATE"
    ],
    "examRelevance": "GATE CS/IT, University Coding Exams, Placement Technical MCQs",
    "placementRelevance": "Amazon, Microsoft, Google, Adobe, Cisco, Oracle Technical Assessments"
  },
  {
    "subject": "PROGRAMMING",
    "topic": "Python Core & Internals",
    "subtopic": "Language Architecture & Data Structures",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "How does Python manage memory and detect unreferenced circular references?",
    "options": [
      "Through reference counting as primary mechanism, coupled with a cyclic garbage collector using generational tracking",
      "Exclusively through mark-and-sweep GC",
      "Through manual malloc and free calls",
      "By allocating all objects on the stack"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Python primarily reclaims memory when reference count drops to 0; cyclic GC periodically detects and collects unreachable circular reference graphs.",
    "tags": [
      "PROGRAMMING",
      "Python Core & Internals",
      "C",
      "C++",
      "Java",
      "Python",
      "Technical Interview",
      "GATE"
    ],
    "examRelevance": "GATE CS/IT, University Coding Exams, Placement Technical MCQs",
    "placementRelevance": "Amazon, Microsoft, Google, Adobe, Cisco, Oracle Technical Assessments"
  },
  {
    "subject": "PROGRAMMING",
    "topic": "Python Core & Internals",
    "subtopic": "Language Architecture & Data Structures",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "What is a Python decorator?",
    "options": [
      "A callable that takes another function or class as an argument and extends its behavior without modifying the original code",
      "A syntax for adding CSS styles to Python scripts",
      "A tool for visualizing AST trees",
      "A class destructor"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Decorators wrap functions or methods using @syntax, executing setup/teardown or modifying arguments and return values dynamically.",
    "tags": [
      "PROGRAMMING",
      "Python Core & Internals",
      "C",
      "C++",
      "Java",
      "Python",
      "Technical Interview",
      "GATE"
    ],
    "examRelevance": "GATE CS/IT, University Coding Exams, Placement Technical MCQs",
    "placementRelevance": "Amazon, Microsoft, Google, Adobe, Cisco, Oracle Technical Assessments"
  },
  {
    "subject": "PROGRAMMING",
    "topic": "Python Core & Internals",
    "subtopic": "Language Architecture & Data Structures",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "In Python, what is the output of: def func(x, a=[]): a.append(x); return a; func(1); print(func(2))?",
    "options": [
      "[1, 2]",
      "[2]",
      "[1]",
      "TypeError"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Default argument expressions in Python are evaluated once at function definition time, so the mutable default list 'a' is shared across calls.",
    "tags": [
      "PROGRAMMING",
      "Python Core & Internals",
      "C",
      "C++",
      "Java",
      "Python",
      "Technical Interview",
      "GATE"
    ],
    "examRelevance": "GATE CS/IT, University Coding Exams, Placement Technical MCQs",
    "placementRelevance": "Amazon, Microsoft, Google, Adobe, Cisco, Oracle Technical Assessments"
  },
  {
    "subject": "PROGRAMMING",
    "topic": "Python Core & Internals",
    "subtopic": "Language Architecture & Data Structures",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "What is the purpose of '*args' and '**kwargs' in Python function definitions?",
    "options": [
      "*args accepts arbitrary positional arguments as a tuple; **kwargs accepts arbitrary keyword arguments as a dictionary",
      "*args passes pointers; **kwargs passes references",
      "*args accepts lists; **kwargs accepts sets",
      "*args is required for recursive calls"
    ],
    "correctAnswerIndex": 0,
    "explanation": "*args packs variable positional arguments into a tuple; **kwargs packs keyword arguments into a dictionary.",
    "tags": [
      "PROGRAMMING",
      "Python Core & Internals",
      "C",
      "C++",
      "Java",
      "Python",
      "Technical Interview",
      "GATE"
    ],
    "examRelevance": "GATE CS/IT, University Coding Exams, Placement Technical MCQs",
    "placementRelevance": "Amazon, Microsoft, Google, Adobe, Cisco, Oracle Technical Assessments"
  },
  {
    "subject": "PROGRAMMING",
    "topic": "Python Core & Internals",
    "subtopic": "Language Architecture & Data Structures",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is list comprehension in Python?",
    "options": [
      "A concise syntax for creating new lists by transforming or filtering elements from an existing iterable",
      "A method for compressing lists into zip archives",
      "A sorting algorithm optimized for Python lists",
      "A type-checking assertion for lists"
    ],
    "correctAnswerIndex": 0,
    "explanation": "List comprehensions [expr for item in iterable if condition] provide a compact, readable, and C-optimized way to construct lists.",
    "tags": [
      "PROGRAMMING",
      "Python Core & Internals",
      "C",
      "C++",
      "Java",
      "Python",
      "Technical Interview",
      "GATE"
    ],
    "examRelevance": "GATE CS/IT, University Coding Exams, Placement Technical MCQs",
    "placementRelevance": "Amazon, Microsoft, Google, Adobe, Cisco, Oracle Technical Assessments"
  },
  {
    "subject": "PROGRAMMING",
    "topic": "Python Core & Internals",
    "subtopic": "Language Architecture & Data Structures",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "What does 'if __name__ == \"__main__\":' do in a Python script?",
    "options": [
      "Ensures the enclosed code block only executes when the file is run directly, not when imported as a module",
      "Validates that the file has a main() function",
      "Compiles the script to .pyc format",
      "Runs the script as root superuser"
    ],
    "correctAnswerIndex": 0,
    "explanation": "When run directly, __name__ is set to '__main__'; when imported, __name__ matches the module name, preventing auto-execution of script logic.",
    "tags": [
      "PROGRAMMING",
      "Python Core & Internals",
      "C",
      "C++",
      "Java",
      "Python",
      "Technical Interview",
      "GATE"
    ],
    "examRelevance": "GATE CS/IT, University Coding Exams, Placement Technical MCQs",
    "placementRelevance": "Amazon, Microsoft, Google, Adobe, Cisco, Oracle Technical Assessments"
  },
  {
    "subject": "PROGRAMMING",
    "topic": "Python Core & Internals",
    "subtopic": "Language Architecture & Data Structures",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is the difference between shallow copy and deep copy in Python?",
    "options": [
      "Shallow copy constructs a new collection with references to the original child objects; deep copy recursively copies child objects",
      "Deep copy is faster than shallow copy",
      "Shallow copy copies all nested objects recursively",
      "There is no difference for primitive types"
    ],
    "correctAnswerIndex": 0,
    "explanation": "copy.copy() duplicates container only; copy.deepcopy() duplicates container and all nested objects recursively, preventing side-effects.",
    "tags": [
      "PROGRAMMING",
      "Python Core & Internals",
      "C",
      "C++",
      "Java",
      "Python",
      "Technical Interview",
      "GATE"
    ],
    "examRelevance": "GATE CS/IT, University Coding Exams, Placement Technical MCQs",
    "placementRelevance": "Amazon, Microsoft, Google, Adobe, Cisco, Oracle Technical Assessments"
  },
  {
    "subject": "PROGRAMMING",
    "topic": "Python Core & Internals",
    "subtopic": "Language Architecture & Data Structures",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "In Python, what is the method resolution order (MRO) algorithm used for multiple inheritance?",
    "options": [
      "C3 Superclass Linearization algorithm",
      "Depth First Search (DFS)",
      "Breadth First Search (BFS)",
      "Random Selection"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Python uses the C3 Linearization algorithm to determine a deterministic, monotonic Method Resolution Order in multiple inheritance hierarchies.",
    "tags": [
      "PROGRAMMING",
      "Python Core & Internals",
      "C",
      "C++",
      "Java",
      "Python",
      "Technical Interview",
      "GATE"
    ],
    "examRelevance": "GATE CS/IT, University Coding Exams, Placement Technical MCQs",
    "placementRelevance": "Amazon, Microsoft, Google, Adobe, Cisco, Oracle Technical Assessments"
  },
  {
    "subject": "PROGRAMMING",
    "topic": "Python Core & Internals",
    "subtopic": "Language Architecture & Data Structures",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What are Python's dunder (magic) methods, like '__init__' and '__str__'?",
    "options": [
      "Special methods with double underscores that emulate built-in behavior, operator overloading, and lifecycle protocols",
      "Private methods that cannot be called by users",
      "Deprecated Python 2 methods",
      "Hardware-accelerated C-extensions"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Dunder methods define object behavior for core operations (e.g. len(obj) -> __len__, obj1 + obj2 -> __add__).",
    "tags": [
      "PROGRAMMING",
      "Python Core & Internals",
      "C",
      "C++",
      "Java",
      "Python",
      "Technical Interview",
      "GATE"
    ],
    "examRelevance": "GATE CS/IT, University Coding Exams, Placement Technical MCQs",
    "placementRelevance": "Amazon, Microsoft, Google, Adobe, Cisco, Oracle Technical Assessments"
  },
  {
    "subject": "PROGRAMMING",
    "topic": "Python Core & Internals",
    "subtopic": "Language Architecture & Data Structures",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "What is the difference between 'range()' and 'list(range())' in Python 3?",
    "options": [
      "range() returns an immutable sequence generator object that computes values on demand in O(1) memory; list(range()) materializes all integers into memory",
      "range() loads all numbers in memory immediately",
      "range() can only go up to 1000",
      "They consume identical memory"
    ],
    "correctAnswerIndex": 0,
    "explanation": "range() produces numbers lazily on iteration, consuming O(1) space regardless of range magnitude.",
    "tags": [
      "PROGRAMMING",
      "Python Core & Internals",
      "C",
      "C++",
      "Java",
      "Python",
      "Technical Interview",
      "GATE"
    ],
    "examRelevance": "GATE CS/IT, University Coding Exams, Placement Technical MCQs",
    "placementRelevance": "Amazon, Microsoft, Google, Adobe, Cisco, Oracle Technical Assessments"
  },
  {
    "subject": "PROGRAMMING",
    "topic": "Python Core & Internals",
    "subtopic": "Language Architecture & Data Structures",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What does the 'with' statement do in Python (Context Managers)?",
    "options": [
      "Guarantees resource setup and teardown by invoking __enter__() on entry and __exit__() on block termination, even if exceptions occur",
      "Runs the code block in parallel with background threads",
      "Suppresses all syntax errors inside the block",
      "Enables type safety validation on variables"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Context managers encapsulate try...finally logic for clean resource management (e.g. automatically closing open files or releasing locks).",
    "tags": [
      "PROGRAMMING",
      "Python Core & Internals",
      "C",
      "C++",
      "Java",
      "Python",
      "Technical Interview",
      "GATE"
    ],
    "examRelevance": "GATE CS/IT, University Coding Exams, Placement Technical MCQs",
    "placementRelevance": "Amazon, Microsoft, Google, Adobe, Cisco, Oracle Technical Assessments"
  },
  {
    "subject": "PROGRAMMING",
    "topic": "Python Core & Internals",
    "subtopic": "Language Architecture & Data Structures",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "What is duck typing in Python?",
    "options": [
      "'If it walks like a duck and quacks like a duck, it's a duck' - dynamic type checking based on an object's methods/properties rather than inheritance",
      "A static type check performed before runtime",
      "A technique for mocking unit tests",
      "Converting all objects to string representations"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Duck typing focuses on what methods and attributes an object provides rather than its explicit class hierarchy.",
    "tags": [
      "PROGRAMMING",
      "Python Core & Internals",
      "C",
      "C++",
      "Java",
      "Python",
      "Technical Interview",
      "GATE"
    ],
    "examRelevance": "GATE CS/IT, University Coding Exams, Placement Technical MCQs",
    "placementRelevance": "Amazon, Microsoft, Google, Adobe, Cisco, Oracle Technical Assessments"
  },
  {
    "subject": "PROGRAMMING",
    "topic": "Python Core & Internals",
    "subtopic": "Language Architecture & Data Structures",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is the purpose of 'collections.defaultdict' in Python?",
    "options": [
      "A dictionary subclass that returns a default value via a factory function whenever a missing key is accessed",
      "A dictionary that sorts keys automatically",
      "A dictionary that limits maximum size like LRU",
      "A thread-safe read-only dictionary"
    ],
    "correctAnswerIndex": 0,
    "explanation": "defaultdict avoids KeyError exceptions by calling a default factory (e.g., list, int) when a nonexistent key is accessed.",
    "tags": [
      "PROGRAMMING",
      "Python Core & Internals",
      "C",
      "C++",
      "Java",
      "Python",
      "Technical Interview",
      "GATE"
    ],
    "examRelevance": "GATE CS/IT, University Coding Exams, Placement Technical MCQs",
    "placementRelevance": "Amazon, Microsoft, Google, Adobe, Cisco, Oracle Technical Assessments"
  },
  {
    "subject": "PROGRAMMING",
    "topic": "Python Core & Internals",
    "subtopic": "Language Architecture & Data Structures",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "What is the time complexity of searching for a key in a Python dictionary on average?",
    "options": [
      "O(1) average time via hash table lookup",
      "O(N) linear search",
      "O(log N) binary search",
      "O(N^2) quadratic scan"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Python dictionaries are implemented as high-performance open-addressing hash tables, yielding average O(1) lookup, insertion, and deletion.",
    "tags": [
      "PROGRAMMING",
      "Python Core & Internals",
      "C",
      "C++",
      "Java",
      "Python",
      "Technical Interview",
      "GATE"
    ],
    "examRelevance": "GATE CS/IT, University Coding Exams, Placement Technical MCQs",
    "placementRelevance": "Amazon, Microsoft, Google, Adobe, Cisco, Oracle Technical Assessments"
  },
  {
    "subject": "PROGRAMMING",
    "topic": "Python Core & Internals",
    "subtopic": "Language Architecture & Data Structures",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What does 'sys.getrefcount(obj)' return in Python?",
    "options": [
      "The current reference count of the object (including the temporary reference passed to getrefcount itself)",
      "The memory address of the object in hex",
      "The number of child attributes on the object",
      "The number of times the object was cloned"
    ],
    "correctAnswerIndex": 0,
    "explanation": "sys.getrefcount(obj) returns the active reference count, which is always 1 higher than expected due to the function call parameter itself.",
    "tags": [
      "PROGRAMMING",
      "Python Core & Internals",
      "C",
      "C++",
      "Java",
      "Python",
      "Technical Interview",
      "GATE"
    ],
    "examRelevance": "GATE CS/IT, University Coding Exams, Placement Technical MCQs",
    "placementRelevance": "Amazon, Microsoft, Google, Adobe, Cisco, Oracle Technical Assessments"
  },
  {
    "subject": "PROGRAMMING",
    "topic": "Python Core & Internals",
    "subtopic": "Language Architecture & Data Structures",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "What is the purpose of 'functools.lru_cache' in Python?",
    "options": [
      "A decorator that wraps a function with a memoizing callable that saves up to maxsize recent call results",
      "A cache for storing database connections",
      "A file compressor for python modules",
      "An operating system process scheduler"
    ],
    "correctAnswerIndex": 0,
    "explanation": "lru_cache memoizes function return values based on arguments, discarding least recently used results when capacity is exceeded.",
    "tags": [
      "PROGRAMMING",
      "Python Core & Internals",
      "C",
      "C++",
      "Java",
      "Python",
      "Technical Interview",
      "GATE"
    ],
    "examRelevance": "GATE CS/IT, University Coding Exams, Placement Technical MCQs",
    "placementRelevance": "Amazon, Microsoft, Google, Adobe, Cisco, Oracle Technical Assessments"
  },
  {
    "subject": "PROGRAMMING",
    "topic": "Python Core & Internals",
    "subtopic": "Language Architecture & Data Structures",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What does 'async' and 'await' syntax enable in Python?",
    "options": [
      "Writing asynchronous, non-blocking coroutines managed by the asyncio event loop for high-concurrency I/O operations",
      "Running code on multiple CPU cores in parallel",
      "Compiling Python functions to C binaries",
      "Disabling the Global Interpreter Lock"
    ],
    "correctAnswerIndex": 0,
    "explanation": "async/await allows asynchronous cooperative multitasking over an event loop, ideal for network requests and I/O-heavy applications.",
    "tags": [
      "PROGRAMMING",
      "Python Core & Internals",
      "C",
      "C++",
      "Java",
      "Python",
      "Technical Interview",
      "GATE"
    ],
    "examRelevance": "GATE CS/IT, University Coding Exams, Placement Technical MCQs",
    "placementRelevance": "Amazon, Microsoft, Google, Adobe, Cisco, Oracle Technical Assessments"
  },
  {
    "subject": "PROGRAMMING",
    "topic": "Python Core & Internals",
    "subtopic": "Language Architecture & Data Structures",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "What is the difference between '@staticmethod' and '@classmethod' in Python?",
    "options": [
      "@classmethod receives the class 'cls' as the first implicit parameter; @staticmethod receives no implicit first argument",
      "@staticmethod receives the instance 'self'",
      "@classmethod cannot access class attributes",
      "They are identical decorators"
    ],
    "correctAnswerIndex": 0,
    "explanation": "@classmethod is bound to the class and gets 'cls' as its first parameter, while @staticmethod behaves like a regular function placed inside a class namespace.",
    "tags": [
      "PROGRAMMING",
      "Python Core & Internals",
      "C",
      "C++",
      "Java",
      "Python",
      "Technical Interview",
      "GATE"
    ],
    "examRelevance": "GATE CS/IT, University Coding Exams, Placement Technical MCQs",
    "placementRelevance": "Amazon, Microsoft, Google, Adobe, Cisco, Oracle Technical Assessments"
  },
  {
    "subject": "PROGRAMMING",
    "topic": "Algorithms & System Concepts",
    "subtopic": "Bit Manipulation & Concurrency",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What does the bitwise expression 'x & (x - 1)' do in binary arithmetic?",
    "options": [
      "Clears the lowest set bit (rightmost 1) of integer x",
      "Checks if x is an odd number",
      "Sets the highest bit of x to 1",
      "Reverses the bit order of x"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Subtracting 1 flips all bits after and including the rightmost 1; ANDing with x clears that lowest set bit. Common for Brian Kernighan's bit count algorithm.",
    "tags": [
      "PROGRAMMING",
      "Algorithms & System Concepts",
      "C",
      "C++",
      "Java",
      "Python",
      "Technical Interview",
      "GATE"
    ],
    "examRelevance": "GATE CS/IT, University Coding Exams, Placement Technical MCQs",
    "placementRelevance": "Amazon, Microsoft, Google, Adobe, Cisco, Oracle Technical Assessments"
  },
  {
    "subject": "PROGRAMMING",
    "topic": "Algorithms & System Concepts",
    "subtopic": "Bit Manipulation & Concurrency",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "How do you check if an integer x > 0 is a power of 2 using bit manipulation?",
    "options": [
      "(x & (x - 1)) == 0",
      "(x | (x + 1)) == 0",
      "(x ^ (x - 1)) == 0",
      "(~x & x) == 1"
    ],
    "correctAnswerIndex": 0,
    "explanation": "A power of 2 has exactly one set bit in binary. Therefore x & (x - 1) will clear that bit and equal 0.",
    "tags": [
      "PROGRAMMING",
      "Algorithms & System Concepts",
      "C",
      "C++",
      "Java",
      "Python",
      "Technical Interview",
      "GATE"
    ],
    "examRelevance": "GATE CS/IT, University Coding Exams, Placement Technical MCQs",
    "placementRelevance": "Amazon, Microsoft, Google, Adobe, Cisco, Oracle Technical Assessments"
  },
  {
    "subject": "PROGRAMMING",
    "topic": "Algorithms & System Concepts",
    "subtopic": "Bit Manipulation & Concurrency",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is the result of 'x ^ x' (XORing any number with itself)?",
    "options": [
      "0",
      "x",
      "1",
      "~x"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Any number XORed with itself produces 0 because identical bits cancel out.",
    "tags": [
      "PROGRAMMING",
      "Algorithms & System Concepts",
      "C",
      "C++",
      "Java",
      "Python",
      "Technical Interview",
      "GATE"
    ],
    "examRelevance": "GATE CS/IT, University Coding Exams, Placement Technical MCQs",
    "placementRelevance": "Amazon, Microsoft, Google, Adobe, Cisco, Oracle Technical Assessments"
  },
  {
    "subject": "PROGRAMMING",
    "topic": "Algorithms & System Concepts",
    "subtopic": "Bit Manipulation & Concurrency",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "How can you swap two integer variables a and b in-place without using a temporary variable?",
    "options": [
      "a = a ^ b; b = a ^ b; a = a ^ b;",
      "a = a & b; b = a | b; a = a & b;",
      "a = a + b; b = a + b; a = a - b;",
      "a = a << 1; b = b >> 1;"
    ],
    "correctAnswerIndex": 0,
    "explanation": "XOR swap algorithm: a=a^b; b=a^b; a=a^b swaps values without auxiliary memory.",
    "tags": [
      "PROGRAMMING",
      "Algorithms & System Concepts",
      "C",
      "C++",
      "Java",
      "Python",
      "Technical Interview",
      "GATE"
    ],
    "examRelevance": "GATE CS/IT, University Coding Exams, Placement Technical MCQs",
    "placementRelevance": "Amazon, Microsoft, Google, Adobe, Cisco, Oracle Technical Assessments"
  },
  {
    "subject": "PROGRAMMING",
    "topic": "Algorithms & System Concepts",
    "subtopic": "Bit Manipulation & Concurrency",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is the time complexity of finding the single non-repeating number in an array where every other number appears twice?",
    "options": [
      "O(N) time and O(1) space using cumulative XOR",
      "O(N log N) using sorting",
      "O(N) time and O(N) space using HashSet",
      "O(N^2) using nested loops"
    ],
    "correctAnswerIndex": 0,
    "explanation": "XORing all elements cancels out duplicate pairs (x ^ x = 0), leaving only the single unique element in linear time and constant space.",
    "tags": [
      "PROGRAMMING",
      "Algorithms & System Concepts",
      "C",
      "C++",
      "Java",
      "Python",
      "Technical Interview",
      "GATE"
    ],
    "examRelevance": "GATE CS/IT, University Coding Exams, Placement Technical MCQs",
    "placementRelevance": "Amazon, Microsoft, Google, Adobe, Cisco, Oracle Technical Assessments"
  },
  {
    "subject": "PROGRAMMING",
    "topic": "Algorithms & System Concepts",
    "subtopic": "Bit Manipulation & Concurrency",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "In recursion, what is the 'base case'?",
    "options": [
      "The terminating condition that stops recursive calls and begins returning values, preventing infinite stack recursion",
      "The maximum number of parameters a function accepts",
      "The first instruction inside the main() function",
      "The initial stack pointer address"
    ],
    "correctAnswerIndex": 0,
    "explanation": "The base case defines when the recursion stops; without it, the function calls itself indefinitely until stack overflow.",
    "tags": [
      "PROGRAMMING",
      "Algorithms & System Concepts",
      "C",
      "C++",
      "Java",
      "Python",
      "Technical Interview",
      "GATE"
    ],
    "examRelevance": "GATE CS/IT, University Coding Exams, Placement Technical MCQs",
    "placementRelevance": "Amazon, Microsoft, Google, Adobe, Cisco, Oracle Technical Assessments"
  },
  {
    "subject": "PROGRAMMING",
    "topic": "Algorithms & System Concepts",
    "subtopic": "Bit Manipulation & Concurrency",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is tail recursion?",
    "options": [
      "A recursive call where the function call is the very last operation performed before returning, allowing compilers to optimize away stack frames",
      "A recursion that iterates from back of an array",
      "A recursion with two recursive branches",
      "A recursion that throws exceptions"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Tail call optimization (TCO) allows compilers to reuse the current stack frame for the next call when the return value depends solely on the recursive call.",
    "tags": [
      "PROGRAMMING",
      "Algorithms & System Concepts",
      "C",
      "C++",
      "Java",
      "Python",
      "Technical Interview",
      "GATE"
    ],
    "examRelevance": "GATE CS/IT, University Coding Exams, Placement Technical MCQs",
    "placementRelevance": "Amazon, Microsoft, Google, Adobe, Cisco, Oracle Technical Assessments"
  },
  {
    "subject": "PROGRAMMING",
    "topic": "Algorithms & System Concepts",
    "subtopic": "Bit Manipulation & Concurrency",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "What is the auxiliary space complexity of calculating Fibonacci number recursively with memoization (top-down DP)?",
    "options": [
      "O(N) space for recursion stack and memo table",
      "O(1) space",
      "O(2^N) exponential space",
      "O(N^2) space"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Memoized recursion requires O(N) space for storing precomputed values in an array/map and O(N) max call stack depth.",
    "tags": [
      "PROGRAMMING",
      "Algorithms & System Concepts",
      "C",
      "C++",
      "Java",
      "Python",
      "Technical Interview",
      "GATE"
    ],
    "examRelevance": "GATE CS/IT, University Coding Exams, Placement Technical MCQs",
    "placementRelevance": "Amazon, Microsoft, Google, Adobe, Cisco, Oracle Technical Assessments"
  },
  {
    "subject": "PROGRAMMING",
    "topic": "Algorithms & System Concepts",
    "subtopic": "Bit Manipulation & Concurrency",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What does the expression '1 << k' evaluate to in bitwise operations?",
    "options": [
      "2 raised to the power of k (2^k)",
      "k multiplied by 2",
      "1 divided by 2^k",
      "k bits set to 1"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Left shifting 1 by k positions shifts the single bit to the k-th position, which represents 2^k.",
    "tags": [
      "PROGRAMMING",
      "Algorithms & System Concepts",
      "C",
      "C++",
      "Java",
      "Python",
      "Technical Interview",
      "GATE"
    ],
    "examRelevance": "GATE CS/IT, University Coding Exams, Placement Technical MCQs",
    "placementRelevance": "Amazon, Microsoft, Google, Adobe, Cisco, Oracle Technical Assessments"
  },
  {
    "subject": "PROGRAMMING",
    "topic": "Algorithms & System Concepts",
    "subtopic": "Bit Manipulation & Concurrency",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "How can you check if the k-th bit of an integer n is set (1) or not?",
    "options": [
      "(n & (1 << k)) != 0",
      "(n | (1 << k)) == 0",
      "(n ^ (1 << k)) == 0",
      "(n >> k) == 0"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Bitmask (1 << k) isolates the k-th bit; bitwise AND with n returns non-zero if the k-th bit is set.",
    "tags": [
      "PROGRAMMING",
      "Algorithms & System Concepts",
      "C",
      "C++",
      "Java",
      "Python",
      "Technical Interview",
      "GATE"
    ],
    "examRelevance": "GATE CS/IT, University Coding Exams, Placement Technical MCQs",
    "placementRelevance": "Amazon, Microsoft, Google, Adobe, Cisco, Oracle Technical Assessments"
  },
  {
    "subject": "PROGRAMMING",
    "topic": "Algorithms & System Concepts",
    "subtopic": "Bit Manipulation & Concurrency",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What does the two's complement of an integer n represent in binary systems?",
    "options": [
      "Negative n (-n), computed as ~n + 1",
      "The absolute value of n",
      "n multiplied by -2",
      "The bit reversal of n"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Two's complement is standard for representing signed integers; negating n is achieved by inverting all bits and adding 1 (~n + 1).",
    "tags": [
      "PROGRAMMING",
      "Algorithms & System Concepts",
      "C",
      "C++",
      "Java",
      "Python",
      "Technical Interview",
      "GATE"
    ],
    "examRelevance": "GATE CS/IT, University Coding Exams, Placement Technical MCQs",
    "placementRelevance": "Amazon, Microsoft, Google, Adobe, Cisco, Oracle Technical Assessments"
  },
  {
    "subject": "PROGRAMMING",
    "topic": "Algorithms & System Concepts",
    "subtopic": "Bit Manipulation & Concurrency",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "What is the output of '7 >> 1' (bitwise right shift of 7 by 1)?",
    "options": [
      "3",
      "14",
      "1",
      "6"
    ],
    "correctAnswerIndex": 0,
    "explanation": "7 in binary is 0111. Right shifting by 1 yields 0011, which is 3 (integer division 7 // 2).",
    "tags": [
      "PROGRAMMING",
      "Algorithms & System Concepts",
      "C",
      "C++",
      "Java",
      "Python",
      "Technical Interview",
      "GATE"
    ],
    "examRelevance": "GATE CS/IT, University Coding Exams, Placement Technical MCQs",
    "placementRelevance": "Amazon, Microsoft, Google, Adobe, Cisco, Oracle Technical Assessments"
  },
  {
    "subject": "PROGRAMMING",
    "topic": "Algorithms & System Concepts",
    "subtopic": "Bit Manipulation & Concurrency",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "In C/C++, what does 'sizeof' operator evaluate at?",
    "options": [
      "Compile time (except for C99 variable-length arrays)",
      "Runtime dynamically",
      "Linker time",
      "Preprocessor phase"
    ],
    "correctAnswerIndex": 0,
    "explanation": "sizeof is evaluated at compile time by determining the size of the expression's static type, incurring zero runtime overhead.",
    "tags": [
      "PROGRAMMING",
      "Algorithms & System Concepts",
      "C",
      "C++",
      "Java",
      "Python",
      "Technical Interview",
      "GATE"
    ],
    "examRelevance": "GATE CS/IT, University Coding Exams, Placement Technical MCQs",
    "placementRelevance": "Amazon, Microsoft, Google, Adobe, Cisco, Oracle Technical Assessments"
  },
  {
    "subject": "PROGRAMMING",
    "topic": "Algorithms & System Concepts",
    "subtopic": "Bit Manipulation & Concurrency",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "What is an iterative solution's primary advantage over an equivalent naive recursive solution?",
    "options": [
      "Avoids function call overhead and risks of call stack overflow",
      "Always takes fewer lines of code",
      "Executes with O(1) time complexity",
      "Automatically vectorizes on the GPU"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Iterative loops use fixed stack space, eliminating the overhead of pushing and popping stack frames and avoiding stack overflow.",
    "tags": [
      "PROGRAMMING",
      "Algorithms & System Concepts",
      "C",
      "C++",
      "Java",
      "Python",
      "Technical Interview",
      "GATE"
    ],
    "examRelevance": "GATE CS/IT, University Coding Exams, Placement Technical MCQs",
    "placementRelevance": "Amazon, Microsoft, Google, Adobe, Cisco, Oracle Technical Assessments"
  },
  {
    "subject": "PROGRAMMING",
    "topic": "Algorithms & System Concepts",
    "subtopic": "Bit Manipulation & Concurrency",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is the maximum number of recursive calls on the call stack during QuickSort in the worst-case vs best-case with tail-call elimination?",
    "options": [
      "O(N) worst case, O(log N) best/average case",
      "O(1) in all cases",
      "O(N^2) in all cases",
      "O(log N) in worst case"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Without optimizations, unbalanced partitions result in recursion depth of O(N). When recursing on smaller subproblem first, depth is at most O(log N).",
    "tags": [
      "PROGRAMMING",
      "Algorithms & System Concepts",
      "C",
      "C++",
      "Java",
      "Python",
      "Technical Interview",
      "GATE"
    ],
    "examRelevance": "GATE CS/IT, University Coding Exams, Placement Technical MCQs",
    "placementRelevance": "Amazon, Microsoft, Google, Adobe, Cisco, Oracle Technical Assessments"
  },
  {
    "subject": "PROGRAMMING",
    "topic": "Algorithms & System Concepts",
    "subtopic": "Bit Manipulation & Concurrency",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "How many bits are needed to represent an unsigned integer N in binary?",
    "options": [
      "floor(log2(N)) + 1",
      "log10(N)",
      "N / 2",
      "2^N"
    ],
    "correctAnswerIndex": 0,
    "explanation": "The number of bits required to represent integer N in binary is floor(log2(N)) + 1.",
    "tags": [
      "PROGRAMMING",
      "Algorithms & System Concepts",
      "C",
      "C++",
      "Java",
      "Python",
      "Technical Interview",
      "GATE"
    ],
    "examRelevance": "GATE CS/IT, University Coding Exams, Placement Technical MCQs",
    "placementRelevance": "Amazon, Microsoft, Google, Adobe, Cisco, Oracle Technical Assessments"
  },
  {
    "subject": "PROGRAMMING",
    "topic": "Algorithms & System Concepts",
    "subtopic": "Bit Manipulation & Concurrency",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is the effect of '~0' (bitwise NOT of 0) in two's complement representation?",
    "options": [
      "-1 (all bits set to 1)",
      "0",
      "1",
      "Undefined"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Bitwise NOT of all 0s produces all 1s, which represents -1 in two's complement arithmetic.",
    "tags": [
      "PROGRAMMING",
      "Algorithms & System Concepts",
      "C",
      "C++",
      "Java",
      "Python",
      "Technical Interview",
      "GATE"
    ],
    "examRelevance": "GATE CS/IT, University Coding Exams, Placement Technical MCQs",
    "placementRelevance": "Amazon, Microsoft, Google, Adobe, Cisco, Oracle Technical Assessments"
  },
  {
    "subject": "PROGRAMMING",
    "topic": "Algorithms & System Concepts",
    "subtopic": "Bit Manipulation & Concurrency",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "In dynamic programming, what is the difference between Tabulation and Memoization?",
    "options": [
      "Tabulation is bottom-up iterative; Memoization is top-down recursive with caching",
      "Tabulation is top-down; Memoization is bottom-up",
      "Memoization never uses memory",
      "Tabulation only works on trees"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Tabulation fills a DP table iteratively starting from base cases; Memoization preserves the recursive structure and stores computed results.",
    "tags": [
      "PROGRAMMING",
      "Algorithms & System Concepts",
      "C",
      "C++",
      "Java",
      "Python",
      "Technical Interview",
      "GATE"
    ],
    "examRelevance": "GATE CS/IT, University Coding Exams, Placement Technical MCQs",
    "placementRelevance": "Amazon, Microsoft, Google, Adobe, Cisco, Oracle Technical Assessments"
  },
  {
    "subject": "PROGRAMMING",
    "topic": "Algorithms & System Concepts",
    "subtopic": "Bit Manipulation & Concurrency",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What does the expression 'x & (-x)' isolate in binary representation of x?",
    "options": [
      "The lowest set bit of x as a power of 2",
      "The highest set bit of x",
      "The value of x without the sign bit",
      "All bits of x inverted"
    ],
    "correctAnswerIndex": 0,
    "explanation": "In two's complement, -x = ~x + 1. Performing x & (-x) isolates the lowest set bit (e.g. 12 (1100) & -12 = 4 (0100)). Used in Fenwick trees.",
    "tags": [
      "PROGRAMMING",
      "Algorithms & System Concepts",
      "C",
      "C++",
      "Java",
      "Python",
      "Technical Interview",
      "GATE"
    ],
    "examRelevance": "GATE CS/IT, University Coding Exams, Placement Technical MCQs",
    "placementRelevance": "Amazon, Microsoft, Google, Adobe, Cisco, Oracle Technical Assessments"
  },
  {
    "subject": "PROGRAMMING",
    "topic": "Algorithms & System Concepts",
    "subtopic": "Bit Manipulation & Concurrency",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "What is the Master Theorem used for in algorithm analysis?",
    "options": [
      "Determining asymptotic time complexity of divide-and-conquer recurrence relations of form T(n) = aT(n/b) + f(n)",
      "Calculating memory consumption of B-trees",
      "Proving NP-completeness of graph problems",
      "Finding shortest paths in weighted DAGs"
    ],
    "correctAnswerIndex": 0,
    "explanation": "The Master Theorem provides closed-form asymptotic bounds (Big-O) for divide-and-conquer recurrences.",
    "tags": [
      "PROGRAMMING",
      "Algorithms & System Concepts",
      "C",
      "C++",
      "Java",
      "Python",
      "Technical Interview",
      "GATE"
    ],
    "examRelevance": "GATE CS/IT, University Coding Exams, Placement Technical MCQs",
    "placementRelevance": "Amazon, Microsoft, Google, Adobe, Cisco, Oracle Technical Assessments"
  },
  {
    "subject": "PROGRAMMING",
    "topic": "Algorithms & System Concepts",
    "subtopic": "Bit Manipulation & Concurrency",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is the recurrence relation for the Tower of Hanoi problem with n disks?",
    "options": [
      "T(n) = 2T(n-1) + 1, resulting in O(2^n) moves",
      "T(n) = T(n-1) + n",
      "T(n) = 3T(n/2) + O(1)",
      "T(n) = T(n/2) + 1"
    ],
    "correctAnswerIndex": 0,
    "explanation": "To move n disks: move n-1 disks to auxiliary pole, move largest disk to target, move n-1 disks to target: 2T(n-1) + 1 = 2^n - 1 moves.",
    "tags": [
      "PROGRAMMING",
      "Algorithms & System Concepts",
      "C",
      "C++",
      "Java",
      "Python",
      "Technical Interview",
      "GATE"
    ],
    "examRelevance": "GATE CS/IT, University Coding Exams, Placement Technical MCQs",
    "placementRelevance": "Amazon, Microsoft, Google, Adobe, Cisco, Oracle Technical Assessments"
  },
  {
    "subject": "PROGRAMMING",
    "topic": "Algorithms & System Concepts",
    "subtopic": "Bit Manipulation & Concurrency",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "In C++, what does 'std::bitset<32>' provide?",
    "options": [
      "A fixed-size sequence of 32 bits optimized for space and bitwise manipulation methods",
      "A dynamic array of 32-bit floats",
      "A hash set of bit pointers",
      "A 32-thread concurrent bit queue"
    ],
    "correctAnswerIndex": 0,
    "explanation": "std::bitset represents fixed-size bit vectors with bitwise operators, count(), any(), none(), and string conversion utilities.",
    "tags": [
      "PROGRAMMING",
      "Algorithms & System Concepts",
      "C",
      "C++",
      "Java",
      "Python",
      "Technical Interview",
      "GATE"
    ],
    "examRelevance": "GATE CS/IT, University Coding Exams, Placement Technical MCQs",
    "placementRelevance": "Amazon, Microsoft, Google, Adobe, Cisco, Oracle Technical Assessments"
  },
  {
    "subject": "PROGRAMMING",
    "topic": "Algorithms & System Concepts",
    "subtopic": "Bit Manipulation & Concurrency",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is an invariant in programming and algorithms?",
    "options": [
      "A condition or predicate that remains true throughout the execution of a loop or algorithm cycle",
      "A variable that cannot be changed",
      "A function that has no side effects",
      "A compiler error that cannot be suppressed"
    ],
    "correctAnswerIndex": 0,
    "explanation": "A loop invariant is a formal property guaranteed to hold true before, during, and after each loop iteration, critical for proving correctness.",
    "tags": [
      "PROGRAMMING",
      "Algorithms & System Concepts",
      "C",
      "C++",
      "Java",
      "Python",
      "Technical Interview",
      "GATE"
    ],
    "examRelevance": "GATE CS/IT, University Coding Exams, Placement Technical MCQs",
    "placementRelevance": "Amazon, Microsoft, Google, Adobe, Cisco, Oracle Technical Assessments"
  },
  {
    "subject": "PROGRAMMING",
    "topic": "Algorithms & System Concepts",
    "subtopic": "Bit Manipulation & Concurrency",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "What is the binary representation of the decimal number 43?",
    "options": [
      "101011",
      "101101",
      "110011",
      "100111"
    ],
    "correctAnswerIndex": 0,
    "explanation": "43 = 32 + 8 + 2 + 1 = 2^5 + 2^3 + 2^1 + 2^0 = 101011 in binary.",
    "tags": [
      "PROGRAMMING",
      "Algorithms & System Concepts",
      "C",
      "C++",
      "Java",
      "Python",
      "Technical Interview",
      "GATE"
    ],
    "examRelevance": "GATE CS/IT, University Coding Exams, Placement Technical MCQs",
    "placementRelevance": "Amazon, Microsoft, Google, Adobe, Cisco, Oracle Technical Assessments"
  },
  {
    "subject": "PROGRAMMING",
    "topic": "Algorithms & System Concepts",
    "subtopic": "Bit Manipulation & Concurrency",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is the Hamming distance between two binary strings of equal length?",
    "options": [
      "The number of positions at which the corresponding bits are different",
      "The total number of set bits in both strings",
      "The length of the longest common substring",
      "The XOR sum of their decimal representations"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Hamming distance measures the number of bit substitutions needed to transform one string into another (count of set bits in x ^ y).",
    "tags": [
      "PROGRAMMING",
      "Algorithms & System Concepts",
      "C",
      "C++",
      "Java",
      "Python",
      "Technical Interview",
      "GATE"
    ],
    "examRelevance": "GATE CS/IT, University Coding Exams, Placement Technical MCQs",
    "placementRelevance": "Amazon, Microsoft, Google, Adobe, Cisco, Oracle Technical Assessments"
  },
  {
    "subject": "PROGRAMMING",
    "topic": "Algorithms & System Concepts",
    "subtopic": "Bit Manipulation & Concurrency",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "What is the Gray Code sequence property?",
    "options": [
      "Successive values differ by exactly one bit",
      "Values increase monotonically by 2",
      "Odd numbers are followed by even numbers",
      "Bits are mirrored across the byte boundary"
    ],
    "correctAnswerIndex": 0,
    "explanation": "In reflected binary code (Gray code), consecutive values differ in only one bit position, preventing spurious states during mechanical transitions.",
    "tags": [
      "PROGRAMMING",
      "Algorithms & System Concepts",
      "C",
      "C++",
      "Java",
      "Python",
      "Technical Interview",
      "GATE"
    ],
    "examRelevance": "GATE CS/IT, University Coding Exams, Placement Technical MCQs",
    "placementRelevance": "Amazon, Microsoft, Google, Adobe, Cisco, Oracle Technical Assessments"
  },
  {
    "subject": "PROGRAMMING",
    "topic": "Algorithms & System Concepts",
    "subtopic": "Bit Manipulation & Concurrency",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "In Java, what is the difference between '>>' (signed right shift) and '>>>' (unsigned right shift)?",
    "options": [
      "'>>' preserves the sign bit by sign extension; '>>>' always shifts in zeros from the left regardless of sign",
      "'>>>' shifts bits to the left",
      "'>>' can only be used on positive integers",
      "There is no difference in Java 17"
    ],
    "correctAnswerIndex": 0,
    "explanation": "'>>' performs arithmetic shift filling high bits with the sign bit; '>>>' performs logical shift filling high bits with 0.",
    "tags": [
      "PROGRAMMING",
      "Algorithms & System Concepts",
      "C",
      "C++",
      "Java",
      "Python",
      "Technical Interview",
      "GATE"
    ],
    "examRelevance": "GATE CS/IT, University Coding Exams, Placement Technical MCQs",
    "placementRelevance": "Amazon, Microsoft, Google, Adobe, Cisco, Oracle Technical Assessments"
  },
  {
    "subject": "PROGRAMMING",
    "topic": "Algorithms & System Concepts",
    "subtopic": "Bit Manipulation & Concurrency",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "What is the time complexity to count the number of set bits of an integer using Brian Kernighan's algorithm?",
    "options": [
      "O(k) where k is the number of set bits (1s)",
      "O(32) always",
      "O(N) where N is the value of the number",
      "O(1) space and O(N^2) time"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Because x = x & (x - 1) removes one set bit per iteration, the loop runs exactly k times where k is the number of 1s in the binary representation.",
    "tags": [
      "PROGRAMMING",
      "Algorithms & System Concepts",
      "C",
      "C++",
      "Java",
      "Python",
      "Technical Interview",
      "GATE"
    ],
    "examRelevance": "GATE CS/IT, University Coding Exams, Placement Technical MCQs",
    "placementRelevance": "Amazon, Microsoft, Google, Adobe, Cisco, Oracle Technical Assessments"
  },
  {
    "subject": "PROGRAMMING",
    "topic": "Algorithms & System Concepts",
    "subtopic": "Bit Manipulation & Concurrency",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is the Pigeonhole Principle in algorithmic problem solving?",
    "options": [
      "If n items are put into m containers and n > m, at least one container must contain more than one item",
      "Every graph has an even number of odd vertices",
      "A recursive tree must have 2^n leaves",
      "Every binary search completes in log N steps"
    ],
    "correctAnswerIndex": 0,
    "explanation": "The Pigeonhole Principle states that if more items are allocated than slots available, at least one slot contains multiple items, useful in hashing and proofs.",
    "tags": [
      "PROGRAMMING",
      "Algorithms & System Concepts",
      "C",
      "C++",
      "Java",
      "Python",
      "Technical Interview",
      "GATE"
    ],
    "examRelevance": "GATE CS/IT, University Coding Exams, Placement Technical MCQs",
    "placementRelevance": "Amazon, Microsoft, Google, Adobe, Cisco, Oracle Technical Assessments"
  },
  {
    "subject": "PROGRAMMING",
    "topic": "Algorithms & System Concepts",
    "subtopic": "Bit Manipulation & Concurrency",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "What is the time complexity of Euclid's algorithm for finding the Greatest Common Divisor (GCD) of two integers a and b?",
    "options": [
      "O(log(min(a, b)))",
      "O(a + b)",
      "O(min(a, b))",
      "O(sqrt(a * b))"
    ],
    "correctAnswerIndex": 0,
    "explanation": "By Lam\u00e9's Theorem, Euclid's algorithm gcd(a, b) terminates in at most 5 * d steps where d is the number of digits in min(a, b), giving O(log(min(a, b))).",
    "tags": [
      "PROGRAMMING",
      "Algorithms & System Concepts",
      "C",
      "C++",
      "Java",
      "Python",
      "Technical Interview",
      "GATE"
    ],
    "examRelevance": "GATE CS/IT, University Coding Exams, Placement Technical MCQs",
    "placementRelevance": "Amazon, Microsoft, Google, Adobe, Cisco, Oracle Technical Assessments"
  },
  {
    "subject": "PROGRAMMING",
    "topic": "Algorithms & System Concepts",
    "subtopic": "Bit Manipulation & Concurrency",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What does the 'extern' keyword in C indicate when placed before a variable declaration?",
    "options": [
      "The variable is defined in another translation unit and linked at link time",
      "The variable is stored in external USB storage",
      "The variable is allocated dynamically on heap",
      "The variable cannot be accessed outside the current function"
    ],
    "correctAnswerIndex": 0,
    "explanation": "'extern' declares a variable name without defining it, notifying the compiler that its storage and definition reside in another source file.",
    "tags": [
      "PROGRAMMING",
      "Algorithms & System Concepts",
      "C",
      "C++",
      "Java",
      "Python",
      "Technical Interview",
      "GATE"
    ],
    "examRelevance": "GATE CS/IT, University Coding Exams, Placement Technical MCQs",
    "placementRelevance": "Amazon, Microsoft, Google, Adobe, Cisco, Oracle Technical Assessments"
  },
  {
    "subject": "PROGRAMMING",
    "topic": "Algorithms & System Concepts",
    "subtopic": "Bit Manipulation & Concurrency",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "What is the difference between shallow and deep inheritance hierarchies in software design?",
    "options": [
      "Deep hierarchies increase coupling and fragility; shallow hierarchies favor composition over inheritance",
      "Deep hierarchies are faster to compile",
      "Shallow hierarchies cannot use polymorphism",
      "Deep hierarchies eliminate memory leaks"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Deep inheritance trees lead to the 'fragile base class problem' and high coupling; modern software engineering prefers composition and shallow trees.",
    "tags": [
      "PROGRAMMING",
      "Algorithms & System Concepts",
      "C",
      "C++",
      "Java",
      "Python",
      "Technical Interview",
      "GATE"
    ],
    "examRelevance": "GATE CS/IT, University Coding Exams, Placement Technical MCQs",
    "placementRelevance": "Amazon, Microsoft, Google, Adobe, Cisco, Oracle Technical Assessments"
  },
  {
    "subject": "PROGRAMMING",
    "topic": "Algorithms & System Concepts",
    "subtopic": "Bit Manipulation & Concurrency",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is the purpose of 'assert()' in C/C++?",
    "options": [
      "A debugging macro that evaluates an expression and terminates the program if it evaluates to false when NDEBUG is not defined",
      "A keyword for handling runtime user input errors",
      "A compiler directive to allocate stack frames",
      "A thread barrier synchronization mechanism"
    ],
    "correctAnswerIndex": 0,
    "explanation": "assert(expr) is an active diagnostic aid that halts execution if assumptions are violated during development, disabled in release builds via #define NDEBUG.",
    "tags": [
      "PROGRAMMING",
      "Algorithms & System Concepts",
      "C",
      "C++",
      "Java",
      "Python",
      "Technical Interview",
      "GATE"
    ],
    "examRelevance": "GATE CS/IT, University Coding Exams, Placement Technical MCQs",
    "placementRelevance": "Amazon, Microsoft, Google, Adobe, Cisco, Oracle Technical Assessments"
  },
  {
    "subject": "PROGRAMMING",
    "topic": "Algorithms & System Concepts",
    "subtopic": "Bit Manipulation & Concurrency",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "What is a race condition in concurrent software?",
    "options": [
      "A flaw where system behavior depends on the uncontrollable timing or interleaving of multiple concurrent threads",
      "When a program runs faster than expected",
      "When two processors execute different clock speeds",
      "When memory bandwidth is saturated"
    ],
    "correctAnswerIndex": 0,
    "explanation": "A race condition occurs when two or more threads access shared state concurrently, and at least one access is a write, without synchronization.",
    "tags": [
      "PROGRAMMING",
      "Algorithms & System Concepts",
      "C",
      "C++",
      "Java",
      "Python",
      "Technical Interview",
      "GATE"
    ],
    "examRelevance": "GATE CS/IT, University Coding Exams, Placement Technical MCQs",
    "placementRelevance": "Amazon, Microsoft, Google, Adobe, Cisco, Oracle Technical Assessments"
  },
  {
    "subject": "PROGRAMMING",
    "topic": "Algorithms & System Concepts",
    "subtopic": "Bit Manipulation & Concurrency",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is a deadlock and what are the four Coffman conditions required for it to occur?",
    "options": [
      "Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait",
      "Starvation, Priority Inversion, Thrashing, and Cache Miss",
      "Paging, Segmentation, Swapping, and Fragmentation",
      "Read Lock, Write Lock, Spin Lock, and Mutex"
    ],
    "correctAnswerIndex": 0,
    "explanation": "All 4 Coffman conditions must hold simultaneously for a deadlock to exist: mutual exclusion, hold and wait, no preemption, and circular wait.",
    "tags": [
      "PROGRAMMING",
      "Algorithms & System Concepts",
      "C",
      "C++",
      "Java",
      "Python",
      "Technical Interview",
      "GATE"
    ],
    "examRelevance": "GATE CS/IT, University Coding Exams, Placement Technical MCQs",
    "placementRelevance": "Amazon, Microsoft, Google, Adobe, Cisco, Oracle Technical Assessments"
  },
  {
    "subject": "PROGRAMMING",
    "topic": "Algorithms & System Concepts",
    "subtopic": "Bit Manipulation & Concurrency",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "What is an atomic operation in multithreading?",
    "options": [
      "An operation that executes completely as a single indivisible step without possibility of interruption or interleaving by other threads",
      "An operation that runs on radioactive hardware",
      "An operation that takes zero CPU cycles",
      "An operation executed only by the kernel"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Atomic operations guarantee that no other thread can observe a partially executed state; they either succeed completely or have not begun.",
    "tags": [
      "PROGRAMMING",
      "Algorithms & System Concepts",
      "C",
      "C++",
      "Java",
      "Python",
      "Technical Interview",
      "GATE"
    ],
    "examRelevance": "GATE CS/IT, University Coding Exams, Placement Technical MCQs",
    "placementRelevance": "Amazon, Microsoft, Google, Adobe, Cisco, Oracle Technical Assessments"
  },
  {
    "subject": "PROGRAMMING",
    "topic": "Algorithms & System Concepts",
    "subtopic": "Bit Manipulation & Concurrency",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is the difference between a mutex and a binary semaphore?",
    "options": [
      "A mutex has ownership (only the thread that locked it can unlock it); a semaphore can be signaled/unlocked by any thread",
      "A mutex can have count > 1",
      "A binary semaphore is faster than a mutex",
      "There is no difference in POSIX standards"
    ],
    "correctAnswerIndex": 0,
    "explanation": "A mutex provides mutual exclusion with thread ownership semantics; a semaphore is a signaling mechanism without ownership.",
    "tags": [
      "PROGRAMMING",
      "Algorithms & System Concepts",
      "C",
      "C++",
      "Java",
      "Python",
      "Technical Interview",
      "GATE"
    ],
    "examRelevance": "GATE CS/IT, University Coding Exams, Placement Technical MCQs",
    "placementRelevance": "Amazon, Microsoft, Google, Adobe, Cisco, Oracle Technical Assessments"
  },
  {
    "subject": "PROGRAMMING",
    "topic": "Algorithms & System Concepts",
    "subtopic": "Bit Manipulation & Concurrency",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "In C++, what does the 'auto' keyword do in modern C++11 and later?",
    "options": [
      "Deduces the type of a variable from its initialization expression at compile time",
      "Declares an automatic local stack variable as in C89",
      "Allocates memory automatically on heap",
      "Declares a thread-safe variable"
    ],
    "correctAnswerIndex": 0,
    "explanation": "C++11 repurposed 'auto' for compile-time type deduction from the initializing expression, improving readability for complex types like iterators.",
    "tags": [
      "PROGRAMMING",
      "Algorithms & System Concepts",
      "C",
      "C++",
      "Java",
      "Python",
      "Technical Interview",
      "GATE"
    ],
    "examRelevance": "GATE CS/IT, University Coding Exams, Placement Technical MCQs",
    "placementRelevance": "Amazon, Microsoft, Google, Adobe, Cisco, Oracle Technical Assessments"
  },
  {
    "subject": "PROGRAMMING",
    "topic": "Algorithms & System Concepts",
    "subtopic": "Bit Manipulation & Concurrency",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is the primary role of a linker in the C/C++ compilation pipeline?",
    "options": [
      "Resolves cross-file symbol references, combines object files (.o/.obj), and produces the final executable or library",
      "Translates C source code into assembly",
      "Executes preprocessor directives (#include, #define)",
      "Optimizes register allocations during loop unrolling"
    ],
    "correctAnswerIndex": 0,
    "explanation": "The linker bundles compiled translation units, resolving undefined external symbols to their definitions and setting program entry point addresses.",
    "tags": [
      "PROGRAMMING",
      "Algorithms & System Concepts",
      "C",
      "C++",
      "Java",
      "Python",
      "Technical Interview",
      "GATE"
    ],
    "examRelevance": "GATE CS/IT, University Coding Exams, Placement Technical MCQs",
    "placementRelevance": "Amazon, Microsoft, Google, Adobe, Cisco, Oracle Technical Assessments"
  },
  {
    "subject": "PROGRAMMING",
    "topic": "Algorithms & System Concepts",
    "subtopic": "Bit Manipulation & Concurrency",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "What is the difference between stack and heap memory allocation?",
    "options": [
      "Stack is automatically managed, fast, and LIFO; Heap is manually managed, dynamic, flexible in size, but prone to fragmentation",
      "Stack memory is shared across all processes",
      "Heap memory is automatically deallocated on function exit",
      "Stack allocation is slower than heap allocation"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Stack allocation is contiguous, ultrafast (pointer increment), and scoped to function frames; heap allocation offers arbitrary lifespans but requires allocation overhead.",
    "tags": [
      "PROGRAMMING",
      "Algorithms & System Concepts",
      "C",
      "C++",
      "Java",
      "Python",
      "Technical Interview",
      "GATE"
    ],
    "examRelevance": "GATE CS/IT, University Coding Exams, Placement Technical MCQs",
    "placementRelevance": "Amazon, Microsoft, Google, Adobe, Cisco, Oracle Technical Assessments"
  }
];
