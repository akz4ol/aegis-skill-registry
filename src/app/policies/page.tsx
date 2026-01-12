import { Plus, Shield, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const policies = [
  {
    id: '1',
    name: 'block-high-risk',
    version: '1.0.0',
    description: 'Block skills with risk score above 80',
    isActive: true,
    rulesCount: 3,
    evaluations: 1247,
    denials: 23,
    lastUpdated: '2 days ago',
  },
  {
    id: '2',
    name: 'require-approval-shell',
    version: '1.0.0',
    description: 'Require approval for skills with shell access',
    isActive: true,
    rulesCount: 2,
    evaluations: 856,
    denials: 0,
    lastUpdated: '1 week ago',
  },
  {
    id: '3',
    name: 'network-access-control',
    version: '2.1.0',
    description: 'Control and audit network access patterns',
    isActive: true,
    rulesCount: 5,
    evaluations: 2103,
    denials: 45,
    lastUpdated: '3 days ago',
  },
  {
    id: '4',
    name: 'secret-access-audit',
    version: '1.2.0',
    description: 'Audit and control access to secrets and credentials',
    isActive: false,
    rulesCount: 4,
    evaluations: 0,
    denials: 0,
    lastUpdated: '2 weeks ago',
  },
];

export default function PoliciesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Policy Management
          </h1>
          <p className="mt-2 text-muted-foreground">
            Define and manage governance policies for skill installation
          </p>
        </div>
        <Link href="/policies/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Policy
          </Button>
        </Link>
      </div>

      {/* Policy Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-muted-foreground">
              Active Policies
            </span>
          </div>
          <p className="mt-2 text-3xl font-bold">3</p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-muted-foreground">
              Total Evaluations
            </span>
          </div>
          <p className="mt-2 text-3xl font-bold">4,206</p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <span className="text-sm font-medium text-muted-foreground">
              Denials (30d)
            </span>
          </div>
          <p className="mt-2 text-3xl font-bold">68</p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-yellow-600" />
            <span className="text-sm font-medium text-muted-foreground">
              Pending Approvals
            </span>
          </div>
          <p className="mt-2 text-3xl font-bold">12</p>
        </div>
      </div>

      {/* Policy List */}
      <div className="rounded-lg border bg-card">
        <div className="border-b p-4">
          <h2 className="font-semibold">All Policies</h2>
        </div>
        <div className="divide-y">
          {policies.map((policy) => (
            <Link
              key={policy.id}
              href={`/policies/${policy.id}`}
              className="block transition-colors hover:bg-muted/50"
            >
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <div
                    className={`rounded-full p-2 ${
                      policy.isActive ? 'bg-green-100' : 'bg-gray-100'
                    }`}
                  >
                    <Shield
                      className={`h-5 w-5 ${
                        policy.isActive ? 'text-green-600' : 'text-gray-400'
                      }`}
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{policy.name}</h3>
                      <Badge
                        variant={policy.isActive ? 'success' : 'secondary'}
                      >
                        {policy.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {policy.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-8 text-sm text-muted-foreground">
                  <div className="text-right">
                    <p className="font-medium text-foreground">
                      {policy.rulesCount} rules
                    </p>
                    <p>v{policy.version}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-foreground">
                      {policy.evaluations.toLocaleString()}
                    </p>
                    <p>evaluations</p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-medium ${
                        policy.denials > 0 ? 'text-red-600' : 'text-green-600'
                      }`}
                    >
                      {policy.denials}
                    </p>
                    <p>denials</p>
                  </div>
                  <p className="w-24 text-right">{policy.lastUpdated}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
