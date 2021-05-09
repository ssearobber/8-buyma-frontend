import Menu from '@components/Menu';
import useInput from '@hooks/useInput';
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
} from './styles';

const Products = () => {
  const { data: userData, error: loginError, revalidate: revalidateUser } = useSWR('/api/users', fetcher);
  const { data: products, error: productsError} = useSWR('/api/products', fetcher);
  const [showUserMenu, setShowUserMenu] = useState(false);
  let theDayBeforeYesterday = dayjs().subtract(7, 'day').format("YYYY-MM-DD");

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

  useEffect(() => {
    return () => {
      // setTodayData(todayData);
    };
  }, []);

  if (loginError || !userData) {
    return <Redirect to="/login" />;
  }

  return (
    <div>
      <Header>
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
        {products?.map((t)=>{
          const latest = dayjs(t.today).format('YYYY-MM-DD');
          if (theDayBeforeYesterday < latest) return (<Link key={t.productId} to={`/product/${t.productId}`} style={{ textDecoration: 'none' }}><div>{t.productId} {t.productName}</div></Link>);
        })}
      </Product>
      <ToastContainer t="bottom-center" />
    </div>
  );
};

export default Products;
