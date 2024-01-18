import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Container = styled.div`
	width: 70px;
	height: 76px;
	border-radius: 6px;
	border: 1.5px solid #d3dee7;
	margin: 0px 7px;
	font-size: 10px;
	font-weight: 550;
	display: flex;
	flex-direction: column;
	align-items: center;
	color: #d3dee7;
	cursor: pointer;
	transition: all .15s ease-out;

	${(props) => {
		if (props.$isSelected) {
			return (`
				background-color: #3fc19f;
				border: 1.5px solid #adefd9;
			`);
		}

		return '';
	}}

	&:hover {
		color: #ffb800;
    	border:  1.5px solid #ffb800;
	}
`;

const Label = styled.span`
	margin-top: auto;
	line-height: 9px;
	min-height: 16px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	text-align: center;
	margin-bottom: 3px;
`;

const Icon = styled.img`
	margin-top: 3px;
	display: flex;
	flex: 1 1;
	align-items: center;
	justify-content: center;
	max-width: 50%;

	${Container}:hover & {
		display: none;
	}
`;

const IconHover = styled.img`
	margin-top: 3px;
	display: flex;
	flex: 1 1;
	align-items: center;
	justify-content: center;
	max-width: 50%;
	display: none;

	${Container}:hover & {
		display: flex;
	}
`;

const propTypes = {
	label: PropTypes.string.isRequired,
	icon: PropTypes.string.isRequired,
	hoverIcon: PropTypes.string.isRequired,
	isSelected: PropTypes.bool.isRequired,
	onSelect: PropTypes.func.isRequired,
};

const CategoryItem = ({ label, icon, hoverIcon, isSelected, onSelect }) => {
	function handleClick() {
		if (isSelected) {
			return onSelect('');
		}

		return onSelect(label);
	}

	return (
		<Container $isSelected={isSelected} onClick={handleClick}>
			<Icon src={icon} />
			<IconHover src={hoverIcon} />
			<Label>{label}</Label>
		</Container>
	);
};

CategoryItem.propTypes = propTypes;

export default CategoryItem;