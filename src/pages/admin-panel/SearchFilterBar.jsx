import React, { useState } from 'react';
import styled from 'styled-components';
import {  Menu, Dropdown } from 'antd';
import { dataSetPublishedStatuses } from '../../constants/sorting';

const Container = styled.div`
	background-color: #046799;
	padding: 10px;
	position: relative;
`;

const FlexRow = styled.div`
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

const SearchBarWrappe = styled(FlexRow)`
	position: relative;
	width: 100%;
	min-width: 0;
	padding: 4px 11px;
	color: rgba(0,0,0,.85);
	font-size: 14px;
	line-height: 1.5715;
	background-color: #fff;
	background-image: none;
	border: 1px solid #d9d9d9;
	transition: all .3s;
	display: inline-flex;
	border-radius: 30px;
	width: 380px;
`;

const SearchInput = styled.input`
	padding: 0;
	border: none;
	outline: none;
	color: #1ca585;
	box-sizing: border-box;
	margin: 0;
	font-variant: tabular-nums;
	list-style: none;
	display: inline-block;
	width: 100%;
	font-size: 14px;
	line-height: 1.5715;
	background-color: #fff;
	background-image: none;
	transition: all .3s;
	border-radius: 2px;
`;

const SearchButton = styled.button`
	color: #2d6796;
	background-color: #05f081;
	border-color: #05f081;
	border-radius: 15px;
	width: 30px;
	height: 30px;
	min-width: 30px;
	padding: 0;
	font-size: 14px;
	outline: none;
	border: 0px;
	display: flex;
	align-items: center;
	justify-content: center;

	&:hover {
		border-color: #079e90;
		color: #00ff7f;
		background: #079e90;
	}
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

const FilterIconContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	margin-left: 5px;
`;

const FilterIconImage = styled.img`
	height: 30px;
`;

const FilteringContainer = styled.div`
	height: 40px;
	border: 2px solid #fff;
	border-radius: 4px;
	display: flex;
	align-items: center;
`;

const FilterLabel = styled.span`
	font-size: 14px;
	color: white;
	margin: 0px 5px 0px 10px;
`;

const FilterValue = styled.span`
	font-size: 14px;
	color: white;
	font-weight: 600;
`;


const SearchBar = ({ onSearch, selectedFilterOption, setSelectedFilterOption }) => {
	const [searchText, setSearchText] = useState('');

	function handleSearchTextChane(e) {
		setSearchText(e.target.value);
	}

	function handleKeyPress(e) {
		if (e.key === "Enter") {
			onSearch(searchText)
		}
	}

	function handleSearch() {
		onSearch(searchText);
	}

	function handleChangeFiltering({ key }) {
		setSelectedFilterOption(key);
	}

	const filterMenu = (
		<Menu onClick={handleChangeFiltering}>
			{Object.values(dataSetPublishedStatuses).map((status) => (
				<MenuItem key={status} $isSelected={status === selectedFilterOption}>
					{status}
				</MenuItem>
			))}
		</Menu>
	);

	return (
		<Container>
			<FlexRow className="container">
				<SearchBarWrappe>
					<SearchInput
						type="text"
						value={searchText}
						onChange={handleSearchTextChane}
						onKeyPress={handleKeyPress}
						placeholder="Search data..."
					/>
					<SearchButton type="button" onClick={handleSearch}>
						<svg viewBox="64 64 896 896" focusable="false" data-icon="search" width="1em" height="1em"
							fill="currentColor" aria-hidden="true">
							<path
								d="M909.6 854.5L649.9 594.8C690.2 542.7 712 479 712 412c0-80.2-31.3-155.4-87.9-212.1-56.6-56.7-132-87.9-212.1-87.9s-155.5 31.3-212.1 87.9C143.2 256.5 112 331.8 112 412c0 80.1 31.3 155.5 87.9 212.1C256.5 680.8 331.8 712 412 712c67 0 130.6-21.8 182.7-62l259.7 259.6a8.2 8.2 0 0011.6 0l43.6-43.5a8.2 8.2 0 000-11.6zM570.4 570.4C528 612.7 471.8 636 412 636s-116-23.3-158.4-65.6C211.3 528 188 471.8 188 412s23.3-116.1 65.6-158.4C296 211.3 352.2 188 412 188s116.1 23.2 158.4 65.6S636 352.2 636 412s-23.3 116.1-65.6 158.4z">
							</path>
						</svg>
					</SearchButton>
				</SearchBarWrappe>
				<Dropdown overlay={filterMenu}>
					<FilteringContainer>
						<FilterIconContainer>
							<FilterIconImage src="/filter-icon.svg" />
						</FilterIconContainer>
						<FilterLabel>Dataset status: <FilterValue>{selectedFilterOption}</FilterValue></FilterLabel>
					</FilteringContainer>
				</Dropdown>
			</FlexRow>
		</Container>
	)
};

export default SearchBar;
