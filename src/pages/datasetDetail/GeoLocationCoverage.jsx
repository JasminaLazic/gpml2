import React, { useState, useEffect } from 'react';
import {
	Row,
	Col,
	Popover,
} from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import './styles.scss';
// import { multicountryGroups } from '../../constants/multiCountry';
import { ReactComponent as LocationImage } from "../../assets/images/location.svg";
import { ReactComponent as TransnationalImage } from "../../assets/images/transnational.svg";
import { ReactComponent as CityImage } from "../../assets/images/city-icn.svg";
import { titleCase } from "../../helpers/string";
import { getCountryList, getTransnationalList } from '../../api';
import { geoCoverage as geoCoverageType, transnationalOrganizations } from '../../constants/dataSetForm';


const GeoLocationCoverage = ({ data }) => {
	const [countries, setCountries] = useState([]);

	useEffect(() => {
		fetchGeoCoverageData();
	}, []);

	async function fetchGeoCoverageData() {
		const countryList = []//await getCountryList();
		setCountries(Array.from(new Set(countryList)));
	}

	const renderGeoCoverageCountryGroups = (data, countries) => {
		const dataCountries = data["transnational"].split(',')?.map((x) => {
			const transOrg = transnationalOrganizations.find((transOrgItem) => transOrgItem.name === x);

			return {
				name: transOrg?.name,
				countries: transOrg?.countryList ?? []
			};
		});

		return (
			<>
				{dataCountries.map((item, index) => (
					<span id={index}>
						{(index ? ", " : " ") + item.name}{" "}
						{item.countries && item.countries.length > 0 && (
							<Popover
								overlayClassName="popover-multi-country"
								title={""}
								content={
									<ul className="list-country-group">
										{item.countries.map((name) => (
											<li id={name.id}>{name.name}</li>
										))}
									</ul>
								}
								placement="right"
								arrowPointAtCenter
							>
								<InfoCircleOutlined />
							</Popover>
						)}
					</span>
				))}
			</>
		);
	};

	function renderGeoDetail() {
		if (data?.geo_coverage === geoCoverageType.global) return null;

		if (data?.geo_coverage === geoCoverageType.transnational) {
			return renderGeoCoverageCountryGroups(
				data,
				countries,
			) && (
				<div className="detail-item">
					<Row>
						<div className="location-icon detail-item-icon">
							<LocationImage />
						</div>
						<div>
							{renderGeoCoverageCountryGroups(
								data,
								countries,
							)}
							{data.country_code && ", " + data.country_code.split(',').join(', ')}
						</div>
					</Row>
				</div>
			);
		}

		return (
			<>
				{(data?.geo_coverage === geoCoverageType.subnational || data?.geo_coverage === geoCoverageType.national) && data.country_code &&
					(
						<div className="detail-item">
							<Row>
								<div className="location-icon detail-item-icon">
									<LocationImage />
								</div>
								<div>
									{data.country_code.split(',').join(', ')}
								</div>
							</Row>
						</div>
				)}

				{(data?.subnational_area) && (
						<div className="detail-item">
							<Row>
								<div className="city-icon detail-item-icon">
									<CityImage />
								</div>
								<div>
									{data?.subnational_area}
								</div>
							</Row>
						</div>
					)}
			</>
		);
	}

	return (
		<Row>
			{data?.geo_coverage && (
				<Col className="section-geo-coverage">
					<div className="extra-wrapper">
						<h3 className="content-heading">Location & Geocoverage</h3>
						<div
							style={{ marginBottom: data?.geo_coverage === "global" && 0 }}
							className="detail-item geocoverage-item"
						>
							<div className="transnational-icon detail-item-icon">
								<TransnationalImage />
							</div>
							<span>{titleCase(data?.geo_coverage || "")}</span>
						</div>
						{renderGeoDetail()}
					</div>
				</Col>
			)}
		</Row>
	);
}

export default GeoLocationCoverage;
