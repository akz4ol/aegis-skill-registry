# AegisSkill Registry Roadmap

This document outlines the planned development phases and features for AegisSkill Registry.

## Phase 1: Foundation (Current)

### Completed

- [x] Core skill ingestion from Git/archives/local
- [x] Canonical skill model with immutable versioning
- [x] SBOM generation with permission analysis
- [x] Static risk analysis and scoring
- [x] Policy DSL and evaluation engine
- [x] Approval workflow with hash binding
- [x] Basic marketplace UI
- [x] Audit logging

### In Progress

- [ ] Cryptographic skill signing
- [ ] OpenTelemetry integration
- [ ] Advanced policy conditions

## Phase 2: Enterprise Features

### Planned

- [ ] Multi-organization support
- [ ] Role-based access control (RBAC)
- [ ] SSO integration (SAML, OIDC)
- [ ] Custom approval workflows
- [ ] Skill dependency analysis
- [ ] Vulnerability scanning integration
- [ ] Advanced audit reporting with exports

## Phase 3: Ecosystem Integration

### Planned

- [ ] SDK for popular agent frameworks
  - [ ] LangChain integration
  - [ ] AutoGPT integration
  - [ ] CrewAI integration
- [ ] CLI tool for skill development
- [ ] VS Code extension
- [ ] GitHub App for repository scanning

## Phase 4: Advanced Intelligence

### Planned

- [ ] ML-based risk prediction
- [ ] Behavioral analysis from execution traces
- [ ] Automated policy suggestions
- [ ] Skill similarity detection
- [ ] Supply chain attack detection

## Phase 5: Scale & Performance

### Planned

- [ ] Global CDN for skill distribution
- [ ] Multi-region deployment
- [ ] Real-time collaboration features
- [ ] Advanced caching strategies

## Success Metrics

### Security

- Zero unapproved skill executions
- Mean time to revoke < 10 minutes

### Adoption

- Number of skills registered
- Organizations using policy gates
- Active marketplace users

### Compliance

- Audit pass rate
- Evidence generation time

## Contributing to the Roadmap

We welcome community input on our roadmap! Please:

1. Open a GitHub Discussion for feature ideas
2. Vote on existing feature requests
3. Contribute to milestone planning

## Timeline

Timelines are intentionally not specified to allow for community-driven prioritization and quality-focused development.

## Version History

- **v0.1.0** - Initial release with core features
- Future versions TBD based on community feedback
