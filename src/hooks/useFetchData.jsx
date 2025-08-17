import { useEffect, useState } from "react";

// Small helper to wait before next request
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const useFetch = (
  url,
  { page = 1, autoPaginate = false, uniqueById = false } = {},
  initialData = []
) => {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasNextPage, setHasNextPage] = useState(false);

  useEffect(() => {
    if (!url) return;

    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        //  Respect API limit: max 3 req/sec
        await sleep(333);

        const response = await fetch(`${url}?page=${page}`, { signal });

        if (!response.ok) {
          throw new Error(`Request failed: ${response.status}`);
        }

        const result = await response.json();
        const incomingData = result?.data || [];

        setData((prev) => {
          if (!autoPaginate) {
            // replace data if not paginating
            return incomingData;
          }

          //  Pagination: append + remove duplicates if uniqueById = true
          const merged = [...prev, ...incomingData];

          if (uniqueById) {
            return Array.from(
              new Map(merged.map((item) => [item.mal_id, item])).values()
            );
          }

          return merged;
        });

        setHasNextPage(result?.pagination?.has_next_page || false);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError({ message: err.message || "Something went wrong" });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => controller.abort();
  }, [url, page, autoPaginate, uniqueById]);

  return { data, loading, error, hasNextPage };
};

export default useFetch;
