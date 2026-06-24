import { getOrganization } from "@/lib/assoconnect";

export const dynamic = "force-dynamic";

export default async function ApiTestPage() {
  const results: { label: string; status: "ok" | "error" | "warn"; detail: string }[] = [];

  // Check env vars
  const hasToken = !!process.env.ASSOCONNECT_API_KEY;
  const hasOrgUlid = !!process.env.ASSOCONNECT_ORGANIZATION_ULID;

  results.push({
    label: "ASSOCONNECT_API_KEY",
    status: hasToken ? "ok" : "error",
    detail: hasToken ? "présente" : "manquante",
  });
  results.push({
    label: "ASSOCONNECT_ORGANIZATION_ULID",
    status: hasOrgUlid ? "ok" : "error",
    detail: hasOrgUlid
      ? process.env.ASSOCONNECT_ORGANIZATION_ULID!
      : "manquante",
  });

  // Test GET /organizations/{ulid}
  let rawOrg: unknown = null;
  try {
    rawOrg = await getOrganization();
    results.push({
      label: "GET /organizations/{ulid}",
      status: "ok",
      detail: "200 OK",
    });
  } catch (e) {
    results.push({
      label: "GET /organizations/{ulid}",
      status: "error",
      detail: e instanceof Error ? e.message : String(e),
    });
  }

  return (
    <main className="mx-auto max-w-2xl p-8 font-mono text-sm">
      <h1 className="mb-6 text-2xl font-bold">AssoConnect API — test de connexion</h1>

      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b text-left text-xs uppercase tracking-widest opacity-50">
            <th className="pb-2 pr-4">Test</th>
            <th className="pb-2 pr-4">Statut</th>
            <th className="pb-2">Détail</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r) => (
            <tr key={r.label} className="border-b last:border-0">
              <td className="py-2 pr-4 font-medium">{r.label}</td>
              <td className="py-2 pr-4">
                <span
                  className={
                    r.status === "ok"
                      ? "text-green-600"
                      : r.status === "warn"
                        ? "text-yellow-600"
                        : "text-red-600"
                  }
                >
                  {r.status === "ok" ? "✓" : r.status === "warn" ? "⚠" : "✗"}
                </span>
              </td>
              <td className="py-2 opacity-70">{r.detail}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {rawOrg && (
        <details className="mt-8">
          <summary className="cursor-pointer font-semibold">
            Réponse brute /organizations
          </summary>
          <pre className="mt-3 overflow-x-auto rounded-md bg-gray-100 p-4 text-xs">
            {JSON.stringify(rawOrg, null, 2)}
          </pre>
        </details>
      )}
    </main>
  );
}
