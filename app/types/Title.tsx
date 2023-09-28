import { Box, Typography, styled } from "@mui/material";

const StyledTitle = styled(Box)`
align-items: center;
display: inline-flex;
gap: 16px;
position: relative;
`;

const StyledTag = styled(Box)`
background-color: rgba(153, 157, 255, 1);;
border-radius: 4px;
height: 32px;
position: relative;
width: 16px;`;

const StyledOverview = styled(Box)`
color: #1a1d1f;
font-family: "Inter-SemiBold", Helvetica;
font-size: 20px;
font-weight: 600;
left: 0;
letter-spacing: -0.4px;
line-height: 32px;
position: fixed;
top: 0;
white-space: nowrap;`;

export const Title = () => {
    return (
        <StyledTitle>
            <StyledTag />
            <StyledOverview>Payout History</StyledOverview>
        </StyledTitle>
        // <StyledOverview>Payout History</StyledOverview>
    );
};