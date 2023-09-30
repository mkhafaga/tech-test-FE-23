import {styled, TextField, } from "@mui/material";
import {OutlinedTextFieldProps} from "@mui/material/TextField/TextField";
import {ChangeEventHandler} from "react";

const StyledContainer = styled('div')`
  display: flex;
  flex-direction: row;
  flex: 1;
  justify-content: flex-end;
`;
const StyledSearchField = ({value, onChange}:{
  value?: string,
  onChange?: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> | undefined
}) => {
  return (
      <StyledContainer>
        <TextField
            data-role="searchbox"
            size='small'
            id="filled-search"
            label="Search username"
            type="search"
            variant="outlined"
            value={value}
            onChange={onChange}
            autoComplete='off'
        />
      </StyledContainer>
  );
};

export default StyledSearchField;
