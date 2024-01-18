import React from 'react';
import styled from 'styled-components';
import { Button, Switch, Popconfirm } from 'antd';
import media from '../../helpers/media';

const Container = styled.div`
	background-color: #046799;
	padding: 10px;
	position: sticky;
  	top: 0;
	z-index: 10;
`;

const FlexRowSpacebetween = styled.div`
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

const SubmitButtonsContainerWeb = styled.div`
	display: flex;
	align-items: center;

	${media.mobile`
		display: none;
  	`};
`;

const SubmitButtonsContainerMobile = styled.div`
	background-color: #046799;
	padding: 10px;
	align-items: center;
	display: none;
	position: fixed;
    bottom: 0px;
    right: 0px;
    width: 100%;
    z-index: 10;
	justify-content: space-around;

	${media.mobile`
		display: flex;
  	`};
`;

const SubmitButton = styled(Button)`
	border-color: #05f081 !important;
	color: #05f081 !important;

	&:hover {
		border-color: #fefefe !important;
		color: #fefefe !important;
	}
`;

const CancelButton = styled(Button)`
	border-color: #f72526 !important;
	color: #f72526 !important;
	margin-left: 10px;
`;

const StyledSwitch = styled(Switch)`
	background-color: ${props => props.$isChecked ? '#05f081' : '#046799' }  !important;
	border: 2px solid white;
	outline: none !important;
	

	& .ant-switch-handle {
		width: 14px;
		height: 14px;
	}

	& .ant-switch-handle {
		left: calc(${props => props.$isChecked ? 100 : 50 }% - ${props => props.$isChecked ? 14 : 16 }px - 2px);
	}
`;

const HightliteFieldsLabel = styled.span`
	display: block;
	font-size: 16px;
	font-weigth: 400;
	color: white;
	margin-left: 12px;
`;

const FlexDiv = styled.div`
	display: flex;
	align-items: center;

	${media.mobile`
		margin-top: 15px;
  	`};
`;

const TopBar = ({ onSubmit, onCancel, requiredFieldsHighlited, toggleRequiredFieldsHighlite }) => {
	return (
		<Container>
			<FlexRowSpacebetween className="container">
				<SubmitButtonsContainerWeb>
					<SubmitButton onClick={onSubmit} ghost shape="round" size="large">
						Update
					</SubmitButton>
					<Popconfirm placement="bottomLeft" title="Are you sure you want to leave? Once you leave filled data will not be saved." onConfirm={onCancel} okText="Yes" cancelText="No">
						<CancelButton ghost shape="round" size="large">
							Cancel
						</CancelButton>
					</Popconfirm>
				</SubmitButtonsContainerWeb>
				<FlexDiv>
					<StyledSwitch $isChecked={requiredFieldsHighlited} checked={requiredFieldsHighlited} onChange={toggleRequiredFieldsHighlite} />
					<HightliteFieldsLabel>Highlight required fields</HightliteFieldsLabel>
				</FlexDiv>
			</FlexRowSpacebetween>
			<SubmitButtonsContainerMobile>
				<SubmitButton onClick={onSubmit} ghost shape="round" size="large">
					Update
				</SubmitButton>
				<Popconfirm placement="bottomLeft" title="Are you sure you want to leave? Once you leave filled data will be erased." onConfirm={onCancel} okText="Yes" cancelText="No">
					<CancelButton ghost shape="round" size="large">
						Cancel
					</CancelButton>
				</Popconfirm>
			</SubmitButtonsContainerMobile>
		</Container>
	);
};

export default TopBar;
