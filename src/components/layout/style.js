import styled from 'styled-components';
import media from '../../helpers/media';
import { Menu, Button, Drawer } from 'antd';
import { Link } from 'react-router-dom';


export const Container = styled.div`
	background-color: #006a9e;
	padding-top: 6px;
	padding-bottom: 6px;

	display: flex;
    justify-content: center;
`;

export const Navbar = styled.nav`
	margin-bottom: 0px;

	${media.ews`
		width: 90%;
	`};

	${media.desktop`
		width: 96%;
	`};
`;

export const ContentCenter = styled.div`
	display: flex;
	align-items: center;

	${media.mobile`
		padding-right: 0px;
		padding-left: 0px;
		margin-right: auto;
		margin-left: 0px;
  	`};
`;

export const HamburgerButton = styled(Button)`
	background: #00000000;
	color: #05f081;
	border-color: #05f081;
	display: none;

	${media.mobile`
		display: block;
  	`};
`;

export const NavbarItem = styled.a`
	cursor: pointer;
	color: #fff;
	font-weight: 600;
	border-right: 1px solid #3176ae;
	display: flex !important;
	align-items: center;
	height: 40px;
	margin-top: 5px !important;
	white-space: nowrap;
	font-size: 14px;
	border-radius: 0px;
	vertical-align: middle;
	font-family: "Open Sans", "Avenir Next";
	padding: 6px 12px !important;
	line-height: 1.5;
	
	@media (max-width: 1200px) {
		
	}

	&:hover {
		color: #4dffa5;
    	background-color: rgba(77,255,165,.1) !important;
	}
`;

export const NavbarDropdownItem = styled.div`
	cursor: pointer;
	color: #fff;
	font-weight: 600;
	border-right: 1px solid #3176ae;
	display: flex !important;
	align-items: center;
	height: 40px;
	margin-top: 5px !important;
	padding: 6px 12px !important;
	white-space: nowrap;
	font-size: 14px;
	font-family: "Open Sans", "Avenir Next";
	vertical-align: middle;
	border-radius: 0px;
	line-height: 1.5;

	&:hover {
		color: #4dffa5;
		background-color: rgba(77,255,165,.1) !important;
	}
`;

export const DropdownChevron = styled.span`
	font-size: 10px;
	margin-top: 2px;
	margin-left: 4px;
`;

export const LogoContainer = styled.a`
	margin-right: 20px;
`;

export const Logo = styled.img`
	margin: 14px 0px;
`;

export const FilledButton = styled.button`
	color: #2d6796;
	background-color: #05f081;
	border-color: #05f081;
	border-radius: 50px;
	box-shadow: rgba(17, 17, 26, 0.1) 0px 4px 16px, rgba(17, 17, 26, 0.1) 0px 8px 24px, rgba(17, 17, 26, 0.1) 0px 16px 56px;

	&:hover {
		border-color: #079e90;
		color: #00ff7f;
		background-color: #079e90 !important;	
	}
`;

export const MenuItem = styled(Menu.Item)`
	display: flex;
	justify-content: space-between;
	align-items: center;
	color: #2d6796;
	height: 40px;
	width: 200px;
`;

export const FloatingButtonAnchor = styled(Link)`
	position: fixed;
	right: ${props => props.right}px;
	bottom: ${props => props.bottom}px;
	z-index: 10;
	outline: none;

	${media.mobile`
		right: 10px;
		bottom: ${props => props.bottom}px;
  	`};
`;

export const AddContentButton = styled(FilledButton)`
	font-size: 15px;
`;

export const AuthButtonsContainer = styled.div`
	display: flex;
	align-items: center;

	${media.mobile`
		display: none;
  	`};
`;

export const StyledDrawer = styled(Drawer)`
	& .ant-drawer-header-title {
		display: flex;
		flex-direction: row-reverse;
	}

	& .ant-drawer-close {
		margin: 0px;
		padding: 0px 0px 0px 6px;
	}

	& .ant-drawer-body {
		padding: 0 0.35rem 0 0;
	}
`;

export const SignButton = styled.button`
	color: #05f081;
	background-color: #346896;
	border-color: #05f081;
	border-radius: 50px;
	box-shadow: rgba(17, 17, 26, 0.1) 0px 4px 16px, rgba(17, 17, 26, 0.1) 0px 8px 24px, rgba(17, 17, 26, 0.1) 0px 16px 56px;
	margin-left: 10px;

	&:hover {
		border-color: #346896;
		color: #05f081;
		background-color: #079e90 !important;	
	}
`;

export const NavCollapsible = styled.div`
	padding: 0px;
`;
