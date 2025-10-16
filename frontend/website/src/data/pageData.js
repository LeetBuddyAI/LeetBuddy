import {
  Code2,
  Lightbulb,
  Puzzle,
  Workflow,
  MessageSquare,
  CircleHelp,
  Pencil,
  PencilRuler,
  BrainCircuit,
  Code,
  AlertTriangle,
  Bug,
} from "lucide-react";
import Amazon from "@assets/Amazon.svg";
import Apple from "@assets/Apple.svg";
import Autodesk from "@assets/Autodesk.svg";
import Google from "@assets/Google.svg";
import IBM from "@assets/IBM.svg";
import JaneStreet from "@assets/JaneStreet.svg";
import Meta from "@assets/Meta.svg";
import RedBullRacing from "@assets/RedBullRacing.svg";
import Roblox from "@assets/Roblox.svg";
import Snowflake from "@assets/Snowflake.svg";
import Tata from "@assets/Tata.svg";
import Tesla from "@assets/Tesla.svg";

// Page Meta

export const pageMeta = {
  home: {
    title: "LeetBuddy - Your AI-Powered LeetCode Assistant",
    description:
      "LeetBuddy is a free Chrome extension that helps you solve LeetCode problems with AI-powered explanations, hints, edge cases, and an interactive whiteboard. Improve your coding interview skills today.",
    canonicalPath: "/",
    structuredData: [
      {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "LeetBuddy",
        url: "https://leetbuddy.app",
        downloadUrl: import.meta.env.VITE_CHROME_STORE_URL,
        description:
          "AI-powered Chrome extension for solving LeetCode problems",
        applicationCategory: "DeveloperApplication",
        browserRequirements: "Requires Google Chrome",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        operatingSystem: "Windows, macOS, Linux, Chrome OS",
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.8",
          ratingCount: "39",
        },
        author: {
          "@type": "Organization",
          name: "LeetBuddy Team",
          url: "https://leetbuddy.app",
        },
      },
    ],
  },
  guide: {
    title: "Getting Started with LeetBuddy - Guide",
    description:
      "Learn how to use LeetBuddy effectively with our comprehensive guide. Discover tips, examples, and best practices for solving LeetCode problems.",
    canonicalPath: "/guide",
    structuredData: [
      {
        "@context": "https://schema.org",
        "@type": "HowTo",
        inLanguage: "en",
        name: "How to Use LeetBuddy for LeetCode Problems",
        description:
          "A comprehensive guide on using LeetBuddy's AI-powered features to solve LeetCode problems more effectively with hints, explanations, and whiteboard visualizations.",
        image: "https://leetbuddy.app/social-preview.png",
        totalTime: "PT5M",
        supply: [
          {
            "@type": "HowToSupply",
            name: "Google Chrome browser",
          },
          {
            "@type": "HowToSupply",
            name: "LeetBuddy Chrome extension",
          },
          {
            "@type": "HowToSupply",
            name: "LeetCode account",
          },
        ],
        tool: [
          {
            "@type": "HowToTool",
            name: "LeetBuddy Chrome Extension",
          },
        ],
        step: [
          {
            "@type": "HowToStep",
            name: "Install LeetBuddy",
            text: "Click 'Add to Chrome' on the Guide page to install the LeetBuddy extension.",
          },
          {
            "@type": "HowToStep",
            name: "Open a LeetCode Problem",
            text: "Navigate to any LeetCode problem you want to solve.",
          },
          {
            "@type": "HowToStep",
            name: "Use Chat Mode for Help",
            text: "Click the LeetBuddy icon and ask questions in natural language to get hints, explanations, or identify edge cases.",
          },
          {
            "@type": "HowToStep",
            name: "Use Whiteboard Mode for Visualization",
            text: "Press the 'Draw' button to draw diagrams to visualize algorithms and data structures. LeetBuddy can interpret your drawings and provide explanations.",
          },
          {
            "@type": "HowToStep",
            name: "Apply Tips for Better Results",
            text: "Use specific tags like 'Edge Cases', 'Hint', or 'Bug' and be specific with your questions for more targeted help.",
          },
        ],
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "Is LeetBuddy free to use?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes, LeetBuddy is completely free to use. We offer all features without any paywalls or subscription requirements.",
            },
          },
          {
            "@type": "Question",
            name: "Does LeetBuddy work on all LeetCode problems?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "LeetBuddy works with all LeetCode problems. It can analyze the problem statement, your code, and provide relevant assistance.",
            },
          },
          {
            "@type": "Question",
            name: "Which programming languages does LeetBuddy support?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "LeetBuddy supports all programming languages available on LeetCode.",
            },
          },
          {
            "@type": "Question",
            name: "Need more help?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "If you have any questions or need assistance, please reach out to our team at leetbuddyrsfn@gmail.com or visit our GitHub issues page at https://github.com/LeetBuddyAI/LeetBuddy/issues.",
            },
          },
        ],
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://leetbuddy.app",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Guide",
            item: "https://leetbuddy.app/guide",
          },
        ],
      },
    ],
  },
  notFound: {
    title: "404 - Page Not Found | LeetBuddy",
    description:
      "The page you're looking for doesn't exist. Return to LeetBuddy homepage to explore our AI-powered LeetCode assistant.",
    canonicalPath: null,
    structuredData: [],
  },
};

// Navbar

export const navigation = [
  {
    title: "Home",
    path: "/",
  },
  {
    title: "Guide",
    path: "/guide",
  },
];

// Footer

export const links = [
  {
    title: "Privacy Policy",
    target: "_blank",
    rel: "noopener noreferrer",
    aria: "Read LeetBuddy's Privacy Policy",
    url: "https://www.privacypolicies.com/live/ed0d8744-3343-43dc-9f23-3d68403aeb4d",
  },
  {
    title: "GitHub",
    target: "_blank",
    rel: "noopener noreferrer",
    aria: "Visit LeetBuddy on GitHub",
    url: "https://github.com/LeetBuddyAI",
  },
  {
    title: "Contact",
    target: undefined,
    rel: undefined,
    aria: "Contact LeetBuddy by email",
    url: "mailto:leetbuddyrsfn@gmail.com",
  },
];

// Home

export const features = [
  {
    feature: "Smart Hints",
    description:
      "Get contextual hints that guide you toward the solution without giving it away completely.",
    icon: Lightbulb,
  },
  {
    feature: "Edge Case Generator",
    description:
      "Automatically identify edge cases you might have missed in your solution.",
    icon: Puzzle,
  },
  {
    feature: "Code Explanation",
    description:
      "Get line-by-line explanations of solutions to better understand the approach.",
    icon: Code2,
  },
  {
    feature: "Interactive Whiteboard",
    description:
      "Visualize algorithms and data structures to better understand complex problems.",
    icon: Workflow,
  },
];

export const steps = [
  {
    step: "Install",
    description:
      "Add the LeetBuddy extension to your Chrome browser with just one click.",
  },
  {
    step: "Start Coding",
    description:
      "Open any LeetCode problem and start working on your solution.",
  },
  {
    step: "Get Help",
    description:
      "Click the LeetBuddy icon whenever you need help for personalized assistance.",
  },
];

export const companyLogos = [
  { src: Amazon, name: "Amazon" },
  { src: Apple, name: "Apple" },
  { src: Autodesk, name: "Autodesk" },
  { src: Google, name: "Google" },
  { src: IBM, name: "IBM" },
  { src: JaneStreet, name: "Jane Street" },
  { src: Meta, name: "Meta" },
  { src: RedBullRacing, name: "Red Bull Racing" },
  { src: Roblox, name: "Roblox" },
  { src: Snowflake, name: "Snowflake" },
  { src: Tata, name: "Tata" },
  { src: Tesla, name: "Tesla" },
];

export const testimonials = [
  {
    name: "Lucian Cheng",
    role: "Software Engineer at Meta",
    description: `"LeetBuddy helped me understand dynamic programming concepts that I had difficulties with. The hints are just right, not too revealing but enough to get you unstuck."`,
  },
  {
    name: "Erick Cevallos",
    role: "Software Engineer at Google",
    description: `"The edge case generator is a game-changer. It's helped me catch bugs in my solutions that I would have missed otherwise. Highly recommend!"`,
  },
  {
    name: "Ahsan Mansoor",
    role: "Software Engineer at Meta",
    description: `"I used LeetBuddy to help prepare for my technical interviews, and it made a huge difference. The whiteboard feature helped me grasp complex algorithms quickly."`,
  },
];

// Guide

export const interaction = [
  {
    title: "Chat Mode",
    description:
      "Ask questions in natural language. LeetBuddy can walk you through problems, explain solutions, offer hints, identify edge cases, and help you improve your code step by step.",
    icon: MessageSquare,
    example: "Can you explain the time complexity of my solution?",
    exampleIcon: CircleHelp,
  },
  {
    title: "Whiteboard Mode",
    description:
      "Use the interactive whiteboard to draw diagrams. LeetBuddy can interpret your visuals such as trees, graphs, or pointers and provide helpful explanations based on what you draw.",
    icon: Pencil,
    example: "Explain how this binary tree traversal works",
    exampleIcon: PencilRuler,
  },
  {
    title: "Smart Context Detection",
    description:
      "LeetBuddy understands your full LeetCode context including the problem, your code, and your progress. It gives personalized answers without you needing to copy and paste anything.",
    icon: BrainCircuit,
    example: "What's the optimal approach for this problem?",
    exampleIcon: Code,
  },
];

export const examples = [
  {
    example: `"Give me 3 edge cases for this problem."`,
    icon: AlertTriangle,
  },
  {
    example: `"Why is my sliding window code not working?"`,
    icon: Bug,
  },
  {
    example: `"Explain the recursive call stack."`,
    icon: Code,
  },
  {
    example: `"Is my tree drawing correct for each iteration?"`,
    icon: Pencil,
  },
];

export const tipsKeywords = ["Edge Cases", "Hint", "Bug"];

export const tips = [
  {
    text: "Use tags like Edge Cases, Hint, or Bug for better results",
  },
  {
    text: "Draw and then hit Ask in whiteboard mode to include visuals",
  },
  {
    text: "You can use LeetBuddy entirely for free",
  },
  {
    text: "Be specific with your questions for more targeted help",
  },
  {
    text: 'Use the "Explain step by step" prompt for detailed walkthroughs',
  },
];

export const faqPlaceholders = {
  leetcode: {
    text: "LeetCode",
    href: "https://leetcode.com",
  },
  mail: {
    text: "leetbuddyrsfn@gmail.com",
    href: "mailto:leetbuddyrsfn@gmail.com",
  },
  github: {
    text: "GitHub issues page",
    href: "https://github.com/LeetBuddyAI/LeetBuddy/issues",
  },
};

export const faqItems = [
  {
    question: "Is LeetBuddy free to use?",
    answer:
      "Yes, LeetBuddy is completely free to use. We offer all features without any paywalls or subscription requirements.",
  },
  {
    question: "Does LeetBuddy work on all LeetCode problems?",
    answer:
      "LeetBuddy works with all LeetCode problems. It can analyze the problem statement, your code, and provide relevant assistance.",
  },
  {
    question: "Which programming languages does LeetBuddy support?",
    answer:
      "LeetBuddy supports all programming languages available on LeetCode.",
  },
  {
    question: "Need more help?",
    answer:
      "If you have any questions or need assistance, please reach out to our team at leetbuddyrsfn@gmail.com or visit our GitHub issues page.",
  },
];
