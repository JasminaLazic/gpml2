import React, { useEffect, useState } from 'react';
import { Menu, Dropdown } from 'antd';
import { MenuOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { isCurrentUserAdmin } from '../../api';
import '../../bootstrap/css/bootstrap-theme.css';
import '../../bootstrap/css/bootstrap.css';
import {
	Container, Navbar, ContentCenter, HamburgerButton, NavbarItem, NavbarDropdownItem, DropdownChevron, LogoContainer, Logo,
	FilledButton, MenuItem, FloatingButtonAnchor, AddContentButton, AuthButtonsContainer, StyledDrawer, SignButton, NavCollapsible
} from './style';
import logo from '../../assets/logo.svg';
import { ROUTES, authUrl } from '../../constants/routes';

const navLinks = {
	overview: {
		key: 'overview',
		label: 'Overview',
		link: 'https://datahub.gpmarinelitter.org/pages/about',
	},
	mapAndLayer: {
		key: 'mapAndLayer',
		label: 'Map and Layer',
		link: 'https://datahub.gpmarinelitter.org/',
	},
	dataExplore: {
		key: 'dataExplore',
		label: 'Data Explore',
		link: ROUTES.MAIN,
	},
	apiExplore: {
		key: 'apiExplore',
		label: 'Api Explore',
		link: 'https://datahub.gpmarinelitter.org/pages/api-explore'

	},
	storyMap: {
		key: 'storyMap',
		label: 'Story Maps',
		link: 'https://datahub.gpmarinelitter.org/pages/story_map',
	},
	dataPartners: {
		key: 'dataPartners',
		label: 'Data Partners',
		link: 'https://digital.gpmarinelitter.org/connect/partners',
	},
	glossary: {
		key: 'glossary',
		label: 'Glossary',
		link: 'https://digital.gpmarinelitter.org/glossary',
	},
	joinDatahub: {
		key: 'joinDatahub',
		label: 'Join GPML Data Hub+',
		link: 'https://digital.gpmarinelitter.org/signup',
	},
	signIn: {
		key: 'signIn',
		label: 'Sign In',
		link: authUrl,
	},
	signOut: {
		key: 'signOut',
		label: 'Sign Out',
		link: `https://unep-gpml.eu.auth0.com/v2/logout?client_id=lmdxuDGdQjUsbLbMFpjDCulTP1w5Z4Gi&returnTo=${encodeURIComponent(window.location.origin)}/user/logout`,
	},
	adminPanel: {
		key: 'adminPanel',
		label: 'Admin Panel',
		link: ROUTES.ADMIN
	},
	addData: {
		key: 'addData',
		label: 'Add data',
		link: ROUTES.ADD_DATASET,
	},
	dataCatalog: {
		key: 'dataCatalog',
		label: 'Data Catalog',
		link: '#',
	}
};

const Header = () => {
	const navigate = useNavigate();
	const [floatingBottonPosition, setFloatingBottonPosition] = useState(null);
	const [isAdminUser, setIsAdminUser] = useState(false);
	const [isDrawerVisible, setIsDrawerVisible] = useState(false);

	useEffect(() => {
		const sortButton = document.getElementById('sort-section');
		if (sortButton) {
			const { right } = sortButton.getBoundingClientRect();
			setFloatingBottonPosition({ right: window.innerWidth - (right + 5), bottom: 40 });
		}

		isCurrentUserAdmin().then((isAdmin) => setIsAdminUser(isAdmin));
	}, []);

	function handleMenuItemClick({ key }) {
		const navItem = Object.values(navLinks).find((item) => item.key === key);
		if (!navItem) return;

		if (navItem.link.startsWith('https://') || navItem.link.startsWith('http://')) {
			window.location = navItem.link;
		} else {
			navigate(navItem.link);
		}
 
	}

	function toggleDrawerVisibility() {
		setIsDrawerVisible((state) => !state);
	}

	function renderFloatingButton() {
		if (floatingBottonPosition) {
			return (
				<FloatingButtonAnchor to={navLinks.addData.link} right={floatingBottonPosition.right} bottom={floatingBottonPosition.bottom}>
					<AddContentButton type="button" className="btn"><PlusOutlined /> {navLinks.addData.label}</AddContentButton>
				</FloatingButtonAnchor>
			);
		}
	}

	function renderDrawer() {
		const token = localStorage.getItem('token');

		return (
			<StyledDrawer
				width="75%"
				title="Menu"
				placement="right"
				onClose={toggleDrawerVisibility}
				visible={isDrawerVisible}
			>
				<Menu
					onClick={handleMenuItemClick}
					style={{ width: "100%" }}
					mode="inline"
				>
					<Menu.Item key={navLinks.overview.key}>{navLinks.overview.label}</Menu.Item>
					<Menu.Item key={navLinks.mapAndLayer.key}>{navLinks.mapAndLayer.label}</Menu.Item>
					<Menu.SubMenu key={navLinks.dataCatalog.key} title={navLinks.dataCatalog.label}>
						<Menu.Item key={navLinks.dataExplore.key}>{navLinks.dataExplore.label}</Menu.Item>
						<Menu.Item key={navLinks.apiExplore.key}>{navLinks.apiExplore.label}</Menu.Item>
					</Menu.SubMenu>
					<Menu.Item key={navLinks.storyMap.key}>{navLinks.storyMap.label}</Menu.Item>
					<Menu.Item key={navLinks.dataPartners.key}>{navLinks.dataPartners.label}</Menu.Item>
					<Menu.Item key={navLinks.glossary.key}>{navLinks.glossary.label}</Menu.Item>
					{
						token ? (
							<>
								{
									isAdminUser && <Menu.Item key={navLinks.adminPanel.key}>{navLinks.adminPanel.label}</Menu.Item>
								}
								<Menu.Item key={navLinks.signOut.key}>{navLinks.signOut.label}</Menu.Item>
							</>
						) : (
							<>
								<Menu.Item key={navLinks.joinDatahub.key}>{navLinks.joinDatahub.label}</Menu.Item>
								<Menu.Item key={navLinks.signIn.key}>{navLinks.signIn.label}</Menu.Item>
							</>
						)
					}
				</Menu>
			</StyledDrawer>
		);
	}

	function renderAuthButton() {
		const token = localStorage.getItem('token');

		if (token) {
			return (
				<AuthButtonsContainer>
					{
						isAdminUser && (
							<a href={navLinks.adminPanel.link} style={{ marginRight: '6px' }}>
								<SignButton type="button" className="btn">{navLinks.adminPanel.label}</SignButton>
							</a>
						)
					}
					<a href={navLinks.signOut.link}>
						<FilledButton type="button" className="btn">{navLinks.signOut.label}</FilledButton>
					</a>
				</AuthButtonsContainer>
			);
		}

		return (
			<AuthButtonsContainer>
				<a href={navLinks.joinDatahub.link}>
					<FilledButton type="button" className="btn">{navLinks.joinDatahub.label}</FilledButton>
				</a>
				<a href={navLinks.signIn.link}>
					<SignButton type="button" className="btn">{navLinks.signIn.label}</SignButton>
				</a>
			</AuthButtonsContainer>
		);
	}

	const exploreMenu = (
		<Menu onClick={handleMenuItemClick} trigger={["click"]}>
			<MenuItem key={navLinks.dataExplore.key} style={{ borderBottom: '1px solid #00aaf1' }}>
				{navLinks.dataExplore.label}
			</MenuItem>
			<MenuItem key={navLinks.apiExplore.key}>
				{navLinks.apiExplore.label}
			</MenuItem>
		</Menu>
	);

	return (
		<Container>
			{renderDrawer()}
			<Navbar>
				<ContentCenter className="container-fluid">
					<ContentCenter>
						<div className="navbar-header">
							<LogoContainer href="https://digital.gpmarinelitter.org/">
								<Logo src={logo} alt="Logo" height={68} />
							</LogoContainer>
						</div>

						<NavCollapsible className="collapse navbar-collapse" id="navbar-collapse">
							<ul className="nav navbar-nav">
								<li >
									<NavbarItem href={navLinks.overview.link}>{navLinks.overview.label}</NavbarItem>
								</li>
								<li >
									<NavbarItem href={navLinks.mapAndLayer.link}>{navLinks.mapAndLayer.label}</NavbarItem>
								</li>
								<li>
									<Dropdown overlay={exploreMenu}>
										<NavbarDropdownItem href="/">
											{navLinks.dataCatalog.label}
											<DropdownChevron className="caret"></DropdownChevron>
										</NavbarDropdownItem>
									</Dropdown>
								</li>
								<li>
									<NavbarItem href={navLinks.storyMap.link}>{navLinks.storyMap.label}</NavbarItem>
								</li>
								<li>
									<NavbarItem href={navLinks.dataPartners.link}>{navLinks.dataPartners.label}</NavbarItem>
								</li>
								<li>
									<NavbarItem href={navLinks.glossary.link}>{navLinks.glossary.label}</NavbarItem>
								</li>
							</ul>
						</NavCollapsible>
					</ContentCenter>
					<div style={{flex: 1}} />
					{renderAuthButton()}
					<HamburgerButton onClick={toggleDrawerVisibility} shape="circle" icon={<MenuOutlined />} />
				</ContentCenter>
				{renderFloatingButton()}
			</Navbar>
		</Container>
	);
};

export default Header;
