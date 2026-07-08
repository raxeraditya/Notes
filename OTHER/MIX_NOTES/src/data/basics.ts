import type { Topic } from '../types';

export const basicsTopics: Topic[] = [
  {
    id: 'program-structure',
    title: 'Program Structure & Hello World',
    category: 'Fundamentals',
    difficulty: 'beginner',
    summary: 'Anatomy of a C++ program: preprocessor, main(), headers, and namespaces.',
    definition:
      'Every C++ program is translated (compiled) from source text into machine code. A translation unit begins with preprocessor directives (lines starting with #), includes header files declaring library facilities, and must define exactly one global `main` function — the entry point the runtime calls when the program starts. `main` returns an int that the operating system interprets as the exit status (0 means success).',
    syntax: '#include <iostream>\nint main() {\n    std::cout << "Hello";\n    return 0;\n}',
    returns: 'main returns an int exit code (0 = success, non-zero = failure).',
    keyPoints: [
      'main is the only required global function; it returns int.',
      '#include copies a header file’s declarations into your translation unit before compilation.',
      'std is the standard namespace; :: is the scope resolution operator.',
      'Angle brackets <...> search system include paths; quotes "..." search local paths first.',
      'Return 0 signals success; return non-zero or call std::exit to signal an error.',
    ],
    examples: [
      {
        title: 'Minimal hello world',
        description: 'Print text to standard output.',
        code: `#include <iostream>

int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}`,
      },
      {
        title: 'Using namespace to avoid std:: prefix',
        description: 'Bring names into scope — convenient but avoid in headers.',
        code: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello!" << endl;
    return 0;
}`,
      },
      {
        title: 'Command-line arguments',
        description: 'argc holds the argument count; argv is an array of C-strings.',
        code: `#include <iostream>

int main(int argc, char* argv[]) {
    std::cout << "argc = " << argc << "\\n";
    for (int i = 0; i < argc; ++i)
        std::cout << "argv[" << i << "] = " << argv[i] << "\\n";
    return 0;
}`,
      },
    ],
    related: ['data-types', 'input-output'],
  },
  {
    id: 'data-types',
    title: 'Data Types & Variables',
    category: 'Fundamentals',
    difficulty: 'beginner',
    summary: 'Fundamental types: int, double, char, bool, and fixed-width types.',
    definition:
      'C++ provides fundamental types for integers, floating-point numbers, characters, and booleans. Each has a fixed or minimum size defined by the standard and the platform. Variables must be declared with a type before use; C++ is statically typed, meaning the compiler checks every expression’s type at compile time.',
    syntax: 'type name = value;  // e.g. int count = 0;',
    parameters: [
      { name: 'int', type: 'integer', description: 'At least 16 bits; typically 32 bits. Use long long for 64-bit.' },
      { name: 'double', type: 'floating', description: 'Double-precision (64-bit) IEEE 754 float.' },
      { name: 'char', type: 'character', description: 'A single byte; holds a character or small integer.' },
      { name: 'bool', type: 'boolean', description: 'true (1) or false (0).' },
    ],
    returns: 'A named object of the declared type.',
    keyPoints: [
      'Use <cstdint> for fixed-width types: int32_t, int64_t, uint8_t, etc.',
      'auto deduces the type from the initializer — use it for complex types.',
      'Uninitialized local variables have indeterminate values — always initialize.',
      'Use constexpr for compile-time constants, const for run-time constants.',
      'sizeof(type) returns the size in bytes on your platform.',
    ],
    examples: [
      {
        title: 'Fundamental types',
        description: 'Declare and print values of each basic type.',
        code: `#include <iostream>
#include <cstdint>

int main() {
    int age = 30;
    double pi = 3.14159;
    char grade = 'A';
    bool is_ready = true;
    int64_t big = 9'000'000'000LL;  // digit separators

    std::cout << "int: " << age << "\\n"
              << "double: " << pi << "\\n"
              << "char: " << grade << "\\n"
              << "bool: " << is_ready << "\\n"
              << "int64_t: " << big << "\\n";
    return 0;
}`,
      },
      {
        title: 'auto and constexpr',
        description: 'Let the compiler deduce types and compute constants at compile time.',
        code: `#include <iostream>

int main() {
    constexpr int rows = 4;        // compile-time constant
    auto area = rows * rows;       // deduced as int
    auto tax = 0.18;               // deduced as double

    std::cout << "area = " << area << "\\n"
              << "tax = " << tax << "\\n";
    return 0;
}`,
      },
    ],
    related: ['program-structure', 'operators'],
  },
  {
    id: 'operators',
    title: 'Operators & Expressions',
    category: 'Fundamentals',
    difficulty: 'beginner',
    summary: 'Arithmetic, comparison, logical, bitwise, and assignment operators with precedence.',
    definition:
      'Operators act on operands to produce values. C++ groups them by arity (unary, binary, ternary) and category: arithmetic (+ - * / %), comparison (== != < > <= >=), logical (&& || !), bitwise (& | ^ ~ << >>), assignment (= += etc.), and the ternary conditional (?:). Each operator has a precedence and associativity that determine evaluation order when parentheses are absent.',
    syntax: 'lhs op rhs  // e.g. a + b, a && b, a = b',
    returns: 'A value whose type depends on the operator and operands.',
    keyPoints: [
      'Integer division truncates toward zero: 7 / 2 == 3.',
      '% (modulus) works on integers only, not floating-point.',
      'Short-circuit: && and || evaluate the right side only if needed.',
      'Bitwise operators work on integer bit patterns; << and >> shift bits.',
      'Use parentheses for clarity — do not rely on precedence in complex expressions.',
      'Avoid mixing signed and unsigned — the conversion can produce surprising results.',
    ],
    examples: [
      {
        title: 'Arithmetic and comparison',
        description: 'Basic math and relational operators.',
        code: `#include <iostream>
int main() {
    int a = 17, b = 5;
    std::cout << "a + b = " << a + b << "\\n"
              << "a / b = " << a / b << "\\n"      // integer division
              << "a % b = " << a % b << "\\n"      // remainder
              << "a > b = " << (a > b) << "\\n";
    return 0;
}`,
      },
      {
        title: 'Logical and bitwise',
        description: 'Short-circuit logic and bit manipulation.',
        code: `#include <iostream>
int main() {
    bool ok = (5 > 3) && (2 < 4);
    std::cout << "logical: " << ok << "\\n";

    int flags = 0b1100;          // 12
    int mask  = 0b1010;          // 10
    std::cout << "AND  " << (flags & mask) << "\\n"   // 8
              << "OR   " << (flags | mask) << "\\n"   // 14
              << "XOR  " << (flags ^ mask) << "\\n"   // 6
              << "shift" << (flags << 2) << "\\n";    // 48
    return 0;
}`,
      },
      {
        title: 'Ternary and assignment',
        description: 'Conditional expression and compound assignment.',
        code: `#include <iostream>
int main() {
    int x = 7;
    const char* label = (x % 2 == 0) ? "even" : "odd";
    std::cout << x << " is " << label << "\\n";

    int n = 10;
    n += 5;   // n = 15
    n *= 2;   // n = 30
    std::cout << "n = " << n << "\\n";
    return 0;
}`,
      },
    ],
    related: ['data-types', 'control-flow'],
  },
  {
    id: 'control-flow',
    title: 'Control Flow (if, switch, loops)',
    category: 'Control Flow',
    difficulty: 'beginner',
    summary: 'Branch with if/else and switch; repeat with for, while, and do-while.',
    definition:
      'Control-flow statements direct the order of execution. `if`/`else if`/`else` branch on a condition; `switch` jumps to a matching constant case. Loops repeat a block: `for` initialises, tests, and increments in one header; `while` tests before each iteration; `do-while` tests after. `break` exits a loop or switch; `continue` skips to the next iteration.',
    syntax: 'if (cond) { ... } else if (cond) { ... } else { ... }',
    returns: 'None — these are statements, not expressions (except the ternary ?:).',
    keyPoints: [
      'Always break each switch case (unless fall-through is intentional).',
      'Prefer range-based for (for (auto& x : container)) over index loops.',
      'Use break to exit a loop early; use continue to skip an iteration.',
      'An uninitialized variable in a for-init is scoped to the loop only.',
      'switch requires integral or enumeration types — not strings or floats.',
    ],
    examples: [
      {
        title: 'if / else if / else',
        description: 'Classify a score into grades.',
        code: `#include <iostream>
int main() {
    int score = 76;
    char grade;
    if (score >= 90) grade = 'A';
    else if (score >= 80) grade = 'B';
    else if (score >= 70) grade = 'C';
    else grade = 'F';
    std::cout << "Grade: " << grade << "\\n";
    return 0;
}`,
      },
      {
        title: 'switch statement',
        description: 'Jump to a matching case label.',
        code: `#include <iostream>
int main() {
    int day = 3;
    switch (day) {
        case 1: std::cout << "Mon\\n"; break;
        case 2: std::cout << "Tue\\n"; break;
        case 3: std::cout << "Wed\\n"; break;
        case 4: std::cout << "Thu\\n"; break;
        case 5: std::cout << "Fri\\n"; break;
        default: std::cout << "Weekend\\n";
    }
    return 0;
}`,
      },
      {
        title: 'for, while, and range-based for',
        description: 'Three loop styles.',
        code: `#include <iostream>
#include <vector>
int main() {
    // classic for
    for (int i = 0; i < 3; ++i)
        std::cout << i << " ";
    std::cout << "\\n";

    // while
    int n = 3;
    while (n > 0) { std::cout << n-- << " "; }
    std::cout << "\\n";

    // range-based for
    std::vector<int> v = {10, 20, 30};
    for (int x : v) std::cout << x << " ";
    std::cout << "\\n";
    return 0;
}`,
      },
    ],
    related: ['operators', 'functions'],
  },
  {
    id: 'functions',
    title: 'Functions & Parameters',
    category: 'Functions',
    difficulty: 'beginner',
    summary: 'Declare, define, and call functions; pass by value, reference, and pointer.',
    definition:
      'A function is a named block of code that performs a task, optionally accepts parameters, and optionally returns a value. C++ passes arguments by value (a copy) by default. Passing by reference (&) avoids a copy and allows mutation; passing by const reference (const &) avoids a copy but forbids mutation. A function declared but not yet defined needs a prototype so the compiler can type-check calls.',
    syntax: 'returnType name(paramType param, ...) { body }',
    parameters: [
      { name: 'by value', type: 'T', description: 'The function receives a copy; changes do not affect the caller.' },
      { name: 'by reference', type: 'T&', description: 'The function operates on the caller’s object directly; changes propagate.' },
      { name: 'by const ref', type: 'const T&', description: 'No copy, no mutation — the idiomatic way to pass large objects.' },
      { name: 'by pointer', type: 'T*', description: 'Passes an address; may be null; use to reseat or for optional objects.' },
    ],
    returns: 'A value of returnType, or void if nothing is returned.',
    keyPoints: [
      'Pass small/cheap types by value; pass large types by const reference.',
      'A reference parameter lets a function modify the caller’s variable.',
      'Declare default arguments in the declaration, not the definition.',
      'Overloading: multiple functions can share a name if their parameter lists differ.',
      'inline is a hint to the compiler to expand the function at the call site.',
    ],
    examples: [
      {
        title: 'Pass by value, reference, and const ref',
        description: 'See how each passing style affects the caller.',
        code: `#include <iostream>
#include <string>

void byValue(std::string s)     { s += "!"; }            // copy
void byRef(std::string& s)      { s += "!"; }            // mutate caller
void byConstRef(const std::string& s) { /* read only */ }

int main() {
    std::string msg = "hi";
    byValue(msg);
    std::cout << msg << "\\n";          // hi (unchanged)

    byRef(msg);
    std::cout << msg << "\\n";          // hi!

    byConstRef(msg);                    // no copy, no change
    std::cout << msg << "\\n";
    return 0;
}`,
      },
      {
        title: 'Default arguments and overloading',
        description: 'Optional parameters and same-name functions.',
        code: `#include <iostream>

// default argument
void greet(const std::string& name, int times = 1) {
    for (int i = 0; i < times; ++i)
        std::cout << "Hello, " << name << "!\\n";
}

// overloaded: same name, different params
int square(int x) { return x * x; }
double square(double x) { return x * x; }

int main() {
    greet("Ada");
    greet("Linus", 2);
    std::cout << square(5) << " " << square(2.5) << "\\n";
    return 0;
}`,
      },
      {
        title: 'Return by reference',
        description: 'Let a function hand back a reference to a stored object.',
        code: `#include <iostream>
#include <vector>

int& at(std::vector<int>& v, size_t i) {
    return v[i];   // caller can read or write
}

int main() {
    std::vector<int> v = {1, 2, 3};
    at(v, 1) = 99;             // writes through the returned reference
    std::cout << v[1] << "\\n"; // 99
    return 0;
}`,
      },
    ],
    related: ['control-flow', 'references'],
  },
  {
    id: 'input-output',
    title: 'Input & Output (iostream)',
    category: 'I/O',
    difficulty: 'beginner',
    summary: 'Read from stdin with cin, write to stdout with cout, and format output.',
    definition:
      'The <iostream> library provides stream-based I/O. `std::cin` is the standard input stream (keyboard by default); `std::cout` is standard output; `std::cerr` is unbuffered error output. The insertion operator << writes to an output stream; the extraction operator >> reads from an input stream. Streams convert between text and typed values automatically.',
    syntax: 'std::cout << value;  std::cin >> variable;',
    returns: 'The stream itself (returned by << and >>), enabling chaining.',
    keyPoints: [
      '<< and >> return the stream, so you can chain: cout << a << b << c.',
      'cin >> skips whitespace and stops at type mismatches — check cin.fail().',
      'Use std::getline(cin, str) to read a whole line including spaces.',
      'endl flushes the buffer; "\\n" is faster when you do not need a flush.',
      'Include <iomanip> for formatting: setw, setprecision, fixed, hex.',
    ],
    examples: [
      {
        title: 'Read and write',
        description: 'Prompt for input and echo it back.',
        code: `#include <iostream>
#include <string>

int main() {
    std::string name;
    int age;
    std::cout << "Name? ";
    std::getline(std::cin, name);
    std::cout << "Age? ";
    std::cin >> age;
    std::cout << "Hi " << name << ", " << age << " years old.\\n";
    return 0;
}`,
      },
      {
        title: 'Formatting with <iomanip>',
        description: 'Control width, precision, and number base.',
        code: `#include <iostream>
#include <iomanip>

int main() {
    double pi = 3.141592653589;
    std::cout << std::fixed << std::setprecision(4) << pi << "\\n";  // 3.1416
    std::cout << std::setw(8) << 42 << "\\n";    // right-aligned width 8
    std::cout << std::hex << 255 << "\\n";       // ff
    return 0;
}`,
      },
    ],
    related: ['program-structure', 'functions'],
  },
  {
    id: 'arrays-strings',
    title: 'Arrays, std::string & C-strings',
    category: 'Data Structures',
    difficulty: 'beginner',
    summary: 'Fixed arrays, std::string, and the legacy char* C-strings.',
    definition:
      'A raw array is a fixed-size, contiguous sequence of elements of one type, accessed by index with O(1) lookup. `std::string` is the modern, bounds-safe, automatically-managed string class from <string>; it grows as needed. A C-string is a null-terminated char array (char*), inherited from C — use it only when interfacing with C APIs.',
    syntax: 'type name[size];  std::string s = "text";',
    returns: 'An array or string object.',
    keyPoints: [
      'Raw arrays do not know their own length — you must track it separately.',
      'std::string manages its own memory and length; prefer it over char*.',
      'std::string::c_str() returns a const char* for C-API interop.',
      'Array indices are zero-based; out-of-bounds access is undefined behaviour.',
      'std::array<T,N> is a thin, bounds-safe wrapper over a raw array — prefer it.',
    ],
    examples: [
      {
        title: 'Raw array vs std::array',
        description: 'Two ways to hold a fixed set of values.',
        code: `#include <iostream>
#include <array>

int main() {
    int raw[3] = {10, 20, 30};            // size must be tracked manually
    std::array<int, 3> arr = {10, 20, 30};

    std::cout << raw[1] << "\\n";
    std::cout << arr[1] << " size=" << arr.size() << "\\n";
    return 0;
}`,
      },
      {
        title: 'std::string operations',
        description: 'Concatenation, substring, length, and find.',
        code: `#include <iostream>
#include <string>

int main() {
    std::string a = "Hello";
    std::string b = a + ", World!";       // concatenation
    std::cout << b << "\\n";
    std::cout << "length: " << b.length() << "\\n";
    std::cout << "substr: " << b.substr(0, 5) << "\\n";   // Hello
    std::cout << "find: "   << b.find("World") << "\\n";  // 7
    return 0;
}`,
      },
    ],
    related: ['data-types', 'stl-vectors'],
  },
];
