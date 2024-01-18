import { useEffect } from 'react';


const AuthRedirect = () => {
	useEffect(() => {
		if ('URL' in window) {
			const params = (new URL(document.location)).searchParams;
			const token = params.get('token');
			const username = params.get('username');

			if (token && username) {
				localStorage.setItem('token', token);
				localStorage.setItem('username', unescape(username));
			} else {
				localStorage.setItem('token', '');
				localStorage.setItem('username', '');
			}
		}

		window.location = '/';
	}, []);

	return (null);
};

export default AuthRedirect;
