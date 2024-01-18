import to from 'await-to-js';
import { SERVER_URL } from './index';

export const getAllDatastComments = async (datasetId) => {
	const [err, response] = await to(fetch(`${SERVER_URL}/api/3/action/thread_show?url=/dataset/${datasetId}`));
	if (err) {
		return [err, null];
	}
	const result = await response.json();

	return [null, result];
};

export const createDatasetComment = async ({ url, parent_id, comment }) => {
	const token = localStorage.getItem('token');

	const [err, response] = await to(fetch(`${SERVER_URL}/api/3/action/comment_create`, {
		method: 'POST',
		headers: {
			Authorization: token,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			url,
			comment,
			...(parent_id && { parent_id: parent_id })
		}),
	}));

	if (err) {
		return [err, null];
	}
	const result = await response.json();

	return [null, result];
};

export const editDatasetComment = async ({ id, comment }) => {
	const token = localStorage.getItem('token');

	const [err, response] = await to(fetch(`${SERVER_URL}/api/3/action/comment_update`, {
		method: 'POST',
		headers: {
			Authorization: token,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			id,
			comment,
		}),
	}));

	if (err) {
		return [err, null];
	}
	const result = await response.json();

	return [null, result];
};

export const deleteDatasetComment = async ({ id }) => {
	const token = localStorage.getItem('token');

	const [err, response] = await to(fetch(`${SERVER_URL}/api/3/action/comment_delete`, {
		method: 'POST',
		headers: {
			Authorization: token,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			id,
		}),
	}));

	if (err) {
		return [err, null];
	}
	const result = await response.json();

	return [null, result];
};