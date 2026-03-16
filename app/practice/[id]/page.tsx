"use client"

import { useState, useEffect, use } from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import Editor from "@monaco-editor/react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import {
  ArrowLeft,
  Play,
  Send,
  RotateCcw,
  Settings,
  CheckCircle2,
  XCircle,
  Clock,
  Code2,
  FileText,
  Lightbulb,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Copy,
  Check,
  Bot,
  SendHorizonal,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { markSolved, getSolvedProblemIds } from "@/lib/supabase/solved"
import { useRef } from "react"
import ReactMarkdown from "react-markdown"

const problemsData: Record<number, {
  id: number
  title: string
  difficulty: string
  description: string
  examples: Array<{ input: string; output: string; explanation?: string }>
  constraints: string[]
  hints: string[]
  starterCode: Record<string, string>
  testCases: Array<{ input: string; expected: string }>
}> = {
  1: {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]",
      },
      {
        input: "nums = [3,3], target = 6",
        output: "[0,1]",
      },
    ],
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists.",
    ],
    hints: [
      "A really brute force way would be to search for all possible pairs of numbers but that would be too slow.",
      "Try using a hash map to store the numbers you've seen so far.",
      "For each number, check if target - number exists in the hash map.",
    ],
    starterCode: {
      python: `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        # Write your code here
        pass`,
      javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    // Write your code here
    
};`,
      cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Write your code here
        
    }
};`,
      java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your code here
        
    }
}`,
    },
    testCases: [
      { input: "[2,7,11,15]\n9", expected: "[0,1]" },
      { input: "[3,2,4]\n6", expected: "[1,2]" },
      { input: "[3,3]\n6", expected: "[0,1]" },
    ],
  },
  2: {
    id: 2,
    title: "Add Two Numbers",
    difficulty: "Medium",
    description: `You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.

You may assume the two numbers do not contain any leading zero, except the number 0 itself.`,
    examples: [
      {
        input: "l1 = [2,4,3], l2 = [5,6,4]",
        output: "[7,0,8]",
        explanation: "342 + 465 = 807.",
      },
      {
        input: "l1 = [0], l2 = [0]",
        output: "[0]",
      },
      {
        input: "l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]",
        output: "[8,9,9,9,0,0,0,1]",
      },
    ],
    constraints: [
      "The number of nodes in each linked list is in the range [1, 100].",
      "0 <= Node.val <= 9",
      "It is guaranteed that the list represents a number that does not have leading zeros.",
    ],
    hints: [
      "Traverse both lists simultaneously, adding corresponding digits.",
      "Keep track of the carry and add it to the next calculation.",
      "Handle the case where lists have different lengths.",
    ],
    starterCode: {
      python: `# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution:
    def addTwoNumbers(self, l1: Optional[ListNode], l2: Optional[ListNode]) -> Optional[ListNode]:
        # Write your code here
        pass`,
      javascript: `/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
var addTwoNumbers = function(l1, l2) {
    // Write your code here
    
};`,
      cpp: `/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode() : val(0), next(nullptr) {}
 *     ListNode(int x) : val(x), next(nullptr) {}
 *     ListNode(int x, ListNode *next) : val(x), next(next) {}
 * };
 */
class Solution {
public:
    ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {
        // Write your code here
        
    }
};`,
      java: `/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
class Solution {
    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
        // Write your code here
        
    }
}`,
    },
    testCases: [
      { input: "[2,4,3]\n[5,6,4]", expected: "[7,0,8]" },
      { input: "[0]\n[0]", expected: "[0]" },
      { input: "[9,9,9,9,9,9,9]\n[9,9,9,9]", expected: "[8,9,9,9,0,0,0,1]" },
    ],
  },
  3: {
    id: 3,
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    description: `Given a string \`s\`, find the length of the longest substring without repeating characters.`,
    examples: [
      {
        input: 's = "abcabcbb"',
        output: "3",
        explanation: 'The answer is "abc", with the length of 3.',
      },
      {
        input: 's = "bbbbb"',
        output: "1",
        explanation: 'The answer is "b", with the length of 1.',
      },
      {
        input: 's = "pwwkew"',
        output: "3",
        explanation: 'The answer is "wke", with the length of 3.',
      },
    ],
    constraints: [
      "0 <= s.length <= 5 * 10^4",
      "s consists of English letters, digits, symbols and spaces.",
    ],
    hints: [
      "Use a sliding window approach.",
      "Keep track of characters in the current window using a set or map.",
      "When you encounter a duplicate, shrink the window from the left.",
    ],
    starterCode: {
      python: `class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        # Write your code here
        pass`,
      javascript: `/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function(s) {
    // Write your code here
    
};`,
      cpp: `class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        // Write your code here
        
    }
};`,
      java: `class Solution {
    public int lengthOfLongestSubstring(String s) {
        // Write your code here
        
    }
}`,
    },
    testCases: [
      { input: '"abcabcbb"', expected: "3" },
      { input: '"bbbbb"', expected: "1" },
      { input: '"pwwkew"', expected: "3" },
    ],
  },
}

// Generate default problem for IDs not in the data
const getDefaultProblem = (id: number) => ({
  id,
  title: `Problem ${id}`,
  difficulty: "Medium",
  description: `This is problem ${id}. Complete the solution below.`,
  examples: [
    { input: "Example input", output: "Example output", explanation: "This is an example." },
  ],
  constraints: ["Constraint 1", "Constraint 2"],
  hints: ["Think about the problem carefully.", "Consider edge cases."],
  starterCode: {
    python: `class Solution:
    def solve(self):
        # Write your code here
        pass`,
    javascript: `/**
 * @return {any}
 */
var solve = function() {
    // Write your code here
    
};`,
    cpp: `class Solution {
public:
    void solve() {
        // Write your code here
        
    }
};`,
    java: `class Solution {
    public void solve() {
        // Write your code here
        
    }
}`,
  },
  testCases: [
    { input: "test input", expected: "expected output" },
  ],
})

const difficultyColors: Record<string, string> = {
  Easy: "bg-green-500/10 text-green-500 border-green-500/20",
  Medium: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  Hard: "bg-red-500/10 text-red-500 border-red-500/20",
}

export default function ProblemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const problemId = parseInt(id)
  const problem = problemsData[problemId] || getDefaultProblem(problemId)

  const { theme, systemTheme } = useTheme()
  const currentTheme = theme === "system" ? systemTheme : theme

  const [language, setLanguage] = useState("python")
  const [code, setCode] = useState(problem.starterCode.python)
  const [activeTab, setActiveTab] = useState("description")
  const [outputTab, setOutputTab] = useState("testcase")
  const [isRunning, setIsRunning] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [testResults, setTestResults] = useState<Array<{ passed: boolean; input: string; expected: string; actual: string; error?: string }> | null>(null)
  const [currentHint, setCurrentHint] = useState(0)
  const [copied, setCopied] = useState(false)
  const [isSolved, setIsSolved] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [chatMessages, setChatMessages] = useState<Array<{ role: "user" | "ai"; text: string }>>([])
  const [chatInput, setChatInput] = useState("")
  const [isChatLoading, setIsChatLoading] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  // Load user + check if already solved
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async (response: any) => {
      const data = response.data
      if (data.user) {
        setUserId(data.user.id)
        const ids = await getSolvedProblemIds(data.user.id)
        setIsSolved(ids.has(problemId))
      }
    })
  }, [problemId])

  const runWithWorker = (sourceCode: string, stdin: string): Promise<{ run: { stdout?: string; stderr?: string } }> => {
    return new Promise((resolve) => {
      const worker = new Worker("/worker.js");
      const timeout = setTimeout(() => {
        worker.terminate();
        resolve({ run: { stderr: "Execution timed out (possible infinite loop)" } });
      }, 5000);
      worker.onmessage = (e) => {
        clearTimeout(timeout);
        worker.terminate();
        if (e.data.type === "success") resolve({ run: { stdout: e.data.output } });
        else resolve({ run: { stderr: e.data.error } });
      };
      worker.postMessage({ code: sourceCode, stdin });
    });
  }

  useEffect(() => {
    setCode(problem.starterCode[language as keyof typeof problem.starterCode] || problem.starterCode.python)
  }, [language, problem.starterCode])

  const handleRun = async () => {
    if (!code.trim()) return;
    if (language !== "javascript") {
      setTestResults([{ passed: false, input: "", expected: "", actual: "", error: `${language.toUpperCase()} execution is coming soon. Please use JavaScript.` }]);
      setOutputTab("result");
      return;
    }
    setIsRunning(true);
    setOutputTab("result");
    setTestResults(null);
    try {
      const results = await Promise.all(problem.testCases.map(async (tc) => {
        const res = await runWithWorker(code, tc.input);
        const actual = res.run?.stdout?.trim() || "";
        const error = res.run?.stderr?.trim() || "";
        const passed = !error && actual === tc.expected.trim();
        return { passed, input: tc.input, expected: tc.expected, actual: actual || "(no output)", error: error || undefined };
      }));
      setTestResults(results);
    } catch (err) {
      setTestResults([{ passed: false, input: "", expected: "", actual: "", error: "Execution failed." }]);
    } finally {
      setIsRunning(false);
    }
  }

  const handleSubmit = async () => {
    if (!code.trim()) return;
    if (language !== "javascript") {
      setTestResults([{ passed: false, input: "", expected: "", actual: "", error: `${language.toUpperCase()} execution is coming soon. Please use JavaScript.` }]);
      setOutputTab("result");
      return;
    }
    setIsSubmitting(true);
    setOutputTab("result");
    setTestResults(null);
    try {
      const results = await Promise.all(problem.testCases.map(async (tc) => {
        const res = await runWithWorker(code, tc.input);
        const actual = res.run?.stdout?.trim() || "";
        const error = res.run?.stderr?.trim() || "";
        const passed = !error && actual === tc.expected.trim();
        return { passed, input: tc.input, expected: tc.expected, actual: actual || "(no output)", error: error || undefined };
      }));
      setTestResults(results);
      if (results.every(r => r.passed) && userId) {
        await markSolved(userId, problemId);
        setIsSolved(true);
      }
    } catch (err) {
      setTestResults([{ passed: false, input: "", expected: "", actual: "", error: "Execution failed." }]);
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleReset = () => {
    setCode(problem.starterCode[language as keyof typeof problem.starterCode] || problem.starterCode.python)
    setTestResults(null)
  }

  const copyCode = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const sendChatMessage = async () => {
    if (!chatInput.trim() || isChatLoading) return
    const userMsg = chatInput.trim()
    setChatInput("")
    setChatMessages(prev => [...prev, { role: "user", text: userMsg }])
    setIsChatLoading(true)
    try {
      const systemContext = `You are a helpful coding assistant for a competitive programming platform. The user is solving this problem:

Title: ${problem.title}
Difficulty: ${problem.difficulty}
Description: ${problem.description}

The user is coding in ${language}. Their current code:
${code}

Help them understand the problem, debug their code, or explain concepts. Be concise and clear.`

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: systemContext }]
          },
          contents: [
            ...chatMessages.map(m => ({
              role: m.role === "user" ? "user" : "model",
              parts: [{ text: m.text }]
            })),
            { role: "user", parts: [{ text: userMsg }]}
          ],
        }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data?.error?.message || JSON.stringify(data))
      
      const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a response."
      setChatMessages(prev => [...prev, { role: "ai", text: aiText }])
    } catch (err) {
      setChatMessages(prev => [...prev, { role: "ai", text: `Error: ${err instanceof Error ? err.message : "Failed to connect to AI."}` }])
    } finally {
      setIsChatLoading(false)
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100)
    }
  }

  return (
    <main className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Top Bar */}
      <header className="h-14 min-h-14 border-b border-border bg-card/50 backdrop-blur-xl flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <Link
            href="/practice"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Problem List</span>
          </Link>
          <div className="h-6 w-px bg-border" />
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="h-8 w-8" disabled={problemId <= 1}>
              <Link href={`/practice/${problemId - 1}`}>
                <ChevronLeft className="h-4 w-4" />
              </Link>
            </Button>
            <span className="text-sm text-muted-foreground">
              {problem.id}. {problem.title}
            </span>
            <Button variant="ghost" size="icon" className="h-8 w-8" disabled={problemId >= 15}>
              <Link href={`/practice/${problemId + 1}`}>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={difficultyColors[problem.difficulty]}>{problem.difficulty}</Badge>
          {isSolved && (
            <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
              <CheckCircle2 className="h-3 w-3 mr-1" /> Solved
            </Badge>
          )}
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <ResizablePanelGroup direction="horizontal" className="flex-1 min-h-0">
        {/* Left Panel - Problem Description */}
        <ResizablePanel defaultSize={40} minSize={30}>
          <div className="h-full flex flex-col bg-card/50 backdrop-blur-xl overflow-hidden">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0 overflow-hidden">
              <TabsList className="w-full justify-start rounded-none border-b border-border bg-transparent h-10 px-4">
                <TabsTrigger
                  value="description"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Description
                </TabsTrigger>
                <TabsTrigger
                  value="hints"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                >
                  <Lightbulb className="h-4 w-4 mr-2" />
                  Hints
                </TabsTrigger>
                <TabsTrigger
                  value="discussion"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Discussion
                </TabsTrigger>
                <TabsTrigger
                  value="ai"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                >
                  <Bot className="h-4 w-4 mr-2" />
                  AI Assistant
                </TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="flex-1 overflow-y-auto p-4 m-0 min-h-0">
                <div className="prose prose-invert max-w-none">
                  <h2 className="text-xl font-bold text-foreground mb-4">{problem.title}</h2>
                  <div className="text-sm text-foreground/90 whitespace-pre-wrap mb-6">
                    {problem.description}
                  </div>

                  <div className="space-y-4 mb-6">
                    {problem.examples.map((example, i) => (
                      <Card key={i} className="bg-muted/30 border-border">
                        <CardHeader className="py-3 px-4">
                          <CardTitle className="text-sm font-medium">Example {i + 1}</CardTitle>
                        </CardHeader>
                        <CardContent className="py-2 px-4 space-y-2">
                          <div>
                            <span className="text-xs text-muted-foreground">Input:</span>
                            <code className="block mt-1 text-sm bg-background/50 p-2 rounded font-mono text-foreground">
                              {example.input}
                            </code>
                          </div>
                          <div>
                            <span className="text-xs text-muted-foreground">Output:</span>
                            <code className="block mt-1 text-sm bg-background/50 p-2 rounded font-mono text-foreground">
                              {example.output}
                            </code>
                          </div>
                          {example.explanation && (
                            <div>
                              <span className="text-xs text-muted-foreground">Explanation:</span>
                              <p className="mt-1 text-sm text-foreground/80">{example.explanation}</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-2">Constraints:</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {problem.constraints.map((constraint, i) => (
                        <li key={i} className="text-sm text-muted-foreground font-mono">
                          {constraint}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="hints" className="flex-1 overflow-y-auto p-4 m-0 min-h-0">
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground">Hints</h3>
                  {problem.hints.map((hint, i) => (
                    <Card
                      key={i}
                      className={`bg-muted/30 border-border transition-opacity ${
                        i > currentHint ? "opacity-40" : ""
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="p-1.5 rounded bg-primary/10">
                            <Lightbulb className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground mb-1">
                              Hint {i + 1}
                            </p>
                            {i <= currentHint ? (
                              <p className="text-sm text-foreground">{hint}</p>
                            ) : (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setCurrentHint(i)}
                                className="text-primary hover:text-primary"
                              >
                                Reveal hint
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="discussion" className="flex-1 overflow-y-auto p-4 m-0 min-h-0">
                <div className="text-center py-12 text-muted-foreground">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Discussion feature coming soon!</p>
                  <p className="text-sm mt-2">Share solutions and discuss approaches with the community.</p>
                </div>
              </TabsContent>

              <TabsContent value="ai" className="flex-1 flex flex-col m-0 min-h-0 overflow-hidden">
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {chatMessages.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Bot className="h-10 w-10 mx-auto mb-3 opacity-50" />
                      <p className="text-sm font-medium">AI Assistant</p>
                      <p className="text-xs mt-1">Ask me to explain the problem, give hints, or debug your code.</p>
                      <div className="mt-4 space-y-2">
                        {["Explain this problem", "Give me a hint", "What's the optimal approach?"].map(s => (
                          <button key={s} onClick={() => { setChatInput(s); }} className="block w-full text-left text-xs bg-muted/40 hover:bg-muted/70 border border-border rounded px-3 py-2 transition-colors">
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {chatMessages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[85%] rounded-lg px-3 py-2 text-xs ${
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted/50 border border-border text-foreground"
                      }`}>
                        {msg.role === "user" ? msg.text : (
                          <ReactMarkdown
                            components={{
                              p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                              strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                              ul: ({ children }) => <ul className="list-disc list-inside space-y-1 mb-2">{children}</ul>,
                              ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 mb-2">{children}</ol>,
                              li: ({ children }) => <li className="ml-2">{children}</li>,
                              code: ({ children, className }) => className
                                ? <code className="block bg-background/70 rounded p-2 font-mono my-1 whitespace-pre-wrap">{children}</code>
                                : <code className="bg-background/70 rounded px-1 font-mono">{children}</code>,
                              h1: ({ children }) => <h1 className="font-bold text-sm mb-1">{children}</h1>,
                              h2: ({ children }) => <h2 className="font-bold text-sm mb-1">{children}</h2>,
                              h3: ({ children }) => <h3 className="font-semibold mb-1">{children}</h3>,
                            }}
                          >
                            {msg.text}
                          </ReactMarkdown>
                        )}
                      </div>
                    </div>
                  ))}
                  {isChatLoading && (
                    <div className="flex justify-start">
                      <div className="bg-muted/50 border border-border rounded-lg px-3 py-2 text-xs text-muted-foreground">
                        Thinking...
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>
                <div className="border-t border-border p-3 flex gap-2">
                  <input
                    className="flex-1 bg-muted/30 border border-border rounded px-3 py-1.5 text-xs outline-none focus:border-primary"
                    placeholder="Ask anything about this problem..."
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendChatMessage()}
                  />
                  <Button size="icon" className="h-8 w-8 shrink-0" onClick={sendChatMessage} disabled={isChatLoading || !chatInput.trim()}>
                    <SendHorizonal className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Right Panel - Code Editor & Output */}
        <ResizablePanel defaultSize={60} minSize={40}>
          <ResizablePanelGroup direction="vertical">
            {/* Code Editor */}
            <ResizablePanel defaultSize={65} minSize={30}>
              <div className="h-full flex flex-col bg-background">
                {/* Editor Header */}
                <div className="h-10 border-b border-border bg-card/50 backdrop-blur-xl flex items-center justify-between px-4">
                  <div className="flex items-center gap-3">
                    <Code2 className="h-4 w-4 text-primary" />
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger className="w-[140px] h-7 text-xs bg-background border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="javascript">JavaScript</SelectItem>
                        <SelectItem value="python">Python 3</SelectItem>
                        <SelectItem value="cpp">C++</SelectItem>
                        <SelectItem value="java">Java</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={copyCode}
                    >
                      {copied ? (
                        <Check className="h-3 w-3 mr-1" />
                      ) : (
                        <Copy className="h-3 w-3 mr-1" />
                      )}
                      {copied ? "Copied" : "Copy"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={handleReset}
                    >
                      <RotateCcw className="h-3 w-3 mr-1" />
                      Reset
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <Maximize2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {/* Code Textarea */}
                <div className="flex-1 relative">
                  <Editor
                    height="100%"
                    language={language === "cpp" ? "cpp" : language === "java" ? "java" : language === "python" ? "python" : "javascript"}
                    theme={currentTheme === "dark" ? "vs-dark" : "light"}
                    value={code}
                    onChange={(value) => setCode(value || "")}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      scrollBeyondLastLine: false,
                      wordWrap: "on",
                      automaticLayout: true,
                      padding: { top: 16 }
                    }}
                    loading={<div className="flex bg-background h-full items-center justify-center text-muted-foreground text-sm">Loading editor...</div>}
                  />
                </div>
              </div>
            </ResizablePanel>

            <ResizableHandle withHandle />

            {/* Output Panel */}
            <ResizablePanel defaultSize={35} minSize={20}>
              <div className="h-full flex flex-col bg-card/50 backdrop-blur-xl overflow-hidden">
                <Tabs value={outputTab} onValueChange={setOutputTab} className="flex-1 flex flex-col min-h-0 overflow-hidden">
                  <div className="border-b border-border flex items-center justify-between pr-4">
                    <TabsList className="rounded-none bg-transparent h-10 px-4">
                      <TabsTrigger
                        value="testcase"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent text-xs"
                      >
                        Testcase
                      </TabsTrigger>
                      <TabsTrigger
                        value="result"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent text-xs"
                      >
                        Result
                      </TabsTrigger>
                    </TabsList>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={handleRun}
                        disabled={isRunning || isSubmitting}
                      >
                        <Play className="h-3 w-3 mr-1" />
                        {isRunning ? "Running..." : "Run"}
                      </Button>
                      <Button
                        size="sm"
                        className="h-7 text-xs bg-primary hover:bg-primary/90"
                        onClick={handleSubmit}
                        disabled={isRunning || isSubmitting}
                      >
                        <Send className="h-3 w-3 mr-1" />
                        {isSubmitting ? "Submitting..." : "Submit"}
                      </Button>
                    </div>
                  </div>

                  <TabsContent value="testcase" className="flex-1 overflow-y-auto p-4 m-0 min-h-0">
                    <div className="space-y-3">
                      {problem.testCases.map((tc, i) => (
                        <Card key={i} className="bg-muted/30 border-border">
                          <CardContent className="p-3">
                            <p className="text-xs text-muted-foreground mb-2">Case {i + 1}</p>
                            <div className="space-y-2">
                              <div>
                                <span className="text-xs text-muted-foreground">Input:</span>
                                <code className="block mt-1 text-xs bg-background/50 p-2 rounded font-mono text-foreground">
                                  {tc.input}
                                </code>
                              </div>
                              <div>
                                <span className="text-xs text-muted-foreground">Expected:</span>
                                <code className="block mt-1 text-xs bg-background/50 p-2 rounded font-mono text-foreground">
                                  {tc.expected}
                                </code>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="result" className="flex-1 overflow-y-auto p-4 m-0 min-h-0">
                    {isRunning || isSubmitting ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <Clock className="h-8 w-8 mx-auto mb-2 text-primary animate-spin" />
                          <p className="text-sm text-muted-foreground">
                            {isRunning ? "Running tests..." : "Submitting solution..."}
                          </p>
                        </div>
                      </div>
                    ) : testResults ? (
                      <div className="space-y-3">
                        <div
                          className={`flex items-center gap-2 p-3 rounded-lg ${
                            testResults.every((r) => r.passed)
                              ? "bg-green-500/10"
                              : "bg-red-500/10"
                          }`}
                        >
                          {testResults.every((r) => r.passed) ? (
                            <>
                              <CheckCircle2 className="h-5 w-5 text-green-500" />
                              <span className="font-medium text-green-500">All tests passed!</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="h-5 w-5 text-red-500" />
                              <span className="font-medium text-red-500">
                                {testResults.filter((r) => r.passed).length}/{testResults.length} tests passed
                              </span>
                            </>
                          )}
                        </div>
                        {testResults.map((result, i) => (
                          <Card
                            key={i}
                            className={`border ${
                              result.passed ? "border-green-500/30" : "border-red-500/30"
                            }`}
                          >
                            <CardContent className="p-3">
                              <div className="flex items-center gap-2 mb-2">
                                {result.passed ? (
                                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                                ) : (
                                  <XCircle className="h-4 w-4 text-red-500" />
                                )}
                                <span className="text-xs font-medium">Case {i + 1}</span>
                              </div>
                              <div className="space-y-2 text-xs">
                                <div>
                                  <span className="text-muted-foreground">Input:</span>
                                  <code className="block mt-1 bg-background/50 p-2 rounded font-mono">
                                    {result.input}
                                  </code>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Expected:</span>
                                  <code className="block mt-1 bg-background/50 p-2 rounded font-mono text-green-500">
                                    {result.expected}
                                  </code>
                                </div>
                                {result.error ? (
                                  <div>
                                    <span className="text-muted-foreground">Error Output:</span>
                                    <code className="block mt-1 bg-red-500/10 p-2 rounded font-mono text-red-500 whitespace-pre-wrap">
                                      {result.error}
                                    </code>
                                  </div>
                                ) : (
                                  <div>
                                    <span className="text-muted-foreground">Output:</span>
                                    <code
                                      className={`block mt-1 bg-background/50 p-2 rounded font-mono whitespace-pre-wrap ${
                                        result.passed ? "text-green-500" : "text-red-500"
                                      }`}
                                    >
                                      {result.actual}
                                    </code>
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full text-muted-foreground">
                        <p className="text-sm">Run your code to see results</p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  )
}
