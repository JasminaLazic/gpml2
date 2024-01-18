import { setSearchParams } from '../helpers/searchParams';
import { geoCoverage} from '../constants/dataSetForm';
import uuid from 'uuid-random';
import to from 'await-to-js';
import { ENTITY_TYPES } from '../constants/dataSetForm';

// export const SERVER_URL = 'https://20.73.56.226:5000';
export const SERVER_URL = 'https://apps.unep.org/data-catalog';

export const MAIN_ORG = "primary_org";

function generateQueryString({ tags, countries, goals, format, category, subcategory, multiCountry }) {
	let queryString = '';

	if (format) {
		queryString += `&fq=data_format:("${format}")`;
	}

	if (category) {
		queryString += `${ queryString ? ' AND ' : '&fq=' }category:("${category}")`;
	}

	if (subcategory) {
		queryString += `${ queryString ? ' AND ' : '&fq=' }sub_category:("${subcategory}")`;
	}

	if (tags.length ||countries.length || goals.length || multiCountry.length ) {
		queryString += `${ queryString ? ' AND ' : '&fq=' }tags:(${[...tags, ...countries, ...goals, ...multiCountry].map((tag) => `"${tag}"`).join(' OR ')})`;
	}

	return queryString;
}


export const getDatasetById = async (id) => {
	const token = localStorage.getItem('token');
	const response = await fetch(`${SERVER_URL}/api/3/action/package_show?id=${id}&include_private=True`,  {
	   method: 'GET',
	   headers: {
		   Authorization: token,
		   'Content-Type': 'application/json',
	   },
   });
	const dataSetList = await response.json();
	return dataSetList.result;
};

export const searchDataset = async ({ searchText, tags, countries, sort, goals, format, category, subcategory, multiCountry }) => {
	setSearchParams({ searchText, tags, countries, sort, goals, format, category, subcategory, multiCountry });

	let queryString = `q=${searchText}${generateQueryString({ tags, countries, goals, format, category, subcategory, multiCountry })}&facet.field=["tags", "data_format", "category", "sub_category"]&facet.limit=1000&rows=1000&sort=${sort}`;

	const response = await fetch(`${SERVER_URL}/api/3/action/package_search?${queryString}`);

	return response.json();
};

export const getDatasetForAdminPanel = async ({ searchText }) => {
	let queryString = `q=${searchText}&rows=1000&`;
	const token = localStorage.getItem('token');

	const response = await fetch(`${SERVER_URL}/api/3/action/package_search?${queryString}&include_private=True`, {
		 // &fq=NOT(approval_status:"declined")
		method: 'GET',
		headers: {
			Authorization: token,
			'Content-Type': 'application/json',
		},
	});

	return response.json();
};

export const createDataset = async ({ file, title, category, subCategory, description, dataSource, tags, goals, geoCoverageType, transnationals,
	entityList, dataType, format, languages, info, startEndDate, countries, country, countryArea, license }) => {
	const country_code = (geoCoverageType === geoCoverage.national || geoCoverageType === geoCoverage.transnational) ? countries.join(',') : (geoCoverageType === geoCoverage.subnational) ? country : '';
	const token = localStorage.getItem('token');

	const owners = Array.from(new Set(entityList.filter(({ entityType }) => entityType === ENTITY_TYPES.OWNER).map(({ entityOrganizationId }) => entityOrganizationId))).join(',');
	const partners = Array.from(new Set(entityList.filter(({ entityType }) => entityType === ENTITY_TYPES.PARTNER).map(({ entityOrganizationId }) => entityOrganizationId))).join(',');
	const sponsors = Array.from(new Set(entityList.filter(({ entityType }) => entityType === ENTITY_TYPES.DONOR).map(({ entityOrganizationId }) => entityOrganizationId))).join(',');

	const data = new FormData();
	file && data.append('image_upload', file);
	data.append('owner_org', MAIN_ORG);
	data.append('name', uuid());
	data.append('title', title);
	data.append('category', category);
	data.append('sub_category', subCategory);
	data.append('notes', description);
	data.append('url', dataSource);
	data.append('geo_coverage', geoCoverageType);
	data.append('country_code', country_code);
	data.append('transnational', geoCoverageType === geoCoverage.transnational ? transnationals.join(',') : '');
	data.append('subnational_area', geoCoverageType === geoCoverage.subnational ? countryArea : '');
	data.append('sdg_goals', goals.join(','));
	data.append('owners',  owners);
	data.append('partners', partners);
	data.append('sponsors', sponsors);
	data.append('start_date1', startEndDate[0] ? startEndDate[0] : '');
	data.append('end_date1', startEndDate[1] ? startEndDate[1] : '');
	data.append('related_source', 'Related Source1');
	data.append('lang', languages.join(','));
	data.append('tag_string', tags.join(','));
	data.append('data_type', dataType);
	data.append('data_format', format);

	data.append('info', info);
	data.append('license_id', license);
	data.append('private', true);
	data.append('approval_status', '');

	const [err, response] = await to(fetch(`${SERVER_URL}/api/3/action/package_create`, {
		method: 'POST',
		headers: {
			Authorization: token,
		},
		body: data,
	}));

	const result = await response.json();

	if (result.success === false) {
		return [result.error, null];
	}

	if (err) {
		return [err, null];
	}


	return [null, result];
};

export const editDataset = async ({ id, file, title, category, subCategory, description, dataSource, tags, goals, geoCoverageType, transnationals, entityList, dataType, format, languages, info, startEndDate, countries, country, countryArea, license }) => {
	const country_code = (geoCoverageType === geoCoverage.national || geoCoverageType === geoCoverage.transnational) ? countries.join(',') : (geoCoverageType === geoCoverage.subnational) ? country : '';
	const token = localStorage.getItem('token');

	const owners = Array.from(new Set(entityList.filter(({ entityType }) => entityType === ENTITY_TYPES.OWNER).map(({ entityOrganizationId }) => entityOrganizationId))).join(',');
	const partners = Array.from(new Set(entityList.filter(({ entityType }) => entityType === ENTITY_TYPES.PARTNER).map(({ entityOrganizationId }) => entityOrganizationId))).join(',');
	const sponsors = Array.from(new Set(entityList.filter(({ entityType }) => entityType === ENTITY_TYPES.DONOR).map(({ entityOrganizationId }) => entityOrganizationId))).join(',');

	const data = new FormData();
	file && data.append('image_upload', file);
	data.append('id', id);
	data.append('title', title);
	data.append('category', category);
	data.append('sub_category', subCategory);
	data.append('notes', description);
	data.append('url', dataSource);
	data.append('geo_coverage', geoCoverageType);
	data.append('country_code', country_code);
	data.append('transnational', geoCoverageType === geoCoverage.transnational ? transnationals.join(',') : '');
	data.append('subnational_area', geoCoverageType === geoCoverage.subnational ? countryArea : '');
	data.append('sdg_goals', goals.join(','));
	data.append('owners',  owners);
	data.append('partners', partners);
	data.append('sponsors', sponsors);
	data.append('start_date1', startEndDate[0] ? startEndDate[0] : '');
	data.append('end_date1', startEndDate[1] ? startEndDate[1] : '');
	data.append('lang', languages.join(','));
	data.append('tag_string', tags.join(','));
	data.append('data_type', dataType);
	data.append('data_format', format);

	data.append('info', info);
	data.append('license_id', license);

	const [err, response] = await to(fetch(`${SERVER_URL}/api/3/action/package_patch`, {
		method: 'POST',
		headers: {
			Authorization: token,
		},
		body: data,
	}));

	const result = await response.json();

	if (err) {
		return [err, null];
	}

	if (result.success === false) {
		return [result.error, null];
	}

	return [null, result];
};

export const getMemberRoleList = async () => {
	const token = localStorage.getItem('token');
	const response = await fetch(`${SERVER_URL}/api/3/action/member_roles_list`, {
		method: 'GET',
		headers: {
			Authorization: token,
			'Content-Type': 'application/json',
		},
	});

	const data = await response.json();
	return data.result;
};

export const approveDatasetPublication = async (dataSetId) => {
	const token = localStorage.getItem('token');

	const response = await fetch(`${SERVER_URL}/api/3/action/package_patch`, {
		method: 'POST',
		headers: {
			Authorization: token,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			private: false,
			id: dataSetId,
		}),
	});
	const data = await response.json();
};


export const declineDatasetPublication = async (dataSetId) => {
	const token = localStorage.getItem('token');

	const response = await fetch(`${SERVER_URL}/api/3/action/package_patch`, {
		method: 'POST',
		headers: {
			Authorization: token,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			"approval_status": "declined",
			id: dataSetId,
		})
	});

	const data = await response.json();
}

export const getTagList = async () => {
	const response = await fetch(`${SERVER_URL}/api/3/action/tag_list`);
	const data = await response.json();
	return data.result;
};

export const getCountryList = async () => {
	const response = await fetch(`${SERVER_URL}/api/3/action/tag_list?vocabulary_id=country_listv3`);
	const data = await response.json();
	return data.result;
};

export const getGoalList = async () => {
	const response = await fetch(`${SERVER_URL}/api/3/action/tag_list?vocabulary_id=sdg_goals_list`);
	const data = await response.json();
	return data.result;
};

export const getTransnationalList = async () => {
	const response = await fetch(`${SERVER_URL}/api/3/action/tag_list?vocabulary_id=transnational_list`);
	const data = await response.json();
	return data.result;
};


export const getLanguageList = async () => {
	const response = await fetch(`${SERVER_URL}/api/3/action/tag_list?vocabulary_id=language_list`);
	const data = await response.json();
	return data.result;
};

export const getLicenseList = async () => {
	const response = await fetch(`${SERVER_URL}/api/3/action/license_list`);
	const data = await response.json();
	return data.result;
};

export const getStakeholdersList = async () => {
	const response = await fetch(`${SERVER_URL}/api/3/action/stakeholder_list?id=primary_org`);
	const data = await response.json();
	return data.result;
};

export const isCurrentUserAdmin = async () => {
	const username = localStorage.getItem('username');
	const token = localStorage.getItem('token');

	if (!username || !token) {
		return false;
	}

	try {
		const response = await fetch(`${SERVER_URL}/api/3/action/organization_list_for_user?id=${username}`, {
			method: 'GET',
			headers: {
				Authorization: token,
				'Content-Type': 'application/json',
			},
		});
	
		const data = await response.json();
	
		const mainOrg = data.result.find(({ name }) => name === MAIN_ORG);
	
		if (!mainOrg) {
			return false;
		}
	
		if (mainOrg.capacity === 'admin') {
			return true;
		}
	
		
	} catch (error) {
		return false;
	}
	return false;
	
};

export const getPackageStakeholderList = async (packageId) => {
	const response = await fetch(`${SERVER_URL}/api/3/action/package_stakeholders?package_id=${packageId}`);
	const data = await response.json();
	return data.result;
};
