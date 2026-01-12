import {
  Shield,
  TrendingUp,
  Star,
  Download,
  ChevronRight,
  Filter,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const featuredSkills = [
  {
    id: '1',
    name: 'data-processor',
    version: '2.1.0',
    description:
      'Enterprise-grade data processing with built-in validation and governance.',
    riskScore: 35,
    riskLevel: 'LOW',
    downloads: '12.5k',
    rating: 4.8,
    isVerified: true,
    publisher: 'Aegis Team',
  },
  {
    id: '2',
    name: 'secure-exec',
    version: '3.0.0',
    description:
      'Sandboxed execution environment with comprehensive security controls.',
    riskScore: 78,
    riskLevel: 'MEDIUM',
    downloads: '8.2k',
    rating: 4.6,
    isVerified: true,
    publisher: 'Security Labs',
  },
  {
    id: '3',
    name: 'api-client',
    version: '4.2.0',
    description:
      'Universal API client with smart retry and caching capabilities.',
    riskScore: 22,
    riskLevel: 'LOW',
    downloads: '25.3k',
    rating: 4.9,
    isVerified: true,
    publisher: 'Core Team',
  },
];

const categories = [
  { name: 'Data Processing', count: 156, icon: '📊' },
  { name: 'API Integration', count: 234, icon: '🔗' },
  { name: 'Security', count: 89, icon: '🔒' },
  { name: 'LLM Tools', count: 178, icon: '🤖' },
  { name: 'File Operations', count: 67, icon: '📁' },
  { name: 'Web Scraping', count: 45, icon: '🌐' },
];

export default function MarketplacePage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Skill Marketplace
          </h1>
          <p className="mt-2 text-muted-foreground">
            Discover trusted, security-audited skills for your AI agents
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
          <Button variant="outline">
            <TrendingUp className="mr-2 h-4 w-4" />
            Trending
          </Button>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="rounded-lg bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-8">
        <div className="flex items-center gap-4">
          <Shield className="h-12 w-12 text-primary" />
          <div>
            <h2 className="text-2xl font-bold">Security-First Marketplace</h2>
            <p className="text-muted-foreground">
              Every skill includes an SBOM, risk analysis, and policy
              compliance check
            </p>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div>
        <h2 className="mb-4 text-xl font-semibold">Browse by Category</h2>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={`/marketplace?category=${category.name.toLowerCase()}`}
              className="flex items-center gap-3 rounded-lg border bg-card p-4 transition-colors hover:border-primary"
            >
              <span className="text-2xl">{category.icon}</span>
              <div>
                <p className="font-medium">{category.name}</p>
                <p className="text-sm text-muted-foreground">
                  {category.count} skills
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Skills */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Featured Skills</h2>
          <Link
            href="/skills"
            className="flex items-center text-sm text-primary hover:underline"
          >
            View all
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {featuredSkills.map((skill) => (
            <Link key={skill.id} href={`/skills/${skill.id}`}>
              <div className="group rounded-lg border bg-card p-6 transition-all hover:border-primary hover:shadow-md">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold group-hover:text-primary">
                        {skill.name}
                      </h3>
                      {skill.isVerified && (
                        <Shield className="h-4 w-4 text-blue-600" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      v{skill.version} by {skill.publisher}
                    </p>
                  </div>
                  <Badge
                    variant={
                      skill.riskLevel === 'LOW' ? 'success' : 'warning'
                    }
                  >
                    Risk: {skill.riskScore}
                  </Badge>
                </div>
                <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
                  {skill.description}
                </p>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      {skill.rating}
                    </span>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Download className="h-4 w-4" />
                      {skill.downloads}
                    </span>
                  </div>
                  <Button size="sm" variant="outline">
                    Install
                  </Button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Trust Signals */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-card p-6">
          <Shield className="h-8 w-8 text-green-600" />
          <h3 className="mt-4 font-semibold">Verified Publishers</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            All publishers undergo identity verification and security review
          </p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <Shield className="h-8 w-8 text-blue-600" />
          <h3 className="mt-4 font-semibold">Automated SBOM</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Every skill includes a detailed Software Bill of Materials
          </p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <Shield className="h-8 w-8 text-purple-600" />
          <h3 className="mt-4 font-semibold">Policy Enforcement</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Install only skills that comply with your organization policies
          </p>
        </div>
      </div>
    </div>
  );
}
