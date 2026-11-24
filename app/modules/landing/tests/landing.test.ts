import { beforeEach, describe, expect, it } from "vitest";
import { createTestDb, seedBaseData, type TestDb } from "~/test/setup";
import * as schema from "~/db/schema";
import { CourseStatus, UserRole } from "~/db/schema";
import { markdown } from "~/lib/text";
import { createLanding, FEATURED_COURSE_LIMIT } from "../index.server";

let db: TestDb;
let base: ReturnType<typeof seedBaseData>;

beforeEach(() => {
  db = createTestDb();
  base = seedBaseData(db);
});

// ─── Fixtures ───
// The landing module only reads, so rows go in directly. Kept in one place
// so a schema change touches only this block.

let counter = 0;

function addInstructor(name: string) {
  counter += 1;
  return db
    .insert(schema.users)
    .values({
      name,
      email: `instructor-${counter}@example.com`,
      role: UserRole.Instructor,
    })
    .returning()
    .get();
}

function addCategory(name: string) {
  counter += 1;
  return db
    .insert(schema.categories)
    .values({ name, slug: `category-${counter}` })
    .returning()
    .get();
}

function addCourse(
  title: string,
  {
    status = CourseStatus.Published,
    createdAt = "2026-01-01T00:00:00.000Z",
    instructorId = base.instructor.id,
    categoryId = base.category.id,
  } = {}
) {
  counter += 1;
  return db
    .insert(schema.courses)
    .values({
      title,
      slug: `course-${counter}`,
      description: `${title} description`,
      salesCopy: markdown(title),
      instructorId,
      categoryId,
      status,
      createdAt,
    })
    .returning()
    .get();
}

function addLessons(courseId: number, perModule: number[]) {
  perModule.forEach((lessonCount, position) => {
    const mod = db
      .insert(schema.modules)
      .values({ courseId, title: `Module ${position}`, position })
      .returning()
      .get();
    for (let i = 0; i < lessonCount; i++) {
      db.insert(schema.lessons)
        .values({ moduleId: mod.id, title: `Lesson ${i}`, position: i })
        .run();
    }
  });
}

function getLanding() {
  return createLanding(db).get();
}

describe("featured courses", () => {
  it("shows the newest published courses first, up to the limit", () => {
    addCourse("Oldest", { createdAt: "2030-01-01T00:00:00.000Z" });
    addCourse("Newest", { createdAt: "2031-06-01T00:00:00.000Z" });
    addCourse("Middle", { createdAt: "2031-03-01T00:00:00.000Z" });
    addCourse("Older", { createdAt: "2030-06-01T00:00:00.000Z" });

    const titles = getLanding().featuredCourses.map((c) => c.title);

    expect(FEATURED_COURSE_LIMIT).toBe(3);
    expect(titles).toEqual(["Newest", "Middle", "Older"]);
  });

  it("leaves out draft and archived courses", () => {
    addCourse("Draft", {
      status: CourseStatus.Draft,
      createdAt: "2027-01-01T00:00:00.000Z",
    });
    addCourse("Archived", {
      status: CourseStatus.Archived,
      createdAt: "2027-01-01T00:00:00.000Z",
    });

    const titles = getLanding().featuredCourses.map((c) => c.title);

    expect(titles).toEqual([base.course.title]);
  });

  it("carries the instructor, category and lessons across every module", () => {
    const instructor = addInstructor("Dana Doe");
    const category = addCategory("Design");
    const course = addCourse("Design Basics", {
      instructorId: instructor.id,
      categoryId: category.id,
      createdAt: "2027-01-01T00:00:00.000Z",
    });
    addLessons(course.id, [2, 3]);

    const [featured] = getLanding().featuredCourses;

    expect(featured).toMatchObject({
      id: course.id,
      title: "Design Basics",
      slug: course.slug,
      description: "Design Basics description",
      coverImageUrl: null,
      instructorName: "Dana Doe",
      categoryName: "Design",
      lessonCount: 5,
    });
  });

  it("gives a course with no lessons a count of zero", () => {
    const [featured] = getLanding().featuredCourses;

    expect(featured.lessonCount).toBe(0);
  });

  it("is empty when nothing is published", () => {
    db.update(schema.courses).set({ status: CourseStatus.Draft }).run();

    expect(getLanding()).toEqual({
      featuredCourses: [],
      stats: { courses: 0, lessons: 0, instructors: 0, categories: 0 },
    });
  });
});

describe("catalogue stats", () => {
  it("counts published courses, their lessons, instructors and categories", () => {
    const instructor = addInstructor("Dana Doe");
    const category = addCategory("Design");
    addLessons(base.course.id, [4]);
    const second = addCourse("Second", {
      instructorId: instructor.id,
      categoryId: category.id,
    });
    addLessons(second.id, [1, 2]);
    addCourse("Same instructor and category");

    expect(getLanding().stats).toEqual({
      courses: 3,
      lessons: 7,
      instructors: 2,
      categories: 2,
    });
  });

  it("ignores unpublished courses and their lessons, instructors and categories", () => {
    const instructor = addInstructor("Dana Doe");
    const category = addCategory("Design");
    const draft = addCourse("Draft", {
      status: CourseStatus.Draft,
      instructorId: instructor.id,
      categoryId: category.id,
    });
    addLessons(draft.id, [10]);

    expect(getLanding().stats).toEqual({
      courses: 1,
      lessons: 0,
      instructors: 1,
      categories: 1,
    });
  });

  it("counts every published course, not only the featured ones", () => {
    for (let i = 0; i < FEATURED_COURSE_LIMIT + 2; i++) addCourse(`Extra ${i}`);

    expect(getLanding().stats.courses).toBe(FEATURED_COURSE_LIMIT + 3);
  });
});
