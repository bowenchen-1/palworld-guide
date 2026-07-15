import { permanentRedirect } from "next/navigation";

type SearchParams = Record<string, string | string[] | undefined>;

// Retain historic calculator links while making the homepage the single source
// of truth for calculator UI, data loading, local storage, and URL state.
export default async function BreedingCalculatorRedirect({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (Array.isArray(value)) value.forEach((item) => query.append(key, item));
    else if (value) query.set(key, value);
  }
  permanentRedirect(query.size ? `/?${query.toString()}` : "/");
}
