import {styled} from "@mui/material";
import StyledColoredBox from "@/app/components/StyledColoredBox";
import React from "react";

 const TitleContainer = styled('div')`
   display: flex;
   flexDirection: row;
   flex: 1;
   alignItems: center;
 `;

 const Title = styled('div')`
   align-self: center;
   font-weight: bold;
   font-size: 18px;
 `;
 const WidgetTitle = () => {
    return(
        <TitleContainer>
            <StyledColoredBox />
            <Title>Payout History</Title>
        </TitleContainer>
    );
}

export default WidgetTitle;
