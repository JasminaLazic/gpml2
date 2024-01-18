import React from 'react';
import styled from 'styled-components';
import { Button, Menu, Dropdown } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';

import { sortOptionsData } from '../../constants/sorting';

const Container = styled.div`
	padding-bottom: 20px;
	padding-top: 40px;
	width: 100%;
	background-color: #D3DEE726;
`;

const Content = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;

	&:before {
		content: none;
	}

	&:after {
		content: none;
	}
`;

const PagingIndicator = styled.div`
	width: 128px;
	height: 31px;
	background: rgba(211, 222, 231, 0.5);
	border-radius: 10px;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #18162F;
	font-style: normal;
	font-weight: 400;
	font-size: 12px;
	line-height: 142%;
	letter-spacing: 0.005em;
	text-transform: capitalize;
`;

const SortIconContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	margin-left: 5px;
`;

const SortIconImage = styled.img`
	height: 32px;
`;

const SortingContainer = styled.div`
	height: 40px;
	border: 2px solid #255B87;
	border-radius: 4px;
	display: flex;
	align-items: center;
`;

const SortLabel = styled.span`
	font-size: 14px;
	color: #255B87;
	margin: 0px 5px 0px 10px;
`;

const SortValue = styled.span`
	font-size: 14px;
	color: #255B87;
	font-weight: 600;
`;

const MenuItem = styled(Menu.Item)`
	display: flex;
	justify-content: space-between;
	align-items: center;
	color: #2d6796;
	height: 30px;
	border-bottom: ${props => props.$hasBottomBorder ? 1 : 0}px solid #00aaf1;
	${props => props.$isSelected && 'background-color: #d7d5d5;'}
`;

const DownloadContainer = styled.div``;

const DownloadButton = styled(Button)`
    border: 2px solid #18162F;
	align-self: center;
	color: #18162F;
	margin: 0px 13px;
	background-color: #D3DEE726;

	font-weight: 500;
	font-size: 14px;
	line-height: 20px;

	&:hover {
		border: 2px solid #18162F;
		background-color: #D3DEE726;
		color: #18162F;
	}

	outline: none;
`;

const FilterAndPageingIndicator = ({ searchFilterData, setSearchFilterData, datasetSize, pagingSize }) => {
	function getSelectedSortLabel() {
		const selectedSortOption = sortOptionsData.find(({ key }) => key === searchFilterData.sort);
		return selectedSortOption?.displayName;
	}

	const downloadFile = (link) => {
		const element = document.createElement('a');
		element.setAttribute('href', link);
		element.style.display = 'none';
		element.setAttribute('target', '_blank')
		document.body.appendChild(element);
	
		element.click();
	
		document.body.removeChild(element);
	};

	function handleDownloadFullDataList() {
		downloadFile('https://unepazecosysadlsstorage.blob.core.windows.net/publicfiles/DatasetsList_20220830.pdf');
	}

	function handleDownloadSourceInverntory() {
		downloadFile('https://unepazecosysadlsstorage.blob.core.windows.net/publicfiles/ProposedIndicatorsList_20220901.pdf');
	}

	function handleChangeSorting({ key }) {
		setSearchFilterData((prevState) => ({
			...prevState,
			sort: key,
		}));
	}

	const sortMenu = (
		<Menu onClick={handleChangeSorting}>
			{sortOptionsData.map(({ key, displayName }, index) => (
				<MenuItem key={key} $isSelected={displayName === getSelectedSortLabel()}>
					{displayName}
				</MenuItem>
			))}
		</Menu>
	);


	function getPagingIndicatorData() {
		if (!datasetSize) {
			return 'Showing 0 Of 0';
		}
		if (pagingSize >= datasetSize) {
			return `Showing ${datasetSize} Of ${datasetSize}`;
		}

		return `Showing ${pagingSize} Of ${datasetSize}`;
	}

	return (
		<Container>
			<Content className="container">
				<PagingIndicator>
					{getPagingIndicatorData()}
				</PagingIndicator>
				<DownloadContainer>
					<DownloadButton
						shape="round"
						icon={<DownloadOutlined />}
						onClick={handleDownloadFullDataList}
						size="large"
					>
						Full List of Data Layers
					</DownloadButton>
					<DownloadButton
						shape="round"
						icon={<DownloadOutlined />}
						onClick={handleDownloadSourceInverntory}
						size="large"
					>
						National Source Inventory
					</DownloadButton>
				</DownloadContainer>
				<Dropdown overlay={sortMenu}>
					<SortingContainer id="sort-section">
						<SortIconContainer>
							<SortIconImage src="/sort-icon.svg" />
						</SortIconContainer>
						<SortLabel>Sort by: <SortValue>{getSelectedSortLabel()}</SortValue></SortLabel>
					</SortingContainer>
				</Dropdown>
			</Content>
		</Container>
	)
}

export default FilterAndPageingIndicator