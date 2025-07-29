import { z } from "zod";

export const memorySchema = z.object({
  id: z.string(),
  task: z.string(),
  title: z.string(),
  status: z.enum(["todo", "in-progress", "done", "canceled"]),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  estHours: z.number(),
  createdAt: z.string(),
  type: z.string(),
  reviewer: z.string(),
});

export type Memory = z.infer<typeof memorySchema>;

// Transform and expand the existing data to match table.cn format
export const memoriesData: Memory[] = [
  {
    id: "MEM-1001",
    task: "MEM-1001",
    title: "Cover page design and layout implementation",
    status: "in-progress",
    priority: "high",
    estHours: 8,
    createdAt: "2024-01-15",
    type: "Cover page",
    reviewer: "Eddie Lake"
  },
  {
    id: "MEM-1002", 
    task: "MEM-1002",
    title: "Table of contents structure and navigation",
    status: "done",
    priority: "medium",
    estHours: 4,
    createdAt: "2024-01-16",
    type: "Table of contents",
    reviewer: "Eddie Lake"
  },
  {
    id: "MEM-1003",
    task: "MEM-1003", 
    title: "Executive summary content creation and review",
    status: "done",
    priority: "high",
    estHours: 12,
    createdAt: "2024-01-17",
    type: "Narrative",
    reviewer: "Eddie Lake"
  },
  {
    id: "MEM-1004",
    task: "MEM-1004",
    title: "Technical approach documentation and methodology",
    status: "done", 
    priority: "high",
    estHours: 16,
    createdAt: "2024-01-18",
    type: "Narrative",
    reviewer: "Jamik Tashpulatov"
  },
  {
    id: "MEM-1005",
    task: "MEM-1005",
    title: "Design specifications and visual mockups",
    status: "in-progress",
    priority: "medium",
    estHours: 10,
    createdAt: "2024-01-19",
    type: "Narrative", 
    reviewer: "Jamik Tashpulatov"
  },
  {
    id: "MEM-1006",
    task: "MEM-1006",
    title: "Capabilities assessment and documentation",
    status: "in-progress",
    priority: "medium",
    estHours: 6,
    createdAt: "2024-01-20",
    type: "Narrative",
    reviewer: "Jamik Tashpulatov"
  },
  {
    id: "MEM-1007",
    task: "MEM-1007", 
    title: "Integration with existing systems analysis",
    status: "in-progress",
    priority: "high",
    estHours: 14,
    createdAt: "2024-01-21",
    type: "Narrative",
    reviewer: "Jamik Tashpulatov"
  },
  {
    id: "MEM-1008",
    task: "MEM-1008",
    title: "Innovation and advantages competitive analysis",
    status: "done",
    priority: "medium",
    estHours: 8,
    createdAt: "2024-01-22",
    type: "Narrative",
    reviewer: "Unassigned"
  },
  {
    id: "MEM-1009",
    task: "MEM-1009",
    title: "Overview of EMR's innovative solutions documentation",
    status: "done",
    priority: "low",
    estHours: 5,
    createdAt: "2024-01-23",
    type: "Technical content",
    reviewer: "Unassigned"
  },
  {
    id: "MEM-1010",
    task: "MEM-1010",
    title: "Advanced algorithms and machine learning implementation",
    status: "done",
    priority: "urgent",
    estHours: 20,
    createdAt: "2024-01-24",
    type: "Narrative",
    reviewer: "Unassigned"
  },
  {
    id: "MEM-1011",
    task: "MEM-1011",
    title: "Adaptive communication protocols development",
    status: "done",
    priority: "high",
    estHours: 15,
    createdAt: "2024-01-25",
    type: "Narrative",
    reviewer: "Unassigned"
  },
  {
    id: "MEM-1012",
    task: "MEM-1012",
    title: "Advantages over current technologies research",
    status: "done",
    priority: "medium",
    estHours: 7,
    createdAt: "2024-01-26",
    type: "Narrative",
    reviewer: "Unassigned"
  },
  {
    id: "MEM-1013",
    task: "MEM-1013",
    title: "Past performance metrics and case studies",
    status: "done",
    priority: "high",
    estHours: 9,
    createdAt: "2024-01-27",
    type: "Narrative", 
    reviewer: "Unassigned"
  },
  {
    id: "MEM-1014",
    task: "MEM-1014",
    title: "Customer feedback and satisfaction analysis",
    status: "done",
    priority: "medium",
    estHours: 6,
    createdAt: "2024-01-28",
    type: "Narrative",
    reviewer: "Unassigned"
  },
  {
    id: "MEM-1015",
    task: "MEM-1015",
    title: "Implementation challenges and solutions documentation",
    status: "done",
    priority: "high",
    estHours: 11,
    createdAt: "2024-01-29",
    type: "Narrative",
    reviewer: "Unassigned"
  },
  {
    id: "MEM-1016", 
    task: "MEM-1016",
    title: "Security measures and data protection policies",
    status: "in-progress",
    priority: "urgent",
    estHours: 18,
    createdAt: "2024-01-30",
    type: "Narrative",
    reviewer: "Unassigned"
  },
  {
    id: "MEM-1017",
    task: "MEM-1017",
    title: "Scalability and future proofing architecture",
    status: "done",
    priority: "high",
    estHours: 13,
    createdAt: "2024-01-31",
    type: "Narrative", 
    reviewer: "Unassigned"
  },
  {
    id: "MEM-1018",
    task: "MEM-1018",
    title: "Cost-benefit analysis and ROI calculations",
    status: "done",
    priority: "medium",
    estHours: 8,
    createdAt: "2024-02-01",
    type: "Plain language",
    reviewer: "Unassigned"
  },
  {
    id: "MEM-1019",
    task: "MEM-1019",
    title: "User training and onboarding experience design",
    status: "done",
    priority: "medium",
    estHours: 10,
    createdAt: "2024-02-02",
    type: "Narrative",
    reviewer: "Unassigned"
  },
  {
    id: "MEM-1020",
    task: "MEM-1020",
    title: "Future development roadmap and timeline",
    status: "done",
    priority: "low",
    estHours: 7,
    createdAt: "2024-02-03",
    type: "Narrative",
    reviewer: "Unassigned"
  },
  {
    id: "MEM-1021",
    task: "MEM-1021",
    title: "System architecture overview and diagrams",
    status: "in-progress",
    priority: "high",
    estHours: 16,
    createdAt: "2024-02-04",
    type: "Technical content",
    reviewer: "Maya Johnson"
  },
  {
    id: "MEM-1022",
    task: "MEM-1022", 
    title: "Risk management plan and mitigation strategies",
    status: "done",
    priority: "high",
    estHours: 12,
    createdAt: "2024-02-05",
    type: "Narrative",
    reviewer: "Carlos Rodriguez"
  },
  {
    id: "MEM-1023",
    task: "MEM-1023",
    title: "Compliance documentation and regulatory requirements",
    status: "in-progress",
    priority: "urgent",
    estHours: 22,
    createdAt: "2024-02-06",
    type: "Legal",
    reviewer: "Sarah Chen"
  },
  {
    id: "MEM-1024",
    task: "MEM-1024",
    title: "API documentation and integration guides",
    status: "done",
    priority: "medium",
    estHours: 9,
    createdAt: "2024-02-07",
    type: "Technical content",
    reviewer: "Raj Patel"
  },
  {
    id: "MEM-1025",
    task: "MEM-1025",
    title: "User interface mockups and wireframes",
    status: "in-progress",
    priority: "medium",
    estHours: 14,
    createdAt: "2024-02-08",
    type: "Visual",
    reviewer: "Leila Ahmadi"
  },
  {
    id: "MEM-1026",
    task: "MEM-1026",
    title: "Database schema design and optimization",
    status: "done",
    priority: "high",
    estHours: 11,
    createdAt: "2024-02-09",
    type: "Technical content",
    reviewer: "Thomas Wilson"
  },
  {
    id: "MEM-1027",
    task: "MEM-1027",
    title: "Testing methodology and quality assurance",
    status: "in-progress",
    priority: "high",
    estHours: 13,
    createdAt: "2024-02-10",
    type: "Technical content",
    reviewer: "Unassigned"
  },
  {
    id: "MEM-1028",
    task: "MEM-1028",
    title: "Deployment strategy and rollout plan",
    status: "done",
    priority: "medium",
    estHours: 8,
    createdAt: "2024-02-11", 
    type: "Narrative",
    reviewer: "Eddie Lake"
  },
  {
    id: "MEM-1029",
    task: "MEM-1029",
    title: "Budget breakdown and financial projections",
    status: "in-progress",
    priority: "high",
    estHours: 10,
    createdAt: "2024-02-12",
    type: "Financial",
    reviewer: "Jamik Tashpulatov"
  },
  {
    id: "MEM-1030",
    task: "MEM-1030",
    title: "Market analysis and competitive landscape",
    status: "done",
    priority: "medium",
    estHours: 12,
    createdAt: "2024-02-13",
    type: "Research", 
    reviewer: "Sophia Martinez"
  }
];

export const statusOptions = [
  { label: "Todo", value: "todo", count: 5 },
  { label: "In Progress", value: "in-progress", count: 8 },
  { label: "Done", value: "done", count: 15 },
  { label: "Canceled", value: "canceled", count: 2 }
];

export const priorityOptions = [
  { label: "Low", value: "low", count: 3 },
  { label: "Medium", value: "medium", count: 12 },
  { label: "High", value: "high", count: 10 },
  { label: "Urgent", value: "urgent", count: 5 }
];

export const typeOptions = [
  { label: "Narrative", value: "Narrative", count: 8 },
  { label: "Technical content", value: "Technical content", count: 6 },
  { label: "Research", value: "Research", count: 4 },
  { label: "Legal", value: "Legal", count: 2 },
  { label: "Planning", value: "Planning", count: 3 },
  { label: "Visual", value: "Visual", count: 1 },
  { label: "Financial", value: "Financial", count: 1 },
  { label: "Cover page", value: "Cover page", count: 1 },
  { label: "Table of contents", value: "Table of contents", count: 1 },
  { label: "Plain language", value: "Plain language", count: 1 }
]; 