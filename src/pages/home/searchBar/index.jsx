import React, { useState } from 'react';
import styled from 'styled-components';
import { Popover, Button } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

import FilterModal from './FilterModal';
import FilterByLocation from './FilterByLocation';
import { categories, categoryIcons, categoryHoverIcons } from '../../../constants/dataSetForm';
import CategoryItem from './CategoryItem';
import ActionButton from './ActionButton';

const Container = styled.div`
	background-color: #06496c;
	height: 95px;
	display: flex;
    justify-content: center;
`;

const ResetFilterButton = styled(Button)`
    border: 1px solid #fff;
	align-self: center;
	margin-right: 16px;
	background-color: #07496c;
	color: white;

	&:hover {
		border: 1px solid #fff;
		background-color: #07496c;
		color: white;
	}

	outline: none;
`;

const Content = styled.div`
	display: flex;
	align-items: center;
	height: 100%;
	justify-content: space-between;

	&:before {
		content: none;
	}

	&:after {
		content: none;
	}
`;

const LeftBar = styled.div`
	display: flex;
	margin-left: 14px
    align-items: center;
`;

const SearchBar = ({ searchFilterData, setSearchFilterData, facets }) => {
	const [filterModalOpen, setFilterModalOpen] = useState(false);

	function handleCategoryChange(selectedCategory) {
		setSearchFilterData((prevState) => ({
			...prevState,
			category: selectedCategory,
			subcategory: '',
		}));
	}

	function toggleModalVisibility() {
		setFilterModalOpen(state => !state);
	}

	function resetFilterData() {
		setSearchFilterData((prevState) => ({
			...prevState,
			searchText: '',
			format: '',
			subcategory: '',
			tags: [],
			goals: [],
		}));
	}

	function getAppiedFiltersCount() {
		let counter = 0;

		if (searchFilterData.searchText) {
			counter++;
		}

		if (searchFilterData.format) {
			counter++;
		}

		if (searchFilterData.subcategory) {
			counter++;
		}

		if (searchFilterData.tags?.length) {
			counter++;
		}

		if (searchFilterData.goals?.length) {
			counter++;
		}

		return counter;
	}

	function getAppiedLocationsCount() {
		return searchFilterData.countries.length + searchFilterData.multiCountry.length;
	}


	function renderCategories() {
		return categories.map((item) => (
			<CategoryItem
				isSelected={item === searchFilterData.category}
				label={item}
				key={item}
				icon={categoryIcons[item]}
				hoverIcon={categoryHoverIcons[item]}
				onSelect={handleCategoryChange}
			/>
		));
	}

	function renderClearButton() {
		if (!!getAppiedFiltersCount()) {
			return (
				<ResetFilterButton shape="round" icon={<CloseOutlined />} onClick={resetFilterData}>
					Reset Filters
				</ResetFilterButton>
			);
		}
	}

	function renderLocationModal() {
		return (
			<FilterByLocation
				filterData={searchFilterData}
				setSearchFilterData={setSearchFilterData}
			/>
		);
	}

	return (
		<Container>
			<FilterModal
				isOpen={filterModalOpen}
				onClose={toggleModalVisibility}
				filterData={searchFilterData}
				setSearchFilterData={setSearchFilterData}
				facets={facets}
			/>
			<Content className="container">
				<LeftBar>
					{renderCategories()}
					<ActionButton
						appiedFiltersCount={getAppiedFiltersCount()}
						label="Advanced Search"
						onClick={toggleModalVisibility}
						icon="./filter-icon.svg"
					/>
					{renderClearButton()}
				</LeftBar>
				<Popover placement="bottomRight" content={renderLocationModal()} trigger="click">
					<ActionButton
						appiedFiltersCount={getAppiedLocationsCount()}
						label="Location"
						onClick={() => null}
						icon="./location.svg"
					/>	
				</Popover>
			</Content>
		</Container>
	)
};

export default SearchBar;
