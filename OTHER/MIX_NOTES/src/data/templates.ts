import type { Topic } from '../types';

export const templatesTopics: Topic[] = [
  {
    id: 'templates-basics',
    title: 'Function & Class Templates',
    category: 'Templates',
    difficulty: 'advanced',
    summary: 'Write type-parameterised code once; the compiler generates a version per type used.',
    definition:
      'A template is a blueprint the compiler uses to generate code for specific types. A function template parameterises a function’s types; a class template parameterises a class. When you call a template with a concrete type, the compiler instantiates a specialisation by substituting that type. This is the foundation of generic programming and the C++ Standard Library.',
    syntax: 'template <typename T> ReturnType name(T param) { ... }',
    parameters: [
      { name: 'T', type: 'type parameter', description: 'A placeholder type filled in at instantiation.' },
      { name: 'typename/class', type: 'keyword', description: 'Declares a type parameter (both keywords are equivalent here).' },
    ],
    returns: 'A generated function or class specialised for the requested type.',
    keyPoints: [
      'Templates are compile-time — no runtime overhead, but larger binaries.',
      'Type deduction often fills in T automatically from the arguments.',
      'A template must be fully defined (including body) before use — usually in a header.',
      'A non-type parameter (e.g. template <int N>) can hold a compile-time constant.',
      'Specialise a template with template<> for a specific type when the generic version does not fit.',
    ],
    examples: [
      {
        title: 'Function template',
        description: 'A generic max that works for any comparable type.',
        code: `#include <iostream>
#include <string>

template <typename T>
T maxValue(const T& a, const T& b) {
    return (a > b) ? a : b;
}

int main() {
    std::cout << maxValue(3, 7) << "\\n";                  // int
    std::cout << maxValue(2.5, 1.5) << "\\n";              // double
    std::cout << maxValue(std::string("a"), std::string("b")) << "\\n";
    return 0;
}`,
      },
      {
        title: 'Class template',
        description: 'A generic stack that holds any type.',
        code: `#include <iostream>
#include <vector>

template <typename T>
class Stack {
    std::vector<T> data;
public:
    void push(const T& v) { data.push_back(v); }
    T pop() { T v = data.back(); data.pop_back(); return v; }
    bool empty() const { return data.empty(); }
};

int main() {
    Stack<int> si;
    si.push(1); si.push(2);
    std::cout << si.pop() << "\\n";          // 2

    Stack<std::string> ss;
    ss.push("hi");
    std::cout << ss.pop() << "\\n";          // hi
    return 0;
}`,
      },
      {
        title: 'Non-type template parameter',
        description: 'A compile-time constant as a parameter.',
        code: `#include <iostream>
#include <array>

template <size_t N>
double average(const std::array<double, N>& arr) {
    double sum = 0;
    for (double x : arr) sum += x;
    return sum / N;       // N known at compile time
}

int main() {
    std::array<double, 3> a = {1, 2, 3};
    std::cout << average(a) << "\\n";        // 2
    return 0;
}`,
      },
    ],
    related: ['template-specialization', 'concepts', 'stl-vectors'],
  },
  {
    id: 'template-specialization',
    title: 'Template Specialization',
    category: 'Templates',
    difficulty: 'advanced',
    summary: 'Provide a custom implementation of a template for one specific type.',
    definition:
      'Full (explicit) specialisation gives a complete, type-specific implementation of a template for one exact type, written with `template<>`. Partial specialisation restricts a class template to a subset of types (e.g. all pointer types) but is only allowed for class templates, not function templates. The compiler picks the most specialised match.',
    syntax: 'template <> class Name<SpecificType> { ... };',
    returns: 'A type-specific version of the template, chosen over the generic one.',
    keyPoints: [
      'Full specialisation: one exact type; partial specialisation: a constrained family.',
      'Function templates cannot be partially specialised — overload instead.',
      'Specialising a standard library template (e.g. std::swap) is allowed but risky.',
      'Always specialise both the declaration and the definition consistently.',
      'The compiler chooses the most specialised candidate that matches.',
    ],
    examples: [
      {
        title: 'Full specialisation for bool',
        description: 'A different implementation for one specific type.',
        code: `#include <iostream>

template <typename T>
const char* typeName() { return "unknown"; }

template <>
const char* typeName<bool>() { return "boolean"; }

template <>
const char* typeName<int>() { return "integer"; }

int main() {
    std::cout << typeName<bool>() << "\\n";    // boolean
    std::cout << typeName<int>() << "\\n";     // integer
    std::cout << typeName<double>() << "\\n";  // unknown
    return 0;
}`,
      },
      {
        title: 'Partial specialisation for pointers',
        description: 'A version that matches all pointer types.',
        code: `#include <iostream>
#include <type_traits>

template <typename T>
struct TypeInfo { static const char* name() { return "value"; } };

template <typename T>
struct TypeInfo<T*> { static const char* name() { return "pointer"; } };

int main() {
    std::cout << TypeInfo<int>::name() << "\\n";        // value
    std::cout << TypeInfo<int*>::name() << "\\n";       // pointer
    std::cout << TypeInfo<double*>::name() << "\\n";    // pointer
    return 0;
}`,
      },
    ],
    related: ['templates-basics', 'concepts'],
  },
  {
    id: 'concepts',
    title: 'Concepts (C++20) — Constraining Templates',
    category: 'Templates',
    difficulty: 'advanced',
    summary: 'Name a set of requirements a template type must satisfy, with clear error messages.',
    definition:
      'A concept (C++20) is a compile-time predicate over template parameters. It names a set of requirements — valid expressions, associated types, or other concepts — that a type must satisfy. Using concepts produces far clearer template errors ("T does not satisfy Printable") and lets you overload templates by requirements.',
    syntax: 'template <typename T> concept Name = requires(T a) { expr; };',
    returns: 'A boolean compile-time predicate true when T satisfies the requirements.',
    keyPoints: [
      'A requires expression yields true if all its expressions are valid for T.',
      'Use concept-name directly in a template header: template <Printable T>.',
      'Concepts enable overload resolution between constrained templates.',
      'Errors become "T does not satisfy C" instead of a 100-line substitution failure.',
      'The standard library ships many concepts in <concepts> and <iterator>.',
    ],
    examples: [
      {
        title: 'Define and use a concept',
        description: 'Constrain a function to types that support <.',
        code: `#include <iostream>
#include <concepts>

template <typename T>
concept Comparable = requires(T a, T b) {
    { a < b } -> std::convertible_to<bool>;
};

template <Comparable T>
T minOf(const T& a, const T& b) {
    return (a < b) ? a : b;
}

int main() {
    std::cout << minOf(3, 7) << "\\n";        // 3
    std::cout << minOf(2.5, 1.5) << "\\n";    // 1.5
    return 0;
}`,
      },
      {
        title: 'Standard concepts',
        description: 'Use std::integral and std::floating_point from <concepts>.',
        code: `#include <iostream>
#include <concepts>

template <std::integral T>
T factorial(T n) {
    T r = 1;
    for (T i = 2; i <= n; ++i) r *= i;
    return r;
}

int main() {
    std::cout << factorial(5) << "\\n";       // 120
    // factorial(5.0);  // compile error: double is not integral
    return 0;
}`,
      },
    ],
    related: ['templates-basics', 'template-specialization'],
  },
  {
    id: 'variadic-templates',
    title: 'Variadic Templates & Fold Expressions',
    category: 'Templates',
    difficulty: 'advanced',
    summary: 'Accept any number of arguments of any types with a parameter pack.',
    definition:
      'A variadic template accepts a parameter pack — zero or more arguments of possibly different types. A pack expansion recurses over the pack or, since C++17, uses a fold expression to combine all elements with an operator in one expression. This is how std::make_unique, std::tuple, and std::printf-like functions accept arbitrary argument lists.',
    syntax: 'template <typename... Args> void f(Args... args) { (g(args), ...); }',
    returns: 'A function or class that accepts an arbitrary number of arguments.',
    keyPoints: [
      'typename... Args declares a type pack; Args... args is the value pack.',
      'sizeof...(pack) gives the number of elements in a pack.',
      'A C++17 fold expression: (op pack ...) or (... op pack) combines all elements.',
      'Recursive expansion is the pre-C++17 technique; folds are simpler and preferred.',
      'Perfect forwarding with std::forward<Args>(args)... preserves value categories.',
    ],
    examples: [
      {
        title: 'Print all arguments (comma fold)',
        description: 'A variadic print that handles any number of args.',
        code: `#include <iostream>

void print() {}  // base case for zero args

template <typename T, typename... Rest>
void print(const T& first, const Rest&... rest) {
    std::cout << first;
    if constexpr (sizeof...(rest) > 0) {
        std::cout << " ";
        print(rest...);    // recurse
    } else {
        std::cout << "\\n";
    }
}

int main() {
    print(1, 2.5, "hello", 'x');   // 1 2.5 hello x
    return 0;
}`,
      },
      {
        title: 'Fold expression to sum',
        description: 'Add all arguments in one expression.',
        code: `#include <iostream>

template <typename... Args>
auto sum(Args... args) {
    return (... + args);   // left fold: ((a0 + a1) + a2) + ...
}

int main() {
    std::cout << sum(1, 2, 3, 4) << "\\n";    // 10
    std::cout << sum(1.5, 2.5) << "\\n";      // 4
    return 0;
}`,
      },
      {
        title: 'Perfect forwarding',
        description: 'Preserve lvalue/rvalue-ness when passing arguments along.',
        code: `#include <iostream>
#include <utility>
#include <string>

template <typename... Args>
auto makeString(Args&&... args) {
    return std::string(std::forward<Args>(args)...);
}

int main() {
    auto s = makeString(5, 'x');   // string(5, 'x') -> "xxxxx"
    std::cout << s << "\\n";
    return 0;
}`,
      },
    ],
    related: ['templates-basics', 'move-semantics'],
  },
  {
    id: 'type-traits',
    title: 'Type Traits & <type_traits>',
    category: 'Metaprogramming',
    difficulty: 'advanced',
    summary: 'Query and transform types at compile time with type traits.',
    definition:
      'Type traits (in <type_traits>) are compile-time predicates and transformations on types. Queries like std::is_integral, std::is_pointer, std::is_base_of return bool_v; transforms like std::remove_reference, std::decay, std::common_type produce a new type via ::type. They enable conditional behaviour through std::enable_if and if constexpr.',
    syntax: 'std::is_integral<T>::value  // or std::is_integral_v<T> in C++17',
    returns: 'A bool (queries) or a new type (transforms) known at compile time.',
    keyPoints: [
      'C++17 adds _v shorthand: std::is_integral_v<T> over ::value.',
      'C++14 adds _t shorthand: std::remove_pointer_t<T> over ::type.',
      'Use if constexpr to branch on a trait without SFINAE complexity.',
      'std::enable_if selectively disables template overloads based on a condition.',
      'std::decay gives the type as it would be stored by value (strips ref/cv/array).',
    ],
    examples: [
      {
        title: 'Branch on a type trait',
        description: 'Use if constexpr to handle integer vs floating types differently.',
        code: `#include <iostream>
#include <type_traits>

template <typename T>
void describe(const T& x) {
    if constexpr (std::is_integral_v<T>)
        std::cout << "integer: " << x << "\\n";
    else if constexpr (std::is_floating_point_v<T>)
        std::cout << "float: " << x << "\\n";
    else
        std::cout << "other\\n";
}

int main() {
    describe(42);     // integer
    describe(3.14);   // float
    return 0;
}`,
      },
      {
        title: 'enable_if to pick an overload',
        description: 'Only enable a template for integral types.',
        code: `#include <iostream>
#include <type_traits>
#include <cstdint>

template <typename T,
          typename = std::enable_if_t<std::is_integral_v<T>>>
T doubleIt(T x) { return x * 2; }

int main() {
    std::cout << doubleIt(21) << "\\n";     // 42
    // doubleIt(2.5);  // compile error: not enabled for double
    return 0;
}`,
      },
    ],
    related: ['concepts', 'templates-basics'],
  },
  {
    id: 'constexpr',
    title: 'constexpr & consteval — Compile-Time Computation',
    category: 'Metaprogramming',
    difficulty: 'advanced',
    summary: 'Compute values at compile time so they become constants with zero runtime cost.',
    definition:
      'A `constexpr` function can be evaluated at compile time when its arguments are constants, producing a constant result that can be used in templates and array sizes. A `consteval` function (C++20) must be evaluated at compile time — it never runs at runtime. `constexpr` variables must be initialised with a constant expression. Since C++14, constexpr functions can use loops and local variables.',
    syntax: 'constexpr returnType name(params) { ... }',
    returns: 'A value computable at compile time when inputs are constant.',
    keyPoints: [
      'constexpr does not guarantee compile-time evaluation — it permits it.',
      'consteval forces compile-time evaluation; calling it with a runtime value is an error.',
      'constexpr variables and functions can be used in other constant expressions.',
      'Since C++14 constexpr functions may use local variables, loops, and if.',
      'Use constexpr to replace macros and hand-written metaprogramming.',
    ],
    examples: [
      {
        title: 'Compile-time factorial',
        description: 'A constexpr function used to size an array.',
        code: `#include <iostream>
#include <array>

constexpr int factorial(int n) {
    int r = 1;
    for (int i = 2; i <= n; ++i) r *= i;
    return r;
}

int main() {
    constexpr int f5 = factorial(5);          // computed at compile time
    std::array<int, factorial(4)> arr{};      // array size 24 — compile time
    std::cout << f5 << " " << arr.size() << "\\n";   // 120 24
    return 0;
}`,
      },
      {
        title: 'consteval forces compile time',
        description: 'A function that cannot run at runtime.',
        code: `#include <iostream>

consteval int square(int x) { return x * x; }

int main() {
    constexpr int s = square(6);    // ok, compile time
    std::cout << s << "\\n";        // 36
    // int n; std::cin >> n; square(n); // error: n is not constant
    return 0;
}`,
      },
    ],
    related: ['type-traits', 'templates-basics'],
  },
];
