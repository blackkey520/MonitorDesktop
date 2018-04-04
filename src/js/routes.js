
import React from 'react';
import { withRouter, Route } from 'react-router-dom';
import { MainLayout } from './pages';
import {routerconfig} from './config';

const Main = withRouter(props => <MainLayout {...props} />);

export default () => {
    /* eslint-disable */
    return (
        <Main>
            {
                routerconfig.map(item => {
                    return (
                        <Route
                            key={item.key}
                            path={item.path}
                            component={item.component}
                        />
                    )
                })
            }
        </Main>
    );
    /* eslint-enable */
};
