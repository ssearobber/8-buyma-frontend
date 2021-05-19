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

import {
  Header,
  LogOutButton,
  ProfileImg,
  ProfileModal,
  RightMenu,
  Container
} from './styles';

const Product = () => {
    const params = useParams();
    const { productId } = params;
    const { data: userData, error: loginError, revalidate: revalidateUser } = useSWR('/api/users', fetcher);
    const { data: product, error: productError} = useSWR(`/api/product/${productId}`, fetcher);
    const { data: commentData, error, revalidate: revalidateComment } = useSWR(`/api/comments/${productId}`, fetcher);
    const [showUserMenu, setShowUserMenu] = useState(false);
    let [productInfo, setProductInfo] = useState([['Day','cart','wish','access']]);
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

    if (product) {
        for (let i = 0 ; i < product.length ; i ++) {
            let result_array = [];
            Object.keys(product[i]).map(function (key) {
                if (key == "productId" || key == "productName" || key == "link") {
                    return;
                }
                if (key == "today") {
                    result_array.push(dayjs(product[i][key]).format('YYYY-MM-DD'));
                    return;
                }  
                result_array.push(product[i][key]); 
            });
            productArray.push(result_array);
        }
    }
    useEffect(() => {
      if (product) {
          setProductInfo(pre => [...pre,...productArray]);
      }
    }, [product]);
    useEffect(() => {
      if (commentData?.length > 0) {
          console.log("commentData1", commentData);
          console.log("productId1", productId);
          console.log("comments1", comments);
          setComments(commentData);
          console.log("commentData3", commentData);
          console.log("productId3", productId);
          console.log("comments3", comments);
      }
    }, [commentData]);
    console.log("commentData2", commentData);
    console.log("productId2", productId);
    console.log("comments2", comments);

    if (loginError || !userData) {
      return <Redirect to="/login" />;
    }

    if (productError) return <div>failed to load</div>
    // if (product == undefined) return <div>loading...</div>

    const CommentList = ({ comments }) => (
    <List
      dataSource={comments}
      header={`${comments?.length} ${comments?.length > 1 ? 'replies' : 'reply'}`}
      itemLayout="horizontal"
      renderItem={props => <Comment {...props} />}
    />
    );

    const Editor = useCallback(({ onChange, onSubmit, submitting, value }) => (
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
    ),[]);

    const handleSubmit = (e) => {
      if (!value) {
        return;
      }
      e.preventDefault();
      setSubmitting(true);
      // setTimeout(() => {
      //   setComments([...comments,{
      //         author: userData.nickname,
      //         email: gravatar.url(userData.email, { s: '28px', d: 'retro' }),
      //         content: <p>{value}</p>,
      //         datetime: dayjs().format('YYYY-MM-DD'),
      //         // productId : productId
      //       }]);
      //   setSubmitting(false);
      //   setValue('');
      // }, 1000);
      axios
        .post(
          '/api/comments',
          {
              author: userData.nickname,
              email: userData.email,
              content: value,
              datetime: dayjs().format('YYYY-MM-DD'),
              productId : productId
            },
          {
            withCredentials: true,
          },
        )
        .then(() => {
          revalidateComment();
          setSubmitting(false);
          setValue('');
          // setComments(commentData);
        })
        .catch((error) => {
          console.log(error.response);
          // setLogInError(error.response?.status === 401);
        });
    };

    const handleChange = e => {
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
      {productInfo.length != [] && product && (
        <Container>
          <Button type="primary" onClick={() => window.open(`${product[7].link}`, '_blank')}>go to buyma</Button>
              <Chart
              width={'100%'}
              height={'90vh'}
              chartType="Bar"
              data={productInfo}
              loader={<div>Loading Chart</div>}
              options={{
                  chart: {
                  title: `${product[0].productName}`,
                  subtitle: `${product[0].productId}`,
                  },
              }}
              rootProps={{ 'data-testid': `${productInfo.length}` }}
              />
          <div>
            {comments.length > 0 && <CommentList comments={comments} />}
            <Comment
              avatar={
                <Avatar
                  src={gravatar.url(userData.email, { s: '28px', d: 'retro' })} 
                  alt={userData.nickname} 
                />
              }
              content={
                <Editor
                  onChange={handleChange}
                  onSubmit={handleSubmit}
                  submitting={submitting}
                  value={value}
                />
              }
            />
          </div>
        </Container>)}
      <ToastContainer t="bottom-center" />
    </div>
  );
};

export default Product;
