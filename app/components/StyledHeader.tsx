import {Box, styled} from "@mui/material";

const StyledHead = styled(Box)`
  margin-left: 40px;
`;

const StyledHeader = ({value}: {value: string}) => {
    return (
        <StyledHead>
            <h2>{value}</h2>
        </StyledHead>
    );
}

export default StyledHeader;
