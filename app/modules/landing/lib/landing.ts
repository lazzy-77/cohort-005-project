import { count, countDistinct, desc, eq, inArray } from "drizzle-orm";
import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import * as schema from "~/db/schema";
import {
  CourseStatus,
  categories,
  courses,
  lessons,
  modules,
  users,
} from "~/db/schema";

export type Db = BetterSQLite3Database<typeof schema>;

export const FEATURED_COURSE_LIMIT = 3;

export type FeaturedCourse = {
  id: number;
  title: string;
  slug: string;
  description: string;
  coverImageUrl: string | null;
  instructorName: string;
  categoryName: string;
  lessonCount: number;
};

export type CatalogueStats = {
  courses: number;
  lessons: number;
  instructors: number;
  categories: number;
};

export type Landing = {
  featuredCourses: FeaturedCourse[];
  stats: CatalogueStats;
};

const isPublished = eq(courses.status, CourseStatus.Published);

function newestPublishedCourses(db: Db) {
  return db
    .select({
      id: courses.id,
      title: courses.title,
      slug: courses.slug,
      description: courses.description,
      coverImageUrl: courses.coverImageUrl,
      instructorName: users.name,
      categoryName: categories.name,
    })
    .from(courses)
    .innerJoin(users, eq(courses.instructorId, users.id))
    .innerJoin(categories, eq(courses.categoryId, categories.id))
    .where(isPublished)
    .orderBy(desc(courses.createdAt), desc(courses.id))
    .limit(FEATURED_COURSE_LIMIT)
    .all();
}

function lessonCountsByCourse(db: Db, courseIds: number[]) {
  const rows = db
    .select({ courseId: modules.courseId, lessons: count(lessons.id) })
    .from(modules)
    .innerJoin(lessons, eq(lessons.moduleId, modules.id))
    .where(inArray(modules.courseId, courseIds))
    .groupBy(modules.courseId)
    .all();
  return new Map(rows.map((row) => [row.courseId, row.lessons]));
}

function catalogueStats(db: Db): CatalogueStats {
  const catalogue = db
    .select({
      courses: countDistinct(courses.id),
      instructors: countDistinct(courses.instructorId),
      categories: countDistinct(courses.categoryId),
    })
    .from(courses)
    .where(isPublished)
    .get();
  const lessonTotal = db
    .select({ lessons: count(lessons.id) })
    .from(lessons)
    .innerJoin(modules, eq(lessons.moduleId, modules.id))
    .innerJoin(courses, eq(modules.courseId, courses.id))
    .where(isPublished)
    .get();
  return {
    courses: catalogue?.courses ?? 0,
    instructors: catalogue?.instructors ?? 0,
    categories: catalogue?.categories ?? 0,
    lessons: lessonTotal?.lessons ?? 0,
  };
}

export function getLanding(db: Db): Landing {
  const newest = newestPublishedCourses(db);
  const lessonCounts = lessonCountsByCourse(
    db,
    newest.map((course) => course.id)
  );
  return {
    featuredCourses: newest.map((course) => ({
      ...course,
      lessonCount: lessonCounts.get(course.id) ?? 0,
    })),
    stats: catalogueStats(db),
  };
}
