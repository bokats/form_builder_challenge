import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import App from './app';
import Create from './create/create';
import Preview from './preview/preview';
import Export from './export/export';

const Root = () => {

  const _redirectToCreate = (nextState, replace) => {
    replace('/create');
  };

  return (
    <Router history={ hashHistory }>
      <Route path='/' component={ App }>
        <IndexRoute onEnter={ _redirectToCreate }/>
        <Route path="/create" component={ Create }/>
        <Route path="/preview" component={ Preview }/>
        <Route path="/export" component={ Export }/>
      </Route>
    </Router>
  );
};

export default Root;
