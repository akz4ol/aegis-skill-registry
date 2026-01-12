import { Shield, Package, Lock, Activity, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const stats = [
  { name: 'Total Skills', value: '2,847', change: '+12%', changeType: 'positive' },
  { name: 'Approved Skills', value: '2,341', change: '+8%', changeType: 'positive' },
  { name: 'Pending Reviews', value: '156', change: '-23%', changeType: 'negative' },
  { name: 'Policy Violations', value: '12', change: '-45%', changeType: 'negative' },
];

const recentActivity = [
  {
    id: 1,
    type: 'approval',
    skill: 'data-processor-v2',
    user: 'security-team',
    time: '2 hours ago',
  },
  {
    id: 2,
    type: 'import',
    skill: 'llm-router',
    user: 'dev-team',
    time: '4 hours ago',
  },
  {
    id: 3,
    type: 'policy-update',
    skill: 'block-high-risk',
    user: 'admin',
    time: '1 day ago',
  },
];

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Monitor and manage your AI agent skill registry
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="rounded-lg border bg-card p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                {stat.name}
              </span>
              <span
                className={`text-xs font-medium ${
                  stat.changeType === 'positive'
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}
              >
                {stat.change}
              </span>
            </div>
            <p className="mt-2 text-3xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link
          href="/skills"
          className="group flex items-center gap-4 rounded-lg border bg-card p-6 shadow-sm transition-colors hover:border-primary"
        >
          <div className="rounded-full bg-primary/10 p-3">
            <Package className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">Browse Skills</h3>
            <p className="text-sm text-muted-foreground">
              Explore the marketplace
            </p>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
        </Link>

        <Link
          href="/skills/import"
          className="group flex items-center gap-4 rounded-lg border bg-card p-6 shadow-sm transition-colors hover:border-primary"
        >
          <div className="rounded-full bg-green-100 p-3">
            <Shield className="h-6 w-6 text-green-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">Import Skill</h3>
            <p className="text-sm text-muted-foreground">
              Add from Git or archive
            </p>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
        </Link>

        <Link
          href="/policies"
          className="group flex items-center gap-4 rounded-lg border bg-card p-6 shadow-sm transition-colors hover:border-primary"
        >
          <div className="rounded-full bg-orange-100 p-3">
            <Lock className="h-6 w-6 text-orange-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">Manage Policies</h3>
            <p className="text-sm text-muted-foreground">
              Configure governance rules
            </p>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
        </Link>

        <Link
          href="/audit"
          className="group flex items-center gap-4 rounded-lg border bg-card p-6 shadow-sm transition-colors hover:border-primary"
        >
          <div className="rounded-full bg-purple-100 p-3">
            <Activity className="h-6 w-6 text-purple-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">View Audit Log</h3>
            <p className="text-sm text-muted-foreground">
              Track all activities
            </p>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="rounded-lg border bg-card shadow-sm">
        <div className="border-b p-6">
          <h2 className="text-lg font-semibold">Recent Activity</h2>
        </div>
        <div className="divide-y">
          {recentActivity.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between p-4"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`rounded-full p-2 ${
                    activity.type === 'approval'
                      ? 'bg-green-100'
                      : activity.type === 'import'
                        ? 'bg-blue-100'
                        : 'bg-orange-100'
                  }`}
                >
                  {activity.type === 'approval' ? (
                    <Shield className="h-4 w-4 text-green-600" />
                  ) : activity.type === 'import' ? (
                    <Package className="h-4 w-4 text-blue-600" />
                  ) : (
                    <Lock className="h-4 w-4 text-orange-600" />
                  )}
                </div>
                <div>
                  <p className="font-medium">{activity.skill}</p>
                  <p className="text-sm text-muted-foreground">
                    {activity.type === 'approval'
                      ? 'Approved'
                      : activity.type === 'import'
                        ? 'Imported'
                        : 'Policy Updated'}{' '}
                    by {activity.user}
                  </p>
                </div>
              </div>
              <span className="text-sm text-muted-foreground">
                {activity.time}
              </span>
            </div>
          ))}
        </div>
        <div className="border-t p-4">
          <Link
            href="/audit"
            className="text-sm font-medium text-primary hover:underline"
          >
            View all activity
          </Link>
        </div>
      </div>
    </div>
  );
}
