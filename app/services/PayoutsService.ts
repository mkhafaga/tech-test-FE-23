import { Payout, PayoutsWithMetadata } from "../types/Payout";

/**
 * Implement PaypoutService. The service function is responsible for listing payouts by fetching https://theseus-staging.lithium.ventures/api/v1/analytics/tech-test/payouts
 * and returning the data.
 * Fetches the payouts data from the API and returns it.
 * @returns {Promise<PayoutsWithMetadata>}
 */
export const paginatePayouts = async (
  page = 1,
  limit = 10
): Promise<PayoutsWithMetadata> => {
  const url = new URL(
    "https://theseus-staging.lithium.ventures/api/v1/analytics/tech-test/payouts"
  );
  url.searchParams.append("page", page.toString());
  url.searchParams.append("limit", limit.toString());
  const response = await fetch(url.toString());
  const data = await response.json();
  return data;
};

/**
 * Implement searchPaypouts. The service function is responsible for searching payouts by fetching https://theseus-staging.lithium.ventures/api/v1/analytics/tech-test/search?query=
 * and returning the data.
 * Fetches the payouts data from the API and returns it.
 * @returns {Promise<Payout[]>}
 */
export const searchPayouts = async (query: string): Promise<Payout[]> => {
  const url = new URL(
    "https://theseus-staging.lithium.ventures/api/v1/analytics/tech-test/search"
  );
  url.searchParams.append("query", query);
  const response = await fetch(url.toString());
  const data = await response.json();
  return data;
};
