import type { Topic } from '../types';

export const oopTopics: Topic[] = [
  {
    id: 'classes-objects',
    title: 'Classes & Objects',
    category: 'Classes',
    difficulty: 'intermediate',
    summary: 'A class bundles data (members) and behaviour (methods) into a user-defined type.',
    definition:
      'A class defines a new type by grouping data members (variables) and member functions (methods) under one name, with access specifiers controlling visibility. An object is an instance of a class — a concrete value laid out in memory. The compiler generates a default constructor, copy constructor, copy assignment, and destructor if you do not declare them (the Rule of Zero).',
    syntax: 'class Name { public: ...; private: ...; };',
    parameters: [
      { name: 'public', type: 'access', description: 'Accessible from anywhere — the interface.' },
      { name: 'private', type: 'access', description: 'Accessible only inside the class — the implementation.' },
      { name: 'protected', type: 'access', description: 'Accessible in the class and derived classes.' },
    ],
    returns: 'A user-defined type you can instantiate into objects.',
    keyPoints: [
      'A struct is a class whose members are public by default; a class is private by default.',
      'Constructors initialise an object; the destructor cleans it up.',
      'The Rule of Zero: if all members manage themselves, write no special members.',
      'Member functions declared inside the class are implicitly inline.',
      'Separate declaration (.h) from definition (.cpp) for non-inline methods.',
    ],
    examples: [
      {
        title: 'A simple class',
        description: 'Define a Point with private data and public methods.',
        code: `#include <iostream>

class Point {
    double x, y;                 // private by default in a class
public:
    Point(double x, double y) : x(x), y(y) {}   // constructor
    double getX() const { return x; }
    double dist() const { return x * x + y * y; }
};

int main() {
    Point p(3, 4);
    std::cout << p.getX() << " " << p.dist() << "\\n";   // 3 25
    return 0;
}`,
      },
      {
        title: 'struct with default public access',
        description: 'A struct is just a class with public members by default.',
        code: `#include <iostream>
#include <string>

struct Book {
    std::string title;           // public
    int pages;
    void show() const { std::cout << title << " (" << pages << "p)\\n"; }
};

int main() {
    Book b{"Effective C++", 320};
    b.show();
    return 0;
}`,
      },
    ],
    related: ['constructors', 'encapsulation'],
  },
  {
    id: 'constructors',
    title: 'Constructors & Initializer Lists',
    category: 'Classes',
    difficulty: 'intermediate',
    summary: 'Construct objects with default, parameterised, copy, and move constructors.',
    definition:
      'A constructor is a special member function that initialises a new object. The default constructor takes no arguments; a parameterised constructor accepts initialiser values; a copy constructor initialises from an existing object; a move constructor steals resources from a temporary. Member initialiser lists (`: member(value)`) initialise members directly, before the body runs — more efficient than assigning in the body and required for references and const members.',
    syntax: 'ClassName(params) : member1(v1), member2(v2) { body }',
    returns: 'A fully constructed object.',
    keyPoints: [
      'Prefer initialiser lists to assignment in the body — avoids default-construct-then-overwrite.',
      'Members are initialised in declaration order, NOT the order in the initialiser list.',
      'A user-declared constructor suppresses the implicit default constructor.',
      'Use = default to ask for the compiler-generated version explicitly.',
      'Use = delete to forbid a constructor (e.g. delete the copy constructor).',
    ],
    examples: [
      {
        title: 'Initialiser list vs body assignment',
        description: 'Two ways to initialise members.',
        code: `#include <iostream>
#include <string>

class Person {
    std::string name;
    int age;
public:
    // initialiser list — preferred, initialises directly
    Person(const std::string& n, int a) : name(n), age(a) {}

    void show() const { std::cout << name << ", " << age << "\\n"; }
};

int main() {
    Person p("Ada", 36);
    p.show();
    return 0;
}`,
      },
      {
        title: 'Default, = default, and = delete',
        description: 'Control which constructors the compiler generates.',
        code: `#include <iostream>

class NonCopyable {
public:
    NonCopyable() = default;                      // keep default ctor
    NonCopyable(const NonCopyable&) = delete;     // forbid copying
    NonCopyable& operator=(const NonCopyable&) = delete;
};

int main() {
    NonCopyable a;
    // NonCopyable b = a;  // compile error: copy ctor deleted
    std::cout << "ok\\n";
    return 0;
}`,
      },
      {
        title: 'Copy and move constructor',
        description: 'Duplicate or steal an object’s resources.',
        code: `#include <iostream>
#include <vector>

class Buffer {
    std::vector<int> data;
public:
    explicit Buffer(int n) : data(n) {}

    Buffer(const Buffer& o) : data(o.data) { std::cout << "copy\\n"; }
    Buffer(Buffer&& o) noexcept : data(std::move(o.data)) { std::cout << "move\\n"; }

    size_t size() const { return data.size(); }
};

int main() {
    Buffer a(100);
    Buffer b = a;                 // copy ctor
    Buffer c = std::move(a);      // move ctor
    std::cout << b.size() << " " << c.size() << "\\n";
    return 0;
}`,
      },
    ],
    related: ['classes-objects', 'rule-of-five', 'move-semantics'],
  },
  {
    id: 'encapsulation',
    title: 'Encapsulation & Access Specifiers',
    category: 'Classes',
    difficulty: 'intermediate',
    summary: 'Hide implementation details behind a public interface using private/protected.',
    definition:
      'Encapsulation bundles data and the functions that operate on it into one unit, and restricts direct access to the internal representation. `public` members form the interface; `private` members are the hidden implementation; `protected` members are visible to derived classes. Good encapsulation keeps invariants intact because external code cannot mutate private state arbitrarily.',
    syntax: 'class C { public: interface; private: state; };',
    returns: 'A type whose internal state is protected from uncontrolled access.',
    keyPoints: [
      'Make data members private; expose them through methods if needed.',
      'Access specifiers can appear in any order and multiple times in a class.',
      'A friend class/function can access private members — use sparingly.',
      'Protected data is still accessible to derived classes; prefer private + accessor methods.',
      'Encapsulation reduces coupling and makes refactoring safer.',
    ],
    examples: [
      {
        title: 'A class that protects its invariant',
        description: 'A BankAccount that cannot go negative through its interface.',
        code: `#include <iostream>
#include <stdexcept>

class BankAccount {
    double balance;              // private — protected state
public:
    BankAccount() : balance(0) {}
    void deposit(double amt) { if (amt > 0) balance += amt; }
    void withdraw(double amt) {
        if (amt <= 0) return;
        if (amt > balance) throw std::runtime_error("insufficient funds");
        balance -= amt;
    }
    double getBalance() const { return balance; }
};

int main() {
    BankAccount acc;
    acc.deposit(100);
    acc.withdraw(30);
    std::cout << "balance: " << acc.getBalance() << "\\n";  // 70
    return 0;
}`,
      },
      {
        title: 'friend function',
        description: 'Grant a free function access to private members.',
        code: `#include <iostream>
class Vec {
    double x, y;
public:
    Vec(double x, double y) : x(x), y(y) {}
    friend double dot(const Vec& a, const Vec& b);  // grants access
};

double dot(const Vec& a, const Vec& b) {
    return a.x * b.x + a.y * b.y;   // accesses private members
}

int main() {
    Vec a(1, 2), b(3, 4);
    std::cout << dot(a, b) << "\\n";   // 11
    return 0;
}`,
      },
    ],
    related: ['classes-objects', 'inheritance'],
  },
  {
    id: 'inheritance',
    title: 'Inheritance & Polymorphism',
    category: 'Inheritance',
    difficulty: 'advanced',
    summary: 'Derive new classes from base classes; use virtual functions for runtime polymorphism.',
    definition:
      'Inheritance models an "is-a" relationship: a derived class extends a base class, inheriting its members and adding or overriding behaviour. A `virtual` function is dispatched dynamically — the actual derived type’s override is called through a base pointer or reference. This is runtime polymorphism. A pure virtual function (`= 0`) makes the class abstract and un-instantiable; concrete derived classes must implement it.',
    syntax: 'class Derived : public Base { void override() override; };',
    returns: 'A derived type that can be used wherever a base is expected.',
    keyPoints: [
      'Always declare a virtual destructor in a polymorphic base class.',
      'override tells the compiler to check that you really overrode a base function.',
      'final prevents further overriding or deriving.',
      'A pure virtual function (= 0) makes the class abstract.',
      'Use public inheritance for "is-a"; private/protected inheritance is rare and models "implemented-in-terms-of".',
    ],
    examples: [
      {
        title: 'Virtual function dispatch',
        description: 'Call the right override through a base pointer.',
        code: `#include <iostream>
#include <memory>
#include <vector>

class Animal {
public:
    virtual void speak() const { std::cout << "...\\n"; }
    virtual ~Animal() = default;          // essential for polymorphic bases
};

class Dog : public Animal {
public:
    void speak() const override { std::cout << "Woof\\n"; }
};

class Cat : public Animal {
public:
    void speak() const override { std::cout << "Meow\\n"; }
};

int main() {
    std::vector<std::unique_ptr<Animal>> zoo;
    zoo.push_back(std::make_unique<Dog>());
    zoo.push_back(std::make_unique<Cat>());
    for (const auto& a : zoo) a->speak();   // Woof, Meow
    return 0;
}`,
      },
      {
        title: 'Abstract class with a pure virtual',
        description: 'Force derived classes to implement an interface.',
        code: `#include <iostream>

class Shape {
public:
    virtual double area() const = 0;    // pure virtual — no body
    virtual ~Shape() = default;
};

class Circle : public Shape {
    double r;
public:
    explicit Circle(double r) : r(r) {}
    double area() const override { return 3.14159 * r * r; }
};

int main() {
    // Shape s;            // compile error: abstract class
    Circle c(2);
    std::cout << c.area() << "\\n";       // ~12.57
    return 0;
}`,
      },
    ],
    related: ['encapsulation', 'virtual-functions'],
  },
  {
    id: 'virtual-functions',
    title: 'Virtual Functions & the vtable',
    category: 'Inheritance',
    difficulty: 'advanced',
    summary: 'How dynamic dispatch works: each polymorphic class has a table of function pointers.',
    definition:
      'When a class declares a virtual function, the compiler gives it a hidden pointer (the vptr) to a static table of function pointers (the vtable). Each object of a polymorphic class carries a vptr; a virtual call reads the vptr, looks up the slot, and calls the right function. This is the cost of runtime polymorphism — one extra indirection per call and one pointer per object.',
    syntax: 'virtual returnType name(params) [override] [final] [= 0];',
    returns: 'Dynamic dispatch to the most-derived override.',
    keyPoints: [
      'Virtual calls cost one extra memory read (the vtable lookup) per call.',
      'virtual destructors ensure the derived destructor runs when deleting via a base.',
      'A final method cannot be overridden; a final class cannot be derived from.',
      'Calling a virtual function from a constructor or destructor calls the base version.',
      'Non-virtual functions are resolved at compile time (static dispatch).',
    ],
    examples: [
      {
        title: 'final to stop overriding',
        description: 'Lock a method so no further derived class can change it.',
        code: `#include <iostream>
class Base {
public:
    virtual void f() { std::cout << "Base\\n"; }
    virtual ~Base() = default;
};
class Mid : public Base {
public:
    void f() override final { std::cout << "Mid\\n"; }   // locked
};
// class Sub : public Mid {
//     void f() override {}  // compile error: f is final
// };
int main() {
    Mid m;
    m.f();
    return 0;
}`,
      },
      {
        title: 'CRTP — static (compile-time) polymorphism',
        description: 'Achieve polymorphism without vtable overhead using templates.',
        code: `#include <iostream>

template <typename Derived>
struct ShapeBase {
    double area() { return static_cast<Derived*>(this)->areaImpl(); }
};

struct Square : ShapeBase<Square> {
    double side;
    explicit Square(double s) : side(s) {}
    double areaImpl() { return side * side; }
};

int main() {
    Square s(3);
    std::cout << s.area() << "\\n";   // 9 — no virtual call
    return 0;
}`,
      },
    ],
    related: ['inheritance', 'templates-basics'],
  },
  {
    id: 'rule-of-five',
    title: 'Rule of Five / Rule of Zero',
    category: 'Classes',
    difficulty: 'advanced',
    summary: 'If you define one special member, define all five — or none and let the compiler do it.',
    definition:
      'The Rule of Five: if a class manages a resource and you write any of the destructor, copy constructor, copy assignment, move constructor, or move assignment, you almost certainly need all five. The Rule of Zero: if every member manages its own resources (smart pointers, containers), write none of them — the compiler-generated versions are correct and exception-safe.',
    syntax: '~C(); C(const C&); C& operator=(const C&); C(C&&); C& operator=(C&&);',
    returns: 'A class with correct, leak-free copy, move, and destruction semantics.',
    keyPoints: [
      'Rule of Zero: prefer members that self-manage (unique_ptr, vector, string).',
      'Rule of Five: only when you own a raw resource (a pointer, a handle).',
      'Move members should be noexcept so containers can use them when reallocating.',
      'Copy-and-swap idiom unifies copy assignment and gives strong exception safety.',
      'Declaring a move constructor suppresses the implicit copy members.',
    ],
    examples: [
      {
        title: 'Rule of Five with a raw pointer',
        description: 'Manually manage every special member.',
        code: `#include <iostream>
#include <algorithm>

class IntArray {
    int* data;
    size_t n;
public:
    explicit IntArray(size_t n) : data(new int[n]()), n(n) {}
    ~IntArray() { delete[] data; }                                   // 1

    IntArray(const IntArray& o) : data(new int[o.n]), n(o.n) {       // 2 copy ctor
        std::copy(o.data, o.data + n, data);
    }
    IntArray& operator=(IntArray o) {                                 // 3 copy assign (copy-and-swap)
        std::swap(data, o.data); std::swap(n, o.n);
        return *this;
    }
    IntArray(IntArray&& o) noexcept : data(o.data), n(o.n) {          // 4 move ctor
        o.data = nullptr; o.n = 0;
    }
    // move assign covered by the copy-and-swap above (o passed by value)

    size_t size() const { return n; }
};

int main() {
    IntArray a(5);
    IntArray b = a;             // copy
    IntArray c = std::move(a);  // move
    std::cout << b.size() << " " << c.size() << "\\n";
    return 0;
}`,
      },
      {
        title: 'Rule of Zero',
        description: 'Let smart members handle everything.',
        code: `#include <iostream>
#include <vector>
#include <string>

class Team {
    std::string name;
    std::vector<int> scores;
public:
    Team(std::string n, std::vector<int> s)
        : name(std::move(n)), scores(std::move(s)) {}
    // no dtor, no copy/move — all five are correct automatically
};

int main() {
    Team t("A", {1, 2, 3});
    Team t2 = t;               // copy — fine
    Team t3 = std::move(t);    // move — fine
    std::cout << "ok\\n";
    return 0;
}`,
      },
    ],
    related: ['constructors', 'smart-pointers', 'move-semantics'],
  },
  {
    id: 'operator-overloading',
    title: 'Operator Overloading',
    category: 'Classes',
    difficulty: 'advanced',
    summary: 'Give user-defined types natural syntax like +, ==, <<, and [].',
    definition:
      'Operator overloading lets you define what built-in operators do for your custom types. You implement a function named operatorX (e.g. operator+, operator==). Binary operators can be members (one implicit operand) or free functions (two explicit operands); the free form allows conversions on the left operand. Some operators must be members: =, [], (), ->.',
    syntax: 'ReturnType operator+(const T& lhs, const T& rhs);',
    returns: 'A value of the operator’s result type.',
    keyPoints: [
      'Overload only when the meaning is natural and unambiguous (+ for addition, not for "concatenate a log").',
      'Prefer free functions for symmetric binary operators (+, ==) to allow left-operand conversions.',
      '=, [], (), -> must be member functions.',
      'Always implement == and !=; implement <, >, <=, >= together (or use <=> in C++20).',
      'std::ostream& operator<< is the idiomatic way to print a custom type.',
    ],
    examples: [
      {
        title: 'A 2-D vector with operators',
        description: 'Add, compare, and stream a Vec2.',
        code: `#include <iostream>

class Vec2 {
    double x, y;
public:
    Vec2(double x, double y) : x(x), y(y) {}
    Vec2 operator+(const Vec2& o) const { return {x + o.x, y + o.y}; }
    bool operator==(const Vec2& o) const { return x == o.x && y == o.y; }
    friend std::ostream& operator<<(std::ostream& os, const Vec2& v) {
        return os << "(" << v.x << ", " << v.y << ")";
    }
};

int main() {
    Vec2 a(1, 2), b(3, 4);
    std::cout << (a + b) << "\\n";          // (4, 6)
    std::cout << (a == b) << "\\n";         // 0
    return 0;
}`,
      },
      {
        title: 'Subscript operator for a container',
        description: 'Custom [] with bounds checking.',
        code: `#include <iostream>
#include <vector>
#include <stdexcept>

class Grid {
    std::vector<int> data;
    int cols;
public:
    Grid(int rows, int cols) : data(rows * cols), cols(cols) {}
    int& operator()(int r, int c) {
        return data.at(r * cols + c);   // bounds-checked
    }
};

int main() {
    Grid g(2, 3);
    g(0, 1) = 42;
    std::cout << g(0, 1) << "\\n";
    return 0;
}`,
      },
    ],
    related: ['classes-objects', 'inheritance'],
  },
];
