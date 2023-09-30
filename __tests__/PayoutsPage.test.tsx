import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import PayoutsPage from '../app/PayoutsPage';
import '@testing-library/jest-dom'
import {searchPayouts, paginatePayouts} from '../app/services/PayoutsService';

const payouts = [
    {
        id: 1,
        username: 'mo',
        status: 'Completed',
        dateAndTime: '2023-09-14T00:00:00.000Z',
        value: '$2312',
    },
    {
        id: 2,
        username: 'khafaga',
        status: 'Completed',
        dateAndTime: '2023-09-14T00:00:00.000Z',
        value: '$1342',
    },
    {
        id: 3,
        username: 'tom',
        status: 'Pending',
        dateAndTime: '2023-09-14T00:00:00.000Z',
        value: '$14442',
    },
    {
        id: 4,
        username: 'william',
        status: 'Pending',
        dateAndTime: '2023-09-14T00:00:00.000Z',
        value: '$12344',
    },
    {
        id: 5,
        username: 'james',
        status: 'Completed',
        dateAndTime: '2023-09-14T00:00:00.000Z',
        value: '$1882',
    },
    {
        id: 6,
        username: 'Khafaga',
        status: 'Completed',
        dateAndTime: '2023-09-14T00:00:00.000Z',
        value: '$1562',
    }, {
        id: 7,
        username: 'george',
        status: 'Completed',
        dateAndTime: '2023-09-14T00:00:00.000Z',
        value: '$1342',
    }, {
        id: 8,
        username: 'paul',
        status: 'Completed',
        dateAndTime: '2023-09-14T00:00:00.000Z',
        value: '$1862',
    },
    {
        id: 9,
        username: 'carmen',
        status: 'Completed',
        dateAndTime: '2023-09-14T00:00:00.000Z',
        value: '$19882',
    }, {
        id: 10,
        username: 'julia',
        status: 'Completed',
        dateAndTime: '2023-09-14T00:00:00.000Z',
        value: '$1342',
    },
    {
        id: 11,
        username: 'paula',
        status: 'Completed',
        dateAndTime: '2023-09-14T00:00:00.000Z',
        value: '$15662',
    },

];
jest.mock('../app/services/PayoutsService', () => ({
    paginatePayouts: jest.fn(() => Promise.resolve({
        data: [
            payouts[payouts.length - 1]
        ], metadata: {totalCount: 1}
    })),
    searchPayouts: jest.fn(() => Promise.resolve([payouts[0]])),
}));

describe('PayoutsPage', () => {

    it('renders the data grid', () => {
        render(<PayoutsPage
            initialPageState={{
                data: payouts,
                total: payouts.length
            }}
        />);
        const dataGrid = screen.getByRole('grid');
        // Assert
        expect(dataGrid).toBeInTheDocument();
    });

    it('calls paginatePayouts with the correct arguments when the page changes', async () => {
        // Arrange
        render(<PayoutsPage initialPageState={{
            data: payouts,
            total: payouts.length,
        }}/>);
        const pageButton = screen.getByRole('button', {name: /next page/i});
        // Act
        fireEvent.click(pageButton);
        // Assert
        await waitFor(() => expect(paginatePayouts).toHaveBeenCalledWith(1, 10));
    });

    it('calls searchPayouts with the correct arguments when the search text changes', async () => {
        // Arrange
        render(<PayoutsPage initialPageState={{
            data: [payouts[0]],
            total: 1,
        }}/>);
        const searchField = screen.getByRole('searchbox');
        // Act
        fireEvent.change(searchField, {target: {value: 'test'}});
        // Assert
        await waitFor(() => expect(searchPayouts).toHaveBeenCalledWith('test'), {timeout: 2000});
    });
});
