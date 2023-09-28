/**
 * Implement PaypoutService. The service is repsobsible for listing payouts by fetching https://theseus-staging.lithium.ventures/api/v1/analytics/tech-test/payouts
 * and returning the data.
 */

    /**
     * Fetches the payouts data from the API and returns it.
     * @returns {Promise<Payout[]>}
     */
    import {PayoutsWithMetadata} from '../types/Payout';


        /**
         * Fetches the payouts data from the API and returns it.
         * @returns {Promise<PayoutsWithMetadata>}
         */
        export const fetchPayouts = async (page = 1, limit = 10): Promise<PayoutsWithMetadata> => {
            const url = new URL('https://theseus-staging.lithium.ventures/api/v1/analytics/tech-test/payouts');
            url.searchParams.append('page', page.toString());
            url.searchParams.append('limit', limit.toString());
            const response = await fetch(url.toString());
            const data = await response.json();
            console.log(`Here: ${JSON.stringify(data)}`);
            return data;
        };




