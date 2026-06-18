export const questions = [
  // ==================== JAVASCRIPT QUESTIONS ====================
  {
    id: 1,
    category: "JavaScript",
    difficulty: "easy",
    question: "Which keyword is used to declare a block-scoped variable in JavaScript?",
    options: ["var", "let", "const", "set"],
    answer: "let"
  },
  {
    id: 2,
    category: "JavaScript",
    difficulty: "easy",
    question: "What is the correct syntax for writing a single-line comment in JavaScript?",
    options: ["<!-- Comment -->", "/* Comment */", "// Comment", "# Comment"],
    answer: "// Comment"
  },
  {
    id: 3,
    category: "JavaScript",
    difficulty: "easy",
    question: "Which array method is used to add one or more elements to the end of an array?",
    options: ["push()", "pop()", "shift()", "unshift()"],
    answer: "push()"
  },
  {
    id: 4,
    category: "JavaScript",
    difficulty: "easy",
    question: "Which operator is used to assign a value to a variable in JavaScript?",
    options: ["==", "=", "===", "set"],
    answer: "="
  },
  {
    id: 5,
    category: "JavaScript",
    difficulty: "medium",
    question: "What is the output of 'typeof NaN' in JavaScript?",
    options: ["\"number\"", "\"NaN\"", "\"undefined\"", "\"object\""],
    answer: "\"number\""
  },
  {
    id: 6,
    category: "JavaScript",
    difficulty: "medium",
    question: "Which block structure is used to handle runtime exceptions in JavaScript?",
    options: ["if...else", "try...catch", "switch...case", "while...do"],
    answer: "try...catch"
  },
  {
    id: 7,
    category: "JavaScript",
    difficulty: "medium",
    question: "What is a primary purpose of enabling 'strict mode' in a JavaScript file?",
    options: [
      "It makes the code execute faster",
      "It converts JavaScript to statically typed code",
      "It enforces stricter parsing and disables unsafe legacy syntax features",
      "It automatically minifies the output bundle"
    ],
    answer: "It enforces stricter parsing and disables unsafe legacy syntax features"
  },
  {
    id: 8,
    category: "JavaScript",
    difficulty: "medium",
    question: "What is the return type of the array push() method in JavaScript?",
    options: ["The updated array", "undefined", "The new length of the array", "The elements added"],
    answer: "The new length of the array"
  },
  {
    id: 9,
    category: "JavaScript",
    difficulty: "hard",
    question: "What is a closure in JavaScript?",
    options: [
      "A technique to exit a running function early",
      "A function that retains access to its lexical scope even when executed outside that scope",
      "A way to write recursive functions",
      "The process of garbage collecting unused variables"
    ],
    answer: "A function that retains access to its lexical scope even when executed outside that scope"
  },
  {
    id: 10,
    category: "JavaScript",
    difficulty: "hard",
    question: "How does the 'this' keyword behave inside a JavaScript arrow function?",
    options: [
      "It refers to the object that called the function",
      "It is dynamically bound at execution time",
      "It is undefined",
      "It is lexically bound, inheriting 'this' from its outer enclosing scope"
    ],
    answer: "It is lexically bound, inheriting 'this' from its outer enclosing scope"
  },
  {
    id: 11,
    category: "JavaScript",
    difficulty: "hard",
    question: "Which method is used to lock an object, preventing the addition or modification of properties?",
    options: ["Object.seal()", "Object.freeze()", "Object.lock()", "Object.preventExtensions()"],
    answer: "Object.freeze()"
  },
  {
    id: 12,
    category: "JavaScript",
    difficulty: "hard",
    question: "What is a key difference between Object.freeze() and Object.seal()?",
    options: [
      "Object.freeze() makes properties read-only and prevents additions/deletions, whereas Object.seal() allows editing existing properties but prevents additions/deletions.",
      "Object.seal() makes properties read-only, while Object.freeze() allows deletions.",
      "There is no difference.",
      "Object.freeze() only applies to arrays."
    ],
    answer: "Object.freeze() makes properties read-only and prevents additions/deletions, whereas Object.seal() allows editing existing properties but prevents additions/deletions."
  },

  // ==================== HTML QUESTIONS ====================
  {
    id: 13,
    category: "HTML",
    difficulty: "easy",
    question: "What is the correct HTML element for the largest heading?",
    options: ["<h6>", "<heading>", "<head>", "<h1>"],
    answer: "<h1>"
  },
  {
    id: 14,
    category: "HTML",
    difficulty: "easy",
    question: "Which tag is used to define an anchor/hyperlink in HTML?",
    options: ["<link>", "<a>", "<href>", "<nav>"],
    answer: "<a>"
  },
  {
    id: 15,
    category: "HTML",
    difficulty: "easy",
    question: "What does HTML stand for?",
    options: [
      "HyperText Markup Language",
      "HighText Machine Language",
      "HyperTabular Markup Layout",
      "HyperTech Media Links"
    ],
    answer: "HyperText Markup Language"
  },
  {
    id: 16,
    category: "HTML",
    difficulty: "easy",
    question: "Which HTML element represents an image?",
    options: ["<src>", "<img>", "<picture>", "<image>"],
    answer: "<img>"
  },
  {
    id: 17,
    category: "HTML",
    difficulty: "medium",
    question: "Which HTML5 attribute specifies that a form field must be filled out before submission?",
    options: ["validate", "required", "mandatory", "check"],
    answer: "required"
  },
  {
    id: 18,
    category: "HTML",
    difficulty: "medium",
    question: "Which element is used to group inline elements for styling or scripting without semantic meaning?",
    options: ["<div>", "<section>", "<span>", "<p>"],
    answer: "<span>"
  },
  {
    id: 19,
    category: "HTML",
    difficulty: "medium",
    question: "What is the semantic purpose of the HTML5 `<aside>` element?",
    options: [
      "To contain the footer links of a webpage",
      "To declare a navigation side menu only",
      "To represent content that is tangentially related to the content around it",
      "To display image sliders"
    ],
    answer: "To represent content that is tangentially related to the content around it"
  },
  {
    id: 20,
    category: "HTML",
    difficulty: "medium",
    question: "Which HTML5 semantic element represents self-contained content, like a blog post or news card?",
    options: ["<section>", "<div>", "<article>", "<aside>"],
    answer: "<article>"
  },
  {
    id: 21,
    category: "HTML",
    difficulty: "hard",
    question: "Which element represents the root node of an HTML document?",
    options: ["<!DOCTYPE html>", "<html>", "<root>", "<body>"],
    answer: "<html>"
  },
  {
    id: 22,
    category: "HTML",
    difficulty: "hard",
    question: "What is the default value of the 'target' attribute in an anchor tag?",
    options: ["_blank", "_parent", "_top", "_self"],
    answer: "_self"
  },
  {
    id: 23,
    category: "HTML",
    difficulty: "hard",
    question: "Which element represents a container for introductory content or a set of navigational links?",
    options: ["<section>", "<header>", "<nav>", "<intro>"],
    answer: "<header>"
  },
  {
    id: 24,
    category: "HTML",
    difficulty: "hard",
    question: "What does the 'defer' attribute accomplish inside a script element?",
    options: [
      "It defers script execution until the script is manually loaded by user scroll.",
      "It downloads the script asynchronously and executes it immediately, blocking document parsing.",
      "It executes the script after the document has been fully parsed, in the order the scripts appear.",
      "It prevents the script from running entirely."
    ],
    answer: "It executes the script after the document has been fully parsed, in the order the scripts appear."
  },

  // ==================== CSS QUESTIONS ====================
  {
    id: 25,
    category: "CSS",
    difficulty: "easy",
    question: "Which CSS property is used to change the background color of an element?",
    options: ["color", "bg-color", "background-color", "fill"],
    answer: "background-color"
  },
  {
    id: 26,
    category: "CSS",
    difficulty: "easy",
    question: "Which CSS selector targets an element with a specific ID attribute?",
    options: [".", "#", "*", ":"],
    answer: "#"
  },
  {
    id: 27,
    category: "CSS",
    difficulty: "easy",
    question: "How do you select all `<p>` elements in CSS?",
    options: ["p { }", ".p { }", "#p { }", "*p { }"],
    answer: "p { }"
  },
  {
    id: 28,
    category: "CSS",
    difficulty: "easy",
    question: "Which CSS property is used to set the text alignment of an element?",
    options: ["align-text", "text-align", "vertical-align", "text-position"],
    answer: "text-align"
  },
  {
    id: 29,
    category: "CSS",
    difficulty: "medium",
    question: "Which display property value aligns items in a flexible one-dimensional layout?",
    options: ["block", "grid", "inline-block", "flex"],
    answer: "flex"
  },
  {
    id: 30,
    category: "CSS",
    difficulty: "medium",
    question: "What is the default value of the position property in CSS?",
    options: ["relative", "absolute", "static", "fixed"],
    answer: "static"
  },
  {
    id: 31,
    category: "CSS",
    difficulty: "medium",
    question: "Which CSS property controls the spacing inside an element, between content and border?",
    options: ["margin", "padding", "border-spacing", "outline"],
    answer: "padding"
  },
  {
    id: 32,
    category: "CSS",
    difficulty: "medium",
    question: "Which CSS property is used to create space outside elements (external spacing)?",
    options: ["padding", "spacing", "margin", "border-width"],
    answer: "margin"
  },
  {
    id: 33,
    category: "CSS",
    difficulty: "hard",
    question: "What is the correct hierarchy of CSS specificity, from highest to lowest?",
    options: [
      "IDs -> Classes -> Elements -> Inline Styles",
      "Inline Styles -> IDs -> Classes -> Elements",
      "Classes -> IDs -> Inline Styles -> Elements",
      "Inline Styles -> Classes -> IDs -> Elements"
    ],
    answer: "Inline Styles -> IDs -> Classes -> Elements"
  },
  {
    id: 34,
    category: "CSS",
    difficulty: "hard",
    question: "Which transition timing function accelerates at the start and decelerates at the end?",
    options: ["linear", "ease-in", "ease-out", "ease-in-out"],
    answer: "ease-in-out"
  },
  {
    id: 35,
    category: "CSS",
    difficulty: "hard",
    question: "What does the 'box-sizing: border-box' CSS property accomplish?",
    options: [
      "It hides borders inside the box model",
      "It adds double lines to borders",
      "It incorporates padding and borders within the total declared width and height of an element",
      "It places padding outside the borders of the element"
    ],
    answer: "It incorporates padding and borders within the total declared width and height of an element"
  },
  {
    id: 36,
    category: "CSS",
    difficulty: "hard",
    question: "Which flexbox property defines the default alignment for items along the cross axis inside the container?",
    options: ["justify-content", "align-items", "align-content", "flex-wrap"],
    answer: "align-items"
  },

  // ==================== REACT QUESTIONS ====================
  {
    id: 37,
    category: "React",
    difficulty: "easy",
    question: "What is the primary benefit of the virtual DOM in React?",
    options: [
      "It bypasses the browser DOM completely",
      "It speeds up execution by updating only the changed subtrees of the real DOM",
      "It prevents bugs automatically",
      "It enforces static typing at runtime"
    ],
    answer: "It speeds up execution by updating only the changed subtrees of the real DOM"
  },
  {
    id: 38,
    category: "React",
    difficulty: "easy",
    question: "Which built-in React hook is used to manage local state within a functional component?",
    options: ["useLocal", "useState", "useReducer", "useEffect"],
    answer: "useState"
  },
  {
    id: 39,
    category: "React",
    difficulty: "easy",
    question: "How is data passed down from a parent component to a child component in React?",
    options: ["Props", "Context", "Hooks", "Redux"],
    answer: "Props"
  },
  {
    id: 40,
    category: "React",
    difficulty: "easy",
    question: "What does JSX stand for in React development?",
    options: ["JavaScript Extension", "JavaScript XML", "Joint Script XML", "Java Syntax Extension"],
    answer: "JavaScript XML"
  },
  {
    id: 41,
    category: "React",
    difficulty: "medium",
    question: "Which React hook is used to coordinate side effects (e.g. data fetching, event listeners)?",
    options: ["useMemo", "useContext", "useEffect", "useCallback"],
    answer: "useEffect"
  },
  {
    id: 42,
    category: "React",
    difficulty: "medium",
    question: "What is the recommended approach to update a state variable based on a previous state value?",
    options: [
      "Set the state value directly as count = count + 1",
      "Pass a callback function to the state setter (e.g. setVal(prev => prev + 1))",
      "Call forceUpdate()",
      "Create a local copy of the DOM"
    ],
    answer: "Pass a callback function to the state setter (e.g. setVal(prev => prev + 1))"
  },
  {
    id: 43,
    category: "React",
    difficulty: "medium",
    question: "What is the purpose of the 'key' prop when rendering lists of elements in React?",
    options: [
      "To apply CSS styles dynamically",
      "To help React identify which items have changed, been added, or been removed",
      "To validate input types",
      "To access components directly via references"
    ],
    answer: "To help React identify which items have changed, been added, or been removed"
  },
  {
    id: 44,
    category: "React",
    difficulty: "medium",
    question: "Which React hook returns a mutable reference object that persists for the lifetime of the component?",
    options: ["useRef", "useMemo", "useCallback", "useState"],
    answer: "useRef"
  },
  {
    id: 45,
    category: "React",
    difficulty: "hard",
    question: "Which hook should be used to memoize the computed result of an expensive calculation?",
    options: ["useCallback", "useMemo", "useRef", "useReducer"],
    answer: "useMemo"
  },
  {
    id: 46,
    category: "React",
    difficulty: "hard",
    question: "What does the React.forwardRef API enable?",
    options: [
      "It automatically creates references for hooks",
      "It allows passing a ref through a parent component down to one of its children",
      "It references previous state values",
      "It forwards page routes to static HTML"
    ],
    answer: "It allows passing a ref through a parent component down to one of its children"
  },
  {
    id: 47,
    category: "React",
    difficulty: "hard",
    question: "In which lifecycle phase are API side effects typically triggered in class-based React components?",
    options: ["constructor", "componentWillUpdate", "componentDidMount", "render"],
    answer: "componentDidMount"
  },
  {
    id: 48,
    category: "React",
    difficulty: "hard",
    question: "Which React API is used to perform code splitting, loading components dynamically as needed?",
    options: ["React.memo()", "React.lazy()", "React.forwardRef()", "React.Fragment"],
    answer: "React.lazy()"
  },

  // ==================== PROGRAMMING QUESTIONS ====================
  {
    id: 49,
    category: "Programming",
    difficulty: "easy",
    question: "What is a variable in computer programming?",
    options: [
      "A loop that never terminates",
      "A named storage location for storing data values",
      "A mathematical error",
      "A static database record"
    ],
    answer: "A named storage location for storing data values"
  },
  {
    id: 50,
    category: "Programming",
    difficulty: "easy",
    question: "Which of the following is an example of a boolean value?",
    options: ["\"true\"", "true", "1.0", "null"],
    answer: "true"
  },
  {
    id: 51,
    category: "Programming",
    difficulty: "easy",
    question: "What is the primary function of a loop construct in programming?",
    options: [
      "To declare class interfaces",
      "To test software features automatically",
      "To repeatedly execute a block of code while a condition is met",
      "To compile binary files"
    ],
    answer: "To repeatedly execute a block of code while a condition is met"
  },
  {
    id: 52,
    category: "Programming",
    difficulty: "easy",
    question: "Which logical operator represents the AND operation in most languages?",
    options: ["||", "!", "&&", "&"],
    answer: "&&"
  },
  {
    id: 53,
    category: "Programming",
    difficulty: "medium",
    question: "Which data structure operates strictly on a First-In, First-Out (FIFO) access basis?",
    options: ["Stack", "Queue", "Binary Tree", "Graph"],
    answer: "Queue"
  },
  {
    id: 54,
    category: "Programming",
    difficulty: "medium",
    question: "What is recursion in programming?",
    options: [
      "A loop that is nested inside another loop",
      "An object definition containing private methods",
      "A programming pattern where a function calls itself directly or indirectly to solve a subproblem",
      "Translating compiled files back to readable source text"
    ],
    answer: "A programming pattern where a function calls itself directly or indirectly to solve a subproblem"
  },
  {
    id: 55,
    category: "Programming",
    difficulty: "medium",
    question: "Which sorting algorithm carries a worst-case time complexity of O(n^2)?",
    options: ["Merge Sort", "Quick Sort", "Bubble Sort", "Heap Sort"],
    answer: "Bubble Sort"
  },
  {
    id: 56,
    category: "Programming",
    difficulty: "medium",
    question: "Which structure allows developers to verify multiple conditional paths in sequence?",
    options: ["for loop", "if-else if-else", "try-catch", "while loop"],
    answer: "if-else if-else"
  },
  {
    id: 57,
    category: "Programming",
    difficulty: "hard",
    question: "What is the primary role of a compiler in software development?",
    options: [
      "To format file structures dynamically",
      "To translate source code written in a high-level language into machine code or intermediate byte code",
      "To execute JavaScript code in the browser directly",
      "To index database records"
    ],
    answer: "To translate source code written in a high-level language into machine code or intermediate byte code"
  },
  {
    id: 58,
    category: "Programming",
    difficulty: "hard",
    question: "Which creational design pattern restricts a class instantiation to a single unique instance?",
    options: ["Factory Method", "Builder", "Singleton", "Prototype"],
    answer: "Singleton"
  },
  {
    id: 59,
    category: "Programming",
    difficulty: "hard",
    question: "What is the average-case time complexity of looking up an item by key in a Hash Table?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    answer: "O(1)"
  },
  {
    id: 60,
    category: "Programming",
    difficulty: "hard",
    question: "What is the main characteristic of an idempotent API operation?",
    options: [
      "It requires a unique key for each subsequent API request to run.",
      "Making multiple identical requests has the same side-effect and outcome as making a single request.",
      "It deletes all variables inside the execution stack upon finishing.",
      "It runs in parallel threads."
    ],
    answer: "Making multiple identical requests has the same side-effect and outcome as making a single request."
  },

  // ==================== GENERAL KNOWLEDGE QUESTIONS ====================
  {
    id: 61,
    category: "General Knowledge",
    difficulty: "easy",
    question: "Which planet in our solar system is closest to the Sun?",
    options: ["Venus", "Mars", "Earth", "Mercury"],
    answer: "Mercury"
  },
  {
    id: 62,
    category: "General Knowledge",
    difficulty: "easy",
    question: "What is the capital city of France?",
    options: ["Berlin", "London", "Rome", "Paris"],
    answer: "Paris"
  },
  {
    id: 63,
    category: "General Knowledge",
    difficulty: "easy",
    question: "Which chemical element gas is essential for human respiration?",
    options: ["Nitrogen", "Oxygen", "Carbon Dioxide", "Helium"],
    answer: "Oxygen"
  },
  {
    id: 64,
    category: "General Knowledge",
    difficulty: "easy",
    question: "What is the largest living animal species on Earth?",
    options: ["African Elephant", "Blue Whale", "Colossal Squid", "Giraffe"],
    answer: "Blue Whale"
  },
  {
    id: 65,
    category: "General Knowledge",
    difficulty: "medium",
    question: "Which country gifted the Statue of Liberty to the United States?",
    options: ["Great Britain", "France", "Spain", "Germany"],
    answer: "France"
  },
  {
    id: 66,
    category: "General Knowledge",
    difficulty: "medium",
    question: "Who is the world-renowned artist who painted 'The Starry Night'?",
    options: ["Vincent van Gogh", "Pablo Picasso", "Claude Monet", "Leonardo da Vinci"],
    answer: "Vincent van Gogh"
  },
  {
    id: 67,
    category: "General Knowledge",
    difficulty: "medium",
    question: "Which is the smallest continent by land area on Earth?",
    options: ["Europe", "Antarctica", "Australia", "South America"],
    answer: "Australia"
  },
  {
    id: 68,
    category: "General Knowledge",
    difficulty: "medium",
    question: "Which chemical element is represented by the symbol 'Fe'?",
    options: ["Fluorine", "Iron", "Gold", "Lead"],
    answer: "Iron"
  },
  {
    id: 69,
    category: "General Knowledge",
    difficulty: "hard",
    question: "Who is credited with the invention of the World Wide Web (WWW) in 1989?",
    options: ["Bill Gates", "Steve Jobs", "Tim Berners-Lee", "Alan Turing"],
    answer: "Tim Berners-Lee"
  },
  {
    id: 70,
    category: "General Knowledge",
    difficulty: "hard",
    question: "What is the speed of light in a vacuum (approximate value in meters per second)?",
    options: ["300,000 m/s", "150,000,000 m/s", "299,792,458 m/s", "1,080,000,000 m/s"],
    answer: "299,792,458 m/s"
  },
  {
    id: 71,
    category: "General Knowledge",
    difficulty: "hard",
    question: "Which is the largest hot desert on Earth?",
    options: ["Gobi Desert", "Sahara Desert", "Arabian Desert", "Kalahari Desert"],
    answer: "Sahara Desert"
  },
  {
    id: 72,
    category: "General Knowledge",
    difficulty: "hard",
    question: "Which physicist formulated the theory of General Relativity?",
    options: ["Isaac Newton", "Albert Einstein", "Nikola Tesla", "Marie Curie"],
    answer: "Albert Einstein"
  }
];
