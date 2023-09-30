import {styled} from "@mui/material";
import {BoldBox} from "./BoldBox";

export const StyledChip = styled(BoldBox) <{ value: string }>`
  background-color: ${props => props.value === 'Pending' ? 'rgba(111, 118, 126, 0.4)' : 'rgba(96, 202, 87, 1)'};
  color: black;
  padding: 5px;
  border-radius: 3px;
`;
