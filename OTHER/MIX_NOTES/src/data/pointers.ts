import type { Topic } from '../types';

export const pointersTopics: Topic[] = [
  {
    id: 'pointers-basics',
    title: 'Pointers — Basics & Address-of',
    category: 'Pointers',
    difficulty: 'intermediate',
    summary: 'A pointer stores the memory address of another object; * dereferences, & takes the address.',
    definition:
      'A pointer is a variable that holds the memory address of another object. The address-of operator `&` yields a pointer to an existing object; the dereference operator `*` reads or writes the object a pointer points at. Pointers have a type (e.g. `int*`) telling the compiler what kind of object lives at that address, which affects how dereferencing and pointer arithmetic work.',
    syntax: 'type* name = &object;  // type* ptr = nullptr;',
    parameters: [
      { name: '&', type: 'address-of', description: 'Returns a pointer to an existing object.' },
      { name: '*', type: 'dereference', description: 'Accesses the object a pointer points at.' },
      { name: 'nullptr', type: 'null pointer', description: 'A pointer that points to nothing.' },
    ],
    returns: 'A pointer value (an address) or, when dereferenced, the pointed-to object.',
    keyPoints: [
      'A pointer’s type describes what is at the address, not the pointer itself.',
      'Always initialise pointers — an uninitialized pointer is dangerous.',
      'nullptr is the modern null pointer literal; prefer it over NULL or 0.',
      'Dereferencing a null or dangling pointer is undefined behaviour.',
      'Pointer arithmetic moves by sizeof(type), not by one byte.',
    ],
    examples: [
      {
        title: 'Address-of and dereference',
        description: 'Take an address and read/write through it.',
        code: `#include <iostream>
int main() {
    int x = 42;
    int* p = &x;            // p holds the address of x

    std::cout << "x    = " << x << "\\n";
    std::cout << "p    = " << p << "\\n";        // address
    std::cout << "*p   = " << *p << "\\n";      // 42 (dereference)

    *p = 99;                // write through the pointer
    std::cout << "x now = " << x << "\\n";      // 99
    return 0;
}`,
      },
      {
        title: 'Null pointer check',
        description: 'Guard against dereferencing nullptr.',
        code: `#include <iostream>
int main() {
    int* p = nullptr;
    if (p != nullptr) {
        std::cout << *p << "\\n";   // would be UB
    } else {
        std::cout << "pointer is null\\n";
    }
    return 0;
}`,
      },
      {
        title: 'Pointer to an array element',
        description: 'Point at one element and step forward.',
        code: `#include <iostream>
int main() {
    int arr[3] = {10, 20, 30};
    int* p = arr;                  // points to arr[0]
    std::cout << *p << " ";        // 10
    ++p;                            // advance by sizeof(int)
    std::cout << *p << " ";        // 20
    std::cout << *(p + 1) << "\\n"; // 30
    return 0;
}`,
      },
    ],
    related: ['references', 'dynamic-memory'],
  },
  {
    id: 'references',
    title: 'References (lvalue & rvalue)',
    category: 'References',
    difficulty: 'intermediate',
    summary: 'An alias for an existing object; safer than a pointer and never null.',
    definition:
      'A reference is an alias — another name for an existing object. An lvalue reference (`T&`) binds to a named, addressable object; an rvalue reference (`T&&`) binds to a temporary (a value about to expire), enabling move semantics. Unlike a pointer, a reference must be initialised when created, cannot be null, and cannot be reseated to refer to a different object.',
    syntax: 'T& ref = object;  // lvalue reference\nT&& rref = temporary;  // rvalue reference',
    returns: 'An alias that acts exactly like the referenced object.',
    keyPoints: [
      'A reference must be initialised and cannot be null or reseated.',
      'Use lvalue references to avoid copies and to allow mutation.',
      'Use const T& to bind to both lvalues and rvalues without copying.',
      'Rvalue references (T&&) enable move semantics and perfect forwarding.',
      'Dangling references (to a destroyed object) cause undefined behaviour.',
    ],
    examples: [
      {
        title: 'lvalue reference as an alias',
        description: 'A reference shares storage with its target.',
        code: `#include <iostream>
int main() {
    int x = 5;
    int& r = x;        // r is another name for x
    r = 20;
    std::cout << x << "\\n";   // 20 — x changed through r
    return 0;
}`,
      },
      {
        title: 'const reference extends a temporary’s lifetime',
        description: 'Binding a const ref to a temporary is safe and legal.',
        code: `#include <iostream>
#include <string>
int main() {
    const std::string& s = std::string("temp");  // lifetime extended
    std::cout << s << "\\n";                      // temp
    return 0;
}`,
      },
      {
        title: 'Rvalue reference for move semantics',
        description: 'Bind to a temporary and steal its resources.',
        code: `#include <iostream>
#include <string>
int main() {
    std::string a = "hello";
    std::string b = std::move(a);   // move, not copy — a is now empty
    std::cout << "b = " << b << "\\n";
    std::cout << "a = '" << a << "'\\n";   // valid but unspecified
    return 0;
}`,
      },
    ],
    related: ['pointers-basics', 'dynamic-memory', 'move-semantics'],
  },
  {
    id: 'dynamic-memory',
    title: 'Dynamic Memory (new / delete)',
    category: 'Memory Management',
    difficulty: 'intermediate',
    summary: 'Allocate objects on the heap with new; free them with delete to avoid leaks.',
    definition:
      'Dynamic (heap) memory outlives the scope where it was created. `new` allocates and constructs an object, returning a pointer; `delete` destroys and frees it. Arrays use `new[]` and `delete[]`. Forgetting to delete causes memory leaks; deleting twice or using freed memory is undefined behaviour. In modern C++ prefer smart pointers (unique_ptr, shared_ptr) over raw new/delete.',
    syntax: 'T* p = new T;  delete p;  T* a = new T[n];  delete[] a;',
    returns: 'new returns a pointer to the heap-allocated object.',
    keyPoints: [
      'Every new must be matched by exactly one delete; new[] by delete[].',
      'Mismatching new/new[] with delete/delete[] is undefined behaviour.',
      'new throws std::bad_alloc when memory is exhausted (use nothrow to get null).',
      'Prefer std::unique_ptr / std::make_unique over raw new in modern code.',
      'A memory leak occurs when the last pointer to heap memory is lost without delete.',
    ],
    examples: [
      {
        title: 'Single object on the heap',
        description: 'Allocate, use, and free one object.',
        code: `#include <iostream>
int main() {
    int* p = new int(42);
    std::cout << *p << "\\n";
    delete p;               // free the memory
    return 0;
}`,
      },
      {
        title: 'Dynamic array',
        description: 'Allocate an array on the heap and free it.',
        code: `#include <iostream>
int main() {
    int n = 5;
    int* arr = new int[n];
    for (int i = 0; i < n; ++i) arr[i] = i * i;
    for (int i = 0; i < n; ++i) std::cout << arr[i] << " ";
    std::cout << "\\n";
    delete[] arr;           // must use delete[] for arrays
    return 0;
}`,
      },
      {
        title: 'Why smart pointers are better',
        description: 'make_unique frees memory automatically.',
        code: `#include <iostream>
#include <memory>
int main() {
    auto p = std::make_unique<int>(42);
    std::cout << *p << "\\n";
    // no delete needed — freed when p goes out of scope
    return 0;
}`,
      },
    ],
    related: ['pointers-basics', 'smart-pointers', 'raii'],
  },
  {
    id: 'smart-pointers',
    title: 'Smart Pointers (unique_ptr, shared_ptr)',
    category: 'Memory Management',
    difficulty: 'advanced',
    summary: 'RAII wrappers that own heap memory and free it automatically.',
    definition:
      'Smart pointers manage heap memory through RAII: they own an object and free it when the pointer itself is destroyed. `std::unique_ptr` is the sole owner — non-copyable, movable, zero overhead; `std::shared_ptr` uses reference counting so multiple owners can share an object, freed when the last owner dies. `std::weak_ptr` is a non-owning observer of a shared_ptr that breaks cycles.',
    syntax: 'auto p = std::make_unique<T>(args);  auto s = std::make_shared<T>(args);',
    returns: 'A smart pointer object that owns heap memory.',
    keyPoints: [
      'Prefer std::make_unique / std::make_shared over direct new — exception-safe.',
      'unique_ptr is move-only; copying it is a compile error.',
      'shared_ptr’s control block is allocated once; copies just bump the count.',
      'weak_ptr prevents shared_ptr reference cycles (e.g. parent/child graphs).',
      'Never create two shared_ptrs from the same raw pointer — use copy instead.',
    ],
    examples: [
      {
        title: 'unique_ptr — exclusive ownership',
        description: 'Only one owner; memory freed on scope exit.',
        code: `#include <iostream>
#include <memory>

struct Widget {
    Widget()  { std::cout << "ctor\\n"; }
    ~Widget() { std::cout << "dtor\\n"; }
};

int main() {
    {
        auto w = std::make_unique<Widget>();
    }  // ~Widget called here, memory freed
    std::cout << "after scope\\n";
    return 0;
}`,
      },
      {
        title: 'shared_ptr — shared ownership',
        description: 'Reference counting across multiple owners.',
        code: `#include <iostream>
#include <memory>
int main() {
    auto a = std::make_shared<int>(10);
    auto b = a;                      // both share ownership, count = 2
    std::cout << "use_count: " << a.use_count() << "\\n";  // 2
    *b = 20;
    std::cout << *a << "\\n";        // 20 — same object
    return 0;
}`,
      },
      {
        title: 'weak_ptr breaks cycles',
        description: 'A non-owning observer that does not keep the object alive.',
        code: `#include <iostream>
#include <memory>
int main() {
    auto sp = std::make_shared<int>(7);
    std::weak_ptr<int> wp = sp;      // observe, don’t own

    if (auto locked = wp.lock())     // promote to shared_ptr if still alive
        std::cout << "alive: " << *locked << "\\n";
    sp.reset();                       // object freed (wp did not count)
    std::cout << "expired: " << wp.expired() << "\\n";  // 1 (true)
    return 0;
}`,
      },
    ],
    related: ['dynamic-memory', 'raii', 'move-semantics'],
  },
  {
    id: 'raii',
    title: 'RAII — Resource Acquisition Is Initialization',
    category: 'Memory Management',
    difficulty: 'advanced',
    summary: 'Tie a resource’s lifetime to an object’s lifetime so cleanup is automatic and exception-safe.',
    definition:
      'RAII is the core C++ resource-management idiom: acquire a resource (memory, file handle, lock, socket) in a constructor and release it in the destructor. Because destructors run automatically when an object goes out of scope — even when an exception is thrown — resources are never leaked. Every standard container, smart pointer, lock guard, and stream uses RAII.',
    syntax: 'class Owner { Owner() { acquire(); } ~Owner() { release(); } };',
    returns: 'An object whose lifetime exactly governs a resource’s lifetime.',
    keyPoints: [
      'Destructors run in reverse order of construction, at scope exit, even on throw.',
      'RAII makes manual cleanup (close, free, unlock) unnecessary and error-prone code rare.',
      'std::lock_guard, std::unique_lock, std::fstream, smart pointers are all RAII types.',
      'Move semantics transfer ownership; copy semantics share or clone the resource.',
      'A class that owns a resource should usually disable copying or implement them carefully.',
    ],
    examples: [
      {
        title: 'A handmade RAII file handle',
        description: 'Open in the constructor, close in the destructor.',
        code: `#include <iostream>
#include <fstream>
#include <string>

class LogFile {
    std::ofstream ofs;
public:
    explicit LogFile(const std::string& path) : ofs(path) {
        if (!ofs) throw std::runtime_error("cannot open");
    }
    void write(const std::string& s) { ofs << s << "\\n"; }
    ~LogFile() { if (ofs.is_open()) ofs.close(); }   // automatic cleanup
};

int main() {
    {
        LogFile log("out.txt");
        log.write("hello RAII");
    }  // file closed automatically here
    std::cout << "done\\n";
    return 0;
}`,
      },
      {
        title: 'RAII with exceptions',
        description: 'The destructor runs even when an exception is thrown.',
        code: `#include <iostream>
#include <memory>
struct Trace {
    Trace()  { std::cout << "acquire\\n"; }
    ~Trace() { std::cout << "release\\n"; }
};
void risky() {
    Trace t;                       // RAII guard
    throw std::runtime_error("boom");
}
int main() {
    try { risky(); }
    catch (const std::exception& e) {
        std::cout << "caught: " << e.what() << "\\n";  // "release" already printed
    }
    return 0;
}`,
      },
    ],
    related: ['smart-pointers', 'dynamic-memory', 'exceptions'],
  },
  {
    id: 'memory-layout',
    title: 'Memory Layout: Stack vs Heap vs Static',
    category: 'Memory Management',
    difficulty: 'intermediate',
    summary: 'Where objects live: automatic stack storage, dynamic heap storage, and static storage.',
    definition:
      'C++ objects live in one of three storage durations. Stack (automatic) storage is managed by the compiler — objects are created at definition and destroyed at scope exit, very fast but limited in size. Heap (dynamic) storage is managed by the programmer via new/delete — flexible but slow and leak-prone. Static storage holds globals and static locals, living for the entire program. Thread storage is a fourth, per-thread variant.',
    syntax: 'int local;          // stack\nint* p = new int;   // heap\nstatic int s;       // static',
    returns: 'Objects placed in the appropriate storage region.',
    keyPoints: [
      'Stack allocation is a pointer bump — O(1) and cache-friendly.',
      'Stack size is limited (often 1–8 MB); large arrays should go on the heap.',
      'Heap allocation via new is slower and can fragment memory.',
      'Static objects are initialised before main and destroyed after it returns.',
      'Prefer automatic (stack) storage whenever the lifetime fits a scope.',
    ],
    examples: [
      {
        title: 'Three storage durations',
        description: 'Show where each kind of object lives.',
        code: `#include <iostream>

int global = 100;                 // static storage

void f() {
    static int count = 0;         // static, persists across calls
    int local = 10;               // stack, destroyed at return
    ++count;
    std::cout << "call " << count << " local " << local << "\\n";
}

int main() {
    f();
    f();
    int* heap = new int(42);      // heap
    std::cout << "global " << global << " heap " << *heap << "\\n";
    delete heap;
    return 0;
}`,
      },
    ],
    related: ['dynamic-memory', 'raii', 'pointers-basics'],
  },
];
