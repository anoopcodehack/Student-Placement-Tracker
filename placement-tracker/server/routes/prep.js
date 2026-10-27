const express = require('express');
const router = express.Router();
const PrepQuestion = require('../models/PrepQuestion');
const { protect } = require('../middleware/auth');

// Curated seed questions for campus placement preparation
const SEED_QUESTIONS = [
  // ── DSA ──
  {
    title: 'Two Sum Problem / Find Pair with Target Sum',
    topic: 'DSA',
    subTopic: 'Arrays & Hash Maps',
    difficulty: 'Easy',
    companies: ['Amazon', 'Google', 'TCS', 'Infosys', 'Accenture'],
    question: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. Each input has exactly one solution, and you may not use the same element twice.',
    solution: 'Use a Hash Map to store each number and its index as you iterate through the array. For each number x, check if (target - x) already exists in the map in O(1) time.\n\nTime Complexity: O(n)\nSpace Complexity: O(n)',
    codeSnippet: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
    language: 'javascript',
    keyPoints: [
      'Brute force takes O(n²) time by checking all pairs.',
      'Hash map reduces search lookup to average O(1).',
      'Pay attention to edge cases like duplicates and negative numbers.'
    ],
    tips: 'Mention the trade-off: O(n) space for O(n) time vs O(1) space if array is sorted (two pointers, O(n log n)).',
    isOfficial: true,
  },
  {
    title: 'Reverse a Singly Linked List',
    topic: 'DSA',
    subTopic: 'Linked Lists',
    difficulty: 'Easy',
    companies: ['TCS', 'Infosys', 'Wipro', 'Amazon', 'Cognizant'],
    question: 'Given the head of a singly linked list, reverse the list and return the new head. Explain both iterative and recursive implementations.',
    solution: 'Iterative approach: Maintain three pointers: prev (initially null), curr (initially head), and next. In each step, store curr.next in next, point curr.next to prev, advance prev to curr, and curr to next. Return prev.\n\nTime Complexity: O(n)\nSpace Complexity: O(1)',
    codeSnippet: `function reverseList(head) {
  let prev = null;
  let curr = head;
  while (curr !== null) {
    const next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  return prev;
}`,
    language: 'javascript',
    keyPoints: [
      'Iterative: O(n) time, O(1) auxiliary space.',
      'Recursive: O(n) time, O(n) call stack space.',
      'Always safeguard against empty list (head === null) or single-node list.'
    ],
    tips: 'Draw the pointer movements on a whiteboard or virtual notepad while explaining to the interviewer.',
    isOfficial: true,
  },
  {
    title: 'Maximum Subarray Sum (Kadane’s Algorithm)',
    topic: 'DSA',
    subTopic: 'Dynamic Programming / Arrays',
    difficulty: 'Medium',
    companies: ['Amazon', 'Microsoft', 'Google', 'Swiggy', 'PhonePe'],
    question: 'Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.',
    solution: 'Use Kadane’s Algorithm. Keep track of currentMax and globalMax. At each element, decide whether to add the current element to the existing running sum or start a fresh subarray at this element. globalMax = Math.max(globalMax, currentMax).\n\nTime: O(n), Space: O(1)',
    codeSnippet: `function maxSubArray(nums) {
  let currentMax = nums[0];
  let globalMax = nums[0];
  for (let i = 1; i < nums.length; i++) {
    currentMax = Math.max(nums[i], currentMax + nums[i]);
    globalMax = Math.max(globalMax, currentMax);
  }
  return globalMax;
}`,
    language: 'javascript',
    keyPoints: [
      'Avoid restarting sum to 0 if all numbers are negative — initialize with nums[0].',
      'Local optimal choice leads to global optimal subarray.',
      'Can be extended to return the starting and ending indices.'
    ],
    tips: 'Mention that a divide and conquer approach also exists with O(n log n) time, but Kadane’s is linear O(n).',
    isOfficial: true,
  },
  {
    title: 'Valid Parentheses String Matching',
    topic: 'DSA',
    subTopic: 'Stack',
    difficulty: 'Easy',
    companies: ['TCS', 'Infosys', 'Accenture', 'Amazon', 'Wipro'],
    question: 'Given a string s containing just the characters "(", ")", "{", "}", "[" and "]", determine if the input string is valid (brackets must close in correct order and type).',
    solution: 'Iterate through characters. If an opening bracket is encountered, push onto a stack. If a closing bracket is encountered, verify if the top of the stack has the matching opening bracket and pop it. If stack is empty or mismatch occurs, return false. Finally, return stack.length === 0.\n\nTime: O(n), Space: O(n)',
    codeSnippet: `function isValid(s) {
  const stack = [];
  const map = { ')': '(', '}': '{', ']': '[' };
  for (const char of s) {
    if (map[char]) {
      if (stack.pop() !== map[char]) return false;
    } else {
      stack.push(char);
    }
  }
  return stack.length === 0;
}`,
    language: 'javascript',
    keyPoints: [
      'Stack LIFO property directly aligns with nested bracket hierarchy.',
      'Must check if stack is empty when string iteration finishes.',
      'Odd-length strings can immediately return false.'
    ],
    tips: 'Great problem to demonstrate clean code and dictionary lookup mapping.',
    isOfficial: true,
  },

  // ── SQL ──
  {
    title: 'Find the Second Highest Salary in Employees Table',
    topic: 'SQL',
    subTopic: 'Subqueries & Window Functions',
    difficulty: 'Medium',
    companies: ['TCS', 'Infosys', 'Wipro', 'Accenture', 'Cognizant', 'Amazon'],
    question: 'Write an SQL query to find the second highest salary from the Employee table. If there is no second highest salary, return NULL.',
    solution: 'Method 1 (Subquery):\nSELECT MAX(salary) AS SecondHighestSalary FROM Employee WHERE salary < (SELECT MAX(salary) FROM Employee);\n\nMethod 2 (DENSE_RANK window function):\nSELECT salary FROM (SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) as rank_no FROM Employee) WHERE rank_no = 2 LIMIT 1;',
    codeSnippet: `-- Method 1: Subquery (Safe for NULLs)
SELECT MAX(salary) AS SecondHighestSalary 
FROM Employee 
WHERE salary < (SELECT MAX(salary) FROM Employee);

-- Method 2: Generic Nth Highest Salary using DENSE_RANK()
WITH RankedSalaries AS (
  SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) as rnk
  FROM Employee
)
SELECT salary FROM RankedSalaries WHERE rnk = 2 LIMIT 1;`,
    language: 'sql',
    keyPoints: [
      'DENSE_RANK() handles duplicate salary values without skipping ranks.',
      'LIMIT 1 OFFSET 1 can fail if duplicates exist or if only 1 record is present unless wrapped in IFNULL.',
      'MAX() gracefully returns NULL if no matching rows exist.'
    ],
    tips: 'Always ask the interviewer: "Could there be multiple employees earning the exact highest salary?" before answering.',
    isOfficial: true,
  },
  {
    title: 'Find Duplicate Records and their Occurrence Count',
    topic: 'SQL',
    subTopic: 'GROUP BY & HAVING',
    difficulty: 'Easy',
    companies: ['TCS', 'Infosys', 'Capgemini', 'Wipro'],
    question: 'Given an employee table with email column, write an SQL query to report all the duplicate emails and the count of times each appears.',
    solution: 'Use GROUP BY on the target column and filter aggregates using the HAVING clause with COUNT(*) > 1.',
    codeSnippet: `SELECT email, COUNT(*) as duplicate_count
FROM Employees
GROUP BY email
HAVING COUNT(*) > 1;`,
    language: 'sql',
    keyPoints: [
      'WHERE filters rows BEFORE grouping occurs.',
      'HAVING filters groups AFTER aggregation.',
      'To delete duplicates while keeping lowest ID, use DELETE e1 FROM Employees e1 INNER JOIN Employees e2 ON e1.email = e2.email AND e1.id > e2.id.'
    ],
    tips: 'Be prepared to explain how to delete duplicates if asked as a follow-up.',
    isOfficial: true,
  },
  {
    title: 'Difference Between INNER JOIN, LEFT JOIN, and FULL OUTER JOIN',
    topic: 'SQL',
    subTopic: 'Joins & Set Theory',
    difficulty: 'Easy',
    companies: ['All Companies', 'TCS', 'Infosys', 'Accenture'],
    question: 'Explain the conceptual and functional difference between INNER JOIN, LEFT OUTER JOIN, RIGHT OUTER JOIN, and FULL OUTER JOIN with visual explanation.',
    solution: '• INNER JOIN: Returns only rows with matching values in both tables.\n• LEFT JOIN: Returns all rows from the left table, and matching rows from the right table (NULL if no match).\n• RIGHT JOIN: Returns all rows from right table, and matched rows from left.\n• FULL OUTER JOIN: Returns all records when there is a match in either left or right table.',
    codeSnippet: `-- Left Join finding students without placement records
SELECT s.name, s.rollNo, p.companyName
FROM Students s
LEFT JOIN Placements p ON s.id = p.studentId
WHERE p.id IS NULL;`,
    language: 'sql',
    keyPoints: [
      'Joins depend on ON predicate conditions.',
      'LEFT JOIN is vital for finding missing or orphan foreign keys.',
      'Cross Join (Cartesian Product) produces N x M rows.'
    ],
    tips: 'Provide a real-world scenario (e.g., Students table and Placements table).',
    isOfficial: true,
  },

  // ── Core CS ──
  {
    title: 'Difference Between Process and Thread',
    topic: 'Core CS',
    subTopic: 'Operating Systems',
    difficulty: 'Medium',
    companies: ['Amazon', 'Microsoft', 'Google', 'TCS', 'Infosys', 'Swiggy'],
    question: 'What is the difference between a Process and a Thread? Explain context switching, memory sharing, and Inter-Process Communication (IPC).',
    solution: 'A Process is an executing instance of a program with its own dedicated memory space (Code, Data, Heap, Stack). A Thread is the smallest unit of CPU execution within a process.\n\nKey Differences:\n1. Memory: Threads within the same process share Code, Data, and Heap, but have private Stacks and Registers. Processes have separate address spaces.\n2. Overhead: Thread creation and context switching are much lighter (fewer register saves, no TLB cache flush). Process context switching is expensive.\n3. Communication: Threads communicate easily via shared memory. Processes require IPC mechanisms (Pipes, Sockets, Shared Memory, Message Queues).\n4. Crash impact: If one thread crashes, the whole process might crash. If one process crashes, other processes remain unaffected.',
    language: 'text',
    keyPoints: [
      'Thread = Lightweight Process (LWP).',
      'Context switch cost of thread is minimal because memory mapping stays identical.',
      'Synchronization (mutex, semaphore) is critical when multiple threads write to shared heap.'
    ],
    tips: 'Use browser tabs (Chrome processes) vs browser worker threads as a modern real-world illustration.',
    isOfficial: true,
  },
  {
    title: 'ACID Properties in Database Management Systems',
    topic: 'Core CS',
    subTopic: 'DBMS & Transactions',
    difficulty: 'Easy',
    companies: ['Amazon', 'Swiggy', 'TCS Digital', 'Infosys', 'PhonePe'],
    question: 'What are ACID properties in a relational DBMS? Explain each letter with a banking transaction scenario.',
    solution: '• Atomicity (All or Nothing): Either all operations of a transaction succeed, or the entire transaction is rolled back. (e.g. If debit succeeds but credit fails, rollback).\n• Consistency: Database transitions from one valid state to another valid state, respecting all constraints and rules.\n• Isolation: Concurrent transactions execute independently without interfering with each other (Isolation levels: Read Uncommitted, Read Committed, Repeatable Read, Serializable).\n• Durability: Once a transaction commits, its changes survive system crashes and power outages via Write-Ahead Logging (WAL).',
    language: 'text',
    keyPoints: [
      'Banking transfer ($100 from Alice to Bob) is the universally accepted explanation.',
      'Write-Ahead Logging (WAL) guarantees Durability.',
      'Isolation levels trade off throughput vs concurrency anomalies (dirty reads, phantom reads).'
    ],
    tips: 'Mention the CAP theorem (Consistency, Availability, Partition tolerance) if interviewing for a backend or distributed systems role.',
    isOfficial: true,
  },
  {
    title: 'What Happens When You Type a URL in Browser and Press Enter?',
    topic: 'Core CS',
    subTopic: 'Computer Networks',
    difficulty: 'Medium',
    companies: ['Google', 'Amazon', 'Microsoft', 'Swiggy', 'PhonePe'],
    question: 'Walk through step-by-step what happens from the moment you type https://www.google.com in your browser URL bar until the webpage is rendered.',
    solution: '1. URL Parsing & Protocol resolution (HTTPS, port 443).\n2. DNS Lookup: Browser cache -> OS cache -> Router cache -> ISP recursive resolver -> Root, TLD (.com), and Authoritative nameservers.\n3. TCP 3-Way Handshake (SYN, SYN-ACK, ACK) to establish reliable transport.\n4. TLS/SSL Handshake for cryptographic session keys (asymmetric exchange -> symmetric AES).\n5. HTTP Request sent (GET /).\n6. Server processing via Reverse Proxy (NGINX), application server, and DB query.\n7. Server sends HTTP Response (200 OK + HTML payload).\n8. Browser parsing: DOM Tree + CSSOM Tree -> Render Tree -> Layout / Reflow -> Paint -> Composite.',
    language: 'text',
    keyPoints: [
      'Covers DNS, TCP, TLS, HTTP, and Browser Rendering Engine in one cohesive story.',
      'Demonstrates breadth of computer science fundamentals.',
      'Highlight caching at multiple network layers.'
    ],
    tips: 'Structure your answer systematically: Network Layer -> Transport Layer -> Security Layer -> Application Layer -> Browser Engine.',
    isOfficial: true,
  },

  // ── Web Dev ──
  {
    title: 'Event Loop & Asynchronous JavaScript (Call Stack, Web APIs, Microtask Queue)',
    topic: 'Web Dev',
    subTopic: 'JavaScript Fundamentals',
    difficulty: 'Medium',
    companies: ['Swiggy', 'PhonePe', 'Flipkart', 'Infosys', 'Accenture'],
    question: 'Explain how asynchronous execution works in JavaScript. What is the difference between Microtask Queue (Promises) and Macrotask / Callback Queue (setTimeout)?',
    solution: 'JavaScript is single-threaded with one call stack. When an asynchronous operation (e.g., setTimeout, fetch) is called, it is offloaded to Browser Web APIs. Once finished, its callback goes into a queue:\n• Microtask Queue: Promises (.then), process.nextTick, MutationObserver.\n• Macrotask Queue: setTimeout, setInterval, setImmediate, I/O.\n\nThe Event Loop constantly checks if the Call Stack is empty. When empty, it empties the ENTIRE Microtask Queue first before processing a single Macrotask.',
    codeSnippet: `console.log('1');
setTimeout(() => console.log('2'), 0);
Promise.resolve().then(() => console.log('3'));
console.log('4');
// Output: 1, 4, 3, 2 (Microtask 3 runs before Macrotask 2)`,
    language: 'javascript',
    keyPoints: [
      'Call stack executes synchronous code first.',
      'Microtasks have strict priority over Macrotasks.',
      'Rendering happens between macrotask executions.'
    ],
    tips: 'Trace the output of sample snippets line by line for the interviewer.',
    isOfficial: true,
  },

  // ── Aptitude ──
  {
    title: 'Time & Work: Combined Work and Pipe Cistern Formula',
    topic: 'Aptitude',
    subTopic: 'Quantitative Aptitude',
    difficulty: 'Easy',
    companies: ['TCS NQT', 'Infosys DSE', 'Wipro Elite', 'Cognizant', 'Accenture'],
    question: 'A can complete a piece of work in 12 days, and B can complete the same work in 18 days. If they work together for 4 days and then A leaves, how many days will B take to finish the remaining work?',
    solution: '• Step 1: Find total work using LCM of 12 and 18. LCM(12, 18) = 36 units.\n• Step 2: Calculate daily efficiency:\n  Efficiency of A = 36 / 12 = 3 units/day.\n  Efficiency of B = 36 / 18 = 2 units/day.\n  Combined efficiency (A + B) = 3 + 2 = 5 units/day.\n• Step 3: Work completed in 4 days = 4 × 5 = 20 units.\n• Step 4: Remaining work = 36 - 20 = 16 units.\n• Step 5: Time taken by B alone = Remaining work / Efficiency of B = 16 / 2 = 8 days.',
    language: 'text',
    keyPoints: [
      'Always use the LCM unitary method instead of fractions (1/12 + 1/18) to compute in seconds without errors.',
      'Efficiency = Total Work / Time taken.',
      'Remaining work = Total Work - Completed Work.'
    ],
    tips: 'The LCM technique saves 70% calculation time during TCS NQT and Cognizant assessment rounds.',
    isOfficial: true,
  },
  {
    title: 'Trains & Relative Speed Calculation',
    topic: 'Aptitude',
    subTopic: 'Speed, Distance & Time',
    difficulty: 'Medium',
    companies: ['TCS NQT', 'Infosys', 'Wipro', 'Capgemini'],
    question: 'Two trains of length 150m and 120m are running on parallel tracks in opposite directions at speeds of 60 km/h and 48 km/h respectively. In what time will they cross each other?',
    solution: '• Step 1: Total distance to cover = Sum of lengths of both trains = 150m + 120m = 270 meters.\n• Step 2: When moving in OPPOSITE directions, Relative Speed = Speed1 + Speed2 = 60 + 48 = 108 km/h.\n• Step 3: Convert km/h to m/s by multiplying by (5 / 18):\n  108 × (5 / 18) = 6 × 5 = 30 m/s.\n• Step 4: Time taken = Total Distance / Relative Speed = 270 / 30 = 9 seconds.',
    language: 'text',
    keyPoints: [
      'Opposite directions: Add speeds (S1 + S2).',
      'Same direction: Subtract speeds (|S1 - S2|).',
      'Conversion: 1 km/h = 5/18 m/s; 1 m/s = 18/5 km/h.',
      'Distance when crossing each other is ALWAYS the sum of lengths.'
    ],
    tips: 'Double check units! Speed in km/h must be converted before dividing meters.',
    isOfficial: true,
  },

  // ── HR & Behavioral ──
  {
    title: 'Tell Me About Yourself (The 90-Second Framework)',
    topic: 'HR',
    subTopic: 'Self Introduction',
    difficulty: 'Easy',
    companies: ['All Companies', 'Google', 'Amazon', 'TCS', 'Infosys', 'Accenture'],
    question: 'How should you answer "Tell me about yourself" in campus placement interviews without reciting your resume line by line?',
    solution: 'Use the 3-Part Past-Present-Future Formula:\n\n1. Present (30s): Who you are right now — degree, branch at Sahyadri College, core technical strengths (e.g., MERN stack, Java DSA, cloud).\n2. Past (30s): 1-2 highlight projects or internships where you solved a real problem with metrics (e.g. built a placement analytics tool handling 500+ records).\n3. Future (30s): Why this specific company and role is the natural next step where you want to contribute and grow.',
    language: 'text',
    keyPoints: [
      'Keep it strictly between 60 to 90 seconds.',
      'Do not recite 10th and 12th marks unless asked.',
      'Conclude with enthusiasm: "And that is why I am really excited about this Software Engineer opportunity at [Company]."'
    ],
    tips: 'Practice delivering this aloud without reading. This question sets the tone and anchors the rest of the interview.',
    isOfficial: true,
  },
  {
    title: 'The STAR Method for Behavioral Questions ("Tell me about a challenge you faced")',
    topic: 'HR',
    subTopic: 'Behavioral & Leadership',
    difficulty: 'Medium',
    companies: ['Amazon', 'Google', 'Swiggy', 'TCS', 'Infosys'],
    question: 'How do you answer behavioral questions like "Tell me about a time you had a deadline crunch or conflict in your team"?',
    solution: 'Structure every behavioral answer using the STAR method:\n\n• Situation (20%): Set the context briefly (e.g., final year capstone project with a 3-week deadline).\n• Task (10%): What was your specific responsibility?\n• Action (50%): The concrete actions YOU took (facilitated daily standup, refactored bottleneck API, resolved disagreement objectively).\n• Result (20%): Measurable outcome & what you learned (delivered on time, reduced latency by 35%, received best project award).',
    language: 'text',
    keyPoints: [
      'Use "I" instead of only "we" to highlight your personal contribution.',
      'Never badmouth team members or college faculty.',
      'Focus the majority of your time on the Action section.'
    ],
    tips: 'Amazon particularly evaluates every interview round against their 16 Leadership Principles using this format.',
    isOfficial: true,
  }
];

// Curated Company Recruitment Guides
const COMPANY_PREP_GUIDES = [
  {
    id: 'tcs',
    name: 'TCS (Tata Consultancy Services)',
    industry: 'IT Services & Consulting',
    roles: ['Ninja (3.6 LPA)', 'Digital (7.0 LPA)', 'Prime (9.0 LPA)'],
    packageRange: { min: 3.6, max: 9.0 },
    rounds: [
      {
        roundNo: 1,
        title: 'TCS NQT (National Qualifier Test)',
        type: 'Online Assessment (165 mins)',
        description: 'Section 1: Cognitive (Numerical, Verbal, Reasoning Ability). Section 2: Advanced Cognitive. Section 3: Advanced Coding (2 problems in C/C++/Java/Python).',
        tips: 'Focus heavily on the LCM unitary method, speed distance, and clean string/array algorithms.'
      },
      {
        roundNo: 2,
        title: 'Technical Interview',
        type: 'Technical (30-45 mins)',
        description: 'Questions on OOPs concepts, SQL joins and subqueries, your final year academic project, and live coding for prime numbers, palindrome, or sorting.',
        tips: 'Be ready to explain every library and framework listed on your resume.'
      },
      {
        roundNo: 3,
        title: 'Managerial & HR Interview',
        type: 'HR (20 mins)',
        description: 'Willingness to relocate, night shifts, handling work pressure, and situational questions.',
        tips: 'Express full flexibility regarding location and technologies.'
      }
    ],
    syllabus: [
      'Aptitude: Percentages, Profit/Loss, Time & Work, Permutations, Syllogisms',
      'Coding: Array manipulation, String parsing, Hash Tables, Matrix operations',
      'Core CS: DBMS (Normalization, Joins), OOP (Polymorphism, Inheritance), OS fundamentals'
    ]
  },
  {
    id: 'infosys',
    name: 'Infosys',
    industry: 'IT & Digital Services',
    roles: ['Systems Engineer (3.6 LPA)', 'DSE (6.25 LPA)', 'Specialist Programmer (9.5 LPA)'],
    packageRange: { min: 3.6, max: 9.5 },
    rounds: [
      {
        roundNo: 1,
        title: 'Online Aptitude & Coding Assessment',
        type: 'Online Test (100 mins)',
        description: 'Sections: Reasoning Ability (15 Qs), Technical Ability (10 Qs), Verbal Ability (20 Qs), Pseudocode (5 Qs), and Hands-on Coding (2-3 Qs depending on role track).',
        tips: 'Pseudocode round checks pointer arithmetic and recursion step analysis.'
      },
      {
        roundNo: 2,
        title: 'Technical & Academic Interview',
        type: 'Technical (30 mins)',
        description: 'Deep dive into data structures (Linked Lists, Binary Trees), database indexing, web technologies, and code debugging.',
        tips: 'Explain your reasoning aloud while writing pseudo-code.'
      },
      {
        roundNo: 3,
        title: 'HR Discussion',
        type: 'Behavioral (15 mins)',
        description: 'Career goals, Infosys training campus at Mysore, adaptability, and background verification.',
        tips: 'Show enthusiasm about learning modern cloud/AI stacks.'
      }
    ],
    syllabus: [
      'Data Structures: Stacks, Queues, Linked Lists, Binary Trees, Hash Maps',
      'Database: SQL queries, ACID properties, Indexing types',
      'Aptitude: Data Interpretation, Syllogisms, Series Completion, Logical Venn'
    ]
  },
  {
    id: 'amazon',
    name: 'Amazon',
    industry: 'Product & Cloud / E-Commerce',
    roles: ['Software Development Engineer (SDE-1)', 'Cloud Support Associate', 'Data Engineer'],
    packageRange: { min: 14.0, max: 28.0 },
    rounds: [
      {
        roundNo: 1,
        title: 'Online Assessment (OA)',
        type: 'Online Test (90 mins)',
        description: '2 Coding questions (Medium/Hard DSA) on Hackerrank/AMCAT platform + Amazon Work Style Assessment (Behavioral simulation based on Amazon Leadership Principles).',
        tips: 'Optimize for both time and space complexity. All hidden test cases must pass.'
      },
      {
        roundNo: 2,
        title: 'Technical Interview 1: Data Structures',
        type: 'Live Coding (60 mins)',
        description: 'Focus on Arrays, Strings, Heaps, and Dynamic Programming. Candidates code in a shared editor without auto-complete.',
        tips: 'State brute force first, then optimize to target complexity before writing a single line of code.'
      },
      {
        roundNo: 3,
        title: 'Technical Interview 2: Algorithms & Low Level Design',
        type: 'Live Coding & Design (60 mins)',
        description: 'Graphs (BFS/DFS, Dijkstra), Tree traversals, or object-oriented design for a component (e.g., Parking Lot, Deck of Cards).',
        tips: 'Clean code, modular functions, and edge case validation are scrutinized.'
      },
      {
        roundNo: 4,
        title: 'Bar Raiser & Leadership Principles',
        type: 'Senior Tech + Behavioral (60 mins)',
        description: 'Evaluated by a certified Bar Raiser. In-depth questions testing "Customer Obsession", "Ownership", "Invent & Simplify", and "Bias for Action" via STAR method.',
        tips: 'Prepare 4-5 genuine project stories mapped to specific Amazon leadership principles.'
      }
    ],
    syllabus: [
      'DSA: Graphs, Dynamic Programming, Heaps, Sliding Window, Two Pointers, Trees',
      'System Design / OOD: OOP design patterns, SOLID principles, Schema design',
      'Leadership Principles: Customer Obsession, Ownership, Dive Deep, Bias for Action'
    ]
  },
  {
    id: 'google',
    name: 'Google',
    industry: 'Product & Technology',
    roles: ['Software Engineer (L3)', 'Associate Cloud Engineer', 'Application Engineer'],
    packageRange: { min: 18.0, max: 35.0 },
    rounds: [
      {
        roundNo: 1,
        title: 'Google Online Challenge (GOC)',
        type: 'Online Test (60 mins)',
        description: '2 Algorithmic coding challenges testing graph theory, dynamic programming, or mathematical combinatorics.',
        tips: 'Write bug-free code handling large constraints ($10^5$).'
      },
      {
        roundNo: 2,
        title: 'Technical Phone Screen',
        type: 'Live Coding on Google Docs (45 mins)',
        description: 'Real-time problem solving without syntax highlighting. Tests analytical thinking and communication under pressure.',
        tips: 'Talk through your mental model constantly.'
      },
      {
        roundNo: 3,
        title: 'Onsite / Virtual Rounds (3-4 Rounds)',
        type: 'Coding, Algorithms & Googlyness (45 mins each)',
        description: 'Data structures, algorithm design, edge case rigor, and "Googlyness" (navigating ambiguity, collaborative spirit, intellectual humility).',
        tips: 'Ask clarifying questions about constraints and null inputs before coding.'
      }
    ],
    syllabus: [
      'Advanced DSA: Graph algorithms (Topological sort, Union-Find), DP with Bitmask, Tries',
      'Math & Logic: Modulo arithmetic, Prime sieves, Probability',
      'Behavioral: Intellectual curiosity, handling feedback, collaborative engineering'
    ]
  },
  {
    id: 'wipro',
    name: 'Wipro',
    industry: 'IT Services',
    roles: ['Project Engineer - Elite (3.5 LPA)', 'Turbo (6.5 LPA)'],
    packageRange: { min: 3.5, max: 6.5 },
    rounds: [
      {
        roundNo: 1,
        title: 'Elite National Talent Hunt (NLTH)',
        type: 'Online Assessment (128 mins)',
        description: 'Aptitude Test (Logical, Quantitative, English), Written Communication Test (Essay writing evaluated by AI engine), and Online Coding (2 problems).',
        tips: 'In essay writing, avoid grammatical errors and maintain proper paragraph structure.'
      },
      {
        roundNo: 2,
        title: 'Technical & HR Composite Interview',
        type: 'Interview (30 mins)',
        description: 'Questions on final year engineering project, core programming language basics, and willingness to work across different domains.',
        tips: 'Be confident in at least one object-oriented programming language.'
      }
    ],
    syllabus: [
      'Aptitude: Number system, Speed Time Distance, Blood Relations, Coding Decoding',
      'Coding: Array sorting, String reversals, Pattern printing, Basic recursion',
      'Core CS: C/C++/Java fundamentals, Basic SQL queries'
    ]
  },
  {
    id: 'swiggy',
    name: 'Swiggy',
    industry: 'Consumer Tech / Product',
    roles: ['Software Development Engineer 1 (SDE-1)', 'QA Engineer'],
    packageRange: { min: 12.0, max: 20.0 },
    rounds: [
      {
        roundNo: 1,
        title: 'Machine Coding Round',
        type: 'Clean Coding & Architecture (90 mins)',
        description: 'Candidates are given a problem statement (e.g. In-memory Cache, Splitwise, Ride Sharing) and must write fully working, modular, extensible object-oriented code.',
        tips: 'Focus on separation of concerns, interfaces, and unit testability.'
      },
      {
        roundNo: 2,
        title: 'Problem Solving & DSA',
        type: 'Live Coding (60 mins)',
        description: 'Medium to hard problems involving Trees, Hash Maps, Priority Queues, and Concurrency basics.',
        tips: 'Write clean variable names and discuss trade-offs.'
      },
      {
        roundNo: 3,
        title: 'Engineering Fundamentals & Culture Fit',
        type: 'Managerial (45 mins)',
        description: 'HTTP protocol, REST APIs, databases, indexes, caching with Redis, and situational teamwork questions.',
        tips: 'Demonstrate enthusiasm for high-scale distributed backend systems.'
      }
    ],
    syllabus: [
      'Clean Code: SOLID principles, Factory & Observer design patterns',
      'DSA: Trees, Graphs, Hash Maps, Two Pointers',
      'Backend Basics: REST API, SQL vs NoSQL, Caching concepts'
    ]
  }
];

// ── GET /api/prep/questions — fetch all questions with search & filters
router.get('/questions', protect, async (req, res) => {
  try {
    const { topic, company, difficulty, search } = req.query;

    // Check if collection is empty; if so, seed standard campus questions
    const count = await PrepQuestion.countDocuments();
    if (count === 0) {
      await PrepQuestion.insertMany(SEED_QUESTIONS);
    }

    const query = {};
    if (topic && topic !== 'All') {
      query.topic = topic;
    }
    if (difficulty && difficulty !== 'All') {
      query.difficulty = difficulty;
    }
    if (company && company !== 'All') {
      query.companies = { $in: [new RegExp(company, 'i')] };
    }
    if (search && search.trim()) {
      const q = search.trim();
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { question: { $regex: q, $options: 'i' } },
        { subTopic: { $regex: q, $options: 'i' } },
        { companies: { $in: [new RegExp(q, 'i')] } },
      ];
    }

    const questions = await PrepQuestion.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      total: questions.length,
      data: questions,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── POST /api/prep/questions — add a new question to the bank
router.post('/questions', protect, async (req, res) => {
  try {
    const { title, topic, subTopic, difficulty, companies, question, solution, codeSnippet, language, keyPoints, tips } = req.body;

    if (!title || !topic || !question || !solution) {
      return res.status(400).json({
        success: false,
        message: 'Title, Topic, Question statement, and Solution are required.'
      });
    }

    const newQuestion = await PrepQuestion.create({
      title,
      topic,
      subTopic: subTopic || '',
      difficulty: difficulty || 'Medium',
      companies: Array.isArray(companies) ? companies : (companies ? companies.split(',').map(c => c.trim()) : []),
      question,
      solution,
      codeSnippet: codeSnippet || '',
      language: language || 'text',
      keyPoints: Array.isArray(keyPoints) ? keyPoints : [],
      tips: tips || '',
      createdBy: req.user._id,
      isOfficial: req.user.role === 'admin',
    });

    res.status(201).json({
      success: true,
      message: 'Question added to the Question Bank successfully!',
      data: newQuestion
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── PUT /api/prep/questions/:id/like — upvote/like a question
router.put('/questions/:id/like', protect, async (req, res) => {
  try {
    const question = await PrepQuestion.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );
    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }
    res.json({ success: true, likes: question.likes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET /api/prep/companies — fetch curated company recruitment & preparation guides
router.get('/companies', protect, async (req, res) => {
  try {
    res.json({
      success: true,
      total: COMPANY_PREP_GUIDES.length,
      data: COMPANY_PREP_GUIDES,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
