import { db } from "@/db";
import { optimizationPlans } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

const profiles = new Set(["Everyday", "Gaming", "Creator", "AI / Dev"]);
const visitorPattern = /^[A-Za-z0-9-]{8,120}$/;
const stepPattern = /^[a-z0-9-]{1,40}(:\d{1,3})?$/;

async function findPlan(visitorId: string) {
  const [plan] = await db
    .select()
    .from(optimizationPlans)
    .where(eq(optimizationPlans.visitorId, visitorId))
    .orderBy(desc(optimizationPlans.updatedAt))
    .limit(1);
  return plan ?? null;
}

export async function GET(request: Request) {
  const visitorId = new URL(request.url).searchParams.get("visitorId") ?? "";

  if (!visitorPattern.test(visitorId)) {
    return Response.json({ plan: null });
  }

  try {
    return Response.json({ plan: await findPlan(visitorId) });
  } catch {
    return Response.json({ error: "Unable to load your plan right now." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  let body: { visitorId?: unknown; profile?: unknown; completedSteps?: unknown };

  try {
    body = (await request.json()) as typeof body;
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const visitorId = typeof body.visitorId === "string" ? body.visitorId : "";
  const profile = typeof body.profile === "string" ? body.profile : "";

  if (!visitorPattern.test(visitorId) || !profiles.has(profile)) {
    return Response.json({ error: "A valid visitor and setup lane are required." }, { status: 400 });
  }

  const completedSteps = Array.isArray(body.completedSteps)
    ? [
        ...new Set(
          body.completedSteps.filter(
            (step): step is string => typeof step === "string" && stepPattern.test(step),
          ),
        ),
      ].slice(0, 600)
    : [];

  try {
    const existing = await findPlan(visitorId);

    if (existing) {
      const [plan] = await db
        .update(optimizationPlans)
        .set({ profile, completedSteps, updatedAt: new Date() })
        .where(eq(optimizationPlans.id, existing.id))
        .returning();
      return Response.json({ plan });
    }

    const [plan] = await db
      .insert(optimizationPlans)
      .values({ visitorId, profile, completedSteps })
      .returning();
    return Response.json({ plan }, { status: 201 });
  } catch {
    return Response.json({ error: "Unable to save your plan right now." }, { status: 500 });
  }
}
