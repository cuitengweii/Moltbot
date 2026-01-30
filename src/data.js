// Mock data for ClawdTM skills
export const mockSkills = [
  {
    id: 1,
    name: "Web Search",
    author: "@0xMythril",
    description: "Enable your agent to search the web for real-time information and current events.",
    rating: 4.8,
    reviewCount: 124,
    category: "search",
    icon: "fas fa-robot",
    color: "from-blue-500 to-purple-600",
    installed: false
  },
  {
    id: 2,
    name: "Code Editor",
    author: "@devteam",
    description: "Advanced code editing capabilities with syntax highlighting and auto-completion.",
    rating: 4.9,
    reviewCount: 89,
    category: "development",
    icon: "fas fa-code",
    color: "from-green-500 to-teal-600",
    installed: false
  },
  {
    id: 3,
    name: "Image Generator",
    author: "@artbot",
    description: "Generate and manipulate images using advanced AI models and editing tools.",
    rating: 4.7,
    reviewCount: 156,
    category: "creative",
    icon: "fas fa-image",
    color: "from-purple-500 to-pink-600",
    installed: false
  },
  {
    id: 4,
    name: "Database Manager",
    author: "@datawiz",
    description: "Manage and query databases with intuitive tools and powerful search capabilities.",
    rating: 4.6,
    reviewCount: 72,
    category: "data",
    icon: "fas fa-database",
    color: "from-orange-500 to-red-600",
    installed: false
  },
  {
    id: 5,
    name: "Weather Forecast",
    author: "@weatherman",
    description: "Get real-time weather updates and forecasts for any location worldwide.",
    rating: 4.5,
    reviewCount: 203,
    category: "analytics",
    icon: "fas fa-cloud-sun",
    color: "from-cyan-500 to-blue-600",
    installed: false
  },
  {
    id: 6,
    name: "PDF Converter",
    author: "@docmaster",
    description: "Convert documents to and from PDF format with high quality and speed.",
    rating: 4.4,
    reviewCount: 98,
    category: "ai-tools",
    icon: "fas fa-file-pdf",
    color: "from-red-500 to-orange-600",
    installed: false
  }
];

export const categories = [
  { id: "search", name: "Search", icon: "fas fa-search", color: "text-blue-500" },
  { id: "development", name: "Development", icon: "fas fa-code", color: "text-green-500" },
  { id: "creative", name: "Creative", icon: "fas fa-image", color: "text-purple-500" },
  { id: "data", name: "Data", icon: "fas fa-database", color: "text-orange-500" },
  { id: "analytics", name: "Analytics", icon: "fas fa-chart-bar", color: "text-red-500" },
  { id: "ai-tools", name: "AI Tools", icon: "fas fa-robot", color: "text-gray-500" }
];

export const featuredSkills = [1, 2, 3, 4]; // IDs of featured skills