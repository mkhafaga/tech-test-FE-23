'use client'

import StyledHeader from "@/app/components/StyledHeader";
import CenteredContainer from "@/app/components/CenteredContainer";
import BoldBox from "@/app/components/BoldBox";
import HomeLink from "@/app/components/HomeLink";

const NotFound = () => {
    return (<>
            <StyledHeader value='Not Found'/>
            <CenteredContainer id='centContain'>
                <BoldBox>Could not find requested resource</BoldBox>
                <HomeLink value='Return to Home'/>
            </CenteredContainer>
        </>
    )
}

export default NotFound;
