import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Collapse, Button, Popconfirm, Select, Tag, Tooltip, Modal } from 'antd';
import { DeleteOutlined } from "@ant-design/icons";
import { approveDatasetPublication, declineDatasetPublication } from '../../../api';
import { toggleReviewer, getReviewerStatusList } from '../../../api/admin';

const { Panel } = Collapse;

const Container = styled.div`
	width: 100%;
	background: #fff;
	box-shadow: 1px 1px 5px lightgrey;
	padding: 15px 20px 15px 20px;
	border: 1px solid lightgrey;
	border-radius: 4px;
	cursor: pointer;
	border-bottom: 1px solid #fff;
	position: relative;
	margin-bottom: 12px;
`;

const Title = styled.h4`
	-webkit-text-size-adjust: 100%;
    -webkit-tap-highlight-color: rgba(0,0,0,0);
    --antd-wave-shadow-color: #1890ff;
    --scroll-bar: 0;
    font-family: -apple-system,BlinkMacSystemFont,"Open Sans","Segoe UI","Roboto","Oxygen","Ubuntu","Cantarell","Fira Sans","Droid Sans","Helvetica Neue",sans-serif;
    -webkit-font-smoothing: antialiased;
    font-variant: tabular-nums;
    line-height: 1.5715;
    list-style: none;
    font-feature-settings: "tnum","tnum";
    margin-top: 0;
    margin-bottom: .5em;
    color: rgba(0,0,0,.85);
    font-weight: 500;
    font-size: 2rem;
    box-sizing: border-box;
    width: 30%;
	max-width: 30%;
	min-width: 30%;
`;

const StyledTag = styled(Tag)`
	border-radius: 16px;
	margin-left: 5px;
`;

const TagText = styled.span`
	font-size: 14px;
	font-weight: 700;
`;

const Subtitle = styled.span`
	display: block;
	opacity: .75;
	margin-right: 10px;
	font-size: 12px;
	font-weight: 500;
	margin-bottom: 2em;
`;

const Row = styled.div`
	display: flex;
	align-items: center;
	position: relative;
`;

const Thumbnail = styled.img`
	margin-bottom: 15px;
	height: 400px;
`;

const ReviewersLabel = styled.span`
	font-size: 14px;
	color: #1890ff;
`;

const ReviewerContainer = styled.div`
	display: flex;
    flex: 1;
    flex-direction: column;
	margin: 10px 100px 0px 20px;
`;

const RowSpaceBetween = styled(Row)`
	justify-content: space-between;
`;

const StyledCollapse = styled(Collapse)`
	background-color: white !important;

	& .ant-collapse-item {
		border: none !important;
	}
`;

const Label = styled.div`
	font-size: 14px;
	margin-right: 15px;
	opacity: .75;
`;

const Value = styled.div`
	font-size: 14px;
	margin-right: 15px;
	font-weight: 500;
	font-style: italic;
	color: black;
	flex: 1;
`;

const Status = styled.div`
	font-size: 15px;
	font-weight: 500;
	margin-right: 15px;
	font-style: italic;
	opacity: .75;
`;

const ApproveButton = styled(Button)`
	color: blue !important;
	border-color: blue !important;
`;

const DeclineButton = styled(Button)`
	color: red;
`;

const EditButton = styled(Button)`
	position: absolute;
	left: 120px;
	top: 7px;
`;

const { Option } = Select;

const DatasetItem = ({ fetchFilteredDataList, reviwerList, onShowDetail, onEditDataset, getEntityList, ...datasetItem }) => {
	const [reviewerStatusList, setReviewerStatusList] = useState(null);

	useEffect(() => {
		fetchReviewerStatusList();
	}, []);

	async function fetchReviewerStatusList() {
		const [err, response] = await getReviewerStatusList(datasetItem.id);

		setReviewerStatusList(response.result);
	}

	async function handleApprove() {
		await approveDatasetPublication(datasetItem.id);
		fetchFilteredDataList();
	}

	async function handleDecline() {
		await declineDatasetPublication(datasetItem.id);
		fetchFilteredDataList();
	}

	function handleShowDetail() {
		onShowDetail(datasetItem.id);
	}

	function getValidTagList(tags) {
		return tags.filter((item) => Object.keys(item).length > 1);
	}

	function handleEditDataset() {
		onEditDataset(datasetItem.id);
	}

	async function handleAssignReviewer(email) {
		await toggleReviewer({ email, datasetId: datasetItem.id });
		await fetchReviewerStatusList();
		await fetchFilteredDataList();
	}

	async function handleRemoveReviewer(email) {
		await toggleReviewer({ email, datasetId: datasetItem.id, isRemove: true });
		await fetchReviewerStatusList();
		await fetchFilteredDataList();
	}

	function handleDeselectAttempt(email) {
		if (reviewerStatusList.find((item) => item.email === email).review_status !== 'pending') {
			Modal.warning({
				className: "popup-delete",
				centered: true,
				closable: true,
				icon: <DeleteOutlined />,
				title: "Are you sure you want to delete already submitted review?",
				content: "Please be aware this action cannot be undone.",
				okText: "Delete",
				okType: "danger",
				onOk() {
					handleRemoveReviewer(email);
				},
			});
		} else {
			handleRemoveReviewer(email);
		}
	}

	function getOptionList() {
		const selectedReviewerList = reviewerStatusList.map(({ email }) => email);

		return reviwerList.filter((reviewerEmail) => !selectedReviewerList.includes(reviewerEmail))
		.map((reviewerEmail) => (
			<Option key={reviewerEmail}>{reviewerEmail}</Option>
		));
	}

	function renderActionButtonsOrStatus() {
		if (datasetItem.approval_status === 'declined') {
			return <Status>Declined</Status>
		}
		else if (!datasetItem.private) {
			return (
				<>
					<Status>Published</Status>
					<Popconfirm placement="bottomRight" title="Are you sure you want to decline? Declined datasets cannot be published." onConfirm={handleDecline} okText="Yes" cancelText="No">
						<DeclineButton type="text">Unpublish</DeclineButton>
					</Popconfirm>
				</>
			);
		} else {
			return (
				<div>
					<ApproveButton ghost shape="round" onClick={handleApprove}>Publish</ApproveButton>
					<Popconfirm placement="bottomRight" title="Are you sure you want to decline? Declined datasets cannot be published." onConfirm={handleDecline} okText="Yes" cancelText="No">
						<DeclineButton type="text">Decline</DeclineButton>
					</Popconfirm>
				</div>
			);
		}
	}

	function renderReviewerSelect() {
		if (!reviewerStatusList) {
			return (
				<ReviewerContainer>
					{null}
				</ReviewerContainer>
			);
		}

		return (
			<ReviewerContainer>
				<ReviewersLabel>Reviewers: </ReviewersLabel> 
				<Select
					mode="multiple"
					allowClear={false}
					disabled={datasetItem.approval_status === 'declined'}
					placeholder="Assign reviewers..."
					value={reviewerStatusList ? reviewerStatusList.map(({ email }) => email) : []}
					onSelect={(email) => handleAssignReviewer(email)}
					onDeselect={(email) => handleDeselectAttempt(email)}
				>
					{getOptionList()}
				</Select>
			</ReviewerContainer>
		);
	}

	function renderStatusReview() {
		if (!reviewerStatusList || !reviewerStatusList.length ) {
			return null;
		}
		const sortedReviewerList = reviewerStatusList.sort((a, b) => a.email > b.email ? 1 : -1);

		return (
			<Row>
				<span style={{ fontSize: 14 }}>Status of review: </span>
				{sortedReviewerList.map(({ review_status, review_comments }) => {
					if (review_status === "pending") {
						return (
							<StyledTag color="orange">
								<TagText>Pending</TagText>
							</StyledTag>
						);
					} else if (review_status === "approved") {
						return (
							<Tooltip title={review_comments ?? ''}>
								<StyledTag color="blue">
									<TagText>{review_comments ? 'Approved (c)' : 'Approved'}</TagText>
								</StyledTag>
							</Tooltip>
						);
					} else if (review_status === "declined") {
						return (
							<Tooltip title={review_comments ?? ''}>
								<StyledTag color="red">
									<TagText>{review_comments ? 'Declined (c)' : 'Declined'}</TagText>
								</StyledTag>
							</Tooltip>
						);
					}
				})}
			</Row>
		);
	}

	return (
		<Container>
			{renderStatusReview()}
			<RowSpaceBetween>
				<Title>{datasetItem.title}</Title>
				{renderReviewerSelect()}
				{renderActionButtonsOrStatus()}
			</RowSpaceBetween>
			<Subtitle>Data category: {datasetItem.category}</Subtitle>
			{
				datasetItem.approval_status !== 'declined' && (
					<Row>
						<StyledCollapse bordered={false} defaultActiveKey={['0']}>
							<Panel header="Show detail" key="1">
								{
									datasetItem?.image_display_url && (
										<Thumbnail src={datasetItem?.image_display_url} /> 
									)
								}
								<Row>
									<Label>Title:</Label>
									<Value>{datasetItem.title}</Value>
								</Row>
								<Row>
									<Label>Theme:</Label>
									<Value>{datasetItem.category}</Value>
								</Row>
								<Row>
									<Label>Sub-Theme:</Label>
									<Value>{datasetItem.sub_category}</Value>
								</Row>
								<Row>
									<Label>Url:</Label>
									<Value>{datasetItem.url}</Value>
								</Row>
								<Row>
									<Label>Geo Coverage:</Label>
									<Value>{datasetItem.geo_coverage}</Value>
								</Row>
								{
									datasetItem.country_code &&
									<Row>
										<Label>Countries:</Label>
										<Value>{datasetItem.country_code}</Value>
									</Row>
								}
								{
									datasetItem.transnational &&
									<Row>
										<Label>Transnational organizations:</Label>
										<Value>{datasetItem.transnational}</Value>
									</Row>
								}
								{
									datasetItem.subnational_area &&
									<Row>
										<Label>Sub-national area:</Label>
										<Value>{datasetItem.subnational_area}</Value>
									</Row>
								}
								<Row>
									<Label>Goals:</Label>
									<Value>{datasetItem.sdg_goals}</Value>
								</Row>
								<Row>
									<Label>Owners:</Label>
									<Value>{getEntityList(datasetItem.owners)}</Value>
								</Row>
								<Row>
									<Label>Partners:</Label>
									<Value>{getEntityList(datasetItem.partners)}</Value>
								</Row>
								<Row>
									<Label>Sponsors:</Label>
									<Value>{getEntityList(datasetItem.sponsors)}</Value>
								</Row>
								<Row>
									<Label>Valid From:</Label>
									<Value>{datasetItem.start_date1 ?? ''}</Value>
								</Row>
								<Row>
									<Label>Valid Until:</Label>
									<Value>{datasetItem.end_date1 ?? ''}</Value>
								</Row>
								<Row>
									<Label>Languages:</Label>
									<Value>{datasetItem.lang}</Value>
								</Row>
								<Row>
									<Label>Tags:</Label>
									<Value>{Array.from(new Set(getValidTagList(datasetItem.tags).map(({ name }) => name))).join(', ')}</Value>
								</Row>
								<Row>
									<Label>Data type:</Label>
									<Value>{datasetItem.data_type}</Value>
								</Row>
								<Row>
									<Label>Data format:</Label>
									<Value>{datasetItem.data_format}</Value>
								</Row>
								<Row>
									<Label>Notes:</Label>
									<div dangerouslySetInnerHTML={{ __html: datasetItem.notes }}></div>
								</Row>
								<Row>
									<Label>Info:</Label>
									<div dangerouslySetInnerHTML={{ __html: datasetItem.info }}></div>
								</Row>
							</Panel>
						</StyledCollapse>
						<EditButton type="link" onClick={handleEditDataset}>Edit</EditButton>
					</Row>
				)
			}
		</Container>
	);
};

export default DatasetItem;
