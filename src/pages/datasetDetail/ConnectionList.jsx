import React, { useEffect, useState } from 'react';
import { Col, Card, Avatar, Tooltip } from "antd";
import { Link } from "react-router-dom";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper";
import { ReactComponent as CircledUserIcon } from "../../assets/images/union-outlined.svg";
import "./stakeholder-carousel.scss";
import "./styles.scss";
import { randomColor } from '../../helpers/misc';
import { getPackageStakeholderList } from '../../api';

import styled from 'styled-components';

const StakeholderLink = styled.a`

`;

const ConnectionList = ({ packageId }) => {
	const [entitiyDetails, setEntityDetails] = useState([]);

	useEffect(() => {
		getPackageStakeholderList(packageId).then((data) => setEntityDetails(data));
	}, []);

	const colour = () => randomColor[Math.floor(Math.random() * randomColor.length)];

	return (
		<Col className="section section-connection-stakeholder">
			<div className="extra-wrapper">
				<h3 className="content-heading">Connections</h3>
				<div className="connection-wrapper">
					<Swiper
						spaceBetween={0}
						slidesPerGroup={window.innerWidth > 1024 ? 5 : 1}
						slidesPerView={"auto"}
						pagination={{
							clickable: true,
						}}
						navigation={true}
						modules={[Pagination, Navigation]}
						className="connection-carousel"
					>
						{entitiyDetails.map((connectionItem) => {
								const name = connectionItem?.description;
								const firstInitial = name[0]?.substring(0, 1) || "";
								const secondInitial = name[1]?.substring(0, 1) || "";
								const initial = `${firstInitial}${secondInitial}`;

								return (
									<SwiperSlide>
										<StakeholderLink href={connectionItem.url} target="_blank">
										<Tooltip placement="top" title={connectionItem.description}>
											<Card
												className="connection-card"
												key={connectionItem.stakeholder_id}
											>
												<div
													className={`connection-image-wrapper connection-no-image-wrapper`}
												>
													<Avatar
														className="connection-image"
														src={connectionItem.logo}
														style={{ backgroundColor: colour() }}
														alt={connectionItem.description}
													>
														{<CircledUserIcon />}
														<span>{initial}</span>
													</Avatar>
												</div>
												<ul className="connection-detail-list">
													<li className="list-item connection-name">
														{connectionItem.description}
													</li>
													<li className="list-item  connection-role">ENTITY</li>
												</ul>
											</Card>
											</Tooltip>
										</StakeholderLink>
									</SwiperSlide>
								);
							})}
					</Swiper>
				</div>
			</div>
		</Col>
	);
};

export default ConnectionList;
