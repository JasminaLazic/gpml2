import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Empty, Spin, Button } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import DatasetItem from './DatasetItem';
import media from './../../helpers/media';

const Container = styled.div`
	background-color: #D3DEE726;
	flex: 1;
`;

const DataSetList = styled.div`
	padding-top: 30px;
	padding-bottom: 60px;
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
	margin: 0 0 5px;
	padding: 30px 0px;
`;


const LoadMoreButton = styled(Button)`
	color: #09689A !important;
	border-color: #09689A !important;
`;

const DataSetListContainer = styled.div`
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	grid-gap: 12px 12px;

	${media.mobile`
		display: block;
  	`};
`;

const StyledLoadintIcon = styled(LoadingOutlined)`
	font-size: 24px;
`;

const Content = ({ datasetList, pagingSize, onLoadMore }) => {
	const loadingIcon = <StyledLoadintIcon spin />;

	function renderEmptyState() {
		if (datasetList?.length === 0) {
			return <Empty description="No data found based on your search and filter criteria" />;
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

		const list = datasetList.slice(0, pagingSize).map((item) => <DatasetItem key={item.id} {...item} />);

		return (
			<DataSetListContainer>
				{list}
			</DataSetListContainer>
		);
	}

	return (
		<Container>
			<DataSetList className="container">
				{renderEmptyState()}
				{renderList()}
			</DataSetList>
			{
				pagingSize < datasetList?.length && (
					<PaginationContainer>
						<LoadMoreButton
							onClick={onLoadMore}
							type="primary"
							shape="round"
							ghost
						>
							LOAD MORE
						</LoadMoreButton>
					</PaginationContainer>
				)
			}
		</Container>
	);
};

export default Content;
