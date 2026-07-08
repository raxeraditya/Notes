import type { Topic } from '../types';

export const modernTopics: Topic[] = [
  {
    id: 'move-semantics',
    title: 'Move Semantics & rvalue References',
    category: 'Modern C++',
    difficulty: 'advanced',
    summary: 'Transfer ownership of resources instead of copying — steal the guts of a temporary.',
    definition:
      'Move semantics lets you transfer a resource (heap memory, a file handle) from one object to another without copying it. An rvalue reference (`T&&`) binds to a temporary or an explicitly moved object. A move constructor/assignment steals the source’s pointer and leaves the source empty. `std::move` casts an lvalue to an rvalue so the move overload is selected; it does not move anything itself.',
    syntax: 'T&& rref = std::move(obj);  std::move(x)',
    returns: 'An rvalue reference that selects the move overload.',
    keyPoints: [
      'std::move is just a cast to T&& — it does not move; the move constructor does.',
      'A moved-from object is in a valid-but-unspecified state; only assign or destroy it.',
      'Mark move constructors and move assignment noexcept so containers can use them.',
      'Return by value relies on move semantics (or copy elision) — no extra copy.',
      'Do not move from an object you still need; it may be empty afterwards.',
    ],
    examples: [
      {
        title: 'Move vs copy a string',
        description: 'See how move avoids an allocation.',
        code: `#include <iostream>
#include <string>
#include <utility>

int main() {
    std::string a = "a long enough string to avoid SSO";
    std::string b = a;                  // copy — allocates new buffer
    std::string c = std::move(a);       // move — steals a's buffer

    std::cout << "b=" << b << "\\n";
    std::cout << "c=" << c << "\\n";
    std::cout << "a='" << a << "' (moved-from)\\n";
    return 0;
}`,
      },
      {
        title: 'A move-only type',
        description: 'A class that transfers its resource instead of copying.',
        code: `#include <iostream>
#include <memory>

class Owner {
    std::unique_ptr<int> p;
public:
    explicit Owner(int x) : p(std::make_unique<int>(x)) {}
    Owner(Owner&&) noexcept = default;            // move ctor
    Owner& operator=(Owner&&) noexcept = default; // move assign
    Owner(const Owner&) = delete;                 // no copy
    int value() const { return *p; }
};

int main() {
    Owner a(42);
    Owner b = std::move(a);          // move — a's pointer now null
    std::cout << b.value() << "\\n";  // 42
    return 0;
}`,
      },
    ],
    related: ['references', 'smart-pointers', 'rule-of-five'],
  },
  {
    id: 'auto-and-decltype',
    title: 'auto, decltype & trailing returns',
    category: 'Modern C++',
    difficulty: 'intermediate',
    summary: 'Let the compiler deduce types for cleaner, less brittle code.',
    definition:
      '`auto` deduces a variable’s type from its initializer using the same rules as template argument deduction. `decltype(expr)` yields the declared type of an expression without evaluating it. A trailing return type (`auto f() -> int`) lets you declare a return type after the parameter list, which matters when the return type depends on the parameters. Since C++14, `auto` as a return type deduces it from the return statement.',
    syntax: 'auto x = expr;  decltype(expr) y;  auto f() -> ReturnType { ... }',
    returns: 'A type deduced by the compiler.',
    keyPoints: [
      'auto drops top-level const and references unless you add them: const auto&.',
      'auto&& is a forwarding reference in templates; in non-template code it’s an rvalue ref.',
      'Use auto for iterators and long type names to reduce clutter and brittleness.',
      'decltype(auto) preserves the exact type including references — useful in forwarding.',
      'Always initialise an auto variable — the compiler needs the initializer to deduce.',
    ],
    examples: [
      {
        title: 'auto for common cases',
        description: 'Deduce iterator and container value types.',
        code: `#include <iostream>
#include <vector>
#include <string>

int main() {
    std::vector<std::string> v = {"a", "bb", "ccc"};

    auto it = v.begin();                       // std::vector<std::string>::iterator
    const auto& first = v[0];                  // const std::string&
    auto len = first.size();                   // size_t

    std::cout << *it << " " << first << " " << len << "\\n";
    return 0;
}`,
      },
      {
        title: 'decltype and trailing return',
        description: 'Declare a return type based on a parameter expression.',
        code: `#include <iostream>
#include <vector>

template <typename T>
auto at(const std::vector<T>& v, size_t i) -> decltype(v[i]) {
    return v[i];
}

int main() {
    std::vector<int> v = {10, 20, 30};
    std::cout << at(v, 1) << "\\n";     // 20
    return 0;
}`,
      },
    ],
    related: ['lambdas', 'templates-basics'],
  },
  {
    id: 'smart-pointers-modern',
    title: 'Smart Pointers Deep Dive',
    category: 'Modern C++',
    difficulty: 'advanced',
    summary: 'unique_ptr, shared_ptr, weak_ptr, and when to use each with make_unique/make_shared.',
    definition:
      'Smart pointers are RAII wrappers that own heap objects. unique_ptr owns exclusively — zero overhead, move-only; it is the default choice. shared_ptr uses a reference-counted control block for shared ownership; use when ownership is genuinely shared and lifetimes unclear. weak_ptr observes a shared_ptr without extending its lifetime, breaking cycles. Prefer std::make_unique/make_shared for exception safety and a single allocation.',
    syntax: 'auto p = std::make_unique<T>(args);  auto s = std::make_shared<T>(args);',
    returns: 'A smart pointer that frees its resource automatically.',
    keyPoints: [
      'Use unique_ptr by default; it has the same cost as a raw pointer.',
      'make_unique/make_shared avoid a leaked allocation if a constructor throws.',
      'make_shared allocates the object and control block in one heap block.',
      'shared_ptr copies are atomic-incremented — a small cost on each copy.',
      'Use custom deleters (unique_ptr<T, Deleter>) for non-memory resources.',
    ],
    examples: [
      {
        title: 'unique_ptr in a container',
        description: 'Store polymorphic objects by unique_ptr.',
        code: `#include <iostream>
#include <memory>
#include <vector>

class Animal { public: virtual void speak() const = 0; virtual ~Animal() = default; };
class Dog : public Animal { public: void speak() const override { std::cout << "Woof\\n"; } };
class Cat : public Animal { public: void speak() const override { std::cout << "Meow\\n"; } };

int main() {
    std::vector<std::unique_ptr<Animal>> zoo;
    zoo.push_back(std::make_unique<Dog>());
    zoo.push_back(std::make_unique<Cat>());
    for (const auto& a : zoo) a->speak();
    return 0;
}`,
      },
      {
        title: 'Custom deleter for a FILE*',
        description: 'Manage a C resource with unique_ptr.',
        code: `#include <iostream>
#include <memory>
#include <cstdio>

int main() {
    auto f = std::unique_ptr<FILE, decltype(&fclose)>(
        fopen("out.txt", "w"), &fclose);
    if (f) std::fprintf(f.get(), "smart FILE\\n");
    return 0;  // fclose called automatically
}`,
      },
    ],
    related: ['smart-pointers', 'move-semantics', 'raii'],
  },
  {
    id: 'exceptions',
    title: 'Exceptions & Error Handling',
    category: 'Error Handling',
    difficulty: 'advanced',
    summary: 'throw, try/catch, and exception safety guarantees for robust error propagation.',
    definition:
      'Exceptions are C++’s primary mechanism for signalling and recovering from errors. A `throw` expression creates an exception object and unwinds the stack, calling destructors along the way, until a matching `catch` is found. Exceptions force errors to be handled — ignoring them terminates the program — and integrate with RAII so resources are freed automatically during stack unwinding.',
    syntax: 'try { ... } catch (const std::exception& e) { ... }',
    returns: 'None — throw transfers control; catch receives the exception object.',
    keyPoints: [
      'Catch by const reference to avoid slicing: catch (const std::exception& e).',
      'Catch the most specific types first; catch(...) matches anything.',
      'Destructors must never throw during stack unwinding — mark them noexcept.',
      'Basic guarantee: no leaks; strong guarantee: operation succeeds or rolls back.',
      'Throw by value, catch by reference — never throw pointers to heap objects.',
    ],
    examples: [
      {
        title: 'Throw and catch a standard exception',
        description: 'Validate input and raise std::invalid_argument.',
        code: `#include <iostream>
#include <stdexcept>

double reciprocal(double x) {
    if (x == 0) throw std::invalid_argument("division by zero");
    return 1.0 / x;
}

int main() {
    try {
        std::cout << reciprocal(2) << "\\n";    // 0.5
        std::cout << reciprocal(0) << "\\n";    // throws
    } catch (const std::exception& e) {
        std::cout << "error: " << e.what() << "\\n";
    }
    return 0;
}`,
      },
      {
        title: 'A custom exception class',
        description: 'Derive from std::runtime_error for your own errors.',
        code: `#include <iostream>
#include <stdexcept>
#include <string>

class ParseError : public std::runtime_error {
public:
    explicit ParseError(const std::string& msg)
        : std::runtime_error(msg) {}
};

int main() {
    try {
        throw ParseError("unexpected token at line 5");
    } catch (const ParseError& e) {
        std::cout << "parse failed: " << e.what() << "\\n";
    } catch (const std::exception& e) {
        std::cout << "other: " << e.what() << "\\n";
    }
    return 0;
}`,
      },
      {
        title: 'Exception-safe resource handling with RAII',
        description: 'A lock guard survives a throw.',
        code: `#include <iostream>
#include <stdexcept>
#include <mutex>

std::mutex m;

void work() {
    std::lock_guard<std::mutex> lock(m);   // RAII — unlocks on unwind
    throw std::runtime_error("boom");      // lock still released
}

int main() {
    try { work(); }
    catch (const std::exception& e) { std::cout << "caught: " << e.what() << "\\n"; }
    return 0;
}`,
      },
    ],
    related: ['raii', 'smart-pointers', 'noexcept'],
  },
  {
    id: 'noexcept',
    title: 'noexcept & the Strong Exception Guarantee',
    category: 'Error Handling',
    difficulty: 'advanced',
    summary: 'Mark functions that cannot throw so the compiler and library can optimise around them.',
    definition:
      '`noexcept` declares that a function does not throw. If a noexcept function does throw, the program calls std::terminate instead of unwinding. The compiler can skip exception-handling bookwork around noexcept calls, and std::vector will use a type’s noexcept move constructor when reallocating — if the move is not noexcept, vector copies instead (the strong exception guarantee).',
    syntax: 'void f() noexcept { ... }  // or noexcept(condition)',
    returns: 'None — it is a declaration affecting exception behaviour.',
    keyPoints: [
      'Mark move constructors and move assignment noexcept so containers use them.',
      'Destructors are implicitly noexcept; do not make them throw.',
      'noexcept(expr) is a query: bool true if expr does not throw.',
      'A noexcept function that throws calls std::terminate — no unwinding.',
      'Do not sprinkle noexcept on everything; only where you can guarantee it.',
    ],
    examples: [
      {
        title: 'noexcept move enables vector optimisation',
        description: 'vector uses move only if it is noexcept.',
        code: `#include <iostream>
#include <vector>
#include <string>

class Buffer {
    std::string data;
public:
    explicit Buffer(std::string s) : data(std::move(s)) {}
    Buffer(const Buffer&) { std::cout << "copy\\n"; }
    Buffer(Buffer&& o) noexcept : data(std::move(o.data)) { std::cout << "move\\n"; }
};

int main() {
    std::vector<Buffer> v;
    v.reserve(3);
    v.emplace_back("a");
    v.emplace_back("b");
    v.emplace_back("c");    // reallocation uses move (noexcept) — no copies
    return 0;
}`,
      },
    ],
    related: ['exceptions', 'move-semantics', 'rule-of-five'],
  },
  {
    id: 'threads',
    title: 'std::thread — Basics & Joining',
    category: 'Concurrency',
    difficulty: 'advanced',
    summary: 'Spawn a thread of execution with std::thread; always join() or detach() it.',
    definition:
      '`std::thread` (in <thread>) represents a new OS thread of execution. You construct it with a callable and its arguments; the function runs concurrently. Every thread must be joined (wait for completion) or detached (run independently) before the std::thread object is destroyed — otherwise std::terminate is called. Arguments are passed by value (copied) by default; wrap in std::ref to pass by reference.',
    syntax: 'std::thread t(func, args...);  t.join();',
    returns: 'A thread handle that must be joined or detached.',
    keyPoints: [
      'A thread must be joined or detached before the std::thread object dies.',
      'Arguments are copied by default; use std::ref to pass by reference.',
      'join() blocks the calling thread until the spawned thread finishes.',
      'detach() lets the thread run independently — you lose its handle.',
      'Each std::thread has one associated native thread; moving transfers ownership.',
    ],
    examples: [
      {
        title: 'Spawn and join a thread',
        description: 'Run a function on a separate thread.',
        code: `#include <iostream>
#include <thread>
#include <string>

void greet(const std::string& name) {
    std::cout << "Hello from " << name << "\\n";
}

int main() {
    std::thread t(greet, "worker");
    t.join();   // wait for it to finish
    std::cout << "done\\n";
    return 0;
}`,
      },
      {
        title: 'Pass by reference with std::ref',
        description: 'Mutate a caller variable from a thread.',
        code: `#include <iostream>
#include <thread>
#include <vector>

void fill(std::vector<int>& v) {
    for (int i = 0; i < 5; ++i) v[i] = i * i;
}

int main() {
    std::vector<int> v(5);
    std::thread t(fill, std::ref(v));   // pass by reference
    t.join();
    for (int x : v) std::cout << x << " ";   // 0 1 4 9 16
    std::cout << "\\n";
    return 0;
}`,
      },
      {
        title: 'Lambda as a thread function',
        description: 'Run an inline lambda on a thread.',
        code: `#include <iostream>
#include <thread>

int main() {
    int result = 0;
    std::thread t([&result]() {
        result = 42;
    });
    t.join();
    std::cout << "result: " << result << "\\n";   // 42
    return 0;
}`,
      },
    ],
    related: ['mutexes', 'async-futures', 'lambdas'],
  },
  {
    id: 'mutexes',
    title: 'Mutexes & Locks',
    category: 'Concurrency',
    difficulty: 'advanced',
    summary: 'Protect shared data with std::mutex and RAII lock guards.',
    definition:
      'A mutex (mutual exclusion lock) serialises access to shared data so only one thread can enter a critical section at a time. `std::lock_guard` is the simplest RAII wrapper — it locks on construction and unlocks on destruction. `std::unique_lock` is movable and supports deferred locking and condition variables. Always lock a mutex through a guard, never by hand, so an exception cannot leave the mutex locked.',
    syntax: 'std::mutex m; std::lock_guard<std::mutex> g(m);',
    returns: 'A guard that releases the lock at scope exit.',
    keyPoints: [
      'Prefer lock_guard for simple scope-bound locking; unique_lock for more control.',
      'Never lock a mutex manually — a throw would leave it locked.',
      'Lock multiple mutexes together with std::lock to avoid deadlock.',
      'std::scoped_lock (C++17) locks any number of mutexes deadlock-free.',
      'Hold locks for the shortest time possible to maximise concurrency.',
    ],
    examples: [
      {
        title: 'Protected counter',
        description: 'Increment a shared counter under a lock.',
        code: `#include <iostream>
#include <thread>
#include <vector>
#include <mutex>

int counter = 0;
std::mutex m;

void increment() {
    for (int i = 0; i < 1000; ++i) {
        std::lock_guard<std::mutex> lock(m);
        ++counter;
    }
}

int main() {
    std::vector<std::thread> threads;
    for (int i = 0; i < 10; ++i) threads.emplace_back(increment);
    for (auto& t : threads) t.join();
    std::cout << "counter: " << counter << "\\n";   // 10000
    return 0;
}`,
      },
      {
        title: 'Lock multiple mutexes deadlock-free',
        description: 'Use std::scoped_lock to acquire two locks atomically.',
        code: `#include <iostream>
#include <mutex>
#include <thread>

std::mutex a, b;

void transfer() {
    std::scoped_lock lock(a, b);   // acquires both, deadlock-free
    std::cout << "both locked\\n";
}

int main() {
    std::thread t1(transfer);
    std::thread t2(transfer);
    t1.join(); t2.join();
    return 0;
}`,
      },
    ],
    related: ['threads', 'async-futures'],
  },
  {
    id: 'async-futures',
    title: 'std::async, futures & promises',
    category: 'Concurrency',
    difficulty: 'advanced',
    summary: 'Run a task asynchronously and retrieve its result through a future.',
    definition:
      '`std::async` launches a callable possibly on a new thread and returns a `std::future` — a handle to the result that will become ready when the task completes. `future::get()` blocks until the result is ready, then returns it (or rethrows any exception). `std::promise` is the write-side counterpart; you set a value or exception on the promise and the matching future receives it. This is a higher-level alternative to raw threads.',
    syntax: 'auto fut = std::async(std::launch::async, func, args...);  fut.get();',
    returns: 'A std::future<T> holding the eventual result.',
    keyPoints: [
      'std::launch::async forces a new thread; std::launch::deferred is lazy (runs on get).',
      'get() blocks until the result is ready, then returns or rethrows.',
      'A future is single-consumer — only one get() is allowed.',
      'std::promise is the channel a task writes its result to.',
      'Use std::shared_future for multiple consumers of one result.',
    ],
    examples: [
      {
        title: 'Run a computation async',
        description: 'Compute in the background and collect the result.',
        code: `#include <iostream>
#include <future>
#include <chrono>
#include <thread>

long slowSum(int n) {
    long s = 0;
    for (int i = 1; i <= n; ++i) s += i;
    return s;
}

int main() {
    auto fut = std::async(std::launch::async, slowSum, 1'000'000);
    std::cout << "doing other work...\\n";
    std::cout << "result: " << fut.get() << "\\n";   // blocks until ready
    return 0;
}`,
      },
      {
        title: 'Promise and future pair',
        description: 'One thread sets a value; another waits for it.',
        code: `#include <iostream>
#include <future>
#include <thread>

int main() {
    std::promise<int> prom;
    std::future<int> fut = prom.get_future();

    std::thread producer([&prom]() {
        prom.set_value(42);
    });

    std::cout << "waiting...\\n";
    std::cout << "got: " << fut.get() << "\\n";
    producer.join();
    return 0;
}`,
      },
    ],
    related: ['threads', 'mutexes', 'lambdas'],
  },
  {
    id: 'ranges',
    title: 'Ranges & Views (C++20)',
    category: 'Modern C++',
    difficulty: 'advanced',
    summary: 'Composable, lazy pipeline operations over any sequence.',
    definition:
      'The C++20 Ranges library lets you compose algorithms as a pipeline over a range without writing begin/end iterators. Views are lazy adapters — they do not copy or compute until you iterate. You can chain std::views::filter, std::views::transform, std::views::reverse, and std::views::take to express a data transformation declaratively in one expression.',
    syntax: 'auto r = v | std::views::filter(pred) | std::views::transform(fn);',
    returns: 'A lazy view object that iterates the transformed range.',
    keyPoints: [
      'Views are lazy — no work happens until you iterate the result.',
      'Pipelines compose with the | operator, like a Unix pipe.',
      'std::ranges::sort(v) takes a container directly, no begin/end.',
      'Views do not own or copy data — keep the source alive while iterating.',
      'A view is cheap to pass around (usually just a pair of iterators or a size).',
    ],
    examples: [
      {
        title: 'Filter and transform pipeline',
        description: 'Keep evens, square them, take the first three.',
        code: `#include <iostream>
#include <vector>
#include <ranges>
#include <algorithm>

int main() {
    std::vector<int> v = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};

    auto result = v
        | std::views::filter([](int x) { return x % 2 == 0; })
        | std::views::transform([](int x) { return x * x; })
        | std::views::take(3);

    for (int x : result) std::cout << x << " ";   // 4 16 36
    std::cout << "\\n";
    return 0;
}`,
      },
      {
        title: 'Reverse and iota',
        description: 'Generate a range and reverse it.',
        code: `#include <iostream>
#include <ranges>
#include <algorithm>

int main() {
    auto first_five = std::views::iota(1)         // infinite 1,2,3,...
                       | std::views::take(5);     // 1..5

    auto reversed = std::views::reverse(first_five);
    for (int x : reversed) std::cout << x << " ";  // 5 4 3 2 1
    std::cout << "\\n";
    return 0;
}`,
      },
    ],
    related: ['stl-algorithms', 'stl-iterators', 'lambdas'],
  },
];
