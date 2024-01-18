import React from "react";
import "../styles.scss";
import {
	Modal,
	Avatar,
	Input,
	Form,
	Comment as CommentAntd,
} from "antd";
import {
	SendOutlined,
	DeleteOutlined,
	EditOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(relativeTime);

const CommentItem = ({
	username,
	item,
	showReplyBox,
	setShowReplyBox,
	onReply,
	setComment,
	profile,
	editComment,
	setEditComment,
	onEditComment,
	onDelete,
}) => {
	function getTime() {
		const local = dayjs.utc(item?.creation_date.substring(0, 23))
		return local.fromNow()
	}

	return (
		<CommentAntd
			key={item.id}
			actions={
				profile &&
				profile.reviewStatus === "APPROVED" && [
					<>
						{profile && profile.reviewStatus === "APPROVED" && (
							<>
								<span
									key="comment-nested-reply-to"
									className={item.id === showReplyBox ? "active" : ""}
									onClick={() => {
										if (item.id === showReplyBox) {
											setShowReplyBox("");
										} else {
											setShowReplyBox(item.id);
										}
										setEditComment("");
									}}
								>
									Reply to
								</span>
								{username === item.oauth2_user_id && (
									<span
										key="comment-nested-edit"
										className={item.id === editComment ? "active" : ""}
										onClick={() => {
											if (item.id === editComment) {
												setEditComment("");
											} else {
												setEditComment(item.id);
											}
											setShowReplyBox("");
										}}
									>
										Edit
									</span>
								)}
								{username === item.oauth2_user_id &&  (
									<span
										key="comment-nested-delete"
										onClick={() => {
											Modal.error({
												className: "popup-delete",
												centered: true,
												closable: true,
												icon: <DeleteOutlined />,
												title: "Are you sure you want to delete this comment?",
												content:
													"Please be aware this action cannot be undone.",
												okText: "Delete",
												okType: "danger",
												onOk() {
													onDelete(item.id)
												},
											});
										}}
									>
										Delete
									</span>
								)}
							</>
						)}
						{(item.id === showReplyBox || item.id === editComment) && (
							<>
								<Form.Item>
									{editComment ? (
										<EditOutlined
											onClick={() => {
												if (showReplyBox) {
													setShowReplyBox("");
													onReply();
												} else {
													setEditComment("");
													onEditComment();
												}
											}}
										/>
									) : (
										<SendOutlined
											onClick={() => {
												if (showReplyBox) {
													setShowReplyBox("");
													onReply();
												} else {
													setEditComment("");
													onEditComment();
												}
											}}
										/>
									)}
									<Input.TextArea
										rows={1}
										defaultValue={editComment && item.content}
										onChange={(e) => setComment(e.target.value)}
										onPressEnter={(e) => {
											if (e.ctrlKey) {
												if (showReplyBox) {
													setShowReplyBox("");
													onReply();
												} else {
													setEditComment("");
													onEditComment();
												}
											}
										}}
									/>
								</Form.Item>
							</>
						)}
					</>,
				]
			}
			author={item?.username}
			datetime={getTime()}
			avatar={
				<Avatar className="default-comment-avatar">
					{item?.username.slice(0, 2).toUpperCase()}
				</Avatar>
			}
			content={item.content}
		>
			{item?.comments?.map((childrenItem) => (
				<CommentItem
					username={username}
					key={childrenItem?.id}
					item={childrenItem}
					showReplyBox={showReplyBox}
					setShowReplyBox={setShowReplyBox}
					onReply={onReply}
					setComment={setComment}
					profile={profile}
					editComment={editComment}
					setEditComment={setEditComment}
					onEditComment={onEditComment}
					onDelete={onDelete}
				/>
			))}
		</CommentAntd>
	);
};

export default CommentItem;
