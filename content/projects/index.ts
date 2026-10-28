import type { CategoryId, Project } from '../types.ts';
import { culturalEchoes } from './cultural-echoes.ts';
import { carinaArabesque } from './carina-arabesque.ts';
import { inHonorOfOurWomen } from './in-honor-of-our-women.ts';
import { glacier } from './glacier.ts';
import { intoHerSkin } from './into-her-skin.ts';
import { arabia } from './arabia.ts';
import { identityBreakdown } from './identity-breakdown.ts';
import { clueStyling } from './clue-styling.ts';

/** Display order across the site. */
export const projects: Project[] = [
  culturalEchoes,
  carinaArabesque,
  inHonorOfOurWomen,
  glacier,
  intoHerSkin,
  arabia,
  identityBreakdown,
  clueStyling,
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
export const projectsIn = (category: CategoryId) => projects.filter((p) => p.category === category);
