import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PayoutsPage from '../app/PayoutsPage';
import '@testing-library/jest-dom'
import {Payout} from "../app/types";
import { searchPayouts, paginatePayouts } from '../app/services/PayoutsService';

const payout =  {   id: 1,
    username: 'Khafaga',
    status: 'Completed',
    dateAndTime: '2023-09-14T00:00:00.000Z',
    value: '$12',
};

const payouts =[
    {   id: 1,
        username: 'Khafaga',
        status: 'Completed',
        dateAndTime: '2023-09-14T00:00:00.000Z',
        value: '$12',
    },
    {   id: 2,
        username: 'Khafaga',
        status: 'Completed',
        dateAndTime: '2023-09-14T00:00:00.000Z',
        value: '$12',
    },
    {   id: 3,
        username: 'Khafaga',
        status: 'Completed',
        dateAndTime: '2023-09-14T00:00:00.000Z',
        value: '$12',
    },
    {   id: 4,
        username: 'Khafaga',
        status: 'Completed',
        dateAndTime: '2023-09-14T00:00:00.000Z',
        value: '$12',
    },
    {   id: 5,
        username: 'Khafaga',
        status: 'Completed',
        dateAndTime: '2023-09-14T00:00:00.000Z',
        value: '$12',
    },
    {   id: 6,
        username: 'Khafaga',
        status: 'Completed',
        dateAndTime: '2023-09-14T00:00:00.000Z',
        value: '$12',
    },{   id: 7,
        username: 'Khafaga',
        status: 'Completed',
        dateAndTime: '2023-09-14T00:00:00.000Z',
        value: '$12',
    },{   id: 8,
        username: 'Khafaga',
        status: 'Completed',
        dateAndTime: '2023-09-14T00:00:00.000Z',
        value: '$12',
    },
    {   id: 9,
        username: 'Khafaga',
        status: 'Completed',
        dateAndTime: '2023-09-14T00:00:00.000Z',
        value: '$12',
    },{   id: 10,
        username: 'Khafaga',
        status: 'Completed',
        dateAndTime: '2023-09-14T00:00:00.000Z',
        value: '$12',
    },
    {   id: 11,
        username: 'Khafaga',
        status: 'Completed',
        dateAndTime: '2023-09-14T00:00:00.000Z',
        value: '$12',
    },



];
jest.mock('../app/services/PayoutsService', () => ({
    paginatePayouts: jest.fn(() => Promise.resolve({ data: [
            payout
        ], metadata: { totalCount: 1 } })),
    searchPayouts: jest.fn(() => Promise.resolve([payout])),
}));

describe('PayoutsPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders the data grid', () => {
        render(<PayoutsPage
            initialPageState={{
                data: [payout as Payout],
                total: 1,
            }}
        />);
        const dataGrid = screen.getByRole('grid');
        expect(dataGrid).toBeInTheDocument();
    });

    it('calls paginatePayouts with the correct arguments when the page changes', async () => {
        render(<PayoutsPage initialPageState={{
            data: payouts,
            total: payouts.length,
        }}/>);
        const pageButton = screen.getByRole('button', { name: /next page/i });
        fireEvent.click(pageButton);
        await waitFor(() => expect(paginatePayouts).toHaveBeenCalledWith(1, 10));
    });

    it('calls searchPayouts with the correct arguments when the search text changes', async () => {
        render(<PayoutsPage initialPageState={{
            data: [{
                id: 1,
                username: 'Khafaga',
                status: 'Completed',
                dateAndTime: '2023-09-14T00:00:00.000Z',
                value: '$12',
            } as Payout],
            total: 1,
        }}/>);


        const searchField = screen.getByRole('searchbox');
        console.log(`searchField is: ${searchField}`);
        fireEvent.change(searchField, { target: { value: 'test' } });
        await waitFor(() => expect(searchPayouts).toHaveBeenCalledWith('test'), { timeout: 2000 });
    });
});
