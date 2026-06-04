import { Router, type IRouter, type Request, type Response } from "express";
import { db, validationsTable, errorReportsTable } from "@workspace/db";
import { eq, and, sql, desc, max } from "drizzle-orm";
const router: IRouter = Router();

const COMMUNITY_THRESHOLD = 3;

function getStatus(validationCount: number): "ki_recherchiert" | "community_geprueft" {
  return validationCount >= COMMUNITY_THRESHOLD ? "community_geprueft" : "ki_recherchiert";
}

router.get("/validations/stats", async (req: Request, res: Response) => {
  const userId = req.isAuthenticated() ? req.user.id : null;

  const valCounts = await db
    .select({
      assumptionId: validationsTable.assumptionId,
      count: sql<number>`cast(count(*) as int)`,
    })
    .from(validationsTable)
    .groupBy(validationsTable.assumptionId);

  const errCounts = await db
    .select({
      assumptionId: errorReportsTable.assumptionId,
      count: sql<number>`cast(count(*) as int)`,
    })
    .from(errorReportsTable)
    .groupBy(errorReportsTable.assumptionId);

  let myValidations: { assumptionId: string }[] = [];
  if (userId) {
    myValidations = await db
      .select({ assumptionId: validationsTable.assumptionId })
      .from(validationsTable)
      .where(eq(validationsTable.userId, userId));
  }

  const mySet = new Set(myValidations.map((v) => v.assumptionId));
  const valMap = new Map(valCounts.map((r) => [r.assumptionId, r.count]));
  const errMap = new Map(errCounts.map((r) => [r.assumptionId, r.count]));

  const allIds = new Set([...valMap.keys(), ...errMap.keys()]);

  const stats = Array.from(allIds).map((id) => {
    const vCount = valMap.get(id) ?? 0;
    return {
      assumptionId: id,
      validationCount: vCount,
      errorCount: errMap.get(id) ?? 0,
      status: getStatus(vCount),
      myValidation: mySet.has(id),
    };
  });

  res.json({ stats });
});

router.post("/validations/:assumptionId", async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Nicht eingeloggt" });
    return;
  }

  const { assumptionId } = req.params;
  const userId = req.user.id;

  try {
    await db
      .insert(validationsTable)
      .values({ assumptionId, userId })
      .onConflictDoNothing();
    res.json({ ok: true });
  } catch {
    res.status(409).json({ error: "Bereits bestätigt" });
  }
});

router.delete("/validations/:assumptionId", async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Nicht eingeloggt" });
    return;
  }

  const { assumptionId } = req.params;
  const userId = req.user.id;

  await db
    .delete(validationsTable)
    .where(and(eq(validationsTable.assumptionId, assumptionId), eq(validationsTable.userId, userId)));

  res.json({ ok: true });
});

router.post("/reports/:assumptionId", async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Nicht eingeloggt" });
    return;
  }

  const reason = typeof req.body?.reason === "string" ? req.body.reason.trim() : "";
  if (!reason || reason.length > 1000) {
    res.status(400).json({ error: "Ungültige Eingabe" });
    return;
  }

  const { assumptionId } = req.params;
  const userId = req.user.id;

  await db.insert(errorReportsTable).values({ assumptionId, userId, reason });
  res.json({ ok: true });
});

router.get("/admin/overview", async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Nicht eingeloggt" });
    return;
  }

  const valRows = await db
    .select({
      assumptionId: validationsTable.assumptionId,
      count: sql<number>`cast(count(*) as int)`,
      lastValidatedAt: max(validationsTable.createdAt),
    })
    .from(validationsTable)
    .groupBy(validationsTable.assumptionId)
    .orderBy(desc(max(validationsTable.createdAt)));

  const errRows = await db
    .select({
      assumptionId: errorReportsTable.assumptionId,
      count: sql<number>`cast(count(*) as int)`,
    })
    .from(errorReportsTable)
    .groupBy(errorReportsTable.assumptionId);

  const errMap = new Map(errRows.map((r) => [r.assumptionId, r.count]));

  const rows = valRows.map((r) => ({
    assumptionId: r.assumptionId,
    validationCount: r.count,
    errorCount: errMap.get(r.assumptionId) ?? 0,
    lastValidatedAt: r.lastValidatedAt?.toISOString() ?? null,
    status: getStatus(r.count),
  }));

  res.json({ rows });
});

export default router;
