import React, { useState, useEffect } from "react";
import "../styles.scss";
import { authUrl } from '../../../constants/routes';
import { getAllDatastComments, createDatasetComment, editDatasetComment, deleteDatasetComment } from '../../../api/comments';
import {
	Col,
	Input,
	Button,
	notification,
	message,
} from "antd";
import { eventTrack } from "../../../helpers/misc";
import {
	MessageOutlined,
	SendOutlined,
} from "@ant-design/icons";
import CommentItem from './CommentItem'


const Comments = ({
	profile,
	isAuthenticated,
	datasetName,
}) => {
	const [comments, setComments] = useState([]);
	const [comment, setComment] = useState("");
	const [editComment, setEditComment] = useState("");
	const [newComment, setNewComment] = useState("");
	const [showReplyBox, setShowReplyBox] = useState("");
	const username = localStorage.getItem('username');

	useEffect(() => {
		getComments();
	}, []);

	const getComments = async () => {
		const [err, result] = await getAllDatastComments(datasetName);
		setComments(result.result.comments);
	};

	function handleRedirectToLogin() {
		window.location = authUrl;
	}

	const onSubmit = async (val) => {
		if (!newComment && !val) return;
	
		const [err, result] = await createDatasetComment({ url: `/dataset/${datasetName}`, comment: newComment ? newComment : val, parent_id: showReplyBox });
		if (err || !result.success) {
			notification.error({ message: "Oops, something went wrong" });
		}
		if (result) {
			message.success('You have successfully created a feedback');
			getComments();
			setNewComment("");
		}

	};

	const onReply = () => {
		onSubmit(comment);
	};

	const onEditComment = async () => {
		const [err, result] = await editDatasetComment({ id: editComment, comment });
		if (err || !result.success) {
			notification.error({ message: "Oops, something went wrong" });
		}
		if (result) {
			message.success('Your feedback have been successfully edited');

			getComments();
		}
	};

	const handleDelete = async (id) => {
		const [err, result] = await deleteDatasetComment({ id });

		if (err || !result.success) {
			notification.error({ message: "Oops, something went wrong" });
		}
		if (result) {
			message.success('Your feedback have been successfully deleted');

			getComments();
		}
	};

	function renderCommentList() {
		return comments?.map((item) => {
			return (
				<CommentItem
					username={username}
					key={item?.id}
					item={item}
					showReplyBox={showReplyBox}
					setShowReplyBox={setShowReplyBox}
					onReply={onReply}
					onDelete={handleDelete}
					setComment={setComment}
					profile={profile}
					editComment={editComment}
					setEditComment={setEditComment}
					onEditComment={onEditComment}
				/>
			);
		});
	}

	function renderInput() {
		if (!isAuthenticated) {
			return (
				<Col className="section">
					<Button
						className="login-button"
						onClick={handleRedirectToLogin}
						icon={<MessageOutlined twoToneColor="#09689a" />}
						shape="round"
					>
						Login to comment
					</Button>
				</Col>
			);
		}

		return (
			<Col className="input-wrapper">
				<MessageOutlined className="message-icon" />
				<div className="input">
					<SendOutlined
						onClick={() => {
							eventTrack("Resource view", "Comment", "Button");
							onSubmit({ description: newComment });
						}}
					/>
					<Input.TextArea
						rows={1}
						className="comment-input"
						placeholder={
							comments && comments.length > 0
								? "Join the discussion..."
								: "Be the first to comment..."
						}
						value={newComment}
						onChange={(e) => setNewComment(e.target.value)}
						onPressEnter={(e) =>
							e.ctrlKey && onSubmit({ description: newComment })
						}
					/>
				</div>
			</Col>
		);
	}

	return (
		<>
			<Col className="section comment-section">
				<h3
					className="content-heading"
					style={
						comments && comments.length > 0
							? { marginBottom: "0" }
							: { marginBottom: "16px" }
					}
				>
					Discussion
				</h3>
				{renderCommentList()}
			</Col>
			{renderInput()}
		</>
	);
};

export default Comments;
