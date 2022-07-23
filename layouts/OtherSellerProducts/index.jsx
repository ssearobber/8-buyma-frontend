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
} from './styles';
const OtherSellerProducts = () => {
  const { data: userData, error: loginError, revalidate: revalidateUser } = useSWR('/api/users', fetcher);
  const { data: otherSellersData, error: otherSellersError } = useSWR('/api/otherSellers', fetcher);
  //   const { data: products, error: productsError } = useSWR('/api/products', fetcher);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [otherSellersProductData, setOtherSellersProductData] = useState([]);

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

  // const handleChange = useCallback((event) => {
  //   console.log(event.target.value);
  //   let { data: otherSellersProductData, error: otherSellersProductError } = useSWR(
  //     '/api/otherSellers/' + event.target.value,
  //     fetcher,
  //   );
  //   setOtherSellersProductData(otherSellersProductData);
  // }, []);
  const handleChange = useCallback(
    (event) => {
      axios
        .get('/api/otherSellers/' + event.target.value)
        .then((res) => {
          setOtherSellersProductData(res.data);
        })
        .catch((error) => {
          console.dir(error);
          toast.error(error.response?.data, { position: 'bottom-center' });
        });
    },
    [otherSellersProductData],
  );

  if (loginError || !userData) {
    return <Redirect to="/login" />;
  }
  // console.log('otherSellersData', otherSellersData);
  // console.log('otherSellersProductData', otherSellersProductData);
  // if (otherSellersDataError) return <Error>{String(productsError)}</Error>;
  if (otherSellersData == undefined) return <Loading>loading...</Loading>;
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
      <div>
        <select onChange={(e) => handleChange(e)}>
          <option key="nothing" value="nothing">
            선택해주세요
          </option>
          {otherSellersData?.map((otherSeller, index) => {
            return (
              <option key={index + '_'} value={otherSeller.buyma_user_id}>
                {otherSeller.buyma_user_name}
              </option>
            );
          })}
        </select>
      </div>
      <UserInfo>other sellers home link</UserInfo>
      <Product>
        {otherSellersProductData?.map((p, index) => {
          const latest = dayjs(p.today).format('YYYY-MM-DD');
          if (p.access < 5) {
            return (
              <Link
                key={index + '_'}
                to={`/otherSeller-product/${p.buyma_product_id}`}
                style={{ textDecoration: 'none', color: 'gray' }}
              >
                <div>
                  {p.buyma_product_id} {p.buyma_product_name} {latest} {p.wish} {p.access}
                </div>
              </Link>
            );
          } else if (p.access < 10) {
            return (
              <Link
                key={index + '_'}
                to={`/otherSeller-product/${p.buyma_product_id}`}
                style={{ textDecoration: 'none', color: 'skyblue' }}
              >
                <div>
                  {p.buyma_product_id} {p.buyma_product_name} {latest} {p.wish} {p.access}
                </div>
              </Link>
            );
          } else if (p.access < 50) {
            return (
              <Link
                key={index + '_'}
                to={`/otherSeller-product/${p.buyma_product_id}`}
                style={{ textDecoration: 'none', color: 'blue' }}
              >
                <div>
                  {p.buyma_product_id} {p.buyma_product_name} {latest} {p.wish} {p.access}
                </div>
              </Link>
            );
          } else {
            return (
              <Link
                key={index + '_'}
                to={`/otherSeller-product/${p.buyma_product_id}`}
                style={{ textDecoration: 'none', color: 'red' }}
              >
                <div>
                  {p.buyma_product_id} {p.buyma_product_name} {latest} {p.wish} {p.access}
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

export default OtherSellerProducts;
