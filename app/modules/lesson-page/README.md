# lesson-page

The reads and writes behind the Student's Lesson page
(`app/routes/courses.$slug.lessons.$lessonId.tsx`): the course and its
curriculum, lesson progress and watch position, the Questions & Discussion
thread, and quiz grading.

Entry points, one per area: `course.server.ts`, `progress.server.ts`,
`thread.server.ts`, `quiz.server.ts`.

This was moved out of the route file as is, to keep the route under the file
size limit. It has no tests of its own yet.
