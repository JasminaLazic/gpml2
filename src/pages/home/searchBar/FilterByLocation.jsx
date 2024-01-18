import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Select, Tabs, Popover } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import './style.css';
import { getCountryList, getTransnationalList } from '../../../api';

import { transnationalOrganizations } from '../../../constants/dataSetForm';
import media from '../../../helpers/media'

const { Option } = Select;
const { TabPane } = Tabs;

const Container = styled.div`
	width: 404px;
	box-sizing: border-box;
	max-height: 80vh;
	overflow: auto;
	border-radius: 8px;
	box-shadow: 0 4px 4px rgb(0 0 0 / 25%);

	${media.mobile`
		width: 100%;
  	`};
`;

const StyledTabs = styled(Tabs)`
	border: 1px solid #d7e6ee;
	border-radius: 8px;

	& .ant-tabs-nav-list {
		width: 100% !important;
	}

	& .ant-tabs-tab {
		background-color: #00000000 !important;
		color: #036799 !important; 
		width: 100% !important;
		border: 0px !important;
	}

	& .ant-tabs-tab-active {
		background-color: #fff !important;
	}

	& .ant-tabs-tab-btn {
		color: #036799 !important;
	}

	& .ant-tabs-nav-operations {
		display: none;
	}
`;


const StyledTabPane = styled(TabPane)`
	width: 100%;
	padding: 10px;
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

const StyledInfoIcon = styled(InfoCircleOutlined)`
	color: #036799;
	margin-left: 5px;
`;

const PopoverContainer = styled.div`
	max-height: 50vh;
    padding: 0 12px;
	width: 280px;
    overflow: auto;

	/* width */
	&::-webkit-scrollbar {
		width: 3px;
	}

	/* Track */
	&::-webkit-scrollbar-track {
		background: #f1f1f1; 
	}
	
	/* Handle */
	&::-webkit-scrollbar-thumb {
		background: #346896; 
	}

	/* Handle on hover */
	&::-webkit-scrollbar-thumb:hover {
		background: #1890ff;
	}
`;

const FilterByLocation = ({ filterData, setSearchFilterData }) => {
	const [countryList, setCountryList] = useState([]);
	const [transnationalOrganizationList, setTransnationalOrganizationList] = useState([]);
	const options = countryList.map((countryName) => <Option key={countryName}>{countryName}</Option>).reverse();

	useEffect(() => {
		fetchFilterOptions();
	}, []);

	async function fetchFilterOptions() {
		const [countryOptions, transnationalOptions] = await Promise.all([getCountryList(), getTransnationalList()]);
		setCountryList(countryOptions.reverse());
		const organizationListWithData = transnationalOrganizations.map(({ name }) => name);
		const validOrglist = transnationalOptions.filter((item) => organizationListWithData.includes(item));
		setTransnationalOrganizationList(validOrglist.reverse());
	}

	function handleChange(selectedList) {
		setSearchFilterData((prevState) => ({
			...prevState,
			countries: selectedList,
		}))
	}

	function handleTabChange() {
		setSearchFilterData((prevState) => ({
			...prevState,
			countries: [],
			multiCountry: []
		}))
	}


	function renderMultiCountrySelector() {
		function generatePopoverContent(oraganizationName) {
			const organization = transnationalOrganizations.find(({ name }) => name === oraganizationName);
			const countryItems = organization.countryList.map(({ name, id }) => <div key={id}>{name}</div>);

			return (
				<PopoverContainer >
					{countryItems}
				</PopoverContainer>
			);
		}

		const options = transnationalOrganizationList.map((organizationName) => (
			<Option key={organizationName}>
				{organizationName}
				<Popover placement="right" content={generatePopoverContent(organizationName)}>
					<StyledInfoIcon />
				</Popover>
			</Option>
		)).reverse();

		function handleChange(selectedList) {
			setSearchFilterData((prevState) => ({
				...prevState,
				multiCountry: selectedList,
			}))
		}

		return (
			<StyledSelect
				$isMultiple
				allowClear
				mode="multiple"
				value={filterData.multiCountry}
				onChange={handleChange}
				placeholder="Multi-Country"
			>
				{options}
			</StyledSelect>
		);
	}

	return (
		<Container>
			<StyledTabs tabBarStyle={{ background: '#d7e6ee' }} onChange={handleTabChange} defaultActiveKey="1" type="card" size="large">
				<StyledTabPane tab="Countries" key="1">
					<StyledSelect
						$isMultiple
						allowClear
						mode="multiple"
						value={filterData.countries}
						onChange={handleChange}
						placeholder="Countries"
					>
						{options}
					</StyledSelect>
				</StyledTabPane>
				<StyledTabPane tab="Multi-Country" key="2">
					{renderMultiCountrySelector()}
				</StyledTabPane>
			</StyledTabs>
		</Container>
	);
};

export default FilterByLocation;
