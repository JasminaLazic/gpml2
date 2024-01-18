import { useState } from 'react';
import {
	Routes,
	Route,
} from 'react-router-dom';
import './index.css';
import HomePageContent from './pages/home';
import CreateDatasetPage from './pages/dataset-create';
import EditDatasetPage from './pages/dataset-edit';
import AdminPanel from './pages/admin-panel';
import AuthRedirect from './pages/AuthRedirect';
import DataSetDetail from './pages/datasetDetail';
import { ROUTES } from './constants/routes';
import PageLayout from './components/layout/PageLayout';
import { PrivateRoute } from './components/common/PrivateRoute';


function App() {
	const [datasetList, setDatasetList] = useState(null);

	return (
		<Routes>
			<Route element={<PageLayout />}>
				<Route path={ROUTES.MAIN} element={(
					<HomePageContent
						datasetList={datasetList}
						setDatasetList={setDatasetList}
					/>
				)} />
				<Route path={`${ROUTES.DATA_SETS}/:datasetId`} element={<DataSetDetail />} />
				<Route path={`${ROUTES.EDIT_DATASET}/:datasetId`} element={<EditDatasetPage />} />
				<Route path={`${ROUTES.MAPS_AND_LAYERS}`} element={<MapsAndLayers />} />
				<Route path={ROUTES.ADD_DATASET} element={(
					<PrivateRoute>
						<CreateDatasetPage />
					</PrivateRoute>
				)} />
				<Route path={ROUTES.ADMIN} element={(
					<PrivateRoute>
						<AdminPanel />
					</PrivateRoute>
				)} />
				<Route path={ROUTES.OAUTH_CALLBACK} element={<AuthRedirect />} />
				<Route path={ROUTES.LOG_OUT} element={<AuthRedirect />} />
			</Route>
		</Routes>
	);
}

export default App;
