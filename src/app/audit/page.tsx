import {
  Download,
  Filter,
  Shield,
  Package,
  Lock,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const auditEntries = [
  {
    id: '1',
    timestamp: '2024-01-15 14:32:15',
    eventType: 'APPROVED',
    actor: 'security-team',
    resource: 'data-processor@2.1.0',
    resourceType: 'skill',
    details: 'Skill approved after security review',
    status: 'success',
  },
  {
    id: '2',
    timestamp: '2024-01-15 14:28:03',
    eventType: 'POLICY_EVALUATED',
    actor: 'system',
    resource: 'llm-router@1.0.0',
    resourceType: 'skill',
    details: 'Policy "require-approval-shell" triggered',
    status: 'warning',
  },
  {
    id: '3',
    timestamp: '2024-01-15 14:15:42',
    eventType: 'IMPORTED',
    actor: 'dev-team',
    resource: 'file-manager@2.0.1',
    resourceType: 'skill',
    details: 'Skill imported from GitHub',
    status: 'info',
  },
  {
    id: '4',
    timestamp: '2024-01-15 13:58:21',
    eventType: 'REJECTED',
    actor: 'security-team',
    resource: 'unsafe-exec@1.0.0',
    resourceType: 'skill',
    details: 'Rejected due to critical risk score (92)',
    status: 'error',
  },
  {
    id: '5',
    timestamp: '2024-01-15 13:45:00',
    eventType: 'EXECUTED',
    actor: 'agent-runtime',
    resource: 'api-client@4.2.0',
    resourceType: 'skill',
    details: 'Skill executed successfully (trace: abc123)',
    status: 'success',
  },
  {
    id: '6',
    timestamp: '2024-01-15 12:30:15',
    eventType: 'SIGNED',
    actor: 'security-team',
    resource: 'secure-exec@3.0.0',
    resourceType: 'skill',
    details: 'Skill signed with key sig_abc123',
    status: 'success',
  },
];

const getEventIcon = (eventType: string) => {
  switch (eventType) {
    case 'APPROVED':
    case 'SIGNED':
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case 'REJECTED':
    case 'REVOKED':
      return <XCircle className="h-4 w-4 text-red-600" />;
    case 'POLICY_EVALUATED':
      return <Lock className="h-4 w-4 text-yellow-600" />;
    case 'IMPORTED':
    case 'EXECUTED':
      return <Package className="h-4 w-4 text-blue-600" />;
    default:
      return <AlertTriangle className="h-4 w-4 text-gray-600" />;
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'success':
      return <Badge variant="success">Success</Badge>;
    case 'error':
      return <Badge variant="danger">Failed</Badge>;
    case 'warning':
      return <Badge variant="warning">Warning</Badge>;
    default:
      return <Badge variant="secondary">Info</Badge>;
  }
};

export default function AuditPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Audit Log</h1>
          <p className="mt-2 text-muted-foreground">
            Complete audit trail of all skill and policy activities
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 rounded-lg border bg-card p-4">
        <select className="h-9 rounded-md border border-input bg-background px-3 text-sm">
          <option>All Event Types</option>
          <option>Imported</option>
          <option>Approved</option>
          <option>Rejected</option>
          <option>Executed</option>
          <option>Signed</option>
        </select>
        <select className="h-9 rounded-md border border-input bg-background px-3 text-sm">
          <option>All Actors</option>
          <option>security-team</option>
          <option>dev-team</option>
          <option>system</option>
        </select>
        <select className="h-9 rounded-md border border-input bg-background px-3 text-sm">
          <option>Last 24 hours</option>
          <option>Last 7 days</option>
          <option>Last 30 days</option>
          <option>Custom range</option>
        </select>
        <input
          type="text"
          placeholder="Search resources..."
          className="h-9 w-64 rounded-md border border-input bg-background px-3 text-sm"
        />
      </div>

      {/* Audit Table */}
      <div className="rounded-lg border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Timestamp
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Event
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Actor
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Resource
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Details
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {auditEntries.map((entry) => (
                <tr key={entry.id} className="hover:bg-muted/50">
                  <td className="px-4 py-3 text-sm font-mono text-muted-foreground">
                    {entry.timestamp}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {getEventIcon(entry.eventType)}
                      <span className="text-sm font-medium">
                        {entry.eventType}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">{entry.actor}</td>
                  <td className="px-4 py-3">
                    <code className="rounded bg-muted px-2 py-1 text-sm">
                      {entry.resource}
                    </code>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {entry.details}
                  </td>
                  <td className="px-4 py-3">{getStatusBadge(entry.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t px-4 py-3">
          <p className="text-sm text-muted-foreground">
            Showing 6 of 1,247 entries
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
