import to from 'await-to-js';
import { SERVER_URL, MAIN_ORG } from './index';

export const getReviewersList = async () => {
	const token = localStorage.getItem('token');

	const [err, response] = await to(fetch(`${SERVER_URL}/api/3/action/reviewer_list?owner_org=${MAIN_ORG}&active=True`, {
		method: 'GET',
		headers: {
			Authorization: token,
			'Content-Type': 'application/json',
		},
	}));
	if (err) {
		return [err, null];
	}
	const result = await response.json();

	return [null, result];
};

export const toggleReviewer = async ({ datasetId, email, isRemove = false }) => {
	const token = localStorage.getItem('token');

	const [err, response] = await to(fetch(`${SERVER_URL}/api/3/action/reviewer_assign`, {
		method: 'POST',
		headers: {
			Authorization: token,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			package_id: datasetId,
			email,
			...(isRemove && { is_deleted: 'y' })
		}),
	}));

	if (err) {
		return [err, null];
	}
	const result = await response.json();

	return [null, result];
};

export const getReviewerStatusList = async (datasetId) => {
	const token = localStorage.getItem('token');

	const [err, response] = await to(fetch(`${SERVER_URL}/api/3/action/dataset_reviews_list?package_id=${datasetId}`, {
		method: 'GET',
		headers: {
			Authorization: token,
			'Content-Type': 'application/json',
		},
	}));
	
	if (err) {
		return [err, null];
	}
	const result = await response.json();

	return [null, result];
};

export const isCurrentUserReviewer = async () => {
	const token = localStorage.getItem('token');

	const [err, response] = await to(fetch(`${SERVER_URL}/api/3/action/is_reviewer`, {
		method: 'GET',
		headers: {
			Authorization: token,
			'Content-Type': 'application/json',
		},
	}));

	if (err) {
		return [err, null];
	}
	const { result } = await response.json();

	return [null, result.is_reviewer];
};

export const fetchDatasetsForReview = async () => {
	const token = localStorage.getItem('token');

	const [err, response] = await to(fetch(`${SERVER_URL}/api/3/action/reviewer_dataset_list`, {
		method: 'GET',
		headers: {
			Authorization: token,
			'Content-Type': 'application/json',
		},
	}));

	if (err) {
		return [err, null];
	}
	const { result } = await response.json();

	return [null, result];
};

export const getDatasetsReview = async (reviewId) => {
	const token = localStorage.getItem('token');

	const [err, response] = await to(fetch(`${SERVER_URL}/api/3/action/review_status?review_id=${reviewId}`, {
		method: 'GET',
		headers: {
			Authorization: token,
			'Content-Type': 'application/json',
		},
	}));

	if (err) {
		return [err, null];
	}
	const { result } = await response.json();

	return [null, result];
};

export const changeReviewStatus = async ({ reviewId, reviewStatus, comment }) => {
	const token = localStorage.getItem('token');

	const [err, response] = await to(fetch(`${SERVER_URL}/api/3/action/reviewer_take_action`, {
		method: 'POST',
		headers: {
			Authorization: token,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			review_id: reviewId,
			review_status: reviewStatus,
			review_comment: comment
		}),
	}));

	if (err) {
		return [err, null];
	}
	const result = await response.json();

	return [null, result];
};
