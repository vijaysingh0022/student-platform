// Web Development Question Bank (86 Questions)
export const WEB_DEV_QUESTIONS = [
  {
    "subject": "WEB_DEV",
    "topic": "HTML5",
    "subtopic": "Semantics & APIs",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "Which HTML5 element is semantically best suited to wrap self-contained content like blog posts, news stories, or forum posts?",
    "options": [
      "<section>",
      "<article>",
      "<div>",
      "<aside>"
    ],
    "correctAnswerIndex": 1,
    "explanation": "The <article> element is intended to represent a complete, self-contained piece of content that could be distributed independently.",
    "tags": [
      "WEB_DEV",
      "HTML5",
      "Technical Assessment",
      "CSE"
    ],
    "examRelevance": "Frontend Certification, University Web Tech",
    "placementRelevance": "Frontend Engineer, Full Stack Roles"
  },
  {
    "subject": "WEB_DEV",
    "topic": "HTML5",
    "subtopic": "Semantics & APIs",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What does the 'defer' attribute in a <script> tag do?",
    "options": [
      "Executes the script immediately and pauses HTML parsing",
      "Downloads the script asynchronously and executes it only after HTML parsing is complete",
      "Downloads the script synchronously during DOM construction",
      "Executes the script in a Web Worker thread"
    ],
    "correctAnswerIndex": 1,
    "explanation": "'defer' downloads the script in parallel with HTML parsing, but delays execution until the document has been fully parsed, preserving script order.",
    "tags": [
      "WEB_DEV",
      "HTML5",
      "Technical Assessment",
      "CSE"
    ],
    "examRelevance": "Frontend Certification, University Web Tech",
    "placementRelevance": "Frontend Engineer, Full Stack Roles"
  },
  {
    "subject": "WEB_DEV",
    "topic": "HTML5",
    "subtopic": "Semantics & APIs",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "Which HTML5 attribute allows form input validation using a regular expression?",
    "options": [
      "validate",
      "pattern",
      "regex",
      "match"
    ],
    "correctAnswerIndex": 1,
    "explanation": "The 'pattern' attribute specifies a regular expression that the <input> element's value is checked against on form submit.",
    "tags": [
      "WEB_DEV",
      "HTML5",
      "Technical Assessment",
      "CSE"
    ],
    "examRelevance": "Frontend Certification, University Web Tech",
    "placementRelevance": "Frontend Engineer, Full Stack Roles"
  },
  {
    "subject": "WEB_DEV",
    "topic": "HTML5",
    "subtopic": "Semantics & APIs",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is the primary accessibility purpose of the ARIA 'aria-live' attribute?",
    "options": [
      "To animate live canvas elements",
      "To notify screen readers of dynamic content updates without requiring page reload",
      "To trigger live streaming audio",
      "To validate live user keystrokes"
    ],
    "correctAnswerIndex": 1,
    "explanation": "aria-live notifies assistive technologies of dynamic content changes (polite, assertive) without interrupting the user.",
    "tags": [
      "WEB_DEV",
      "HTML5",
      "Technical Assessment",
      "CSE"
    ],
    "examRelevance": "Frontend Certification, University Web Tech",
    "placementRelevance": "Frontend Engineer, Full Stack Roles"
  },
  {
    "subject": "WEB_DEV",
    "topic": "HTML5",
    "subtopic": "Semantics & APIs",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "In HTML5, which tag is used to specify multiple media resources for <picture>, <audio>, or <video>?",
    "options": [
      "<source>",
      "<media>",
      "<track>",
      "<param>"
    ],
    "correctAnswerIndex": 0,
    "explanation": "<source> allows alternative video/audio/image resources based on media queries or formats (e.g. WebP, AVIF).",
    "tags": [
      "WEB_DEV",
      "HTML5",
      "Technical Assessment",
      "CSE"
    ],
    "examRelevance": "Frontend Certification, University Web Tech",
    "placementRelevance": "Frontend Engineer, Full Stack Roles"
  },
  {
    "subject": "WEB_DEV",
    "topic": "HTML5",
    "subtopic": "Semantics & APIs",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "Which attribute on an <iframe> prevents malicious scripts from executing inside the iframe by running it in a restricted sandbox?",
    "options": [
      "security='restricted'",
      "sandbox",
      "csp='strict'",
      "isolated"
    ],
    "correctAnswerIndex": 1,
    "explanation": "The 'sandbox' attribute applies an extra set of restrictions to the iframe content, preventing form submission, script execution, and top-level navigation unless explicitly permitted.",
    "tags": [
      "WEB_DEV",
      "HTML5",
      "Technical Assessment",
      "CSE"
    ],
    "examRelevance": "Frontend Certification, University Web Tech",
    "placementRelevance": "Frontend Engineer, Full Stack Roles"
  },
  {
    "subject": "WEB_DEV",
    "topic": "HTML5",
    "subtopic": "Semantics & APIs",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What does the 'contenteditable' attribute do when set to 'true' on an HTML element?",
    "options": [
      "Makes the element editable by the user directly in the browser",
      "Allows CSS to modify the text content",
      "Enables server-side templating",
      "Makes the element focusable only for screen readers"
    ],
    "correctAnswerIndex": 0,
    "explanation": "contenteditable='true' turns any standard HTML element into an inline editable rich text area.",
    "tags": [
      "WEB_DEV",
      "HTML5",
      "Technical Assessment",
      "CSE"
    ],
    "examRelevance": "Frontend Certification, University Web Tech",
    "placementRelevance": "Frontend Engineer, Full Stack Roles"
  },
  {
    "subject": "WEB_DEV",
    "topic": "HTML5",
    "subtopic": "Semantics & APIs",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "Which HTML5 input type provides built-in browser UI and mobile virtual keyboard optimizations for URLs?",
    "options": [
      "type='link'",
      "type='web'",
      "type='url'",
      "type='uri'"
    ],
    "correctAnswerIndex": 2,
    "explanation": "type='url' prompts mobile devices to display URL-friendly keyboards (.com, /, etc.) and performs automatic URL format validation.",
    "tags": [
      "WEB_DEV",
      "HTML5",
      "Technical Assessment",
      "CSE"
    ],
    "examRelevance": "Frontend Certification, University Web Tech",
    "placementRelevance": "Frontend Engineer, Full Stack Roles"
  },
  {
    "subject": "WEB_DEV",
    "topic": "CSS3",
    "subtopic": "Layouts & Box Model",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What is the CSS specificity weight of a single ID selector compared to an attribute selector?",
    "options": [
      "ID has higher specificity than an attribute selector (0-1-0-0 vs 0-0-1-0)",
      "Both have the same specificity weight (0-0-1-0)",
      "Attribute selector has higher specificity",
      "Specificity depends on the order of declaration in CSS"
    ],
    "correctAnswerIndex": 0,
    "explanation": "An ID selector has specificity (0-1-0-0) which overrides class, attribute, and pseudo-class selectors (0-0-1-0).",
    "tags": [
      "WEB_DEV",
      "CSS3",
      "Technical Assessment",
      "CSE"
    ],
    "examRelevance": "Web Tech, UI/UX Engineering",
    "placementRelevance": "Frontend Developer, UI Engineer"
  },
  {
    "subject": "WEB_DEV",
    "topic": "CSS3",
    "subtopic": "Layouts & Box Model",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "In CSS Flexbox, what does 'justify-content: space-between' do?",
    "options": [
      "Spaces items evenly with equal space around each item including edges",
      "Distributes items evenly such that the first item is flush with the start and the last item is flush with the end",
      "Centers all items with equal margin",
      "Aligns items along the cross axis"
    ],
    "correctAnswerIndex": 1,
    "explanation": "space-between places the first item at the main-start, the last at the main-end, and distributes remaining space equally between items.",
    "tags": [
      "WEB_DEV",
      "CSS3",
      "Technical Assessment",
      "CSE"
    ],
    "examRelevance": "Web Tech, UI/UX Engineering",
    "placementRelevance": "Frontend Developer, UI Engineer"
  },
  {
    "subject": "WEB_DEV",
    "topic": "CSS3",
    "subtopic": "Layouts & Box Model",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "In CSS Grid, what is the meaning of the unit '1fr'?",
    "options": [
      "1 fraction of the viewport height",
      "1 free pixel unit calculated after borders",
      "1 fraction of the available free space in the grid container",
      "1 fixed rem unit multiplied by root font-size"
    ],
    "correctAnswerIndex": 2,
    "explanation": "The fr unit represents a fraction of the leftover free space in the grid container after fixed dimensions are allocated.",
    "tags": [
      "WEB_DEV",
      "CSS3",
      "Technical Assessment",
      "CSE"
    ],
    "examRelevance": "Web Tech, UI/UX Engineering",
    "placementRelevance": "Frontend Developer, UI Engineer"
  },
  {
    "subject": "WEB_DEV",
    "topic": "CSS3",
    "subtopic": "Layouts & Box Model",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What does the CSS property 'box-sizing: border-box' change about the standard box model?",
    "options": [
      "Includes padding and border in the element's total specified width and height",
      "Excludes margin and padding from layout calculations",
      "Renders shadows inside the border boundary",
      "Forces border-collapse on standard div elements"
    ],
    "correctAnswerIndex": 0,
    "explanation": "border-box ensures that padding and borders are factored into the element's width/height, preventing layout overflow issues.",
    "tags": [
      "WEB_DEV",
      "CSS3",
      "Technical Assessment",
      "CSE"
    ],
    "examRelevance": "Web Tech, UI/UX Engineering",
    "placementRelevance": "Frontend Developer, UI Engineer"
  },
  {
    "subject": "WEB_DEV",
    "topic": "CSS3",
    "subtopic": "Layouts & Box Model",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What is the difference between 'opacity: 0', 'visibility: hidden', and 'display: none'?",
    "options": [
      "display: none removes the element from document flow, visibility: hidden keeps layout space, opacity: 0 keeps space and can still capture pointer events",
      "visibility: hidden removes element from document flow",
      "opacity: 0 removes DOM node completely",
      "They are identical in rendering and accessibility"
    ],
    "correctAnswerIndex": 0,
    "explanation": "display: none un-renders from flow; visibility: hidden maintains layout box but is invisible and unclickable; opacity: 0 remains in flow, occupies space, and receives pointer events unless pointer-events: none is set.",
    "tags": [
      "WEB_DEV",
      "CSS3",
      "Technical Assessment",
      "CSE"
    ],
    "examRelevance": "Web Tech, UI/UX Engineering",
    "placementRelevance": "Frontend Developer, UI Engineer"
  },
  {
    "subject": "WEB_DEV",
    "topic": "CSS3",
    "subtopic": "Layouts & Box Model",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "Which CSS property enables hardware-accelerated GPU composition without altering element layout?",
    "options": [
      "transform: translateZ(0) / will-change: transform",
      "float: left",
      "position: static",
      "overflow: visible"
    ],
    "correctAnswerIndex": 0,
    "explanation": "3D transforms or will-change tell the browser to promote the element to its own compositor layer for GPU-accelerated rendering.",
    "tags": [
      "WEB_DEV",
      "CSS3",
      "Technical Assessment",
      "CSE"
    ],
    "examRelevance": "Web Tech, UI/UX Engineering",
    "placementRelevance": "Frontend Developer, UI Engineer"
  },
  {
    "subject": "WEB_DEV",
    "topic": "CSS3",
    "subtopic": "Layouts & Box Model",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What does the CSS pseudo-class ':has()' represent?",
    "options": [
      "A parent selector that selects an element if any of the relative selectors match",
      "A pseudo-class selecting elements with matching text attributes",
      "A selector for elements with child iframes",
      "A deprecated CSS2 pseudo-class"
    ],
    "correctAnswerIndex": 0,
    "explanation": "':has()' acts as a parent/relational selector, matching an element if the selector passed into :has() matches any of its descendants or following siblings.",
    "tags": [
      "WEB_DEV",
      "CSS3",
      "Technical Assessment",
      "CSE"
    ],
    "examRelevance": "Web Tech, UI/UX Engineering",
    "placementRelevance": "Frontend Developer, UI Engineer"
  },
  {
    "subject": "WEB_DEV",
    "topic": "CSS3",
    "subtopic": "Layouts & Box Model",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "In CSS variables (Custom Properties), how do you specify a fallback value when calling var()?",
    "options": [
      "var(--my-color || #fff)",
      "var(--my-color, #fff)",
      "var(--my-color default #fff)",
      "var(--my-color ? #fff)"
    ],
    "correctAnswerIndex": 1,
    "explanation": "var() takes an optional second argument as fallback: var(--primary-color, #3b82f6).",
    "tags": [
      "WEB_DEV",
      "CSS3",
      "Technical Assessment",
      "CSE"
    ],
    "examRelevance": "Web Tech, UI/UX Engineering",
    "placementRelevance": "Frontend Developer, UI Engineer"
  },
  {
    "subject": "WEB_DEV",
    "topic": "JavaScript",
    "subtopic": "Core & ES6+",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is the output of 'typeof NaN' in JavaScript?",
    "options": [
      "'number'",
      "'NaN'",
      "'undefined'",
      "'object'"
    ],
    "correctAnswerIndex": 0,
    "explanation": "In JavaScript, NaN (Not-a-Number) is a special numeric value conforming to IEEE-754 floating point standard; its typeof is 'number'.",
    "tags": [
      "WEB_DEV",
      "JavaScript",
      "Technical Assessment",
      "CSE"
    ],
    "examRelevance": "JS Certifications, CS Technical rounds",
    "placementRelevance": "Fullstack SDE, Frontend Engineer"
  },
  {
    "subject": "WEB_DEV",
    "topic": "JavaScript",
    "subtopic": "Core & ES6+",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is the fundamental difference between '==' and '===' in JavaScript?",
    "options": [
      "'==' performs type coercion before comparison, whereas '===' strictly checks value and type without coercion",
      "'===' coerces strings to numbers",
      "'==' only compares references",
      "There is no difference in ES6+"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Loose equality '==' attempts type conversion (coercion) before comparing, while strict equality '===' returns false if types differ.",
    "tags": [
      "WEB_DEV",
      "JavaScript",
      "Technical Assessment",
      "CSE"
    ],
    "examRelevance": "JS Certifications, CS Technical rounds",
    "placementRelevance": "Fullstack SDE, Frontend Engineer"
  },
  {
    "subject": "WEB_DEV",
    "topic": "JavaScript",
    "subtopic": "Core & ES6+",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is a JavaScript closure?",
    "options": [
      "A function bundled together with references to its surrounding lexical environment",
      "A function that immediately terminates execution",
      "A method to seal an object from being modified",
      "A callback passed into setTimeout"
    ],
    "correctAnswerIndex": 0,
    "explanation": "A closure is the combination of a function bundled together with references to its surrounding state (lexical environment).",
    "tags": [
      "WEB_DEV",
      "JavaScript",
      "Technical Assessment",
      "CSE"
    ],
    "examRelevance": "JS Certifications, CS Technical rounds",
    "placementRelevance": "Fullstack SDE, Frontend Engineer"
  },
  {
    "subject": "WEB_DEV",
    "topic": "JavaScript",
    "subtopic": "Core & ES6+",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is Event Delegation in the DOM?",
    "options": [
      "Attaching an event listener to a common ancestor to manage events for multiple child elements using event bubbling",
      "Delegating event processing to Web Workers",
      "Using preventDefault() to stop propagation",
      "Passing events to third-party microservices"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Event delegation leverages event bubbling by placing a single listener on a parent element to handle events triggered on any current or future child elements.",
    "tags": [
      "WEB_DEV",
      "JavaScript",
      "Technical Assessment",
      "CSE"
    ],
    "examRelevance": "JS Certifications, CS Technical rounds",
    "placementRelevance": "Fullstack SDE, Frontend Engineer"
  },
  {
    "subject": "WEB_DEV",
    "topic": "JavaScript",
    "subtopic": "Core & ES6+",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What will 'console.log(0.1 + 0.2 === 0.3)' print in JavaScript?",
    "options": [
      "false",
      "true",
      "TypeError",
      "undefined"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Due to binary floating-point rounding errors in IEEE-754, 0.1 + 0.2 equals 0.30000000000000004, so 0.1 + 0.2 === 0.3 evaluates to false.",
    "tags": [
      "WEB_DEV",
      "JavaScript",
      "Technical Assessment",
      "CSE"
    ],
    "examRelevance": "JS Certifications, CS Technical rounds",
    "placementRelevance": "Fullstack SDE, Frontend Engineer"
  },
  {
    "subject": "WEB_DEV",
    "topic": "JavaScript",
    "subtopic": "Core & ES6+",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is the purpose of Promise.allSettled() compared to Promise.all()?",
    "options": [
      "Promise.allSettled() waits for all promises to settle regardless of rejection, while Promise.all() rejects immediately on first rejection",
      "Promise.allSettled() rejects if any promise settles",
      "Promise.allSettled() executes promises sequentially",
      "Promise.allSettled() only returns fulfilled promises"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Promise.allSettled() resolves once all input promises either resolve or reject, returning an array of outcome objects ({status, value/reason}).",
    "tags": [
      "WEB_DEV",
      "JavaScript",
      "Technical Assessment",
      "CSE"
    ],
    "examRelevance": "JS Certifications, CS Technical rounds",
    "placementRelevance": "Fullstack SDE, Frontend Engineer"
  },
  {
    "subject": "WEB_DEV",
    "topic": "JavaScript",
    "subtopic": "Core & ES6+",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What happens when 'use strict' is enabled in JavaScript?",
    "options": [
      "Prevents silent bugs by throwing errors on undeclared variables, restricts duplicate parameter names, and disables 'with'",
      "Transpiles ES6 to ES5 automatically",
      "Restricts asynchronous execution",
      "Allocates strict memory sizes for arrays"
    ],
    "correctAnswerIndex": 0,
    "explanation": "'use strict' enforces strict parsing and error handling at runtime, preventing accidental globals and unsafe actions.",
    "tags": [
      "WEB_DEV",
      "JavaScript",
      "Technical Assessment",
      "CSE"
    ],
    "examRelevance": "JS Certifications, CS Technical rounds",
    "placementRelevance": "Fullstack SDE, Frontend Engineer"
  },
  {
    "subject": "WEB_DEV",
    "topic": "JavaScript",
    "subtopic": "Core & ES6+",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "Which method converts a JSON string into a JavaScript object safely, and what does it throw on invalid JSON?",
    "options": [
      "JSON.parse(), throws SyntaxError",
      "JSON.stringify(), throws TypeError",
      "JSON.toObject(), throws ParseException",
      "JSON.decode(), throws Error"
    ],
    "correctAnswerIndex": 0,
    "explanation": "JSON.parse() deserializes valid JSON strings into JavaScript objects, throwing a SyntaxError if the string is malformed.",
    "tags": [
      "WEB_DEV",
      "JavaScript",
      "Technical Assessment",
      "CSE"
    ],
    "examRelevance": "JS Certifications, CS Technical rounds",
    "placementRelevance": "Fullstack SDE, Frontend Engineer"
  },
  {
    "subject": "WEB_DEV",
    "topic": "React",
    "subtopic": "State & Lifecycle",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is the primary role of the Virtual DOM in React?",
    "options": [
      "To minimize expensive direct DOM manipulations through reconciliation and batched diffing",
      "To replace browser rendering engines with WebAssembly",
      "To provide server-side rendering for mobile apps",
      "To store application state in IndexedDB"
    ],
    "correctAnswerIndex": 0,
    "explanation": "The Virtual DOM is an in-memory lightweight representation of the real DOM. React diffs changes and updates only modified real DOM nodes efficiently.",
    "tags": [
      "WEB_DEV",
      "React",
      "Technical Assessment",
      "CSE"
    ],
    "examRelevance": "Frontend Frameworks, Industry Assessments",
    "placementRelevance": "React Developer, Frontend Engineer"
  },
  {
    "subject": "WEB_DEV",
    "topic": "React",
    "subtopic": "State & Lifecycle",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "Why must React state never be mutated directly (e.g. state.count = 5)?",
    "options": [
      "Direct mutation does not trigger re-rendering and breaks shallow comparison in React's reconciliation cycle",
      "It causes syntax errors at compile time",
      "JavaScript objects are immutable in strict mode",
      "It immediately deletes all child components"
    ],
    "correctAnswerIndex": 0,
    "explanation": "React relies on referential identity checks and immutability to determine when components need to re-render. Mutating state directly bypasses scheduled updates.",
    "tags": [
      "WEB_DEV",
      "React",
      "Technical Assessment",
      "CSE"
    ],
    "examRelevance": "Frontend Frameworks, Industry Assessments",
    "placementRelevance": "React Developer, Frontend Engineer"
  },
  {
    "subject": "WEB_DEV",
    "topic": "React",
    "subtopic": "State & Lifecycle",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is the purpose of the 'key' prop when rendering dynamic lists in React?",
    "options": [
      "It provides a stable identity to list items so React can identify which items changed, were added, or were removed during reconciliation",
      "It specifies the CSS z-index of each list item",
      "It binds click events automatically",
      "It is required for SEO indexing"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Keys help React identify which items have changed, been added, or been removed, ensuring efficient DOM node reuse during list reconciliation.",
    "tags": [
      "WEB_DEV",
      "React",
      "Technical Assessment",
      "CSE"
    ],
    "examRelevance": "Frontend Frameworks, Industry Assessments",
    "placementRelevance": "React Developer, Frontend Engineer"
  },
  {
    "subject": "WEB_DEV",
    "topic": "React",
    "subtopic": "State & Lifecycle",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "In React's useEffect hook, what does returning a function from the effect callback achieve?",
    "options": [
      "Defines a cleanup function that runs before the component unmounts or before the effect re-runs",
      "Returns the updated state value",
      "Cancels all previous network requests globally",
      "Triggers an immediate forceUpdate"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Returning a function from useEffect sets up a cleanup handler that cleans up subscriptions, timers, or event listeners when dependencies change or on unmount.",
    "tags": [
      "WEB_DEV",
      "React",
      "Technical Assessment",
      "CSE"
    ],
    "examRelevance": "Frontend Frameworks, Industry Assessments",
    "placementRelevance": "React Developer, Frontend Engineer"
  },
  {
    "subject": "WEB_DEV",
    "topic": "React",
    "subtopic": "State & Lifecycle",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is the difference between useMemo and useCallback?",
    "options": [
      "useMemo caches the result of a function calculation; useCallback caches the function definition itself",
      "useMemo is for state; useCallback is for effects",
      "useCallback caches values; useMemo caches JSX elements only",
      "They are identical aliases"
    ],
    "correctAnswerIndex": 0,
    "explanation": "useMemo returns a memoized value based on dependency array; useCallback returns a memoized callback function instance.",
    "tags": [
      "WEB_DEV",
      "React",
      "Technical Assessment",
      "CSE"
    ],
    "examRelevance": "Frontend Frameworks, Industry Assessments",
    "placementRelevance": "React Developer, Frontend Engineer"
  },
  {
    "subject": "WEB_DEV",
    "topic": "React",
    "subtopic": "State & Lifecycle",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What problem does React Context API primarily solve?",
    "options": [
      "Prop drilling through multiple levels of the component hierarchy",
      "Managing relational database connections",
      "Speeding up network requests via HTTP/2",
      "Replacing Redux entirely for high-frequency gaming updates"
    ],
    "correctAnswerIndex": 0,
    "explanation": "React Context provides a way to pass data through the component tree without having to pass props down manually at every level (prop drilling).",
    "tags": [
      "WEB_DEV",
      "React",
      "Technical Assessment",
      "CSE"
    ],
    "examRelevance": "Frontend Frameworks, Industry Assessments",
    "placementRelevance": "React Developer, Frontend Engineer"
  },
  {
    "subject": "WEB_DEV",
    "topic": "React",
    "subtopic": "State & Lifecycle",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is a Controlled Component in React?",
    "options": [
      "A component whose form data is handled by React component state rather than DOM state",
      "A component that cannot be re-rendered",
      "A component wrapped in ErrorBoundary",
      "A component controlled by backend web sockets"
    ],
    "correctAnswerIndex": 0,
    "explanation": "In a controlled component, form inputs receive their current value from state and update it via onChange callbacks, making React state the single source of truth.",
    "tags": [
      "WEB_DEV",
      "React",
      "Technical Assessment",
      "CSE"
    ],
    "examRelevance": "Frontend Frameworks, Industry Assessments",
    "placementRelevance": "React Developer, Frontend Engineer"
  },
  {
    "subject": "WEB_DEV",
    "topic": "React",
    "subtopic": "State & Lifecycle",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What does React.memo() do for functional components?",
    "options": [
      "Performs shallow prop comparison to skip rendering if props have not changed",
      "Memoizes all local state inside the component permanently",
      "Prevents all child components from ever re-rendering",
      "Compiles the component into WebAssembly"
    ],
    "correctAnswerIndex": 0,
    "explanation": "React.memo is a higher-order component that memoizes the rendered output of a functional component, skipping re-renders when incoming props remain shallowly equal.",
    "tags": [
      "WEB_DEV",
      "React",
      "Technical Assessment",
      "CSE"
    ],
    "examRelevance": "Frontend Frameworks, Industry Assessments",
    "placementRelevance": "React Developer, Frontend Engineer"
  },
  {
    "subject": "WEB_DEV",
    "topic": "Node.js & APIs",
    "subtopic": "Runtime & REST",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "How does Node.js achieve high concurrency despite running on a single JavaScript execution thread?",
    "options": [
      "Through the libuv Event Loop and non-blocking I/O operations delegated to OS kernel threads or worker pool",
      "By spawning a new OS thread for every HTTP request",
      "By executing multiple JavaScript threads simultaneously on multiple CPU cores",
      "By disabling garbage collection"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Node.js utilizes a single-threaded event loop combined with libuv's thread pool and OS kernel async polling (epoll/kqueue) for non-blocking I/O.",
    "tags": [
      "WEB_DEV",
      "Node.js & APIs",
      "Technical Assessment",
      "CSE"
    ],
    "examRelevance": "Backend Web Dev, Cloud Certifications",
    "placementRelevance": "Node.js Backend Engineer, SDE-1"
  },
  {
    "subject": "WEB_DEV",
    "topic": "Node.js & APIs",
    "subtopic": "Runtime & REST",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is the correct HTTP status code for a POST request that successfully creates a new resource?",
    "options": [
      "200 OK",
      "201 Created",
      "204 No Content",
      "302 Found"
    ],
    "correctAnswerIndex": 1,
    "explanation": "HTTP 201 Created indicates that the request has succeeded and led to the creation of a new resource, typically including a Location header.",
    "tags": [
      "WEB_DEV",
      "Node.js & APIs",
      "Technical Assessment",
      "CSE"
    ],
    "examRelevance": "Backend Web Dev, Cloud Certifications",
    "placementRelevance": "Node.js Backend Engineer, SDE-1"
  },
  {
    "subject": "WEB_DEV",
    "topic": "Node.js & APIs",
    "subtopic": "Runtime & REST",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is the difference between PUT and PATCH HTTP methods in a RESTful API?",
    "options": [
      "PUT replaces the target resource entirely, while PATCH applies partial modifications to the resource",
      "PUT is non-idempotent; PATCH is idempotent",
      "PATCH creates resources; PUT only reads them",
      "There is no difference in REST specifications"
    ],
    "correctAnswerIndex": 0,
    "explanation": "PUT is idempotent and replaces the entire resource representation; PATCH applies partial modifications to specific fields of the resource.",
    "tags": [
      "WEB_DEV",
      "Node.js & APIs",
      "Technical Assessment",
      "CSE"
    ],
    "examRelevance": "Backend Web Dev, Cloud Certifications",
    "placementRelevance": "Node.js Backend Engineer, SDE-1"
  },
  {
    "subject": "WEB_DEV",
    "topic": "Node.js & APIs",
    "subtopic": "Runtime & REST",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "In Express.js, what does calling 'next()' inside a middleware function do?",
    "options": [
      "Passes control to the next matching middleware function or route handler in the pipeline",
      "Restarts the HTTP server",
      "Immediately returns a 200 JSON response",
      "Aborts the current database query"
    ],
    "correctAnswerIndex": 0,
    "explanation": "next() passes execution to the next middleware function in the request-response cycle; without it, the request is left hanging.",
    "tags": [
      "WEB_DEV",
      "Node.js & APIs",
      "Technical Assessment",
      "CSE"
    ],
    "examRelevance": "Backend Web Dev, Cloud Certifications",
    "placementRelevance": "Node.js Backend Engineer, SDE-1"
  },
  {
    "subject": "WEB_DEV",
    "topic": "Node.js & APIs",
    "subtopic": "Runtime & REST",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is the purpose of the 'process.nextTick()' queue in Node.js event loop?",
    "options": [
      "It schedules a callback to be invoked immediately after current operation completes, before the event loop continues to next phase",
      "It delays execution until the next timer phase",
      "It runs code in a separate child process",
      "It triggers next tick of garbage collection"
    ],
    "correctAnswerIndex": 0,
    "explanation": "process.nextTick() callbacks are processed immediately after the current operation finishes, before the event loop advances to timers or I/O phases.",
    "tags": [
      "WEB_DEV",
      "Node.js & APIs",
      "Technical Assessment",
      "CSE"
    ],
    "examRelevance": "Backend Web Dev, Cloud Certifications",
    "placementRelevance": "Node.js Backend Engineer, SDE-1"
  },
  {
    "subject": "WEB_DEV",
    "topic": "Node.js & APIs",
    "subtopic": "Runtime & REST",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "Which HTTP header is used by clients to authenticate with a Bearer Token in REST APIs?",
    "options": [
      "Authorization: Bearer <token>",
      "Authentication: Token <token>",
      "X-API-Bearer: <token>",
      "Proxy-Authenticate: <token>"
    ],
    "correctAnswerIndex": 0,
    "explanation": "The standard Authorization header with the 'Bearer' authentication scheme: Authorization: Bearer <token>.",
    "tags": [
      "WEB_DEV",
      "Node.js & APIs",
      "Technical Assessment",
      "CSE"
    ],
    "examRelevance": "Backend Web Dev, Cloud Certifications",
    "placementRelevance": "Node.js Backend Engineer, SDE-1"
  },
  {
    "subject": "WEB_DEV",
    "topic": "Node.js & APIs",
    "subtopic": "Runtime & REST",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What does the 'cluster' module in Node.js allow developers to do?",
    "options": [
      "Fork multiple worker processes sharing server ports to utilize multi-core CPUs",
      "Group database collections into clusters",
      "Cluster static assets across multiple CDNs",
      "Merge multiple client browser tabs"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Node.js cluster module allows easy creation of child processes (workers) that all share server ports, effectively scaling across multi-core processors.",
    "tags": [
      "WEB_DEV",
      "Node.js & APIs",
      "Technical Assessment",
      "CSE"
    ],
    "examRelevance": "Backend Web Dev, Cloud Certifications",
    "placementRelevance": "Node.js Backend Engineer, SDE-1"
  },
  {
    "subject": "WEB_DEV",
    "topic": "Node.js & APIs",
    "subtopic": "Runtime & REST",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is the main characteristic of an Idempotent HTTP method?",
    "options": [
      "Making the same request multiple times produces the identical side-effect on the server as making it once",
      "The request executes in constant O(1) time",
      "The request cannot be cached by proxies",
      "The request payload cannot exceed 1MB"
    ],
    "correctAnswerIndex": 0,
    "explanation": "An HTTP method is idempotent if the intended effect on the server of multiple identical requests is the same as for a single request (e.g. GET, PUT, DELETE).",
    "tags": [
      "WEB_DEV",
      "Node.js & APIs",
      "Technical Assessment",
      "CSE"
    ],
    "examRelevance": "Backend Web Dev, Cloud Certifications",
    "placementRelevance": "Node.js Backend Engineer, SDE-1"
  },
  {
    "subject": "WEB_DEV",
    "topic": "Web Security & Performance",
    "subtopic": "Security & Core Web Vitals",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What security vulnerability does a Cross-Site Scripting (XSS) attack exploit?",
    "options": [
      "Injecting malicious client-side scripts into web pages viewed by other users",
      "Sending unauthorized commands from a user that the web application trusts",
      "Injecting raw SQL into database query strings",
      "Overwhelming a server with UDP packet floods"
    ],
    "correctAnswerIndex": 0,
    "explanation": "XSS enables attackers to inject client-side scripts (JavaScript) into web pages viewed by other users, stealing session cookies or altering page DOM.",
    "tags": [
      "WEB_DEV",
      "Web Security & Performance",
      "Technical Assessment",
      "CSE"
    ],
    "examRelevance": "Web Security Audits, Modern Web Dev",
    "placementRelevance": "Security Engineer, Frontend Lead"
  },
  {
    "subject": "WEB_DEV",
    "topic": "Web Security & Performance",
    "subtopic": "Security & Core Web Vitals",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "How does the 'HttpOnly' flag on a cookie enhance application security?",
    "options": [
      "Prevents client-side scripts (document.cookie) from accessing the cookie, mitigating session hijacking via XSS",
      "Restricts cookie transmission to HTTPS only",
      "Enforces strict Cross-Origin Resource Sharing",
      "Encrypts cookie content on the user's hard drive"
    ],
    "correctAnswerIndex": 0,
    "explanation": "HttpOnly prohibits client JavaScript from reading or modifying the cookie, neutralizing cookie-theft attempts via XSS.",
    "tags": [
      "WEB_DEV",
      "Web Security & Performance",
      "Technical Assessment",
      "CSE"
    ],
    "examRelevance": "Web Security Audits, Modern Web Dev",
    "placementRelevance": "Security Engineer, Frontend Lead"
  },
  {
    "subject": "WEB_DEV",
    "topic": "Web Security & Performance",
    "subtopic": "Security & Core Web Vitals",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is the role of a CSRF (Cross-Site Request Forgery) token?",
    "options": [
      "A unique, unpredictable secret sent with state-changing requests to prove the request originated from the authentic web application",
      "A public encryption key for TLS handshakes",
      "A token used to compress HTTP responses",
      "A session identifier stored in localStorage"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Anti-CSRF tokens ensure that requests sent to sensitive endpoints were generated intentionally by the authenticated user from the genuine application origin.",
    "tags": [
      "WEB_DEV",
      "Web Security & Performance",
      "Technical Assessment",
      "CSE"
    ],
    "examRelevance": "Web Security Audits, Modern Web Dev",
    "placementRelevance": "Security Engineer, Frontend Lead"
  },
  {
    "subject": "WEB_DEV",
    "topic": "Web Security & Performance",
    "subtopic": "Security & Core Web Vitals",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "What does CORS (Cross-Origin Resource Sharing) headers enable browsers to do?",
    "options": [
      "Permit or restrict web applications running at one origin from requesting resources from a different origin",
      "Encrypt browser memory against side-channel attacks",
      "Speed up DNS resolution for third-party scripts",
      "Block all iframe rendering permanently"
    ],
    "correctAnswerIndex": 0,
    "explanation": "CORS is an HTTP-header based security mechanism that allows a server to indicate any origins other than its own from which a browser should permit loading resources.",
    "tags": [
      "WEB_DEV",
      "Web Security & Performance",
      "Technical Assessment",
      "CSE"
    ],
    "examRelevance": "Web Security Audits, Modern Web Dev",
    "placementRelevance": "Security Engineer, Frontend Lead"
  },
  {
    "subject": "WEB_DEV",
    "topic": "Web Security & Performance",
    "subtopic": "Security & Core Web Vitals",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is the purpose of Content Security Policy (CSP)?",
    "options": [
      "An HTTP response header that restricts which dynamic resources (scripts, styles, images) the browser is allowed to load and execute",
      "A protocol for server-to-server TLS authentication",
      "A compression algorithm for HTTP/3",
      "A database firewall rule engine"
    ],
    "correctAnswerIndex": 0,
    "explanation": "CSP allows website administrators to declare approved sources of content that browsers are permitted to load, drastically reducing XSS and data injection risks.",
    "tags": [
      "WEB_DEV",
      "Web Security & Performance",
      "Technical Assessment",
      "CSE"
    ],
    "examRelevance": "Web Security Audits, Modern Web Dev",
    "placementRelevance": "Security Engineer, Frontend Lead"
  },
  {
    "subject": "WEB_DEV",
    "topic": "Web Security & Performance",
    "subtopic": "Security & Core Web Vitals",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "What is Lighthouse in modern web performance profiling?",
    "options": [
      "An automated open-source tool for auditing web page performance, accessibility, SEO, and PWA metrics",
      "A hardware firewall appliance for web servers",
      "A distributed NoSQL database for session caches",
      "A CSS preprocessor similar to Sass"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Google Lighthouse audits web performance (LCP, FID, CLS), accessibility, best practices, and SEO, providing concrete scores and optimization opportunities.",
    "tags": [
      "WEB_DEV",
      "Web Security & Performance",
      "Technical Assessment",
      "CSE"
    ],
    "examRelevance": "Web Security Audits, Modern Web Dev",
    "placementRelevance": "Security Engineer, Frontend Lead"
  },
  {
    "subject": "WEB_DEV",
    "topic": "Web Security & Performance",
    "subtopic": "Security & Core Web Vitals",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What does Cumulative Layout Shift (CLS) measure in Google Core Web Vitals?",
    "options": [
      "The visual stability of a page by quantifying unexpected layout shifts of visible elements during page load",
      "The time taken for the server to send the first byte (TTFB)",
      "The delay between user click and browser event processing",
      "The time taken to render the largest visible image"
    ],
    "correctAnswerIndex": 0,
    "explanation": "CLS measures visual stability; unexpected shifting of elements (e.g. ads or images loading without dimensions) results in poor CLS scores.",
    "tags": [
      "WEB_DEV",
      "Web Security & Performance",
      "Technical Assessment",
      "CSE"
    ],
    "examRelevance": "Web Security Audits, Modern Web Dev",
    "placementRelevance": "Security Engineer, Frontend Lead"
  },
  {
    "subject": "WEB_DEV",
    "topic": "Web Security & Performance",
    "subtopic": "Security & Core Web Vitals",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "How does HTTP/2 Multiplexing improve web asset loading over HTTP/1.1?",
    "options": [
      "Allows multiple bidirectional request and response messages to be interleaved concurrently over a single TCP connection",
      "Compresses images using lossless Brotli algorithms",
      "Bypasses DNS lookup via pre-cached IP addresses",
      "Opens 6 parallel TCP connections per subdomain"
    ],
    "correctAnswerIndex": 0,
    "explanation": "HTTP/2 multiplexes multiple request and response streams over a single TCP connection, eliminating Head-of-Line blocking at the application layer.",
    "tags": [
      "WEB_DEV",
      "Web Security & Performance",
      "Technical Assessment",
      "CSE"
    ],
    "examRelevance": "Web Security Audits, Modern Web Dev",
    "placementRelevance": "Security Engineer, Frontend Lead"
  },
  {
    "subject": "WEB_DEV",
    "topic": "Advanced Web APIs & Performance",
    "subtopic": "Modern Web Architecture",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is the key difference between localStorage and sessionStorage?",
    "options": [
      "localStorage persists data indefinitely across browser restarts, while sessionStorage clears data when the page session/tab closes",
      "localStorage has 50MB limit while sessionStorage has 5MB",
      "sessionStorage is transmitted automatically with every HTTP header",
      "localStorage cannot store strings"
    ],
    "correctAnswerIndex": 0,
    "explanation": "localStorage data persists until explicitly cleared; sessionStorage data is scoped to the browser tab and cleared when closed.",
    "tags": [
      "WEB_DEV",
      "Advanced Web APIs & Performance",
      "Technical Assessment",
      "CSE"
    ],
    "examRelevance": "Senior Frontend Architect, Performance Engineering",
    "placementRelevance": "Lead Frontend, Staff SDE, Tech Giants"
  },
  {
    "subject": "WEB_DEV",
    "topic": "Advanced Web APIs & Performance",
    "subtopic": "Modern Web Architecture",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "What does the 'SameSite=Strict' attribute on a session cookie ensure?",
    "options": [
      "The cookie is never sent in cross-site requests, protecting against CSRF attacks",
      "The cookie is only sent over HTTPS",
      "The cookie is deleted after 10 minutes",
      "The cookie can only be read by subdomains"
    ],
    "correctAnswerIndex": 0,
    "explanation": "SameSite=Strict ensures the cookie is withheld on all cross-site browsing contexts (e.g. following links from external sites).",
    "tags": [
      "WEB_DEV",
      "Advanced Web APIs & Performance",
      "Technical Assessment",
      "CSE"
    ],
    "examRelevance": "Senior Frontend Architect, Performance Engineering",
    "placementRelevance": "Lead Frontend, Staff SDE, Tech Giants"
  },
  {
    "subject": "WEB_DEV",
    "topic": "Advanced Web APIs & Performance",
    "subtopic": "Modern Web Architecture",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is the purpose of an Service Worker in Progressive Web Apps (PWAs)?",
    "options": [
      "Runs in the background to intercept network requests, manage offline caching, and handle push notifications",
      "Renders WebGL graphics on the main thread",
      "Manages database transactions in IndexedDB automatically",
      "Compiles TypeScript into JavaScript in the browser"
    ],
    "correctAnswerIndex": 0,
    "explanation": "A Service Worker is an event-driven worker that intercepts network requests, caches assets with CacheStorage, and enables offline capability.",
    "tags": [
      "WEB_DEV",
      "Advanced Web APIs & Performance",
      "Technical Assessment",
      "CSE"
    ],
    "examRelevance": "Senior Frontend Architect, Performance Engineering",
    "placementRelevance": "Lead Frontend, Staff SDE, Tech Giants"
  },
  {
    "subject": "WEB_DEV",
    "topic": "Advanced Web APIs & Performance",
    "subtopic": "Modern Web Architecture",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "What is the time complexity of document.getElementById() in modern browsers?",
    "options": [
      "O(1) average lookup via internal hash map of element IDs",
      "O(N) full DOM tree traversal",
      "O(log N) binary search over elements",
      "O(N^2) recursive traversal"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Browsers maintain an internal hash map mapping ID strings to DOM node pointers, providing O(1) instantaneous lookup.",
    "tags": [
      "WEB_DEV",
      "Advanced Web APIs & Performance",
      "Technical Assessment",
      "CSE"
    ],
    "examRelevance": "Senior Frontend Architect, Performance Engineering",
    "placementRelevance": "Lead Frontend, Staff SDE, Tech Giants"
  },
  {
    "subject": "WEB_DEV",
    "topic": "Advanced Web APIs & Performance",
    "subtopic": "Modern Web Architecture",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "In TypeScript, what is the difference between 'unknown' and 'any'?",
    "options": [
      "'unknown' is type-safe: you cannot perform arbitrary operations on it without type narrowing/checking, whereas 'any' disables all type checking",
      "'unknown' cannot be assigned any value",
      "'any' is stricter than 'unknown'",
      "They are identical aliases in TypeScript 4+"
    ],
    "correctAnswerIndex": 0,
    "explanation": "'unknown' forces developers to perform type assertion or narrowing before accessing properties, unlike 'any' which turns off type checking.",
    "tags": [
      "WEB_DEV",
      "Advanced Web APIs & Performance",
      "Technical Assessment",
      "CSE"
    ],
    "examRelevance": "Senior Frontend Architect, Performance Engineering",
    "placementRelevance": "Lead Frontend, Staff SDE, Tech Giants"
  },
  {
    "subject": "WEB_DEV",
    "topic": "Advanced Web APIs & Performance",
    "subtopic": "Modern Web Architecture",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "What does the 'preload' rel attribute on a <link> tag do?",
    "options": [
      "Informs the browser to fetch high-priority critical resources early in the page lifecycle before they are discovered in CSS/HTML",
      "Executes the script immediately in background",
      "Pre-renders the entire HTML page in hidden memory",
      "Caches the resource in localStorage"
    ],
    "correctAnswerIndex": 0,
    "explanation": "<link rel='preload'> tells the browser to fetch a critical resource immediately because it will be needed shortly in the current page load.",
    "tags": [
      "WEB_DEV",
      "Advanced Web APIs & Performance",
      "Technical Assessment",
      "CSE"
    ],
    "examRelevance": "Senior Frontend Architect, Performance Engineering",
    "placementRelevance": "Lead Frontend, Staff SDE, Tech Giants"
  },
  {
    "subject": "WEB_DEV",
    "topic": "Advanced Web APIs & Performance",
    "subtopic": "Modern Web Architecture",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is Tree Shaking in modern JavaScript bundlers (Webpack, Rollup, Vite)?",
    "options": [
      "The elimination of dead code by analyzing ES6 module import/export static syntax",
      "Compiling JavaScript into binary AST",
      "Compressing PNG images into WebP",
      "Removing comments and whitespace"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Tree shaking relies on ES6 static module structure (import/export) to detect and remove unused exports from final production bundles.",
    "tags": [
      "WEB_DEV",
      "Advanced Web APIs & Performance",
      "Technical Assessment",
      "CSE"
    ],
    "examRelevance": "Senior Frontend Architect, Performance Engineering",
    "placementRelevance": "Lead Frontend, Staff SDE, Tech Giants"
  },
  {
    "subject": "WEB_DEV",
    "topic": "Advanced Web APIs & Performance",
    "subtopic": "Modern Web Architecture",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "What is the difference between microtasks and macrotasks in the JavaScript event loop?",
    "options": [
      "Microtasks (Promise.then, queueMicrotask) run immediately after current script execution and before any macrotask (setTimeout, setInterval)",
      "Macrotasks run before microtasks",
      "Microtasks run in Web Workers",
      "There is no distinction in V8 engine"
    ],
    "correctAnswerIndex": 0,
    "explanation": "All microtasks in the microtask queue are drained completely after the currently executing script finishes, before processing the next macrotask from the task queue.",
    "tags": [
      "WEB_DEV",
      "Advanced Web APIs & Performance",
      "Technical Assessment",
      "CSE"
    ],
    "examRelevance": "Senior Frontend Architect, Performance Engineering",
    "placementRelevance": "Lead Frontend, Staff SDE, Tech Giants"
  },
  {
    "subject": "WEB_DEV",
    "topic": "Advanced Web APIs & Performance",
    "subtopic": "Modern Web Architecture",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is the purpose of the Shadow DOM in Web Components?",
    "options": [
      "Provides encapsulated DOM and scoped CSS styles that do not leak into or get affected by outer document styles",
      "Creates 3D shadows around canvas elements",
      "Improves Google search engine indexing",
      "Renders invisible elements for screen readers"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Shadow DOM allows hidden, isolated DOM trees to be attached to elements, guaranteeing encapsulation of styles and markup for Web Components.",
    "tags": [
      "WEB_DEV",
      "Advanced Web APIs & Performance",
      "Technical Assessment",
      "CSE"
    ],
    "examRelevance": "Senior Frontend Architect, Performance Engineering",
    "placementRelevance": "Lead Frontend, Staff SDE, Tech Giants"
  },
  {
    "subject": "WEB_DEV",
    "topic": "Advanced Web APIs & Performance",
    "subtopic": "Modern Web Architecture",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "What is Server-Side Rendering (SSR) in frameworks like Next.js?",
    "options": [
      "Rendering the initial HTML on the server per request before sending it to the client, improving First Contentful Paint and SEO",
      "Generating static HTML files only at build time",
      "Executing client-side React code in browser Web Workers",
      "Using Node.js as an SQL query proxy only"
    ],
    "correctAnswerIndex": 0,
    "explanation": "SSR renders React components to HTML on the server upon incoming request, delivering populated HTML immediately for fast FCP and search crawler visibility.",
    "tags": [
      "WEB_DEV",
      "Advanced Web APIs & Performance",
      "Technical Assessment",
      "CSE"
    ],
    "examRelevance": "Senior Frontend Architect, Performance Engineering",
    "placementRelevance": "Lead Frontend, Staff SDE, Tech Giants"
  },
  {
    "subject": "WEB_DEV",
    "topic": "Advanced Web APIs & Performance",
    "subtopic": "Modern Web Architecture",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is SSG (Static Site Generation)?",
    "options": [
      "Compiling HTML, CSS, and JS pages at build time so they can be served instantly via CDN without server computation per request",
      "Rendering pages on client side only",
      "Caching database queries in Redis",
      "Streaming HTML chunks via WebSockets"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Static Site Generation pre-renders all pages at build time, producing static HTML assets that can be distributed globally across CDNs.",
    "tags": [
      "WEB_DEV",
      "Advanced Web APIs & Performance",
      "Technical Assessment",
      "CSE"
    ],
    "examRelevance": "Senior Frontend Architect, Performance Engineering",
    "placementRelevance": "Lead Frontend, Staff SDE, Tech Giants"
  },
  {
    "subject": "WEB_DEV",
    "topic": "Advanced Web APIs & Performance",
    "subtopic": "Modern Web Architecture",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "In WebSockets, what is the initial protocol handshake used to establish a persistent connection?",
    "options": [
      "An HTTP GET request with 'Upgrade: websocket' and 'Connection: Upgrade' headers",
      "A direct raw UDP datagram broadcast",
      "A TLS certificate exchange over port 21",
      "A REST POST request with binary JSON payload"
    ],
    "correctAnswerIndex": 0,
    "explanation": "WebSocket connections begin with an HTTP/1.1 or HTTP/2 GET handshake carrying 'Upgrade: websocket' headers, transitioning to full-duplex WS framing.",
    "tags": [
      "WEB_DEV",
      "Advanced Web APIs & Performance",
      "Technical Assessment",
      "CSE"
    ],
    "examRelevance": "Senior Frontend Architect, Performance Engineering",
    "placementRelevance": "Lead Frontend, Staff SDE, Tech Giants"
  },
  {
    "subject": "WEB_DEV",
    "topic": "Advanced Web APIs & Performance",
    "subtopic": "Modern Web Architecture",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is WebAssembly (Wasm)?",
    "options": [
      "A low-level binary code format for executing code written in C, C++, or Rust in web browsers at near-native speed",
      "A replacement for HTML and CSS",
      "A new JavaScript syntax for async operations",
      "A server-side Node.js clustering plugin"
    ],
    "correctAnswerIndex": 0,
    "explanation": "WebAssembly provides a compact binary format that runs with near-native performance alongside JavaScript in modern web browsers.",
    "tags": [
      "WEB_DEV",
      "Advanced Web APIs & Performance",
      "Technical Assessment",
      "CSE"
    ],
    "examRelevance": "Senior Frontend Architect, Performance Engineering",
    "placementRelevance": "Lead Frontend, Staff SDE, Tech Giants"
  },
  {
    "subject": "WEB_DEV",
    "topic": "Advanced Web APIs & Performance",
    "subtopic": "Modern Web Architecture",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "What is Hydration in modern SSR frameworks?",
    "options": [
      "The process where client-side JavaScript attaches event listeners and state to server-rendered HTML markup",
      "Downloading CSS stylesheets dynamically",
      "Connecting to MongoDB from client browser",
      "Injecting environment variables at runtime"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Hydration takes server-rendered static HTML and attaches client-side React/Vue event listeners and state, transforming it into an interactive SPA.",
    "tags": [
      "WEB_DEV",
      "Advanced Web APIs & Performance",
      "Technical Assessment",
      "CSE"
    ],
    "examRelevance": "Senior Frontend Architect, Performance Engineering",
    "placementRelevance": "Lead Frontend, Staff SDE, Tech Giants"
  },
  {
    "subject": "WEB_DEV",
    "topic": "Advanced Web APIs & Performance",
    "subtopic": "Modern Web Architecture",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is the main security risk of 'target=\"_blank\"' without 'rel=\"noopener noreferrer\"'?",
    "options": [
      "The newly opened page can access the opener page via window.opener and redirect it to a phishing site",
      "The new page can read local cookies from other tabs",
      "The browser disables HTTPS on the target link",
      "It exposes browser history to web trackers"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Without noopener, window.opener allows the target page to execute window.opener.location = 'evil.com', leading to reverse tabnabbing phishing attacks.",
    "tags": [
      "WEB_DEV",
      "Advanced Web APIs & Performance",
      "Technical Assessment",
      "CSE"
    ],
    "examRelevance": "Senior Frontend Architect, Performance Engineering",
    "placementRelevance": "Lead Frontend, Staff SDE, Tech Giants"
  },
  {
    "subject": "WEB_DEV",
    "topic": "Advanced Web APIs & Performance",
    "subtopic": "Modern Web Architecture",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "Which CSS property enables text truncation with an ellipsis (...) on a single line?",
    "options": [
      "text-overflow: ellipsis combined with overflow: hidden and white-space: nowrap",
      "overflow-text: ellipsis",
      "text-cut: true",
      "word-break: ellipsis"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Single-line text truncation requires white-space: nowrap, overflow: hidden, and text-overflow: ellipsis.",
    "tags": [
      "WEB_DEV",
      "Advanced Web APIs & Performance",
      "Technical Assessment",
      "CSE"
    ],
    "examRelevance": "Senior Frontend Architect, Performance Engineering",
    "placementRelevance": "Lead Frontend, Staff SDE, Tech Giants"
  },
  {
    "subject": "WEB_DEV",
    "topic": "Advanced Web APIs & Performance",
    "subtopic": "Modern Web Architecture",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is the purpose of the 'ResizeObserver' API in modern web development?",
    "options": [
      "Allows observing changes to an Element's content or border-box dimensions without polling or listening to window resize",
      "Compresses images dynamically on window resize",
      "Listens to browser viewport zoom level changes",
      "Adjusts CSS rem units automatically"
    ],
    "correctAnswerIndex": 0,
    "explanation": "ResizeObserver reports changes to the dimensions of an Element's content rect or border box efficiently.",
    "tags": [
      "WEB_DEV",
      "Advanced Web APIs & Performance",
      "Technical Assessment",
      "CSE"
    ],
    "examRelevance": "Senior Frontend Architect, Performance Engineering",
    "placementRelevance": "Lead Frontend, Staff SDE, Tech Giants"
  },
  {
    "subject": "WEB_DEV",
    "topic": "Advanced Web APIs & Performance",
    "subtopic": "Modern Web Architecture",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "What is a progressive enhancement strategy in web development?",
    "options": [
      "Building a resilient baseline experience that works on all browsers, then layering advanced features for modern browsers",
      "Adding 3D animations before basic HTML is structured",
      "Relying strictly on the latest Chrome-only experimental APIs",
      "Requiring JavaScript for basic text rendering"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Progressive enhancement prioritizes delivering core web content to everyone first, progressively adding enhancements (rich UI, JS, styling) as client capabilities allow.",
    "tags": [
      "WEB_DEV",
      "Advanced Web APIs & Performance",
      "Technical Assessment",
      "CSE"
    ],
    "examRelevance": "Senior Frontend Architect, Performance Engineering",
    "placementRelevance": "Lead Frontend, Staff SDE, Tech Giants"
  },
  {
    "subject": "WEB_DEV",
    "topic": "Advanced Web APIs & Performance",
    "subtopic": "Modern Web Architecture",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "How does JSONP (JSON with Padding) circumvent cross-origin restrictions in legacy web apps?",
    "options": [
      "By dynamically inserting a <script> tag whose src points to the cross-origin API endpoint that returns callback-wrapped data",
      "By sending raw UDP packets",
      "By embedding iframes inside flash players",
      "By overriding the browser's origin header via JavaScript"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Because <script> tags are exempt from the Same-Origin Policy, JSONP loaded remote scripts wrapped in client-defined function callbacks.",
    "tags": [
      "WEB_DEV",
      "Advanced Web APIs & Performance",
      "Technical Assessment",
      "CSE"
    ],
    "examRelevance": "Senior Frontend Architect, Performance Engineering",
    "placementRelevance": "Lead Frontend, Staff SDE, Tech Giants"
  },
  {
    "subject": "WEB_DEV",
    "topic": "Advanced Web APIs & Performance",
    "subtopic": "Modern Web Architecture",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "What is the purpose of an 'abort controller' in the Fetch API?",
    "options": [
      "To cancel ongoing HTTP fetch requests when components unmount or user initiates a new query",
      "To terminate backend server processes",
      "To restart the browser network interface",
      "To clear browser cookie caches"
    ],
    "correctAnswerIndex": 0,
    "explanation": "AbortController allows signaling an AbortSignal to fetch(), cleanly aborting in-flight HTTP network requests.",
    "tags": [
      "WEB_DEV",
      "Advanced Web APIs & Performance",
      "Technical Assessment",
      "CSE"
    ],
    "examRelevance": "Senior Frontend Architect, Performance Engineering",
    "placementRelevance": "Lead Frontend, Staff SDE, Tech Giants"
  },
  {
    "subject": "WEB_DEV",
    "topic": "Advanced Web APIs & Performance",
    "subtopic": "Modern Web Architecture",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is the CSS 'clamp()' function used for?",
    "options": [
      "Defining responsive fluid typography or sizing by clamping a value between defined min, preferred, and max values",
      "Clamping flex items so they cannot wrap",
      "Restricting colors to sRGB space",
      "Locking scroll position to top of viewport"
    ],
    "correctAnswerIndex": 0,
    "explanation": "clamp(min, preferred, max) enables fluid responsive typography and spacing without requiring media queries.",
    "tags": [
      "WEB_DEV",
      "Advanced Web APIs & Performance",
      "Technical Assessment",
      "CSE"
    ],
    "examRelevance": "Senior Frontend Architect, Performance Engineering",
    "placementRelevance": "Lead Frontend, Staff SDE, Tech Giants"
  },
  {
    "subject": "WEB_DEV",
    "topic": "Advanced Web APIs & Performance",
    "subtopic": "Modern Web Architecture",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "What is the difference between 'encodeURI()' and 'encodeURIComponent()' in JavaScript?",
    "options": [
      "encodeURI() encodes a full URI preserving URI delimiters (: / ? # &), while encodeURIComponent() encodes all characters including delimiters",
      "encodeURI() is for base64 strings only",
      "encodeURIComponent() does not encode ampersands",
      "They are identical aliases"
    ],
    "correctAnswerIndex": 0,
    "explanation": "encodeURIComponent is meant for encoding query string parameters, escaping characters like &, ?, =, and / that have syntactic meaning in URIs.",
    "tags": [
      "WEB_DEV",
      "Advanced Web APIs & Performance",
      "Technical Assessment",
      "CSE"
    ],
    "examRelevance": "Senior Frontend Architect, Performance Engineering",
    "placementRelevance": "Lead Frontend, Staff SDE, Tech Giants"
  },
  {
    "subject": "WEB_DEV",
    "topic": "Advanced Web APIs & Performance",
    "subtopic": "Modern Web Architecture",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is the main benefit of CSS 'contain: content' or 'contain: strict'?",
    "options": [
      "Isolates an element's rendering and layout from the rest of the DOM tree, optimizing browser recalculate-style and layout passes",
      "Prevents element contents from overflowing the screen",
      "Locks element styles against user stylesheets",
      "Enables CSS container queries on child spans"
    ],
    "correctAnswerIndex": 0,
    "explanation": "contain tells the browser that the element's subtree is independent of the rest of the page, allowing heavy layout/paint optimizations.",
    "tags": [
      "WEB_DEV",
      "Advanced Web APIs & Performance",
      "Technical Assessment",
      "CSE"
    ],
    "examRelevance": "Senior Frontend Architect, Performance Engineering",
    "placementRelevance": "Lead Frontend, Staff SDE, Tech Giants"
  },
  {
    "subject": "WEB_DEV",
    "topic": "Advanced Web APIs & Performance",
    "subtopic": "Modern Web Architecture",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "What is IndexedDB primarily used for in client-side web applications?",
    "options": [
      "Storing large amounts of structured, transactional client-side data including files and blobs with indexable querying",
      "Managing server-side SQL queries",
      "Replacing Redux store in small apps",
      "Streaming live audio from microphone"
    ],
    "correctAnswerIndex": 0,
    "explanation": "IndexedDB is a transactional, object-oriented client-side database capable of storing gigabytes of structured data and binary files offline.",
    "tags": [
      "WEB_DEV",
      "Advanced Web APIs & Performance",
      "Technical Assessment",
      "CSE"
    ],
    "examRelevance": "Senior Frontend Architect, Performance Engineering",
    "placementRelevance": "Lead Frontend, Staff SDE, Tech Giants"
  },
  {
    "subject": "WEB_DEV",
    "topic": "Advanced Web APIs & Performance",
    "subtopic": "Modern Web Architecture",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What does the 'navigator.sendBeacon()' method do?",
    "options": [
      "Asynchronously transmits a small amount of telemetry/analytics data to a web server without delaying page unload",
      "Pings nearby Bluetooth devices",
      "Broadcasts messages to all open browser tabs",
      "Sends high-priority push notifications to Android devices"
    ],
    "correctAnswerIndex": 0,
    "explanation": "sendBeacon() sends analytics or telemetry over HTTP POST when the user closes or navigates away from a page, without blocking document unload.",
    "tags": [
      "WEB_DEV",
      "Advanced Web APIs & Performance",
      "Technical Assessment",
      "CSE"
    ],
    "examRelevance": "Senior Frontend Architect, Performance Engineering",
    "placementRelevance": "Lead Frontend, Staff SDE, Tech Giants"
  },
  {
    "subject": "WEB_DEV",
    "topic": "Advanced Web APIs & Performance",
    "subtopic": "Modern Web Architecture",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "What is the purpose of the 'IntersectionObserver' API?",
    "options": [
      "Efficiently tracking when a target element enters or exits the viewport (for lazy loading images or infinite scrolling)",
      "Measuring intersection points between two SVG vectors",
      "Detecting collision between canvas sprites",
      "Listening to mouse hover intersections"
    ],
    "correctAnswerIndex": 0,
    "explanation": "IntersectionObserver asynchronously observes changes in the intersection of a target element with an ancestor element or viewport, ideal for lazy loading.",
    "tags": [
      "WEB_DEV",
      "Advanced Web APIs & Performance",
      "Technical Assessment",
      "CSE"
    ],
    "examRelevance": "Senior Frontend Architect, Performance Engineering",
    "placementRelevance": "Lead Frontend, Staff SDE, Tech Giants"
  },
  {
    "subject": "WEB_DEV",
    "topic": "Modern Web Architecture",
    "subtopic": "Frontend Systems",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "Which HTTP/2 or HTTP/3 header replaces the legacy 'Host' header?",
    "options": [
      ":authority",
      ":host",
      ":domain",
      ":path"
    ],
    "correctAnswerIndex": 0,
    "explanation": "In HTTP/2 and HTTP/3 pseudo-headers, :authority takes the place of the HTTP/1.1 Host header.",
    "tags": [
      "WEB_DEV",
      "Modern Web Architecture",
      "Technical Assessment",
      "CSE"
    ],
    "examRelevance": "University, Placements",
    "placementRelevance": "TCS, Infosys, Wipro, Product Companies"
  },
  {
    "subject": "WEB_DEV",
    "topic": "Modern Web Architecture",
    "subtopic": "Frontend Systems",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is the primary function of a Web Worker in JavaScript?",
    "options": [
      "Execute CPU-intensive scripts on a separate background thread without blocking the UI main thread",
      "Directly manipulate the DOM asynchronously",
      "Intercept HTTP requests like a proxy",
      "Manage indexedDB transactions only"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Web Workers run scripts in background threads, keeping the browser UI snappy during heavy computations. They do not have access to the DOM.",
    "tags": [
      "WEB_DEV",
      "Modern Web Architecture",
      "Technical Assessment",
      "CSE"
    ],
    "examRelevance": "University, Placements",
    "placementRelevance": "TCS, Infosys, Wipro, Product Companies"
  },
  {
    "subject": "WEB_DEV",
    "topic": "Modern Web Architecture",
    "subtopic": "Frontend Systems",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "In React 18, what does 'useTransition' hook enable?",
    "options": [
      "Mark state updates as non-urgent transitions, keeping user input responsive while rendering takes place",
      "Animate CSS properties smoothly",
      "Transition between page routes in Next.js",
      "Manage database transactions"
    ],
    "correctAnswerIndex": 0,
    "explanation": "useTransition lets you mark updates as transitions, so that urgent user interactions (typing, clicks) take priority over heavy rendering.",
    "tags": [
      "WEB_DEV",
      "Modern Web Architecture",
      "Technical Assessment",
      "CSE"
    ],
    "examRelevance": "University, Placements",
    "placementRelevance": "TCS, Infosys, Wipro, Product Companies"
  },
  {
    "subject": "WEB_DEV",
    "topic": "Modern Web Architecture",
    "subtopic": "Frontend Systems",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What does the 'crossorigin=\"anonymous\"' attribute in a <script> or <img> tag do?",
    "options": [
      "Performs a CORS request without sending credentials like cookies or HTTP authentication",
      "Disables all cross-origin security checks",
      "Forces downloading via anonymous Tor proxies",
      "Encrypts incoming image payload"
    ],
    "correctAnswerIndex": 0,
    "explanation": "crossorigin='anonymous' sends a CORS request without credentials, enabling error logging (like detailed script errors) or canvas extraction safely.",
    "tags": [
      "WEB_DEV",
      "Modern Web Architecture",
      "Technical Assessment",
      "CSE"
    ],
    "examRelevance": "University, Placements",
    "placementRelevance": "TCS, Infosys, Wipro, Product Companies"
  },
  {
    "subject": "WEB_DEV",
    "topic": "Modern Web Architecture",
    "subtopic": "Frontend Systems",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is the difference between 'debouncing' and 'throttling' in JavaScript?",
    "options": [
      "Debouncing delays execution until a pause after the last event; Throttling ensures execution at most once every specified time interval",
      "Throttling delays execution until the user stops typing",
      "Debouncing runs code on an interval; Throttling runs once",
      "They are identical techniques"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Debouncing bunches up multiple sequential calls into one after quiet period; Throttling enforces a maximum rate of function calls over time.",
    "tags": [
      "WEB_DEV",
      "Modern Web Architecture",
      "Technical Assessment",
      "CSE"
    ],
    "examRelevance": "University, Placements",
    "placementRelevance": "TCS, Infosys, Wipro, Product Companies"
  },
  {
    "subject": "WEB_DEV",
    "topic": "Modern Web Architecture",
    "subtopic": "Frontend Systems",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is Content Delivery Network (CDN) edge computing?",
    "options": [
      "Running serverless compute functions closer to end users at CDN edge locations rather than a centralized origin",
      "Mining cryptocurrency on user browsers",
      "Compressing images at the database tier",
      "Caching static HTML only"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Edge computing deploys serverless application logic to worldwide distributed CDN edge nodes to drastically minimize latency.",
    "tags": [
      "WEB_DEV",
      "Modern Web Architecture",
      "Technical Assessment",
      "CSE"
    ],
    "examRelevance": "University, Placements",
    "placementRelevance": "TCS, Infosys, Wipro, Product Companies"
  },
  {
    "subject": "WEB_DEV",
    "topic": "Modern Web Architecture",
    "subtopic": "Frontend Systems",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is an XSS Sanitization library best practice when rendering user HTML in React?",
    "options": [
      "Use DOMPurify to strip dangerous tags and attributes before dangerouslySetInnerHTML",
      "Rely on JSON.stringify()",
      "Replace script tags with regex",
      "Encode quotes using encodeURIComponent()"
    ],
    "correctAnswerIndex": 0,
    "explanation": "DOMPurify is the gold standard for sanitizing untrusted HTML strings against XSS attacks before rendering in DOM.",
    "tags": [
      "WEB_DEV",
      "Modern Web Architecture",
      "Technical Assessment",
      "CSE"
    ],
    "examRelevance": "University, Placements",
    "placementRelevance": "TCS, Infosys, Wipro, Product Companies"
  },
  {
    "subject": "WEB_DEV",
    "topic": "Modern Web Architecture",
    "subtopic": "Frontend Systems",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is Server-Sent Events (SSE) compared to WebSockets?",
    "options": [
      "SSE is a unidirectional persistent HTTP connection from server to client, while WebSockets is bidirectional full-duplex",
      "SSE supports binary streaming while WebSockets only text",
      "SSE requires special TCP ports",
      "SSE cannot reconnect automatically"
    ],
    "correctAnswerIndex": 0,
    "explanation": "SSE is a standardized browser API (EventSource) providing one-way streaming from server to client over standard HTTP.",
    "tags": [
      "WEB_DEV",
      "Modern Web Architecture",
      "Technical Assessment",
      "CSE"
    ],
    "examRelevance": "University, Placements",
    "placementRelevance": "TCS, Infosys, Wipro, Product Companies"
  },
  {
    "subject": "WEB_DEV",
    "topic": "Modern Web Architecture",
    "subtopic": "Frontend Systems",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is the purpose of the 'integrity' attribute in <script> tags (Subresource Integrity - SRI)?",
    "options": [
      "Enables browsers to verify that fetched resources match an expected cryptographic hash before execution",
      "Guarantees script execution speed",
      "Enforces strict type safety at runtime",
      "Checks if script author has valid SSL certificate"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Subresource Integrity (SRI) uses cryptographic hashes (e.g., sha384-...) to ensure third-party scripts have not been tampered with.",
    "tags": [
      "WEB_DEV",
      "Modern Web Architecture",
      "Technical Assessment",
      "CSE"
    ],
    "examRelevance": "University, Placements",
    "placementRelevance": "TCS, Infosys, Wipro, Product Companies"
  },
  {
    "subject": "WEB_DEV",
    "topic": "Modern Web Architecture",
    "subtopic": "Frontend Systems",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "In CSS, what is the effect of 'will-change: transform'?",
    "options": [
      "Informs the browser in advance that an element's transform property will animate, so it can allocate dedicated GPU layers",
      "Forces the element to animate immediately",
      "Changes layout box from inline to block",
      "Removes CSS transitions"
    ],
    "correctAnswerIndex": 0,
    "explanation": "will-change gives browsers an advance hint to optimize rendering resources, such as creating a GPU compositor layer before animation begins.",
    "tags": [
      "WEB_DEV",
      "Modern Web Architecture",
      "Technical Assessment",
      "CSE"
    ],
    "examRelevance": "University, Placements",
    "placementRelevance": "TCS, Infosys, Wipro, Product Companies"
  },
  {
    "subject": "WEB_DEV",
    "topic": "Modern Web Architecture",
    "subtopic": "Frontend Systems",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is the difference between 'sessionStorage' and cookies regarding server communication?",
    "options": [
      "Cookies are sent automatically with every matching HTTP request, whereas sessionStorage remains purely client-side",
      "sessionStorage is transmitted in request headers",
      "Cookies have a 5MB storage limit",
      "sessionStorage cannot store JSON"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Cookies are sent with every HTTP request to the matching domain; sessionStorage data never leaves the client browser automatically.",
    "tags": [
      "WEB_DEV",
      "Modern Web Architecture",
      "Technical Assessment",
      "CSE"
    ],
    "examRelevance": "University, Placements",
    "placementRelevance": "TCS, Infosys, Wipro, Product Companies"
  },
  {
    "subject": "WEB_DEV",
    "topic": "Modern Web Architecture",
    "subtopic": "Frontend Systems",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "In modern web bundlers, what is Code Splitting?",
    "options": [
      "Splitting application bundles into smaller chunks loaded on demand when specific routes or components are requested",
      "Splitting CSS files by selector type",
      "Splitting backend node scripts across cores",
      "Compiling JavaScript into smaller variable names"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Code splitting breaks codebases into dynamic chunks (using dynamic import()) loaded only when needed, reducing initial download footprint.",
    "tags": [
      "WEB_DEV",
      "Modern Web Architecture",
      "Technical Assessment",
      "CSE"
    ],
    "examRelevance": "University, Placements",
    "placementRelevance": "TCS, Infosys, Wipro, Product Companies"
  }
];
