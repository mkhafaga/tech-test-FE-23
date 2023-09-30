import PayoutsPage from "./PayoutsPage";
import {paginatePayouts} from "@/app/services/PayoutsService";
import {PayoutsWithMetadata} from "@/app/types/Payout";

export default async function Home() {
  const paginatedData: PayoutsWithMetadata = await paginatePayouts(1, 10);
  // NOTE: Styled components don't support server-side rendering
  // ref: https://github.com/mui/mui-x/issues/7599
  return (
    <PayoutsPage
      initialPageState={{
          data: paginatedData.data,
          total: paginatedData.metadata.totalCount
      }}
    />
  )
}
