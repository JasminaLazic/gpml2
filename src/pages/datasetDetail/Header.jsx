import React, { useState, useEffect } from "react";
import { Col, Popover, Input, Button } from "antd";
import "./styles.scss";
// import { eventTrack } from "../../utils/misc";
import { isCurrentUserAdmin } from '../../api';

import {
	EyeFilled,
	HeartTwoTone,
	MailTwoTone,
	PlayCircleTwoTone,
	HeartFilled,
} from "@ant-design/icons";

export const HeaderButtons = ({
	data,
	handleEditBtn,
	handleDeleteBtn,
	canEdit,
	canDelete,
	relation,
	handleRelationChange,
	visible,
	handleVisible,
}) => {

	const handleVisibleChange = () => {
		handleVisible();
	};

	return (
		<Col className="tool-buttons">
			{data?.url && (
				<Button
					className="view-button "
					icon={<EyeFilled />}
					type="primary"
					shape="round"
					size="middle"
					onClick={(e) => {
						e.preventDefault();
						// eventTrack("Resource view", "View Url", "Button");
						window.open(
							`${data?.url && data?.url?.includes("https://")
								? data?.url
								: data?.languages
									? data?.languages[0]?.url
									: data?.url?.includes("http://")
										? data?.url
										: "https://" + data?.url
							}`,
							"_blank"
						);
					}}
				>
					View
				</Button>
			)}
			{data?.recording && (
				<Button
					className="recording-button two-tone-button"
					icon={<PlayCircleTwoTone twoToneColor="#09689a" />}
					type="primary"
					shape="round"
					size="middle"
					ghost
					onClick={() => {
						window.open(
							data?.recording.includes("https://")
								? data?.recording
								: "https://" + data?.recording,
							"_blank"
						);
					}}
				>
					Recording
				</Button>
			)}
			{data?.url && (
				<Popover
					placement="top"
					overlayStyle={{
						width: "22vw",
					}}
					overlayClassName="popover-share"
					content={
						<Input.Group compact>
							<Input
								style={{ width: "calc(100% - 20%)" }}
								defaultValue={`${data?.url && data?.url?.includes("https://")
										? data?.url
										: data?.languages
											? data?.languages[0]?.url
											: data?.url && data?.url?.includes("http://")
												? data?.url
												: data?.url
													? "https://" + data?.url
													: "https://"
									}`}
								disabled
							/>
							<Button
								style={{ width: "20%" }}
								type="primary"
								disabled={!data?.url}
								onClick={() => {
									navigator.clipboard.writeText(
										data?.url && data?.url?.includes("https://")
											? data?.languages
												? data?.languages[0]?.url
												: data?.url
											: "https://" + data?.url
									);
									handleVisibleChange();
								}}
							>
								Copy
							</Button>
						</Input.Group>
					}
					trigger="click"
					visible={visible}
					onVisibleChange={handleVisibleChange}
				>
					<div>
						<Button
							className="share-button two-tone-button"
							icon={<MailTwoTone twoToneColor="#09689a" />}
							type="primary"
							shape="round"
							size="middle"
							ghost
							onClick={() => {
								navigator.clipboard.writeText(
									data?.url && data?.url?.includes("https://")
										? data?.languages
											? data?.languages[0]?.url
											: data?.url
										: "https://" + data?.url
								);
								// eventTrack("Resource view", "Share", "Button");
								handleVisibleChange();
							}}
						>
							Share
						</Button>
					</div>
				</Popover>
			)}
			{/* <Button
				className="bookmark-button two-tone-button"
				icon={
					relation?.association?.indexOf("interested in") !== -1 ? (
						<HeartFilled className="heart-filled" />
					) : (
						<HeartTwoTone className="two-tone-heart" twoToneColor="#09689a" />
					)
				}
				type="primary"
				shape="round"
				size="middle"
				ghost
				onClick={() => {
					//   eventTrack("Resource view", "Bookmark", "Button");
					handleChangeRelation("interested in");
				}}
			>
				Bookmark
			</Button> */}
			{canEdit && data.approval_status !== 'declined' && (
				<Button
					className="edit-button two-tone-button"
					type="primary"
					shape="round"
					size="middle"
					ghost
					onClick={handleEditBtn}
				>
					Edit
				</Button>
			)}
			{canDelete && data.approval_status !== 'declined' && (
				<Button
					className="delete-button two-tone-button"
					type="primary"
					shape="round"
					size="middle"
					ghost
					onClick={handleDeleteBtn}
				>
					Delete
				</Button>
			)}
		</Col>
	);
};

const Header = ({
	data,
	LeftImage,
	profile,
	isAuthenticated,
	params,
	handleEditBtn,
	handleDeleteBtn,
	allowBookmark,
	visible,
	handleVisible,
	showLess,
	setShowLess,
	placeholder,
	handleRelationChange,
	relation,
}) => {
	const [isAdminUser, setIsAdminUser] = useState(false);

	useEffect(() => {
		isCurrentUserAdmin().then((isAdmin) => setIsAdminUser(isAdmin));
	}, []);
	
	const toolButtons = (
		data,
		LeftImage,
		profile,
		isAuthenticated,
		params,
		handleEditBtn,
		handleDeleteBtn,
		allowBookmark,
		visible,
		handleVisible,
		showLess,
		setShowLess,
		placeholder,
		relation,
		handleRelationChange
	) => {
		return (
			<HeaderButtons
				data={data}
				handleDeleteBtn={handleDeleteBtn}
				canDelete={isAdminUser}
				topic={{ ...data, ...params }}
				handleEditBtn={handleEditBtn}
				canEdit={isAdminUser}
				relation={relation.relation}
				handleRelationChange={relation.handleRelationChange}
				allowBookmark={allowBookmark}
				visible={visible}
				handleVisible={handleVisible}
			/>
		);
	};

	return (
		<div className="detail-header">
			<h3 className="detail-resource-type content-heading">
				{data?.category}
			</h3>
			<h4 className="detail-resource-title">{data?.title}</h4>
			{toolButtons(
				data,
				LeftImage,
				profile,
				isAuthenticated,
				params,
				handleEditBtn,
				handleDeleteBtn,
				allowBookmark,
				visible,
				handleVisible,
				showLess,
				setShowLess,
				placeholder,
				{ ...{ handleRelationChange, relation } }
			)}
		</div>
	);
};

export default Header;
