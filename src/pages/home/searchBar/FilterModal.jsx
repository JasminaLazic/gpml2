import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Select, Modal, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

import { getGoalList } from '../../../api';
import { format as formatList } from '../../../constants/dataSetForm';
import { sortGoals } from '../../../helpers/utils';
import './style.css';

const { Option } = Select;

const Container = styled(Modal)`
	border-radius: 10px;
	overflow: hidden;
	width: 820px !important;

	& .ant-modal-content {
		border-radius: 10px;
	}
`;

const SearchInput = styled(Input)`
	background-color: #ebf0f4;

	& input {
		background-color: #ebf0f4;

		::placeholder {
			color: #A5B0C9;
			opacity: 1;
		}
	}
`;

const StyledSelect = styled(Select)`
	width: 100%;
	border-radius: 8px;

	& .ant-select-selector {
		background: ${props => props.$isMultiple ? '#EDF2F7' : '#FFF'} !important;
	}

	& .ant-select-selection-placeholder {
		color: #A5B0C9 !important;
	}

	& .ant-select-selection-item {
		background-color: white !important;
	}
`;

const FormContainer = styled.div`
	margin: 25px 0px;
`;

const FormLabel = styled.span`
	font-style: normal;
	font-weight: 500;
	font-size: 18px;
	margin-bottom: 4px;
	display: block;
	line-height: 25px;
	color: #000000;
`;

const FilterModal = ({ filterData, setSearchFilterData, facets, isOpen, onClose }) => {
	const [searchText, setSearchText] = useState('');
	const [goalList, setGoalList] = useState([]);

	useEffect(() => {
		fetchFilterOptionList();
	}, []);

	useEffect(() => {
		setSearchText(setSearchFilterData.searchText)
	}, [setSearchFilterData.searchText]);

	async function fetchFilterOptionList() {
		const goals = []//await getGoalList();
		setGoalList(goals);
	}

	function handleSearchTextChane(e) {
		setSearchText(e.target.value);
	}

	function handleKeyPress(e) {
		if (e.key === "Enter") {
			if (searchText !== setSearchFilterData.searchText) {
				setSearchFilterData((prevState) => ({
					...prevState,
					searchText: searchText,
				}));
			}
		}
	}

	function renderTagSelect() {
		const options = facets.tags.map(({ count, name }) => <Option key={name}>{name}</Option>).reverse();
		function handleChange(selectedList) {
			setSearchFilterData((prevState) => ({
				...prevState,
				tags: selectedList,
			}))
		}

		return (
			<FormContainer>
				<FormLabel>Tags</FormLabel>
				<StyledSelect
					$isMultiple
					allowClear
					mode="multiple"
					value={filterData.tags}
					onChange={handleChange}
					placeholder="All (default)"
				>
					{options}
				</StyledSelect>
			</FormContainer>
		);
	}

	function renderTextSearch() {
		return (
			<SearchInput
				placeholder="Search resources..."
				value={searchText}
				onChange={handleSearchTextChane}
				onKeyPress={handleKeyPress}
				suffix={<SearchOutlined style={{color: '#a5b0c9'}} onClick={() => handleKeyPress({ key: 'Enter' })} />}
			/>
		);
	}

	function renderSubThemeSelect() {
		if (!filterData.category) {
			return null;
		}
		const options = facets.subcategories.map(({ count, name }) => <Option key={name}>{name}</Option>).reverse();

		function handleChange(selectedValue) {
			setSearchFilterData((prevState) => ({
				...prevState,
				subcategory: selectedValue ?? '',
			}))
		}

		return (
			<FormContainer>
				<FormLabel>Sub-Theme</FormLabel>
				<StyledSelect allowClear value={filterData.subcategory ? filterData.subcategory : null} placeholder="All (default)" onChange={handleChange}>
					{options}
				</StyledSelect>
			</FormContainer>
		);
	}

	function renderGoalSelect() {
		const sortedGoalList = sortGoals(goalList);
		const options = sortedGoalList.map((goal) => (<Option key={goal}>{goal}</Option>));
		function handleChange(selectedList) {
			setSearchFilterData((prevState) => ({
				...prevState,
				goals: selectedList,
			}))
		}

		return (
			<FormContainer>
				<FormLabel>Goals</FormLabel>
				<StyledSelect
					$isMultiple
					allowClear
					mode="multiple"
					value={filterData.goals}
					onChange={handleChange}
					placeholder="All (default)"
				>
					{options}
				</StyledSelect>
			</FormContainer>
		);
	}

	function renderFormatSelect() {
		const options = formatList.map((format) => (<Option key={format}>{format}</Option>));

		function handleChange(selectedValue) {
			setSearchFilterData((prevState) => ({
				...prevState,
				format: selectedValue ?? '',
			}))
		}

		return (
			<FormContainer>
				<FormLabel>Format</FormLabel>
				<StyledSelect allowClear value={filterData.format ? filterData.format : null} placeholder="All (default)" onChange={handleChange}>
					{options}
				</StyledSelect>
			</FormContainer>
		);
	}

	return (
		<Container
			title="Filters"
			visible={isOpen}
			centered
			onCancel={onClose}
			footer={null}
		>
			{renderTextSearch()}
			{renderSubThemeSelect()}
			{renderGoalSelect()}
			{renderTagSelect()}
			{renderFormatSelect()}
		</Container>
	);
};

export default FilterModal;
