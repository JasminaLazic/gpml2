import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const Container = styled.button`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	width: 73px;
	height: 76px;
	background-color: #004063;
	border: unset;
	border-radius: 4px;
	cursor: pointer;
	margin-right: 14px;
	position: relative;
	margin-left: 15px;
`;

const Label = styled.span`
	max-width: 50px;
	display: inline-block;
	white-space: normal;
	font-weight: 400;
	font-size: 10px;
	line-height: 11px;
	text-align: center;
	text-transform: capitalize;
	color: #fff;
`;

const Badge = styled.div`
	position: absolute;
	background-color: #e91a08;
	color: #fff;
	font-weight: 700;
	height: 20px;
	border-radius: 50%;
	top: 5px;
	right: 5px;
	font-size: 10px;
	line-height: 20px;
	padding: 0 2px;
	min-width: 20px;
	text-align: center;
	transform: translateX(-50%);
`;

const Icon = styled.img`
	height: 21px;
	width: 21px;
	margin-bottom: 8px;
`;

const propTypes = {
	label: PropTypes.string.isRequired,
	onClick: PropTypes.func.isRequired,
	icon: PropTypes.string.isRequired,
	appiedFiltersCount: PropTypes.number.isRequired,
};

const ActionButton = ({ label, onClick, icon, appiedFiltersCount }) => {
	return (
		<Container onClick={onClick}>
			{!!appiedFiltersCount && <Badge>{appiedFiltersCount}</Badge>}
			<Icon src={icon} />
			<Label>{label}</Label>
		</Container>
	);
};

ActionButton.propTypes = propTypes;

export default ActionButton;
