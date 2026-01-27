export interface Question {
  id: number;
  text: string;
  options: string[];
  answer: string;
  explanation: string;
}

export interface Exam {
  title: string;
  duration: number;
  questions: Question[];
}

export const examData: Record<string, Exam> = {
  "cpp-oops": {
    title: "C++ OOPS Professional Mock",
    duration: 30,
    questions: [
      {
        id: 1,
        text: "Which keyword is used to define a class in C++?",
        options: ["struct", "class", "object", "define"],
        answer: "class",
        explanation: "In C++, the 'class' keyword is used to encapsulate data and functions into a single unit. By default, its members are private."
      },
      {
        id: 2,
        text: "What is the default access modifier for members of a C++ class?",
        options: ["public", "private", "protected", "friend"],
        answer: "private",
        explanation: "Members of a C++ class are 'private' by default, meaning they cannot be accessed from outside the class. In a 'struct', the default is public."
      },
      {
        id: 3,
        text: "Which of the following is used to initialize an object at the time of creation?",
        options: ["Destructor", "Constructor", "Function", "Pointer"],
        answer: "Constructor",
        explanation: "A constructor is a special member function that is automatically called when an object of the class is created."
      },
      {
        id: 4,
        text: "What is the name of a constructor in C++?",
        options: ["Same as class name", "initialize()", "start()", "create()"],
        answer: "Same as class name",
        explanation: "A constructor must have the exact same name as the class and does not have a return type."
      },
      {
        id: 5,
        text: "Which concept allows a single function to behave differently based on the object calling it?",
        options: ["Inheritance", "Encapsulation", "Polymorphism", "Abstraction"],
        answer: "Polymorphism",
        explanation: "Polymorphism (many forms) allows one interface to be used for a general class of actions, like function overloading or virtual functions."
      },
      {
        id: 6,
        text: "Which operator is used to access members of a class using an object?",
        options: [". (dot)", "-> (arrow)", ":: (scope resolution)", ": (colon)"],
        answer: ". (dot)",
        explanation: "The dot operator (.) is used to access public members of an object directly."
      },
      {
        id: 7,
        text: "What is 'Encapsulation' in C++?",
        options: ["Hiding data", "Wrapping data and functions", "Inheriting properties", "Overloading functions"],
        answer: "Wrapping data and functions",
        explanation: "Encapsulation is the process of binding data and the functions that manipulate them together into a single unit (class)."
      },
      {
        id: 8,
        text: "Which of the following is NOT an OOPS concept?",
        options: ["Inheritance", "Polymorphism", "Compilation", "Abstraction"],
        answer: "Compilation",
        explanation: "Compilation is a process of converting code to machine language, while the others are core pillars of Object Oriented Programming."
      },
      {
        id: 9,
        text: "What is the size of an empty class in C++?",
        options: ["0 byte", "1 byte", "4 bytes", "Depends on compiler"],
        answer: "1 byte",
        explanation: "The C++ standard ensures that every object has a unique memory address, so even an empty class is assigned at least 1 byte."
      },
      {
        id: 10,
        text: "Which function can access private members of a class despite not being a member?",
        options: ["Static function", "Virtual function", "Friend function", "Inline function"],
        answer: "Friend function",
        explanation: "A friend function is granted special access to the private and protected members of a class."
      },
      {
        id: 11,
        text: "Which keyword is used for Inheritance in C++?",
        options: ["extends", "implements", ": (colon)", "inherits"],
        answer: ": (colon)",
        explanation: "C++ uses the colon (:) operator to specify that a class is inheriting from a base class."
      },
      {
        id: 12,
        text: "What is a 'Virtual Function' used for?",
        options: ["Data hiding", "Runtime Polymorphism", "Compile time Polymorphism", "Memory management"],
        answer: "Runtime Polymorphism",
        explanation: "Virtual functions allow the derived class to override a function in the base class, enabling dynamic binding at runtime."
      },
      {
        id: 13,
        text: "A class that contains at least one pure virtual function is called:",
        options: ["Static Class", "Final Class", "Abstract Class", "Friend Class"],
        answer: "Abstract Class",
        explanation: "An abstract class cannot be instantiated and is used as a blueprint for derived classes."
      },
      {
        id: 14,
        text: "Which pointer is implicitly available inside every non-static member function?",
        options: ["self", "that", "this", "pointer"],
        answer: "this",
        explanation: "The 'this' pointer points to the object that invoked the member function."
      },
      {
        id: 15,
        text: "Which of the following can be overloaded in C++?",
        options: ["Functions", "Operators", "Constructors", "All of the above"],
        answer: "All of the above",
        explanation: "C++ allows overloading of functions, most operators, and class constructors."
      },
      {
        id: 16,
        text: "What is 'Abstraction'?",
        options: ["Hiding complexity", "Hiding data", "Code reusability", "Binding data"],
        answer: "Hiding complexity",
        explanation: "Abstraction means showing only the essential features of an object and hiding the background details or implementation."
      },
      {
        id: 17,
        text: "Which type of inheritance is NOT supported in Java but supported in C++?",
        options: ["Single", "Multilevel", "Multiple", "Hierarchical"],
        answer: "Multiple",
        explanation: "C++ allows a class to inherit from more than one base class (Multiple Inheritance), while Java uses Interfaces for this."
      },
      {
        id: 18,
        text: "Which keyword is used to allocate memory dynamically for an object?",
        options: ["alloc", "malloc", "new", "create"],
        answer: "new",
        explanation: "The 'new' operator allocates memory on the heap and calls the constructor."
      },
      {
        id: 19,
        text: "What is a Destructor?",
        options: ["Cleans up memory", "Initializes data", "Copies an object", "Creates an object"],
        answer: "Cleans up memory",
        explanation: "A destructor is called when an object goes out of scope or is deleted to release resources."
      },
      {
        id: 20,
        text: "Which access modifier allows access only within the class and its derived classes?",
        options: ["private", "public", "protected", "global"],
        answer: "protected",
        explanation: "Protected members are accessible within the same class and by classes derived from it."
      },
      {
        id: 21,
        text: "Can a constructor be private?",
        options: ["Yes", "No", "Only for static classes", "Only for friend classes"],
        answer: "Yes",
        explanation: "A private constructor is used in design patterns like the Singleton pattern to prevent direct instantiation."
      },
      {
        id: 22,
        text: "How many destructors can a class have?",
        options: ["Zero", "One", "Multiple", "Unlimited"],
        answer: "One",
        explanation: "A class can have only one destructor, and it cannot take any arguments or have a return type."
      },
      {
        id: 23,
        text: "Which operator cannot be overloaded?",
        options: ["+", "-", "::", "=="],
        answer: "::",
        explanation: "Operators like Scope Resolution (::), Sizeof, and Ternary (?:) cannot be overloaded in C++."
      },
      {
        id: 24,
        text: "What is a Copy Constructor?",
        options: ["Initializes from another object", "Cleans memory", "Copies code", "None"],
        answer: "Initializes from another object",
        explanation: "It is a constructor which creates an object by initializing it with an object of the same class, which has been created previously."
      },
      {
        id: 25,
        text: "Which of the following is static polymorphism?",
        options: ["Virtual functions", "Function Overloading", "Inheritance", "Pointers"],
        answer: "Function Overloading",
        explanation: "Function overloading is resolved at compile time, making it a form of static (early) binding."
      },
      {
        id: 26,
        text: "Which keyword prevents a class from being inherited?",
        options: ["stop", "const", "final", "static"],
        answer: "final",
        explanation: "The 'final' specifier (introduced in C++11) prevents a class from being used as a base class."
      },
      {
        id: 27,
        text: "A constructor that takes no arguments is called:",
        options: ["Parameterized", "Default", "Empty", "Static"],
        answer: "Default",
        explanation: "If no constructor is provided, the compiler automatically provides a default constructor."
      },
      {
        id: 28,
        text: "Which area of memory is used for dynamic allocation?",
        options: ["Stack", "Heap", "Registry", "Cache"],
        answer: "Heap",
        explanation: "The 'new' operator allocates memory from the free store (Heap)."
      },
      {
        id: 29,
        text: "What is an 'Inline' function?",
        options: ["A function that is very long", "A function expanded at call site", "A function with no name", "A function in a different file"],
        answer: "A function expanded at call site",
        explanation: "Inline functions reduce the overhead of a function call by inserting the function's code directly at the point of call."
      },
      {
        id: 30,
        text: "Which OOP principle is violated if data is made public?",
        options: ["Inheritance", "Encapsulation", "Polymorphism", "Abstraction"],
        answer: "Encapsulation",
        explanation: "Encapsulation relies on keeping data private and providing controlled access. Public data exposes the internal state directly."
      }
    ]
  },
  "java-oops": {
    title: "Java OOPS Professional Mock",
    duration: 30,
    questions: [
      {
        id: 1,
        text: "Which keyword is used to inherit a class in Java?",
        options: ["inherits", "extends", "implements", "using"],
        answer: "extends",
        explanation: "In Java, the 'extends' keyword is used to create a subclass from a parent class."
      },
      {
        id: 2,
        text: "What is the root class of all classes in Java?",
        options: ["String", "Main", "Object", "Class"],
        answer: "Object",
        explanation: "The java.lang.Object class is the ultimate parent of every class in Java."
      },
      {
        id: 3,
        text: "Which access modifier makes a member visible only within its own package?",
        options: ["public", "private", "protected", "default (no modifier)"],
        answer: "default (no modifier)",
        explanation: "If no modifier is specified, it is 'package-private', visible only within its own package."
      },
      {
        id: 4,
        text: "Can an Interface have a constructor in Java?",
        options: ["Yes", "No", "Only if it is empty", "Only in Java 17+"],
        answer: "No",
        explanation: "Interfaces cannot be instantiated and thus cannot have constructors."
      },
      {
        id: 5,
        text: "Which keyword is used to call the parent class constructor?",
        options: ["this", "parent", "super", "base"],
        answer: "super",
        explanation: "The 'super' keyword refers to the immediate parent class and can be used to call its constructor or methods."
      }
    ]
  },
  "aptitude": {
    title: "Quantitative Aptitude Mock",
    duration: 30,
    questions: [
      {
        id: 1,
        text: "If a person sells an article for $650 and gains 30%, what was the cost price?",
        options: ["$500", "$450", "$600", "$550"],
        answer: "$500",
        explanation: "Cost Price = (Selling Price * 100) / (100 + Gain%). So, (650 * 100) / 130 = 500."
      },
      {
        id: 2,
        text: "Find the average of first five prime numbers.",
        options: ["5.2", "5.6", "5.0", "6.2"],
        answer: "5.6",
        explanation: "First 5 primes: 2, 3, 5, 7, 11. Sum = 28. Average = 28 / 5 = 5.6."
      },
      {
        id: 3,
        text: "The ratio of two numbers is 3:4 and their sum is 630. Find the smaller number.",
        options: ["270", "360", "210", "180"],
        answer: "270",
        explanation: "3x + 4x = 630 -> 7x = 630 -> x = 90. Smaller number = 3 * 90 = 270."
      },
      {
        id: 4,
        text: "A train moves with a speed of 108 km/hr. Its speed in meters per second is:",
        options: ["10.8 m/s", "30 m/s", "25 m/s", "38.8 m/s"],
        answer: "30 m/s",
        explanation: "To convert km/hr to m/s, multiply by 5/18. So, 108 * (5/18) = 6 * 5 = 30 m/s."
      },
      {
        id: 5,
        text: "Complete the series: 1, 4, 9, 16, 25, ?",
        options: ["30", "35", "36", "40"],
        answer: "36",
        explanation: "The series is squares of natural numbers: 1², 2², 3², 4², 5², 6² (which is 36)."
      }
    ]
  }
};
