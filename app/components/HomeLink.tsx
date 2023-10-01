import styled from '@mui/material/styles/styled';
import Link from '@mui/material/Link';
import HomeIcon from '@mui/icons-material/Home';

const StyledLink = styled(Link)`
  display: flex;
  align-items: center;
  margin-top: 10px;
`;
const HomeLink = ({value}:{value:string}) => (
    <StyledLink href="/">{value}<HomeIcon/></StyledLink>
);

export default HomeLink;
