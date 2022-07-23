import Menu from '@components/Menu';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import gravatar from 'gravatar';
import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Link, Redirect, Route, Switch } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useSWR from 'swr';
import dayjs from 'dayjs';
import { Chart } from 'react-google-charts';
import { Button, List, Comment, Form, Input, Avatar } from 'antd';
const { TextArea } = Input;

import { Header, LogOutButton, ProfileImg, ProfileModal, RightMenu, Container } from './styles';

const OtherSellerProduct = () => {
  const params = useParams();
  const { productId } = params;
  const { data: userData, error: loginError, revalidate: revalidateUser } = useSWR('/api/users', fetcher);
  const { data: otherSellerProduct, error: productError } = useSWR(`/api/otherSeller-product/${productId}`, fetcher); // 버튼 링크를 가져오기 위한 취득
  const {
    data: commentData,
    error,
    revalidate: revalidateComment,
  } = useSWR(`/api/otherSeller-comments/${productId}`, fetcher);
  const [showUserMenu, setShowUserMenu] = useState(false);
  let [productInfo, setProductInfo] = useState([['Day', 'wish', 'access']]); // 그래프 표시
  let productArray = [];

  const [comments, setComments] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [value, setValue] = useState('');

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

  if (otherSellerProduct) {
    for (let i = 0; i < otherSellerProduct.length; i++) {
      let result_array = [];
      Object.keys(otherSellerProduct[i]).map(function (key) {
        if (key == 'buyma_product_id' || key == 'buyma_product_name' || key == 'link') {
          return;
        }
        if (key == 'today') {
          result_array.push(dayjs(otherSellerProduct[i][key]).format('YYYY-MM-DD'));
          return;
        }
        result_array.push(otherSellerProduct[i][key]);
      });
      productArray.push(result_array);
    }
  }

  useEffect(() => {
    if (otherSellerProduct) {
      setProductInfo((pre) => [...pre, ...productArray]);
    }
  }, [otherSellerProduct]);
  useEffect(() => {
    if (commentData?.length > 0) {
      setComments(commentData);
    }
  }, [commentData]);

  if (loginError || !userData) {
    return <Redirect to="/login" />;
  }

  if (productError) return <div>failed to load</div>;

  const CommentList = ({ comments }) => (
    <List
      dataSource={comments}
      header={`${comments?.length} ${comments?.length > 1 ? 'replies' : 'reply'}`}
      itemLayout="horizontal"
      renderItem={(props) => <Comment {...props} />}
    />
  );

  let OtherSellerEditor = useCallback(
    ({ onChange, onSubmit, submitting, value }) => (
      <>
        <Form.Item>
          <TextArea rows={2} onChange={onChange} value={value} />
        </Form.Item>
        <Form.Item>
          <Button htmlType="submit" loading={submitting} onClick={onSubmit} type="primary">
            Add Comment
          </Button>
        </Form.Item>
      </>
    ),
    [],
  );

  const handleSubmit = (e) => {
    if (!value) {
      return;
    }
    e.preventDefault();
    setSubmitting(true);
    axios
      .post(
        '/api/otherSeller-comments',
        {
          author: userData.nickname,
          email: userData.email,
          content: value,
          datetime: dayjs().format('YYYY-MM-DD'),
          productId: productId,
        },
        {
          withCredentials: true,
        },
      )
      .then(() => {
        revalidateComment();
        setSubmitting(false);
        setValue('');
      })
      .catch((error) => {
        console.log(error.response);
      });
  };

  const handleChange = (e) => {
    setValue(e.target.value);
  };

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
      {productInfo.length != [] && otherSellerProduct && (
        <Container>
          <Button
            type="primary"
            onClick={() =>
              window.open(`${otherSellerProduct[Object.keys(otherSellerProduct).length - 1].link}`, '_blank')
            }
          >
            go to buyma
          </Button>
          <Chart
            width={'100%'}
            height={'90vh'}
            chartType="Bar"
            data={productInfo}
            loader={<div>Loading Chart</div>}
            options={{
              chart: {
                title: `${otherSellerProduct[0].buyma_product_name}`,
                subtitle: `${otherSellerProduct[0].buyma_product_id}`,
              },
            }}
            rootProps={{ 'data-testid': `${productInfo.length}` }}
          />
          <div>
            {comments.length > 0 && <CommentList comments={comments} />}
            <Comment
              avatar={<Avatar src={gravatar.url(userData.email, { s: '28px', d: 'retro' })} alt={userData.nickname} />}
              content={
                <OtherSellerEditor
                  onChange={handleChange}
                  onSubmit={handleSubmit}
                  submitting={submitting}
                  value={value}
                />
              }
            />
          </div>
        </Container>
      )}
      <ToastContainer t="bottom-center" />
    </div>
  );
};

export default OtherSellerProduct;
