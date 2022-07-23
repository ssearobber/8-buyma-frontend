import loadable from '@loadable/component';
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import 'antd/dist/antd.css';

const Products = loadable(() => import('@layouts/Products'));
const Product = loadable(() => import('@layouts/Product'));
const LogIn = loadable(() => import('@pages/LogIn'));
const SignUp = loadable(() => import('@pages/SignUp'));
const OtherSellerProducts = loadable(() => import('@layouts/OtherSellerProducts'));
const OtherSellerProduct = loadable(() => import('@layouts/OtherSellerProduct'));

const App = () => (
  <Switch>
    <Route exact path="/">
      <Redirect to="/login" />
    </Route>
    <Route path="/login" component={LogIn} />
    <Route path="/signup" component={SignUp} />
    <Route path="/products" component={Products} />
    <Route path="/product/:productId" component={Product} />
    <Route path="/otherSeller-Products" component={OtherSellerProducts} />
    <Route path="/otherSeller-product/:productId" component={OtherSellerProduct} />
  </Switch>
);

export default App;
