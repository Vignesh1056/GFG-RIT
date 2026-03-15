const fs = require('fs');

const difficultyCategories = [
  { name: 'Warm-up Quests', difficulty: 'Easy', topics: ['Array', 'Math', 'String'] },
  { name: 'Rookie Challenges', difficulty: 'Medium', topics: ['Linked List', 'Stack', 'Two Pointers'] },
  { name: 'Elite Algorithms', difficulty: 'Hard', topics: ['Dynamic Programming', 'Trees', 'Graphs'] },
  { name: 'Grandmaster Trials', difficulty: 'Expert', topics: ['Backtracking', 'Binary Search', 'Trie'] },
];

let id = 1;
const problems = [];

const adjectives = ['Magic', 'Hidden', 'Maximum', 'Minimum', 'Unique', 'Sorted', 'Reverse', 'Valid', 'Longest', 'Shortest', 'Binary', 'Balanced', 'Circular', 'Perfect', 'Optimal', 'Random', 'Greedy', 'Bipartite', 'Continuous', 'Discrete'];
const nouns = ['Array', 'Subset', 'Substring', 'Path', 'Tree', 'Graph', 'Matrix', 'Number', 'Sequence', 'Permutation', 'Combination', 'Palindrome', 'String', 'List', 'Stack', 'Queue', 'Dictionary', 'Word', 'Digit', 'Characters'];
const verbs = ['Sum', 'Difference', 'Product', 'Division', 'Search', 'Sort', 'Merge', 'Find', 'Count', 'Generate', 'Validate', 'Calculate', 'Transform', 'Rotate', 'Shift', 'Flip', 'Swap', 'Remove', 'Add', 'Match'];

for (const cat of difficultyCategories) {
  for (let i = 0; i < 30; i++) {
    // Generate a unique-ish title
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const verb = verbs[Math.floor(Math.random() * verbs.length)];
    
    // Some variety in title structures
    let title = '';
    const pattern = Math.floor(Math.random() * 3);
    if (pattern === 0) title = `${verb} ${noun} ${adj}`;
    else if (pattern === 1) title = `${adj} ${noun} ${verb}`;
    else title = `${verb} ${adj} ${noun}`;

    problems.push({
      id: id,
      title: title,
      categoryName: cat.name,
      difficulty: cat.difficulty,
      category: cat.topics[Math.floor(Math.random() * cat.topics.length)], // just a generic programming category equivalent
      acceptance: (30 + Math.random() * 40).toFixed(1) + '%',
      solved: Math.random() > 0.8,
      topics: [cat.topics[Math.floor(Math.random() * cat.topics.length)]],
    });
    id++;
  }
}

const fileContent = `export interface Problem {
  id: number;
  title: string;
  categoryName: string;
  difficulty: string;
  category: string;
  acceptance: string;
  solved: boolean;
  topics: string[];
}

export const problems: Problem[] = ${JSON.stringify(problems, null, 2)};

export const categories = [
  "All",
  "Warm-up Quests",
  "Rookie Challenges",
  "Elite Algorithms",
  "Grandmaster Trials"
];
`;

fs.writeFileSync('lib/problems.ts', fileContent);
console.log('Saved to lib/problems.ts');
