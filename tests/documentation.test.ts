import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const requiredFiles = [
  'docs/design-system.md',
  'docs/architecture.md',
  'docs/onboarding.md',
  'docs/flows/explore-trail.md',
  'docs/flows/record-and-contribute.md',
  'docs/decisions/ADR-001-mobile-first-offline.md',
  'docs/decisions/ADR-002-aws-native-backend.md',
  'docs/decisions/ADR-003-design-as-code.md',
  'docs/diagrams/system-context.mermaid',
  'docs/diagrams/runtime-architecture.mermaid',
  'docs/diagrams/contribution-flow.mermaid',
  '.superdesign/init/components.md',
  '.superdesign/init/layouts.md',
  '.superdesign/init/routes.md',
  '.superdesign/init/theme.md',
  '.superdesign/init/pages.md',
  '.superdesign/init/extractable-components.md',
];

describe('project documentation', () => {
  it('keeps the onboarding and architecture artifacts versioned', () => {
    for (const file of requiredFiles) {
      const absolutePath = path.join(root, file);
      expect(existsSync(absolutePath)).toBe(true);
      expect(readFileSync(absolutePath, 'utf8').trim().length).toBeGreaterThan(20);
    }
  });

  it('links the main documentation from the README', () => {
    const readme = readFileSync(path.join(root, 'README.md'), 'utf8');
    expect(readme).toContain('docs/design-system.md');
    expect(readme).toContain('docs/architecture.md');
    expect(readme).toContain('docs/onboarding.md');
  });

  it('keeps feature styling on the design token source', () => {
    const reportSheet = readFileSync(path.join(root, 'src/features/quality/ReportContentSheet.tsx'), 'utf8');
    expect(reportSheet).not.toMatch(/#[0-9A-Fa-f]{6}/);
  });
});
