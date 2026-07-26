export type PaldexSearchParams = Record<string, string | string[] | undefined>;

export function serializeInitialPaldexQuery(params: PaldexSearchParams | undefined): string {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params ?? {})) {
    if (Array.isArray(value)) value.forEach((item) => query.append(key, item));
    else if (typeof value === "string") query.set(key, value);
  }
  return query.toString();
}
