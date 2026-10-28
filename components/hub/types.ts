import type { CategoryId } from '@/content/types';
import type { ResolvedImage, ResolvedMedia } from '@/lib/media';

/** The slice of a project the hub needs, resolved on the server and passed to the client. */
export interface HubProject {
  slug: string;
  title: string;
  titleAr?: string;
  tagline: string;
  category: CategoryId;
  palette: string[];
  cover: ResolvedImage;
  previews: ResolvedMedia[];
}
