import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Empty, Spin, Pagination} from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import DatasetItem from './DatasetItem';
import { ROUTES } from '../../../constants/routes';


const Container = styled.div`
	background-color: #fff;
	overflow: auto;
	height: 100%;
`;

const DataSetList = styled.div`
	margin-top: 30px;
`;

const SpinContainer = styled.div`
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	height: 500px;
`;

const PaginationContainer = styled.div`
	text-align: center;
	font-style: italic;
	margin: 0 0 5px;
	background-color: #fff;
	padding: 30px 0px;
`;

const StyledLoadintIcon = styled(LoadingOutlined)`
	font-size: 24px;
`;

const PAGE_SIZE = 8;

const ReviewDatasetList = ({ datasetList, datasetsForReview, entityList }) => {
	const [pagingIndex, setPaginIndex] = useState(1);
	const navigate = useNavigate();

	const loadingIcon = <StyledLoadintIcon spin />;

	useEffect(() => {
		setPaginIndex(1);
	}, [datasetList]);

	function getReviewId(datasetId) {
		return datasetsForReview.find(({ package_id }) => package_id === datasetId)?.review_id;
	}

	function getEntityList(entityStringIdList) {
		if (entityList?.length && entityStringIdList) {
			const entityIdList = entityStringIdList.split(',');
			const entitIdList = entityIdList.map((entityId) => entityList.find(({ id }) => id === entityId));

			return entitIdList.map((entity) => entity.name).join(', ');
		}

		return entityStringIdList;
	}

	function handleShowDetail(id) {
		navigate(`${ROUTES.DATA_SETS}/${id}`);
	}

	function handleEditDataset(id) {
		navigate(`${ROUTES.EDIT_DATASET}/${id}`)
	}

	function handlePagingIndexChange(page) {
		setPaginIndex(page);
	}

	function renderEmptyState() {
		if (datasetList?.length === 0) {
			return <Empty description="No dataset for review" />;
		}
	}

	function renderList() {
		if (!datasetList) {
			return (
				<SpinContainer>
					<Spin indicator={loadingIcon} />
				</SpinContainer>
			);
		}
		const paginatedSlice = datasetList.slice((pagingIndex - 1) * PAGE_SIZE, pagingIndex * PAGE_SIZE );

		return paginatedSlice.map((item) => (
			<DatasetItem
				key={item.id}
				reviewId={getReviewId(item.id)}
				onShowDetail={handleShowDetail}
				onEditDataset={handleEditDataset}
				getEntityList={getEntityList}
				{...item}
			/>
		))
	}

	if (!datasetList) return null;

	return (
		<Container>
			<DataSetList className="container">
				{renderEmptyState()}
				{renderList()}
			</DataSetList>
			<PaginationContainer>
				<Pagination
					showSizeChanger={false}
					current={pagingIndex}
					onChange={handlePagingIndexChange}
					pageSize={PAGE_SIZE}
					total={datasetList ? datasetList.length :  0}
					hideOnSinglePage
				/>
			</PaginationContainer>
		</Container>
	);
};

export default ReviewDatasetList;
