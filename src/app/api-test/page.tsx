import {
  getOrganization,
  getStatsCrm,
  getCollects,
  getNonprofit,
  getAccountingYears,
} from "@/lib/assoconnect";

export const dynamic = "force-dynamic";

type TestResult = {
  label: string;
  status: "ok" | "error";
  detail: string;
  data?: unknown;
};

async function run(
  label: string,
  fn: () => Promise<unknown>
): Promise<TestResult> {
  try {
    const data = await fn();
    return { label, status: "ok", detail: "200 OK", data };
  } catch (e) {
    return {
      label,
      status: "error",
      detail: e instanceof Error ? e.message : String(e),
    };
  }
}

export default async function ApiTestPage() {
  const envResults: TestResult[] = [
    {
      label: "ASSOCONNECT_API_KEY",
      status: process.env.ASSOCONNECT_API_KEY ? "ok" : "error",
      detail: process.env.ASSOCONNECT_API_KEY ? "présente" : "manquante",
    },
    {
      label: "ASSOCONNECT_ORGANIZATION_ULID",
      status: process.env.ASSOCONNECT_ORGANIZATION_ULID ? "ok" : "error",
      detail:
        process.env.ASSOCONNECT_ORGANIZATION_ULID ??
        "manquante",
    },
  ];

  const apiResults = await Promise.all([
    run("GET /organizations/{ulid}", getOrganization),
    run("GET /organizations/{ulid}/stats_crm", getStatsCrm),
    run("GET /organizations/{ulid}/collects", getCollects),
    run("GET /organizations/{ulid}/nonprofit", async () => {
      const nonprofit = await getNonprofit();
      const nonprofitId = nonprofit["@id"].split("/").pop()!;
      const years = await getAccountingYears(nonprofitId);
      return { nonprofit, accountingYears: years["hydra:member"] };
    }),
  ]);

  const allResults = [...envResults, ...apiResults];

  return (
    <main className="mx-auto max-w-3xl p-8 font-mono text-sm">
      <h1 className="mb-2 text-2xl font-bold">AssoConnect API — test de connexion</h1>
      <p className="mb-6 text-xs opacity-50">Base URL: https://app.assoconnect.com/api/v1</p>

      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b text-left text-xs uppercase tracking-widest opacity-50">
            <th className="pb-2 pr-4 w-8">St.</th>
            <th className="pb-2 pr-4">Endpoint</th>
            <th className="pb-2">Détail</th>
          </tr>
        </thead>
        <tbody>
          {allResults.map((r) => (
            <tr key={r.label} className="border-b last:border-0">
              <td className="py-2 pr-4">
                <span className={r.status === "ok" ? "text-green-600" : "text-red-600"}>
                  {r.status === "ok" ? "✓" : "✗"}
                </span>
              </td>
              <td className="py-2 pr-4 font-medium">{r.label}</td>
              <td className="py-2 opacity-70">{r.detail}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-8 space-y-4">
        {apiResults.map(
          (r) =>
            r.data && (
              <details key={r.label}>
                <summary className="cursor-pointer font-semibold">{r.label}</summary>
                <pre className="mt-2 overflow-x-auto rounded-md bg-gray-100 p-4 text-xs">
                  {JSON.stringify(r.data, null, 2)}
                </pre>
              </details>
            )
        )}
      </div>
    </main>
  );
}
