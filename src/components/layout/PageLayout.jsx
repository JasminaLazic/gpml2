import React from 'react';
import styled from 'styled-components';
import Header from './Header';
import { Outlet } from "react-router-dom";

const Container = styled.div`
	flex: 1;
	height: 100%;
	display: flex;
    flex-direction: column;
`;

const DisclainerContainer = styled.div`
	width: 100%;
	background-color: #27ae60;
    color: #fff;
    text-align: left;
    padding: 0.13rem;
    padding-left: 1%;
    padding-right: 1%;
    font-size: 11.5px;
`;

const PageLayout = () => {
	return (
		<Container>
			<DisclainerContainer>
				Disclaimer: The boundaries and names shown, and the designations used in all content hosted 
				on this hub site do not imply official endorsement or acceptance by the United Nations. 
				Additionally, please note that the Data Hub provides linkages to databases and other resources 
				types which may be owned by external sources. UNEP should not be held accountable for boundaries, 
				names and designation adopted in external sources.
			</DisclainerContainer>
			<Header />
			<Outlet />
		</Container>
	);
};

export default PageLayout;
