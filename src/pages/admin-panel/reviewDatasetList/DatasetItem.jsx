import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Button, Input, Modal, Tooltip, message, Collapse } from 'antd';
import { getDatasetsReview, changeReviewStatus } from '../../../api/admin';

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

const Thumbnail = styled.img`
	margin-bottom: 15px;
	height: 400px;
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
`;

const RowSpaceBetween = styled(Row)`
	justify-content: space-between;
`;

const ApproveButton = styled(Button)`
	color: blue !important;
	border-color: blue !important;
`;

const DeclineButton = styled(Button)`
	color: red !important;;
	border-color: red !important;
	margin-left: 10px;
`;

const MODAL_STATUSES = {
	DECLINE: 'DECLINE',
	APPROVE: 'APPROVE',
	IN_PROGRESS: 'IN_PROGRESS'
};

const DatasetItem = ({ fetchFilteredDataList, onShowDetail, reviewId, onEditDataset, getEntityList, ...datasetItem }) => {
	const [reviewStatus, setReviewStatus] = useState(null);
	const [modalState, setModalState] = useState(null);
	const [commentText, setCommentText] = useState('');

	useEffect(() => {
		fetchReviewStatus();
	}, []);

	async function fetchReviewStatus() {
		const [err, resultList] = await getDatasetsReview(reviewId);
		const [firstResult] = resultList;

		setReviewStatus(firstResult);
	}

	// function handleShowDetail() {
	// 	onShowDetail(datasetItem.id);
	// }

	// function handleEditDataset() {
	// 	onEditDataset(datasetItem.id);
	// }

	function renderActionButtonsOrStatus() {
		if (!reviewStatus) {
			return null;
		}

		if (reviewStatus.review_status === 'declined') {
			return (
				<Tooltip title={reviewStatus.review_comments ?? ''}>
					<DeclineButton
						ghost
						shape="round"
						onClick={() => null}
					>
						{reviewStatus.review_comments ? 'Declined (c)' : 'Declined'}
					</DeclineButton>
				</Tooltip>
			)
		} else if (reviewStatus.review_status === 'approved') {
			return (
				<Tooltip title={reviewStatus.review_comments ?? ''}>
					<ApproveButton
						ghost
						shape="round"
						onClick={() => null}
					>
						{reviewStatus.review_comments ? 'Approved (c)' : 'Approved'}
					</ApproveButton>
				</Tooltip>
			);
		} else {
			return (
				<div>
					<ApproveButton ghost shape="round" onClick={() => setModalState(MODAL_STATUSES.APPROVE)}>Approve</ApproveButton>
					<DeclineButton ghost shape="round" onClick={() => setModalState(MODAL_STATUSES.DECLINE)} type="text">Decline</DeclineButton>
				</div>
			);
		}
	}

	function getModalTitle() {
		if (modalState === MODAL_STATUSES.IN_PROGRESS) {
			return 'Status change in progress'
		}

		if (modalState === MODAL_STATUSES.APPROVE) {
			return 'Approve'
		}

		if (modalState === MODAL_STATUSES.DECLINE) {
			return 'Decline'
		}
	}

	function getModalOkButtonText() {
		if (modalState === MODAL_STATUSES.IN_PROGRESS) {
			return 'Processing'
		}

		if (modalState === MODAL_STATUSES.APPROVE) {
			return 'Approve'
		}

		if (modalState === MODAL_STATUSES.DECLINE) {
			return 'Decline'
		}
	}

	function getModalDescriptionText() {
		if (modalState === MODAL_STATUSES.IN_PROGRESS) {
			return "Status change is in progress, pleas wait."
		}

		if (modalState === MODAL_STATUSES.APPROVE) {
			return "Are you sure you want to approve? Once you change status it can't be undone."
		}

		if (modalState === MODAL_STATUSES.DECLINE) {
			return "Are you sure you want to decline? Once you change status it can't be undone."
		}
	}

	function onClose() {
		setCommentText('');
		setModalState(null);
	}

	async function handleChangeStatus() {
		if (modalState === MODAL_STATUSES.DECLINE && !commentText) {
			return message.warning('Comment is mandatory');
		}

		const changeToStatus = modalState === MODAL_STATUSES.APPROVE ? 'approved' : 'declined';

		setModalState(MODAL_STATUSES.IN_PROGRESS);

		const [err, response] = await changeReviewStatus({ reviewId, reviewStatus: changeToStatus, comment: commentText });

		await fetchReviewStatus();
		onClose();
	}

	return (
		<Container>
			<Modal
				title={getModalTitle()}
				visible={!!modalState}
				onOk={handleChangeStatus}
				confirmLoading={modalState === MODAL_STATUSES.IN_PROGRESS}
				onCancel={onClose}
				okText={getModalOkButtonText()}
			>
				<p>{getModalDescriptionText()}</p>
				<Input.TextArea
					rows={3}
					placeholder="Type your comment..."
					maxLength={200}
					value={commentText}
					onChange={(e) => setCommentText(e.target.value)}
				/>

			</Modal>
			<RowSpaceBetween>
				<Title>{datasetItem.title}</Title>
				{renderActionButtonsOrStatus()}
			</RowSpaceBetween>
			<Subtitle>Data category: {datasetItem.category}</Subtitle>
			<StyledCollapse bordered={false} defaultActiveKey={['0']}>
				<Collapse.Panel header="Show detail" key="1">
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
						<Value>{datasetItem.tags.map(({ name }) => name).join(', ')}</Value>
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
				</Collapse.Panel>
			</StyledCollapse>
		</Container>
	);
};

export default DatasetItem;

