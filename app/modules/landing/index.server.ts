import { db } from "~/db";
import { getLanding, type Db } from "./lib/landing";

export type { CatalogueStats, FeaturedCourse, Landing } from "./lib/landing";
export { FEATURED_COURSE_LIMIT } from "./lib/landing";

/**
 * The landing page's view of the catalogue, bound to a database. The app
 * uses `landing`, which reads the app database; tests build their own
 * against a test database.
 */
export function createLanding(database: Db) {
  return {
    /**
     * The newest published courses, with their lesson counts, and the
     * figures for the whole published catalogue. Drafts and archived
     * courses never appear and never count.
     */
    get() {
      return getLanding(database);
    },
  };
}

// Pure so a route importing this only for its loader doesn't pull the
// database into the client bundle (see `~/db`).
export const landing = /* @__PURE__ */ createLanding(db);
