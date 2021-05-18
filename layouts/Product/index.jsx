import Menu from '@components/Menu';
import CommentForm from '@components/CommentForm';
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
import { Button, List, Comment } from 'antd';

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
    const [showUserMenu, setShowUserMenu] = useState(false);
    let [productInfo, setProductInfo] = useState([['Day','cart','wish','access']]);
    let productArray = [];
    
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

  console.log("product",product);

  if (loginError || !userData) {
    return <Redirect to="/login" />;
  }

  if (productError) return <div>failed to load</div>
  // if (product == undefined) return <div>loading...</div>

  // const CommentList = ({ comments }) => (
  // <List
  //   dataSource={comments}
  //   header={`${comments.length} ${comments.length > 1 ? 'replies' : 'reply'}`}
  //   itemLayout="horizontal"
  //   renderItem={props => <Comment {...props} />}
  // />
  // );

  // const Editor = ({ onChange, onSubmit, submitting, value }) => (
  // <>
  //   <Form.Item>
  //     <TextArea rows={4} onChange={onChange} value={value} />
  //   </Form.Item>
  //   <Form.Item>
  //     <Button htmlType="submit" loading={submitting} onClick={onSubmit} type="primary">
  //       Add Comment
  //     </Button>
  //   </Form.Item>
  // </>
  // );

  //   handleSubmit = () => {
  //   if (!this.state.value) {
  //     return;
  //   }

  //   this.setState({
  //     submitting: true,
  //   });

  //   setTimeout(() => {
  //     this.setState({
  //       submitting: false,
  //       value: '',
  //       comments: [
  //         ...this.state.comments,
  //         {
  //           author: 'Han Solo',
  //           avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
  //           content: <p>{this.state.value}</p>,
  //           datetime: moment().fromNow(),
  //         },
  //       ],
  //     });
  //   }, 1000);
  // };

  // handleChange = e => {
  //   this.setState({
  //     value: e.target.value,
  //   });
  // };

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
            {/* <CommentForm >
              <List
                header={`${post.Comments.length}個の更新`}
                itemLayout="horizontal"
                dataSource={post.Comments}
                renderItem={(item) => {
                  <li>
                    <Comment
                      author={item.User.nickname} 

                    />

                  </li>
                }}
              >
                
              </List>
            </CommentForm> */}
            {/* <>
            {comments.length > 0 && <CommentList comments={comments} />}
            <Comment
              avatar={
                <Avatar
                  src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                  alt="Han Solo"
                />
              }
              content={
                <Editor
                  onChange={this.handleChange}
                  onSubmit={this.handleSubmit}
                  submitting={submitting}
                  value={value}
                />
              }
            />
          </> */}
          </div>
        </Container>)}
      <ToastContainer t="bottom-center" />
    </div>
  );
};

export default Product;
