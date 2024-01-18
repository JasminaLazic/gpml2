import { ROUTES } from '../../constants/routes';

export { PrivateRoute };

function PrivateRoute({ children }) {
	const token = localStorage.getItem('token');

	if (!token) {
		window.location.href = ROUTES.AUTHENTICATOR;
		return null;
	}

	return children;
}
