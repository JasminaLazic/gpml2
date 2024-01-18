import React from 'react';
import styled from 'styled-components';
import dayjs from 'dayjs';
import { Button } from 'antd'
import { EyeFilled } from '@ant-design/icons';
import { ROUTES } from '../../constants/routes';
import media from './../../helpers/media';

const Container = styled.div`
	width: 100%;
	overflow: hidden;
	background: #fff;
	box-shadow: 1px 1px 5px lightgrey;
	padding: 20px 20px 10px 20px;
	border: 1px solid lightgrey;
	border-radius: 4px;
	cursor: pointer;
	position: relative;
	height: 390px;
	display: flex;
    flex-direction: column;

	${media.mobile`
		margin-bottom: 18px;
  	`};
`;

const Thumbnail = styled.div`
	height: 190px;
	width: 100%;
	background-image: url(${props => props.backgroundImg});
	background-position: center;
	background-repeat: no-repeat;
	background-size: cover;
`;

const Title = styled.h4`
	font-style: normal;
	font-weight: 700;
	font-size: 18px;
	line-height: 26px;
	margin: 10px 0px;
	color: #255B87;
`;

const Row = styled.div`	
	align-items: center;
	display: flex;
`;

const Icon = styled.img`
	height: 20px;
	width: 20px;
	margin-right: 10px;
`;

const Subtitle = styled.span`
	font-style: normal;
	font-weight: 500;
	font-size: 14px;
	line-height: 20px;
	display: block;
	color: #18162F;
	margin: 5px 0px;
	white-space: nowrap;
	overflow: hidden;
  	text-overflow: ellipsis;
`;

const ButtonContainer = styled.div`
	display: flex;
	flex-direction: column-reverse;
	flex: 1;
	align-self: flex-start;
`;

const ViewButton = styled(Button)`
	color: #09689A !important;
	border-color: #09689A !important;
	border-width: 2px;
	font-weight: 700;
`;

const DatasetItem = ({ title, id, category, image_display_url, start_date1, end_date1 }) => {
	function getFormattedDate(date, isStartDate = false) {
		if (!date) {
			return isStartDate ? 'No start date' : 'No end date';
		}

		return dayjs(new Date(date)).format('DD/MM/YYYY')
	}

	return (
		<a href={`${ROUTES.DATA_SETS}/${id}`}>
			<Container>
				<Thumbnail backgroundImg={image_display_url ?? './datasetIconPlaceholder.png'} />
				<Title>{title}</Title>
				<Row>
					<Icon src='./periodIcon.png' />
					<Subtitle>Time period: {getFormattedDate(start_date1, true)} - {getFormattedDate(end_date1)}</Subtitle>
				</Row>
				<Row>
					<Icon src='./categoryIcon.png' />
					<Subtitle>Data category: {category}</Subtitle>
				</Row>
				<ButtonContainer>
					<ViewButton
						type="primary"
						shape="round"
						icon={<EyeFilled />}
						ghost
					>
						View
					</ViewButton>
				</ButtonContainer>
			</Container>
		</a>
	);
};

export default DatasetItem;
