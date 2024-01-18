import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import DatasetList from './datasetList';
import ReviewDatasetList from './reviewDatasetList';
import SearchBar from './SearchFilterBar';
import { getDatasetForAdminPanel, isCurrentUserAdmin, getStakeholdersList } from './../../api';
import { getReviewersList, isCurrentUserReviewer, fetchDatasetsForReview } from '../../api/admin';
import { dataSetPublishedStatuses } from '../../constants/sorting';
import { FileAddOutlined, SettingOutlined  } from '@ant-design/icons';
import {  Layout, Menu  } from 'antd';

const { Sider } = Layout;

const StyledSider = styled(Sider)`
	background: #046799;
	flex: 0 0 280px !important;
    max-width: 280px !important;
    min-width: 280px !important;
    width: 280px !important;
    padding-top: 56px;
	height: 100vh;
`;

const AntContent = styled(Layout.Content)`
	background: #fff;
`;

const StyledLayout = styled(Layout)`
	background: #056799;
`;

const MenuText = styled.span`
	font-size: 14px;
    font-weight: 700;
	margin-left: 26px !important
	display: inline-block;
`;

const StyledMenu = styled(Menu)`
	background-color: #046799 !important;
`;

const MenuItem = styled(Menu.Item)`
	height: 50px !important;

	& .ant-menu-title-content {
		display: flex !important;
		align-items: center !important;
		flex-direction: row !important;
	}
`;

const NumberOfItems = styled.span`
	font-size: 12px;
	padding: 4px;
	border-radius: 30px;
	margin-left: 20px;
	border: 1px solid white;
	line-height: 18px;
	width: 28px;
	align-items: center;
    justify-content: center;
	display: flex;
`;

const AdminPage = () => {
	const [datasetList, setDatasetList] = useState(null);
	const [selectedFilterOption, setSelectedFilterOption] = useState(dataSetPublishedStatuses.ALL);
	const [selectedSidebarOption, setSelectedSidebarOption] = useState(['1']);
	const [isReviewer, setIsReviewer] = useState(false);
	const [reviwerList, setReviwerList] = useState();
	const [datasetsForReview, setDatasetsForReview] = useState([]);
	const [entityList, setEntityList] = useState([]);

	useEffect(() => {
		isCurrentUserAdmin().then((isAdmin) => {
			if (!isAdmin) {
				return window.location = '/';
			}
		});
		isCurrentUserReviewer().then(([err, result]) => {
			setIsReviewer(result);
		});
		fetchDataList();
		fetchEntityList();
	}, []);

	useEffect(() => {
		fetchDataList();
	}, [selectedSidebarOption]);

	async function fetchEntityList() {
		const stakeholdersList = await getStakeholdersList();

		setEntityList(stakeholdersList.map(([id, name, bool]) => ({ name, id })));
	}

	async function fetchDataList(searchText = '') {
		const data = await getDatasetForAdminPanel({ searchText });
		const [err, response] = await getReviewersList();
		const [_, datasetToReview] = await fetchDatasetsForReview();

		setDatasetsForReview(datasetToReview);
		setReviwerList(response.result);
		setDatasetList(data.result.results);
	}

	function getFilteredDataset() {
		if (selectedFilterOption === dataSetPublishedStatuses.ALL) {
			return datasetList;
		}

		if (selectedFilterOption === dataSetPublishedStatuses.PUBLISHED) {
			return datasetList.filter((item) => item.private === false && item.approval_status !== "declined");
		}

		if (selectedFilterOption === dataSetPublishedStatuses.DECLINED) {
			return datasetList.filter((item) => item.approval_status === "declined");
		}

		if (selectedFilterOption === dataSetPublishedStatuses.PENDING) {
			return datasetList.filter((item) => item.private === true && item.approval_status === "");
		}
	}

	function getReviewDatasetlist() {
		if (!datasetList || !datasetsForReview) {
			return null;
		}

		const reviewDatasetIdList = datasetsForReview.map(({ package_id }) => package_id);
		return datasetList.filter((item) => reviewDatasetIdList.includes(item.id));
	}

	function renderContent() {
		const [selectedMenuItemKey] = selectedSidebarOption;

		if (selectedMenuItemKey === '1') {
			return (
				<StyledLayout>
					<SearchBar
						onSearch={fetchDataList}
						selectedFilterOption={selectedFilterOption}
						setSelectedFilterOption={setSelectedFilterOption}
					/>
					<AntContent>
						<DatasetList
							datasetList={getFilteredDataset()}
							entityList={entityList}
							fetchFilteredDataList={fetchDataList}
							reviwerList={reviwerList}
						/>
					</AntContent>
				</StyledLayout>
			);
		}
		if (selectedMenuItemKey === '2') {
			return (
				<StyledLayout>
					<AntContent>
						<ReviewDatasetList
							entityList={entityList}
							datasetList={getReviewDatasetlist()}
							datasetsForReview={datasetsForReview}
						/>
					</AntContent>
				</StyledLayout>
			);
		}
	}

	return (
		<StyledLayout>
			<StyledSider
				breakpoint="lg"
				collapsedWidth="0"
				onBreakpoint={(broken) => {
					console.log(broken);
				}}
				onCollapse={(collapsed, type) => {
					console.log(collapsed, type);
				}}
			>
				<StyledMenu
					theme="dark"
					mode="inline"
					selectedKeys={selectedSidebarOption}
					onSelect={({ selectedKeys }) => setSelectedSidebarOption(selectedKeys)}
				>
					<MenuItem key={1}>
						<SettingOutlined style={{fontSize: 20, border: '1px solid white', padding: 5, borderRadius: 20}} />
						<MenuText>Admin Section</MenuText>
						{getFilteredDataset() && <NumberOfItems>{getFilteredDataset().length}</NumberOfItems>}
					</MenuItem>
					{
						isReviewer && (
							<MenuItem key={2}>
								<FileAddOutlined style={{fontSize: 20, border: '1px solid white', padding: 5, borderRadius: 20}}  />
								<MenuText>Review Section</MenuText>
								{getReviewDatasetlist() && <NumberOfItems>{getReviewDatasetlist().length}</NumberOfItems>}
							</MenuItem>
						)
					}
				</StyledMenu>
			</StyledSider>
			{renderContent()}
		</StyledLayout>
	);
};

export default AdminPage;
