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
const OtherSellers = () => {
  const { data: userData, error: loginError, revalidate: revalidateUser } = useSWR('/api/users', fetcher);
  //   const { data: products, error: productsError } = useSWR('/api/products', fetcher);
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
  //   if (productsError) return <Error>{String(productsError)}</Error>;
  //   if (products == undefined) return <Loading>loading...</Loading>;
  // if (products == '500') return <Loading>db에 데이터가 없음.</Loading>;

  return (
    <div id="container">
      <Header>
        <Tab>
          <Link to={'/products'}>
            <span>my products</span>
          </Link>
          <Link to={'/otherSellers'}>
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
        <select>
          <option key="banana" value="banana">
            바나나
          </option>
          <option key="apple" value="apple">
            사과
          </option>
          <option key="orange" value="orange">
            오렌지
          </option>
        </select>
      </div>
      <UserInfo>other sellers home link</UserInfo>

      <ToastContainer t="bottom-center" />
    </div>
  );
};

export default OtherSellers;
