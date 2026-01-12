# AegisSkill Registry

> Governed registry and marketplace for AI agent skills with security manifests, policy gating, provenance, and observability linkage.

[![CI](https://github.com/akz4ol/aegis-skill-registry/actions/workflows/ci.yml/badge.svg)](https://github.com/akz4ol/aegis-skill-registry/actions/workflows/ci.yml)
[![Deploy](https://github.com/akz4ol/aegis-skill-registry/actions/workflows/deploy.yml/badge.svg)](https://github.com/akz4ol/aegis-skill-registry/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Live Demo:** [https://aegis-skill-registry.vercel.app](https://aegis-skill-registry.vercel.app)

## North Star

> Installing an agent skill should be as safe, auditable, and reversible as installing a signed software dependency.

## Core Principles

- **Security-by-Default**: All skills are analyzed for security risks before approval
- **Least-Privilege**: Skills request only the permissions they need
- **Immutable Artifacts**: Skill versions cannot be modified once published
- **Policy-Before-Execution**: Governance policies are evaluated before skill installation
- **Observability-with-Attribution**: Full audit trail linking skills to their executions

## Features

### Skill Ingestion & Normalization

- Import skills from Git repositories, archives, or local folders
- Automatic structure detection and normalization
- Deterministic content hashing for integrity verification

### Skill-SBOM & Risk Intelligence

- Automatic generation of Software Bill of Materials (SBOM)
- Static analysis for permissions, network access, and shell patterns
- Risk scoring (0-100) with human-readable explanations

### Policy & Admission Control

- Define organization-level governance policies
- Policy DSL with AND/OR/NOT conditions
- Dry-run support for testing policies

### Provenance, Signing & Trust

- Cryptographic signing of skill artifacts
- Append-only provenance chain
- Exportable audit trails

### Observability & Audit Linkage

- OpenTelemetry-compatible trace injection
- Skill identity and policy context in runtime traces
- Comprehensive audit reporting

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/akz4ol/aegis-skill-registry.git
cd aegis-skill-registry

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your database credentials

# Generate Prisma client and push schema
npm run db:generate
npm run db:push

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to access the application.

## Architecture

```
aegis-skill-registry/
├── src/
│   ├── app/                  # Next.js App Router pages
│   │   ├── api/              # API routes
│   │   ├── skills/           # Skills pages
│   │   ├── policies/         # Policy management
│   │   ├── marketplace/      # Marketplace UI
│   │   └── audit/            # Audit log
│   ├── components/           # React components
│   ├── lib/                  # Utilities
│   ├── schemas/              # Zod validation schemas
│   ├── services/             # Business logic
│   └── types/                # TypeScript types
├── prisma/
│   └── schema.prisma         # Database schema
└── .github/
    └── workflows/            # CI/CD pipelines
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/skills` | GET | List skills with filtering |
| `/api/skills` | POST | Import a new skill |
| `/api/policies` | GET | List policies |
| `/api/policies` | POST | Create a policy |
| `/api/approvals` | GET | List approvals |
| `/api/approvals` | POST | Request approval |
| `/api/audit` | GET | Query audit log |

## Policy DSL Example

```json
{
  "name": "block-high-risk",
  "version": "1.0.0",
  "rules": [
    {
      "name": "Block Critical Risk",
      "condition": {
        "type": "FIELD",
        "field": "sbom.riskScore",
        "operator": "gte",
        "value": 80
      },
      "action": "DENY",
      "message": "Skills with critical risk scores are not allowed"
    }
  ]
}
```

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Roadmap

See our [Roadmap](docs/ROADMAP.md) for planned features and milestones.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Security

If you discover a security vulnerability, please send an email to security@example.com. All security vulnerabilities will be promptly addressed.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Database ORM by [Prisma](https://prisma.io/)
- UI components inspired by [shadcn/ui](https://ui.shadcn.com/)
