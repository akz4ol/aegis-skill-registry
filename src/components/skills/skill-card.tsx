'use client';

import { Package, Shield, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface SkillCardProps {
  id: string;
  name: string;
  version: string;
  description?: string;
  riskScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: string;
  tags: string[];
  isVerified: boolean;
  updatedAt: string;
}

export function SkillCard({
  id,
  name,
  version,
  description,
  riskScore,
  riskLevel,
  status,
  tags,
  isVerified,
  updatedAt,
}: SkillCardProps) {
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'HIGH':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'LOW':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'PENDING_REVIEW':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'REJECTED':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  return (
    <Link href={`/skills/${id}`}>
      <div className="group rounded-lg border bg-card p-6 shadow-sm transition-all hover:border-primary hover:shadow-md">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold group-hover:text-primary">
                  {name}
                </h3>
                {isVerified && (
                  <Shield className="h-4 w-4 text-blue-600" title="Verified" />
                )}
              </div>
              <span className="text-sm text-muted-foreground">v{version}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon(status)}
            <span
              className={cn(
                'rounded-full border px-2 py-1 text-xs font-medium',
                getRiskColor(riskLevel)
              )}
            >
              Risk: {riskScore}
            </span>
          </div>
        </div>

        {description && (
          <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
            {description}
          </p>
        )}

        <div className="mt-4 flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{tags.length - 3}
              </Badge>
            )}
          </div>
          <span className="text-xs text-muted-foreground">{updatedAt}</span>
        </div>
      </div>
    </Link>
  );
}
