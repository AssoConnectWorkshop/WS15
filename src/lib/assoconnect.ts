import "server-only";

const BASE_URL = "https://app.assoconnect.com/api/v1";

export type Organization = {
  "@id": string;
  "@type": string;
  brand: string;
  isAdvanced: boolean;
  isLegalIndependent: boolean;
  logoUrl: string;
  name: string;
  parent: string | null;
  phoneNumber: string;
  url: string;
};

export type StatsCrm = {
  "@id": string;
  "@type": string;
  people: number;
  structures: number;
  inSubscription: number;
};

export type CollectionResponse<T> = {
  "@context": string;
  "@id": string;
  "@type": string;
  "hydra:totalItems": number;
  "hydra:member": T[];
};

export type Contact = {
  "@id": string;
  "@type": string;
  id: string;
  firstName?: string;
  lastName?: string;
  companyName?: string;
  email?: string;
  createdAt?: string;
  type: "PERSON" | "STRUCTURE";
};

export type Collect = {
  "@id": string;
  "@type": string;
  name: string;
  status: string;
};

export type Nonprofit = {
  "@id": string;
  "@type": string;
  name: string;
  siret?: string;
  rna?: string;
};

export type AccountingYear = {
  "@id": string;
  "@type": string;
  label: string;
  startDate: string;
  endDate: string;
  status: string;
};

async function request<T>(path: string): Promise<T> {
  const token = process.env.ASSOCONNECT_API_KEY;
  if (!token) throw new Error("ASSOCONNECT_API_KEY is not set");

  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      Accept: "application/ld+json",
      "X-AUTH-TOKEN": token,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`AssoConnect ${path} failed: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}

function orgUlid() {
  const ulid = process.env.ASSOCONNECT_ORGANIZATION_ULID;
  if (!ulid) throw new Error("ASSOCONNECT_ORGANIZATION_ULID is not set");
  return ulid;
}

export function getOrganization(ulid = orgUlid()) {
  return request<Organization>(`/organizations/${ulid}`);
}

export function getStatsCrm(ulid = orgUlid()) {
  return request<StatsCrm>(`/organizations/${ulid}/stats_crm`);
}

export function getCollects(ulid = orgUlid()) {
  return request<CollectionResponse<Collect>>(`/organizations/${ulid}/collects`);
}

export function getNonprofit(ulid = orgUlid()) {
  return request<Nonprofit>(`/organizations/${ulid}/nonprofit`);
}

export function getAccountingYears(nonprofitId: string) {
  return request<CollectionResponse<AccountingYear>>(`/nonprofits/${nonprofitId}/accounting_years`);
}

export function getContacts(ulid = orgUlid(), page = 1, perPage = 30) {
  return request<CollectionResponse<Contact>>(
    `/organizations/${ulid}/contacts?page=${page}&itemsPerPage=${perPage}&order[createdAt]=desc`
  );
}

export type EventCollect = {
  "@id": string;
  "@type": string;
  id: string;
  name: string;
  status: string;
  bookingStartsAt: string | null;
  bookingEndsAt: string | null;
  availability: string;
};

export type AccountingEntry = {
  "@id": string;
  "@type": string;
  id: string;
  name: string;
  type: "DEBIT" | "CREDIT";
  amount: string;
  date: string;
  currency: string;
  account: {
    "@id": string;
    "@type": string;
    accountNumber: number;
    officialName: string;
    displayName: string;
    type: "INCOME" | "EXPENSE" | "TREASURY" | "OTHER";
  };
};

export function getEventCollects(ulid = orgUlid()) {
  return request<CollectionResponse<EventCollect>>(
    `/organizations/${ulid}/collects?type=EVENT`
  );
}

export function getAccountingEntries(ulid = orgUlid()) {
  return request<CollectionResponse<AccountingEntry>>(
    `/organizations/${ulid}/accounting_entries?itemsPerPage=50`
  );
}
