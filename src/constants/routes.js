// const CALLBACK_URL = encodeURIComponent('https://20.73.56.226:5000/oauth2/callback');
export const CALLBACK_URL = encodeURIComponent('https://apps.unep.org/data-catalog/oauth2/callback');
export const authUrl = `https://unep-gpml.eu.auth0.com/authorize?response_type=code&client_id=lmdxuDGdQjUsbLbMFpjDCulTP1w5Z4Gi&redirect_uri=${CALLBACK_URL}&scope=openid+profile+email&state=eyJjYW1lX2Zyb20iOiAiL2Rhc2hib2FyZCJ9`;
export const ROUTES = {
	MAIN: '/',
	ADMIN: '/admin',
	DATA_SETS: '/data-set',
	MAPS_AND_LAYERS: '/maps-and-layers',
	ADD_DATASET: '/add-data',
	EDIT_DATASET: '/edit-data',
	AUTHENTICATOR: authUrl,
	OAUTH_CALLBACK: '/oauth2/callback',
	LOG_OUT: '/user/logout'
};
