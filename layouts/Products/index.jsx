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

import {
  Header,
  LogOutButton,
  ProfileImg,
  ProfileModal,
  RightMenu,
  Product,
  Tab,
  Loading,
  Error,
  UserInfo,
  StyledLink,
} from './styles';

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
  if (productsError) return <Error>{String(productsError)}</Error>;
  if (products == undefined) return <Loading>loading...</Loading>;
  // if (products == '500') return <Loading>db에 데이터가 없음.</Loading>;

  return (
    <div id="container">
      <Header>
        <Tab>
          <Link to={'/products'}>
            <span>my products</span>
          </Link>
          <Link to={'/otherSeller-Products'}>
            <span>otherSellers</span>
          </Link>
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
      <UserInfo>스케쥴 동작 시간: 1.heroku서버시간 Daily at 4:00 AM UTC , 2.일본동작시간 : 매일 오후 1시 </UserInfo>
      <div>
        {' '}
        <span style={{ color: 'gray' }}>gray</span> : access &lt; 5 , <span style={{ color: 'skyblue' }}>skyblue</span>{' '}
        : access &lt; 10 , <span style={{ color: 'blue' }}>blue</span> : access &lt; 50 ,
        <span style={{ color: 'red' }}>red</span> : access &gt; 50{' '}
      </div>
      <UserInfo>{products?.length ? '총 갯수 : ' + products.length : ''}</UserInfo>
      <Product>
        {products?.map((p) => {
          const latest = dayjs(p.TodayCount.today).format('YYYY-MM-DD');
          if (p.TodayCount.access < 5) {
            return (
              <StyledLink
                key={p.buyma_product_id}
                to={`/product/${p.buyma_product_id}`}
                style={{ textDecoration: 'none', color: 'gray' }}
              >
                <div>
                  {p.buyma_product_id} {p.buyma_product_name} {'total : '}
                  {p.cart} {p.wish} {p.access} / {latest}
                  {' : '}
                  {p.TodayCount.cart} {p.TodayCount.wish} {p.TodayCount.access}
                </div>
              </StyledLink>
            );
          } else if (p.TodayCount.access < 10) {
            return (
              <Link
                key={p.buyma_product_id}
                to={`/product/${p.buyma_product_id}`}
                style={{ textDecoration: 'none', color: 'skyblue' }}
              >
                <div>
                  {p.buyma_product_id} {p.buyma_product_name} {'total : '}
                  {p.cart} {p.wish} {p.access} / {latest}
                  {' : '}
                  {p.TodayCount.cart} {p.TodayCount.wish} {p.TodayCount.access}
                </div>
              </Link>
            );
          } else if (p.TodayCount.access < 50) {
            return (
              <Link
                key={p.buyma_product_id}
                to={`/product/${p.buyma_product_id}`}
                style={{ textDecoration: 'none', color: 'blue' }}
              >
                <div>
                  {p.buyma_product_id} {p.buyma_product_name} {'total : '}
                  {p.cart} {p.wish} {p.access} / {latest}
                  {' : '}
                  {p.TodayCount.cart} {p.TodayCount.wish} {p.TodayCount.access}
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
                  {p.buyma_product_id} {p.buyma_product_name} {'total : '}
                  {p.cart} {p.wish} {p.access} / {latest}
                  {' : '}
                  {p.TodayCount.cart} {p.TodayCount.wish} {p.TodayCount.access}
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
