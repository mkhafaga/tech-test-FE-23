import { Box, styled } from "@mui/material";

const StyledLabel = styled(Box)`
height: 48px;
width: 151px;
`;

const StyledTextWrapper = styled(Box)`
color: #272b30;
font-family: "Inter-SemiBold", Helvetica;
font-size: 40px;
font-weight: 600;
left: 0;
letter-spacing: -0.8px;
line-height: 48px;
position: fixed;
top: 0;
white-space: nowrap;
`;
export const PageTitle = () => {
    return (
        <StyledLabel>
            <StyledTextWrapper>Payouts</StyledTextWrapper>
        </StyledLabel>
    );
};