import React, { Fragment } from "react";
import { Col } from "antd";
import dayjs from "dayjs";

const Records = ({ category, data_format, data_type, lang, license_id, license_title, owners, partners, approval_status, sub_category, url, start_date1, end_date1, sponsors }) => {

	


	return (
		<Col className="record-section section">
			<h3 className="content-heading">Records</h3>
			<div>
				<div className="record-table">
					{/* {
						approval_status && (
							<Fragment>
								<div className="record-row">
									<div className="record-name">Approval status</div>
									<div className="record-value">{approval_status}</div>
								</div>
							</Fragment>
						)
					} */}
					{/* {
						category && (
							<Fragment>
								<div className="record-row">
									<div className="record-name">Category</div>
									<div className="record-value">{category}</div>
								</div>
							</Fragment>
						)
					} */}
					{
						sub_category && (
							<Fragment>
								<div className="record-row">
									<div className="record-name">Sub category</div>
									<div className="record-value">{sub_category}</div>
								</div>
							</Fragment>
						)
					}
					{
						start_date1 && (
							<Fragment>
								<div className="record-row">
									<div className="record-name">Valid From</div>
									<div className="record-value">{dayjs(start_date1).format('DD/MM/YYYY')}</div>
								</div>
							</Fragment>
						)
					}
					{
						(start_date1 || end_date1) && (
							<Fragment>
								<div className="record-row">
									<div className="record-name">Valid Until</div>
									<div className="record-value">{ end_date1 ? dayjs(end_date1).format('DD/MM/YYYY') : 'Ongoing'}</div>
								</div>
							</Fragment>
						)
					}
					{
						data_format && (
							<Fragment>
								<div className="record-row">
									<div className="record-name">Data format</div>
									<div className="record-value">{data_format}</div>
								</div>
							</Fragment>
						)
					}
					{
						data_type && (
							<Fragment>
								<div className="record-row">
									<div className="record-name">Data type</div>
									<div className="record-value">{data_type}</div>
								</div>
							</Fragment>
						)
					}
					{
						lang && (
							<Fragment>
								<div className="record-row">
									<div className="record-name">Language</div>
									<div className="record-value">{lang}</div>
								</div>
							</Fragment>
						)
					}
					{
						license_title && (
							<Fragment>
								<div className="record-row">
									<div className="record-name">License</div>
									<div className="record-value">{license_title}</div>
								</div>
							</Fragment>
						)
					}
				</div>
			</div>
		</Col>
	);
};

export default Records;
