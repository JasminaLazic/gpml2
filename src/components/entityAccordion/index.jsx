import React from 'react';
import { Button } from 'antd';
import styled from 'styled-components';
import { PlusOutlined } from '@ant-design/icons';
import Entity from './Entity';

const Container = styled.div`
	border-radius: 4px;
	${props => props.error && 'border: 1px solid #ff4d4f; padding: 6px 2px;'}
`;

const AddButton = styled(Button)`
	font-weight: 700;
	margin-top: 10px;
`;


const EntityAccordion = ({ entityOptionList, entityList, setEntityList, hasError }) => {

	function handleDeleteEntity(index) {
		if (entityList.length < 2) {
			return null;
		}

		setEntityList([
			...entityList.slice(0, index),
			...entityList.slice(index + 1),
		]);
	}

	function handleMoveupEntity(index) {
		if (index === 0) {
			return null;
		}

		let updatedList = entityList;
		const [entityA, entityB] = [entityList[index - 1], entityList[index]]

		updatedList[index - 1] = entityB;
		updatedList[index] = entityA;

		setEntityList(updatedList);
	}

	function handleAddEntity() {
		setEntityList([...entityList, {
			entityType: '',
			entityOrganizationId: '',
			id: `${Date.now()}`
		}]);
	}

	function renderEntityList() {
		return entityList.map((item, index) => (
			<Entity
				key={item.id}
				entityOptionList={entityOptionList}
				entityList={entityList}
				setEntityList={setEntityList}
				index={index}
				entity={item}
				onDelete={handleDeleteEntity}
				onMoveUp={handleMoveupEntity}
			/>
		));
	}

	return (
		<Container error={hasError}>
			{renderEntityList()}
			<AddButton
				type="dashed"
				block
				icon={<PlusOutlined />}
				onClick={handleAddEntity}
			>
				Connect another entity
			</AddButton>
		</Container>
	);
};

export default EntityAccordion;
