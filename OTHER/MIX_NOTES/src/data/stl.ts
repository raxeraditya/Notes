import type { Topic } from '../types';

export const stlTopics: Topic[] = [
  {
    id: 'stl-vectors',
    title: 'std::vector — Dynamic Array',
    category: 'Containers',
    difficulty: 'intermediate',
    summary: 'The go-to sequence container: a growable array with O(1) random access.',
    definition:
      '`std::vector` is a dynamically-sized, contiguous array. It keeps elements in a single block of memory, giving O(1) indexed access, O(1) push_back amortised, and O(n) insertion in the middle. It tracks both its size (elements used) and capacity (allocated slots); when size exceeds capacity it allocates a larger block and moves all elements across. Contiguous storage makes it cache-friendly and compatible with C APIs.',
    syntax: 'std::vector<T> v;  v.push_back(x);  v[i];  v.size();',
    returns: 'A managed, contiguous, resizable array.',
    keyPoints: [
      'push_back is O(1) amortised; occasional reallocation moves all elements.',
      'reserve(n) pre-allocates capacity to avoid repeated reallocations.',
      'shrink_to_fit hints to release unused capacity (non-binding).',
      'Pass iterators or a size+value to the constructor to pre-fill.',
      'Iterators and references are invalidated by reallocation; use indices when unsure.',
    ],
    examples: [
      {
        title: 'Grow and iterate',
        description: 'Add elements and loop over a vector.',
        code: `#include <iostream>
#include <vector>

int main() {
    std::vector<int> v;
    v.push_back(10);
    v.push_back(20);
    v.push_back(30);

    std::cout << "size=" << v.size() << " cap=" << v.capacity() << "\\n";
    for (int x : v) std::cout << x << " ";   // 10 20 30
    std::cout << "\\n";
    return 0;
}`,
      },
      {
        title: 'reserve and constructor forms',
        description: 'Pre-allocate and pre-fill a vector.',
        code: `#include <iostream>
#include <vector>

int main() {
    std::vector<int> a(5, 0);          // 5 zeros
    std::vector<int> b{1, 2, 3, 4};    // initializer list

    std::vector<int> c;
    c.reserve(1000);                    // capacity 1000, size 0
    for (int i = 0; i < 1000; ++i) c.push_back(i);  // no realloc

    std::cout << a[0] << " " << b[3] << " " << c[999] << "\\n";
    return 0;
}`,
      },
      {
        title: 'Erase and insert',
        description: 'Remove or add elements in the middle.',
        code: `#include <iostream>
#include <vector>

int main() {
    std::vector<int> v = {1, 2, 3, 4, 5};
    v.erase(v.begin() + 1);           // remove element at index 1 -> {1,3,4,5}
    v.insert(v.begin() + 1, 99);      // insert 99 -> {1,99,3,4,5}
    for (int x : v) std::cout << x << " ";
    std::cout << "\\n";
    return 0;
}`,
      },
    ],
    related: ['stl-iterators', 'stl-algorithms', 'arrays-strings'],
  },
  {
    id: 'stl-iterators',
    title: 'Iterators & Range-Based For',
    category: 'Iterators',
    difficulty: 'intermediate',
    summary: 'Generalised pointers that let algorithms work on any container uniformly.',
    definition:
      'An iterator is an object that points to an element in a container and behaves like a pointer — you can dereference it (*it), advance it (++it), and compare it (!=). Containers expose begin() and end() iterators defining the half-open range [begin, end). Algorithms are written in terms of iterators so they work on any container that supplies the right iterator category. Range-based for loops use begin/end under the hood.',
    syntax: 'for (auto it = c.begin(); it != c.end(); ++it) { *it; }',
    returns: 'An iterator object that traverses a container.',
    keyPoints: [
      '[begin, end) is half-open: end is one past the last element and is not dereferenced.',
      'Categories: input, output, forward, bidirectional, random-access, contiguous.',
      'vector and array give random-access iterators; list gives bidirectional.',
      'cbegin()/cend() return const iterators that cannot modify elements.',
      'Prefer range-based for and std::ranges (C++20) over explicit iterator loops.',
    ],
    examples: [
      {
        title: 'Explicit iterator loop',
        description: 'Walk a vector with begin/end.',
        code: `#include <iostream>
#include <vector>

int main() {
    std::vector<int> v = {10, 20, 30};
    for (auto it = v.begin(); it != v.end(); ++it) {
        std::cout << *it << " ";        // 10 20 30
    }
    std::cout << "\\n";
    return 0;
}`,
      },
      {
        title: 'Range-based for (by value, ref, const ref)',
        description: 'Three ways to loop over a container.',
        code: `#include <iostream>
#include <vector>
#include <string>

int main() {
    std::vector<std::string> names = {"Ada", "Linus", "Grace"};

    for (std::string s : names)        s += "!";   // copy — original unchanged
    for (std::string& s : names)       s += "?";   // ref — mutates
    for (const std::string& s : names) std::cout << s << " ";  // read-only, no copy
    std::cout << "\\n";                              // Ada? Linus? Grace?
    return 0;
}`,
      },
    ],
    related: ['stl-vectors', 'stl-algorithms'],
  },
  {
    id: 'stl-algorithms',
    title: 'Algorithms (<algorithm>)',
    category: 'Algorithms',
    difficulty: 'intermediate',
    summary: 'sort, find, copy, accumulate, transform, and more — all iterator-based.',
    definition:
      'The <algorithm> header provides dozens of generic, iterator-based functions that operate on any container’s range [first, last). They are decoupled from containers: the same std::sort works on a vector, an array, or a C array. Common families are sorting (sort, stable_sort), searching (find, binary_search), mutating (copy, transform, remove), and numeric (accumulate, in <numeric>).',
    syntax: '#include <algorithm>\nstd::sort(v.begin(), v.end());',
    returns: 'Varies — many modify in place, some return an iterator or a value.',
    keyPoints: [
      'Algorithms take iterator ranges, not containers — maximally reusable.',
      'std::sort is O(n log n) and not stable; use stable_sort to keep equal-order.',
      'Pass a callable (lambda) as the comparator: sort(v.begin(), v.end(), cmp).',
      'std::accumulate (in <numeric>) folds a range with an operator and initial value.',
      'C++20 std::ranges lets you pass the container directly: std::ranges::sort(v).',
    ],
    examples: [
      {
        title: 'sort, find, and count',
        description: 'Order, search, and tally a vector.',
        code: `#include <iostream>
#include <vector>
#include <algorithm>

int main() {
    std::vector<int> v = {5, 3, 1, 4, 2};
    std::sort(v.begin(), v.end());              // {1,2,3,4,5}

    auto it = std::find(v.begin(), v.end(), 3);
    std::cout << "found: " << (it != v.end()) << "\\n";

    int n = std::count(v.begin(), v.end(), 3);
    std::cout << "count of 3: " << n << "\\n";
    return 0;
}`,
      },
      {
        title: 'transform and accumulate',
        description: 'Map and fold a range.',
        code: `#include <iostream>
#include <vector>
#include <numeric>
#include <algorithm>

int main() {
    std::vector<int> v = {1, 2, 3, 4};
    std::vector<int> squared(v.size());
    std::transform(v.begin(), v.end(), squared.begin(),
                   [](int x) { return x * x; });          // {1,4,9,16}

    int sum = std::accumulate(squared.begin(), squared.end(), 0);
    std::cout << "sum of squares: " << sum << "\\n";      // 30
    return 0;
}`,
      },
      {
        title: 'Custom comparator',
        description: 'Sort in descending order with a lambda.',
        code: `#include <iostream>
#include <vector>
#include <algorithm>

int main() {
    std::vector<int> v = {3, 1, 4, 1, 5, 9, 2, 6};
    std::sort(v.begin(), v.end(), [](int a, int b) {
        return a > b;            // descending
    });
    for (int x : v) std::cout << x << " ";     // 9 6 5 4 3 2 1 1
    std::cout << "\\n";
    return 0;
}`,
      },
    ],
    related: ['stl-vectors', 'stl-iterators', 'lambdas'],
  },
  {
    id: 'stl-maps',
    title: 'std::map & std::unordered_map',
    category: 'Associative Containers',
    difficulty: 'intermediate',
    summary: 'Key/value containers: map is a sorted tree; unordered_map is a hash table.',
    definition:
      '`std::map` stores key/value pairs ordered by key in a balanced red-black tree — O(log n) lookup, insert, and erase, and iteration is sorted. `std::unordered_map` stores pairs in a hash table — average O(1) operations but unordered iteration. Use map when you need sorted keys or range queries; use unordered_map when you only need fast lookup.',
    syntax: 'std::map<K, V> m;  m[key] = value;  m.at(key);  m.find(key);',
    returns: 'A collection mapping unique keys to values.',
    keyPoints: [
      'operator[] inserts a default value if the key is missing — use at() to throw instead.',
      'map keys must be comparable (operator<); unordered_map keys need std::hash.',
      'Iteration over a map is in sorted key order; over unordered_map it is arbitrary.',
      'insert/emplace avoid overwriting an existing key; operator[] overwrites.',
      'Use m.count(key) == 0 or m.find(key) == m.end() to test presence.',
    ],
    examples: [
      {
        title: 'Count word frequencies',
        description: 'Build a frequency map.',
        code: `#include <iostream>
#include <map>
#include <string>
#include <vector>

int main() {
    std::vector<std::string> words = {"a", "b", "a", "c", "b", "a"};
    std::map<std::string, int> freq;
    for (const auto& w : words) freq[w]++;

    for (const auto& [k, v] : freq)
        std::cout << k << ": " << v << "\\n";   // sorted: a:3 b:2 c:1
    return 0;
}`,
      },
      {
        title: 'unordered_map with at()',
        description: 'Fast hash lookup that throws on a missing key.',
        code: `#include <iostream>
#include <unordered_map>
#include <string>

int main() {
    std::unordered_map<std::string, int> ages = {{"Ada", 36}, {"Linus", 54}};
    std::cout << ages.at("Ada") << "\\n";          // 36
    // ages.at("Bob");  // throws std::out_of_range
    std::cout << "has Linus: " << ages.count("Linus") << "\\n";  // 1
    return 0;
}`,
      },
    ],
    related: ['stl-vectors', 'stl-algorithms'],
  },
  {
    id: 'stl-strings',
    title: 'std::string & String Streams',
    category: 'Strings',
    difficulty: 'intermediate',
    summary: 'The standard string class and stringstream for building and parsing text.',
    definition:
      '`std::string` (in <string>) is a growable, null-terminated sequence of chars that manages its own memory. It supports concatenation (+, +=, append), substring (substr), search (find), and comparison. `std::ostringstream` builds a string from typed values using <<, like cout; `std::istringstream` parses a string into typed values using >>, like cin. Together they convert between strings and other types.',
    syntax: 'std::string s = "text";  s += " more";  s.substr(0, 3);',
    returns: 'A managed string or a stream for conversion.',
    keyPoints: [
      'std::string manages its own memory — it grows as you append.',
      'operator+ concatenates; append() and += are equivalent for appending.',
      'find returns std::string::npos when the substring is not found.',
      'to_string(x) converts a number to a string; stoi/stod parse back.',
      'Use ostringstream to build formatted text; istringstream to parse it.',
    ],
    examples: [
      {
        title: 'Common string operations',
        description: 'Concatenate, search, and slice.',
        code: `#include <iostream>
#include <string>

int main() {
    std::string s = "Hello, World";
    std::cout << "length: " << s.length() << "\\n";
    std::cout << "substr: " << s.substr(0, 5) << "\\n";      // Hello
    auto pos = s.find("World");
    std::cout << "found at: " << pos << "\\n";               // 7
    s += "!";
    std::cout << s << "\\n";                                 // Hello, World!
    return 0;
}`,
      },
      {
        title: 'String stream conversion',
        description: 'Build a string from numbers and parse it back.',
        code: `#include <iostream>
#include <sstream>
#include <string>

int main() {
    // build
    std::ostringstream oss;
    oss << "score=" << 95 << " pi=" << 3.14;
    std::string text = oss.str();
    std::cout << text << "\\n";

    // parse
    std::istringstream iss("42 3.14 hello");
    int i; double d; std::string w;
    iss >> i >> d >> w;
    std::cout << i << " " << d << " " << w << "\\n";
    return 0;
}`,
      },
    ],
    related: ['arrays-strings', 'input-output', 'stl-algorithms'],
  },
  {
    id: 'lambdas',
    title: 'Lambdas & std::function',
    category: 'Functions',
    difficulty: 'intermediate',
    summary: 'Anonymous callable objects created inline; capture variables from the enclosing scope.',
    definition:
      'A lambda expression creates an anonymous function object (a closure) at the point of use. It has a capture clause [], an optional parameter list, and a body. Captures copy or reference variables from the enclosing scope. The closure’s type is unique and unnamed; std::function can hold any callable with a matching signature, at the cost of a small runtime overhead.',
    syntax: '[capture](params) -> returnType { body }',
    parameters: [
      { name: '[]', type: 'capture', description: 'Capture nothing.' },
      { name: '[=]', type: 'capture', description: 'Capture all used variables by value (copy).' },
      { name: '[&]', type: 'capture', description: 'Capture all used variables by reference.' },
      { name: '[x, &y]', type: 'capture', description: 'Capture x by value, y by reference.' },
    ],
    returns: 'An unnamed closure object; assign to auto or std::function.',
    keyPoints: [
      'Lambdas are the idiomatic way to pass comparators and callbacks to algorithms.',
      '[=] copies; [&] references — beware dangling references from [&] in async contexts.',
      'A lambda with no captures can decay to a plain function pointer.',
      'std::function is type-erased — flexible but slower than a templated callable.',
      'Use mutable to allow modifying by-value captures inside the body.',
    ],
    examples: [
      {
        title: 'Lambda as an algorithm comparator',
        description: 'Sort by absolute value.',
        code: `#include <iostream>
#include <vector>
#include <algorithm>

int main() {
    std::vector<int> v = {-5, 3, -1, 4, -2};
    std::sort(v.begin(), v.end(), [](int a, int b) {
        return std::abs(a) < std::abs(b);
    });
    for (int x : v) std::cout << x << " ";   // -1 -2 3 4 -5
    std::cout << "\\n";
    return 0;
}`,
      },
      {
        title: 'Capturing by value and reference',
        description: 'Use enclosing variables inside the lambda.',
        code: `#include <iostream>
#include <vector>
#include <algorithm>

int main() {
    int threshold = 3;
    std::vector<int> v = {1, 2, 3, 4, 5};

    // capture threshold by value
    auto above = [threshold](int x) { return x > threshold; };
    int count = std::count_if(v.begin(), v.end(), above);
    std::cout << "above " << threshold << ": " << count << "\\n";   // 2
    return 0;
}`,
      },
      {
        title: 'std::function to store a callable',
        description: 'Hold any callable in one variable.',
        code: `#include <iostream>
#include <functional>
#include <vector>

int main() {
    std::function<int(int)> f;
    f = [](int x) { return x * 2; };        // lambda
    std::cout << f(21) << "\\n";             // 42

    f = [](int x) { return x + 100; };      // reassign a different lambda
    std::cout << f(1) << "\\n";              // 101
    return 0;
}`,
      },
    ],
    related: ['stl-algorithms', 'functions', 'smart-pointers'],
  },
  {
    id: 'stl-containers-overview',
    title: 'Container Choice Guide',
    category: 'Containers',
    difficulty: 'intermediate',
    summary: 'Which container for which job: vector, list, deque, set, map, and their variants.',
    definition:
      'The STL offers many containers, each optimised for different access patterns. The default choice is std::vector — cache-friendly and fast for most uses. std::list is a doubly-linked list (O(1) splice, no contiguous memory). std::deque supports O(1) push at both ends. std::set/map are ordered trees; unordered_set/map are hash tables. std::array is a fixed-size stack array wrapper.',
    syntax: '#include <vector> / <list> / <deque> / <set> / <map> / <unordered_map>',
    returns: 'A container chosen for the right access pattern.',
    keyPoints: [
      'Default to std::vector unless you have a specific reason not to.',
      'Use list only when you need O(1) insertion/erasure in the middle and never index.',
      'deque for a queue or stack with both-end push/pop.',
      'set/multiset for sorted unique/duplicate keys; unordered_* for pure lookup speed.',
      'array<T,N> for a fixed-size, stack-allocated sequence with no overhead.',
    ],
    examples: [
      {
        title: 'Compare containers',
        description: 'Use each container for its strength.',
        code: `#include <iostream>
#include <vector>
#include <list>
#include <deque>
#include <set>

int main() {
    std::vector<int> v = {1, 2, 3};          // random access, O(1)
    std::list<int> l = {1, 2, 3};            // O(1) splice, no []
    std::deque<int> d = {1, 2, 3};           // O(1) front & back
    std::set<int> s = {3, 1, 2};             // sorted, unique

    std::cout << "vector[1]=" << v[1] << "\\n";          // 2
    std::cout << "deque front=" << d.front() << "\\n";   // 1
    for (int x : s) std::cout << x << " ";               // 1 2 3 (sorted)
    std::cout << "\\n";
    return 0;
}`,
      },
    ],
    related: ['stl-vectors', 'stl-maps', 'stl-iterators'],
  },
];
