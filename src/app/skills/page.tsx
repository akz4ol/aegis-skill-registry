import { Plus, Filter, Search } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SkillCard } from '@/components/skills/skill-card';

// Demo data - in production this would come from API
const skills = [
  {
    id: '1',
    name: 'data-processor',
    version: '2.1.0',
    description:
      'Processes and transforms data from multiple sources with built-in validation and error handling.',
    riskScore: 35,
    riskLevel: 'MEDIUM' as const,
    status: 'APPROVED',
    tags: ['data', 'etl', 'validation'],
    isVerified: true,
    updatedAt: '2 days ago',
  },
  {
    id: '2',
    name: 'llm-router',
    version: '1.0.0',
    description:
      'Intelligent routing between different LLM providers based on cost, latency, and capability requirements.',
    riskScore: 45,
    riskLevel: 'MEDIUM' as const,
    status: 'PENDING_REVIEW',
    tags: ['llm', 'routing', 'optimization'],
    isVerified: false,
    updatedAt: '4 hours ago',
  },
  {
    id: '3',
    name: 'secure-exec',
    version: '3.0.0',
    description:
      'Sandboxed code execution environment with configurable resource limits and security policies.',
    riskScore: 78,
    riskLevel: 'HIGH' as const,
    status: 'APPROVED',
    tags: ['execution', 'sandbox', 'security'],
    isVerified: true,
    updatedAt: '1 week ago',
  },
  {
    id: '4',
    name: 'web-scraper',
    version: '1.5.2',
    description:
      'Extracts structured data from web pages with rate limiting and respect for robots.txt.',
    riskScore: 52,
    riskLevel: 'MEDIUM' as const,
    status: 'APPROVED',
    tags: ['web', 'scraping', 'data-extraction'],
    isVerified: true,
    updatedAt: '3 days ago',
  },
  {
    id: '5',
    name: 'file-manager',
    version: '2.0.1',
    description:
      'File system operations with path validation and access control policies.',
    riskScore: 65,
    riskLevel: 'HIGH' as const,
    status: 'PENDING_REVIEW',
    tags: ['filesystem', 'io', 'management'],
    isVerified: false,
    updatedAt: '1 day ago',
  },
  {
    id: '6',
    name: 'api-client',
    version: '4.2.0',
    description:
      'Universal API client with retry logic, caching, and automatic rate limiting.',
    riskScore: 22,
    riskLevel: 'LOW' as const,
    status: 'APPROVED',
    tags: ['api', 'http', 'client'],
    isVerified: true,
    updatedAt: '5 days ago',
  },
];

export default function SkillsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Skills Registry</h1>
          <p className="mt-2 text-muted-foreground">
            Browse and manage AI agent skills with security insights
          </p>
        </div>
        <Link href="/skills/import">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Import Skill
          </Button>
        </Link>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search skills..."
            className="h-10 w-full rounded-md border border-input bg-background pl-10 pr-4 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
          <select className="h-10 rounded-md border border-input bg-background px-3 text-sm">
            <option>All Status</option>
            <option>Approved</option>
            <option>Pending Review</option>
            <option>Rejected</option>
          </select>
          <select className="h-10 rounded-md border border-input bg-background px-3 text-sm">
            <option>All Risk Levels</option>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
            <option>Critical</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {skills.map((skill) => (
          <SkillCard key={skill.id} {...skill} />
        ))}
      </div>
    </div>
  );
}
