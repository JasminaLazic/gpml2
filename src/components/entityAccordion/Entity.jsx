import React from 'react';
import { Collapse, Select } from 'antd';
import styled from 'styled-components';
import { DeleteOutlined, ArrowUpOutlined } from '@ant-design/icons';

import { ENTITY_TYPES } from '../../constants/dataSetForm';

const StyledSelect = styled(Select)`
	width: 100%;
	border-radius: 3px;
	overflow: hidden;
	margin-bottom: 22px;

	& .ant-select-selector {
		background: #EDF2F7 !important;
	}

	& .ant-select-selection-placeholder {
		color: #A5B0C9 !important;
	}
`;

const SelectLabel = styled.span`
	color: #255b87;
	font-size: 16px;
	font-weight: 400;
	padding-bottom: 8px;
	display: block;
`;

const EntityContainer = styled.div`
	margin-bottom: 10px;
`;

const StyledPanel = styled(Collapse.Panel)`
	& .ant-collapse-header {
		color: #3176ae !important;
		font-weight: 700 !important;
		text-transform: capitalize !important;
	}

	& .ant-collapse-extra {
		flex: 1;
	}
`;

const Subheader = styled.div`
	text-transform: uppercase;
	color: #384e85;
	border: 1px solid #384e85;
	box-sizing: border-box;
	border-radius: 60px;
	padding: 0 10px;
	font-weight: 400;
`;

const ExtraContainer = styled.div`
	display: flex;
    float: none!important;
    justify-content: space-between;
	align-items: center;
    flex: 1 1;
    padding-left: 35px;
`;

const RightButtonsContainer = styled.div`
	display: flex;
	align-items: center;
`;

const DeleteIcon = styled(DeleteOutlined)`
	font-size: 20px;
	color: black;
`;

const MoveUpIcon = styled(ArrowUpOutlined)`
	margin-left: 12px;
	font-size: 14px;
	color: black;
	border-radius: 50px;
	border: 1px solid black;
	padding: 2px;
`;

const { Option } = Select;

const Entity = ({ entityOptionList, entityList, setEntityList, index, entity, onDelete, onMoveUp }) => {
	const entityTypeOptionList = Object.values(ENTITY_TYPES).map((entityType) => <Option key={entityType}>{entityType}</Option>);
	const entityOptions = entityOptionList.map(({ id, name }) => <Option value={id} key={id}>{name}</Option>);

	function handleEntityTypeChange(type) {
		const updatedEntity = {
			...entityList[index],
			entityType: type,
		};

		setEntityList([
			...entityList.slice(0, index),
			updatedEntity,
			...entityList.slice(index + 1),
		]);
	}

	function handleEntityChange(value) {
		const updatedEntity = {
			...entityList[index],
			entityOrganizationId: value,
		};

		setEntityList([
			...entityList.slice(0, index),
			updatedEntity,
			...entityList.slice(index + 1),
		]);
	}

	function handleDelete(e) {
		onDelete(index);
		e.stopPropagation();
	}

	function handleMoveUp(e) {
		onMoveUp(index);
		e.stopPropagation();
	}

	function renderExtra() {
		const subHeader = entity.entityType ? <Subheader>{entity.entityType}</Subheader> : <div />;

		return (
			<ExtraContainer>
				{subHeader}
				<RightButtonsContainer>
					<DeleteIcon onClick={handleDelete} />
					{index !== 0 && <MoveUpIcon onClick={handleMoveUp} />}
				</RightButtonsContainer>
			</ExtraContainer>
		);
	}

	function getHeaderText() {
		if (entity.entityOrganizationId) {
			return entityOptionList.find(({ id }) => id === entity.entityOrganizationId).name;
		}

		return '';
	}

	return (
		<EntityContainer>
			<Collapse onClick defaultActiveKey={"1"}>
				<StyledPanel key="1" header={getHeaderText()} extra={renderExtra()}>
					<SelectLabel>Entity role</SelectLabel>
					<StyledSelect
						value={entity.entityType}
						onChange={handleEntityTypeChange}
						placeholder="Select entity role"
					>
						{entityTypeOptionList}
					</StyledSelect>

					<SelectLabel>Entity</SelectLabel>
					<StyledSelect
						value={entity.entityOrganizationId}
						onChange={handleEntityChange}
						placeholder="Select an entity"
						showSearch
						optionFilterProp="children"
						filterOption={(input, option) =>
							(option?.children ?? '').toLowerCase().includes(input.toLowerCase())
						}
					>
						{entityOptions}
					</StyledSelect>
				</StyledPanel>
			</Collapse>
		</EntityContainer>
	);
};

export default Entity;
