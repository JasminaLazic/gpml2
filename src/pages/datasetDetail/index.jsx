/* eslint-disable react-hooks/exhaustive-deps */
import React, {	useState, useEffect } from "react";
import "./styles.scss";
import { useParams, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import styled from "styled-components";
import Spinner from '../../components/common/Spin';
import { declineDatasetPublication } from '../../api/';
import ConnectionList from "./ConnectionList";
import {
	Row,
	Col,
	List,
	Tag,
	Modal,
} from "antd";

import { DeleteOutlined } from "@ant-design/icons";
import { getDatasetById } from '../../api';
import { titleCase } from "../../helpers/string";
import LeftImage from "../../assets/images/sea-dark.jpg";
import Comments from './comments/index';
import Header from "./Header";
import Records from "./Records";
import GeoLocationCoverage from "./GeoLocationCoverage";

const SpinContainer = styled.div`
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100%;
`;

const DetailsView = () => {
	const token = localStorage.getItem('token');
	const isAuthenticated = !!token;
	const [showLess, setShowLess] = useState(true);
	const params = useParams();
	const datasetId = params.datasetId;
	const profile = { reviewStatus: "APPROVED"};
	const placeholder = null;
	const [data, setData] = useState(null);
	const [visible, setVisible] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		if (!data) {
			fetchDatasetDetail();
		}
	}, [data]);

	async function fetchDatasetDetail() {
		const datasetDetail = await getDatasetById(datasetId);

		setData(datasetDetail);
	}

	function getUniqeTags() {
		const filteredValidTags = data.tags.filter((item) => Object.keys(item).length > 1);
		const uniqeNames = Array.from(new Set(filteredValidTags.map(({ name }) => name)));
		return uniqeNames;
	}

	const handleEditBtn = () => {
		navigate(`${ROUTES.EDIT_DATASET}/${datasetId}`);
	};

	const handleDeleteBtn = () => {
		Modal.error({
			className: "popup-delete",
			centered: true,
			closable: true,
			icon: <DeleteOutlined />,
			title: "Are you sure you want to delete this resource?",
			content: "Please be aware this action cannot be undone.",
			okText: "Delete",
			okType: "danger",
			onOk() {
				declineDatasetPublication(data.id).then(() => {
					navigate(-1);
				});
			},
		});
	};

	const handleVisible = () => {
		setVisible(!visible);
	};


	if (!data) {
		return (
			<SpinContainer>
				<Spinner />
			</SpinContainer>
		);
	};

	return (
		<div className="detail-view-wrapper">
			<div
				id="detail-view"
				style={true || !isAuthenticated ? { paddingBottom: "1px" } : { padding: 0 }}
			>
				<Header
					{...{
						data,
						LeftImage: data?.image_display_url ? data?.image_display_url : LeftImage,
						profile,
						isAuthenticated,
						params: {},
						handleEditBtn,
						handleDeleteBtn,
						allowBookmark: false,
						visible,
						handleVisible,
						showLess,
						setShowLess,
						placeholder,
						handleRelationChange: () => null,
						relation: null,
					}}
				/>
				<Row
					className="resource-info "
					gutter={{
						lg: 24,
					}}
				>
					<a
						className="resource-image-wrapper"
						href={`${data?.url && data?.url?.includes("https://")
								? data?.url
								: data.languages
									? data?.languages[0].url
									: data?.url?.includes("http://")
										? data?.url
										: "https://" + data?.url
							}`}
						target="_blank"
					>
						<img
							className="resource-image"
							id="detail-resource-image"
							src={data?.image_display_url ? data?.image_display_url : LeftImage}
							alt={data?.title}
						/>
					</a>

					<Col className="details-content-wrapper section-description section">
						{data?.notes && (
							<Row>
								<h3 className="content-heading">Description</h3>
								<div className="content-paragraph">
									<div
										className="list documents-list"
										dangerouslySetInnerHTML={{ __html: data?.notes }}
									/>
								</div>
							</Row>
						)}

						<GeoLocationCoverage data={data} />
					</Col>
				</Row>

				{data?.tags && data?.tags?.length > 0 && (
					<Col className="section-tag section">
						<div className="extra-wrapper">
							<h3 className="content-heading">Tags</h3>
							<List itemLayout="horizontal">
								<List.Item>
									<List.Item.Meta
										title={
											<ul className="tag-list">
												{data?.tags &&
													getUniqeTags().map((tag) => (
														<li className="tag-list-item" key={tag}>
															<Tag className="resource-tag">
																{titleCase(tag)}
															</Tag>
														</li>
													))}
											</ul>
										}
									/>
								</List.Item>
							</List>
						</div>
					</Col>
				)}
				{/* CONNECTION */}
				<ConnectionList packageId={data.id} />

				{data?.info && (
					<Col className="section section-document">
						<div className="extra-wrapper">
							<h3 className="content-heading">Documents and info</h3>
							<div className="content-paragraph">
								<div
									className="list documents-list"
									dangerouslySetInnerHTML={{ __html: data?.info }}
								/>
							</div>
						</div>
					</Col>
				)}

				<Records {...data} />

				<Comments
					profile={profile}
					isAuthenticated={isAuthenticated}
					datasetId={datasetId}
					datasetName={data.name}
				/>
			</div>
		</div>
	);
};

export default DetailsView;