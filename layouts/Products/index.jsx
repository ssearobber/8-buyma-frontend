import Menu from '@components/Menu';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import gravatar from 'gravatar';
import React, { useCallback, useEffect, useState } from 'react';
import { Link, Redirect, Route, Switch } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useSWR from 'swr';
import dayjs from 'dayjs';

import { Header, LogOutButton, ProfileImg, ProfileModal, RightMenu, Product, Tab } from './styles';

const Products = () => {
  const { data: userData, error: loginError, revalidate: revalidateUser } = useSWR('/api/users', fetcher);
  const { data: products, error: productsError } = useSWR('/api/products', fetcher);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const onLogOut = useCallback(() => {
    axios
      .post('/api/users/logout')
      .then(() => {
        revalidateUser();
      })
      .catch((error) => {
        console.dir(error);
        toast.error(error.response?.data, { position: 'bottom-center' });
      });
  }, [userData]);

  const onClickUserProfile = useCallback(() => {
    setShowUserMenu((prev) => !prev);
  }, []);

  if (loginError || !userData) {
    return <Redirect to="/login" />;
  }
  // console.log("products",products);
  if (productsError)
    return (
      <div>
        <div>failed to load</div>
        <div>{productsError}</div>
      </div>
    );
  if (products == undefined) return <div>loading...</div>;

  return (
    <div id="container">
      <Header>
        <Tab>
          <Link to={'/products'}>
            <span>products</span>
          </Link>
          <Link to={'/imageEdit'}>
            <span>imageEdit</span>
          </Link>
          <span>sheet add</span>
        </Tab>
        {userData && (
          <RightMenu>
            <span onClick={onClickUserProfile}>
              <ProfileImg src={gravatar.url(userData.email, { s: '28px', d: 'retro' })} alt={userData.nickname} />
            </span>
            {showUserMenu && (
              <Menu style={{ right: 0, top: 38 }} show={showUserMenu} onCloseModal={onClickUserProfile}>
                <ProfileModal>
                  <img src={gravatar.url(userData.email, { s: '36px', d: 'retro' })} alt={userData.nickname} />
                  <div>
                    <span id="profile-name">{userData.nickname}</span>
                    <span id="profile-active">Active</span>
                  </div>
                </ProfileModal>
                <LogOutButton onClick={onLogOut}>logout</LogOutButton>
              </Menu>
            )}
          </RightMenu>
        )}
      </Header>
      <Product>
        {products?.map((p) => {
          const latest = dayjs(p.today).format('YYYY-MM-DD');
          if (p.access < 5) {
            return (
              <Link
                key={p.buyma_product_id}
                to={`/product/${p.buyma_product_id}`}
                style={{ textDecoration: 'none', color: 'gray' }}
              >
                <div>
                  {p.buyma_product_id} {p.buyma_product_name} {latest} {p.cart} {p.wish} {p.access}
                </div>
              </Link>
            );
          } else if (p.access < 10) {
            return (
              <Link
                key={p.buyma_product_id}
                to={`/product/${p.buyma_product_id}`}
                style={{ textDecoration: 'none', color: 'skyblue' }}
              >
                <div>
                  {p.buyma_product_id} {p.buyma_product_name} {latest} {p.cart} {p.wish} {p.access}
                </div>
              </Link>
            );
          } else if (p.access < 50) {
            return (
              <Link
                key={p.buyma_product_id}
                to={`/product/${p.buyma_product_id}`}
                style={{ textDecoration: 'none', color: 'blue' }}
              >
                <div>
                  {p.buyma_product_id} {p.buyma_product_name} {latest} {p.cart} {p.wish} {p.access}
                </div>
              </Link>
            );
          } else {
            return (
              <Link
                key={p.buyma_product_id}
                to={`/product/${p.buyma_product_id}`}
                style={{ textDecoration: 'none', color: 'red' }}
              >
                <div>
                  {p.buyma_product_id} {p.buyma_product_name} {latest} {p.cart} {p.wish} {p.access}
                </div>
              </Link>
            );
          }
        })}
      </Product>
      <ToastContainer t="bottom-center" />
    </div>
  );
};

export default Products;
