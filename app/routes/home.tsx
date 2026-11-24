import type { Route } from "./+types/home";
import { eq } from "drizzle-orm";
import { db } from "~/db";
import { users } from "~/db/schema";
import { DevUI } from "~/components/dev-ui";
import { SiteHeader } from "~/components/landing/site-header";
import { Hero } from "~/components/landing/hero";
import { HowItWorks } from "~/components/landing/how-it-works";
import { FeaturedCourses } from "~/components/landing/featured-courses";
import { CallToAction } from "~/components/landing/call-to-action";
import { SiteFooter } from "~/components/landing/site-footer";
import { landing } from "~/modules/landing/index.server";
import { getCurrentUserId, getDevCountry } from "~/lib/session";
import { getCountryTierInfo, COUNTRIES } from "~/lib/ppp";

function getAllUsers() {
  return db.select().from(users).all();
}

function getUserById(id: number) {
  return db.select().from(users).where(eq(users.id, id)).get();
}

export function meta() {
  return [
    { title: "Cadence — Learn at your own pace" },
    {
      name: "description",
      content:
        "A modern course platform for developers. Browse courses, track your progress, and learn at your own pace.",
    },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const { featuredCourses, stats } = landing.get();
  const currentUserId = await getCurrentUserId(request);
  const currentUser = currentUserId ? getUserById(currentUserId) : null;
  const devCountry = await getDevCountry(request);

  return {
    featuredCourses,
    stats,
    users: getAllUsers().map((u) => ({ id: u.id, name: u.name, role: u.role })),
    currentUser: currentUser
      ? { id: currentUser.id, name: currentUser.name, role: currentUser.role }
      : null,
    devCountry,
    countryTierInfo: getCountryTierInfo(devCountry),
    countries: COUNTRIES,
  };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { featuredCourses, stats, currentUser } = loaderData;
  const signedIn = currentUser !== null;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader signedIn={signedIn} />
      <main>
        <Hero stats={stats} courses={featuredCourses} signedIn={signedIn} />
        <HowItWorks />
        <FeaturedCourses courses={featuredCourses} />
        <CallToAction signedIn={signedIn} />
      </main>
      <SiteFooter />
      <DevUI
        users={loaderData.users}
        currentUser={currentUser}
        devCountry={loaderData.devCountry}
        countryTierInfo={loaderData.countryTierInfo}
        countries={loaderData.countries}
      />
    </div>
  );
}
