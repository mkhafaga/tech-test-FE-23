import {Payout, PayoutsWithMetadata} from "../types";

const PAYOUTS_LIST_API_URL = process.env.NEXT_PUBLIC_PAYOUTS_LIST_API_URL || 'https://theseus-staging.lithium.ventures/api/v1/analytics/tech-test/payouts';
const PAYOUTS_SEARCH_API_URL = process.env.NEXT_PUBLIC_PAYOUTS_SEARCH_API_URL || 'https://theseus-staging.lithium.ventures/api/v1/analytics/tech-test/search';

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
    const url = new URL(PAYOUTS_LIST_API_URL);
    url.searchParams.append("page", page.toString());
    url.searchParams.append("limit", limit.toString());

    const response = await fetch(url.toString(), {'cache': 'no-store'});
    const data = await response.json();
    // add unique ids
    data.data = data.data.map((item: object, id: number) => ({
        id,
        ...item
    }));
    return data;
};

/**
 * Implement searchPaypouts. The service function is responsible for searching payouts by fetching https://theseus-staging.lithium.ventures/api/v1/analytics/tech-test/search?query=
 * and returning the data.
 * Fetches the payouts data from the API and returns it.
 * @returns {Promise<Index[]>}
 */
export const searchPayouts = async (query: string): Promise<Payout[]> => {
    const url = new URL(PAYOUTS_SEARCH_API_URL);
    url.searchParams.append("query", query);
    const response = await fetch(url.toString());
    const data = await response.json();
    return data.map((item: object, id: number) => ({
        id,
        ...item
    }));
};
