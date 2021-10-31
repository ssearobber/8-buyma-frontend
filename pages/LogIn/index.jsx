import useInput from '@hooks/useInput';
import { Button, Error, Form, Header, Input, Label, LinkContainer } from '@pages/SignUp/styles';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { useCallback, useState } from 'react';
import { Redirect } from 'react-router-dom';
import useSWR from 'swr';

const LogIn = () => {
  const { data: userData, error, revalidate } = useSWR('/api/users', fetcher);
  const [logInError, setLogInError] = useState(false);
  const [email, onChangeEmail] = useInput('');
  const [password, onChangePassword] = useInput('');
  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      setLogInError(false);
      axios
        .post(
          '/api/users/login',
          { email, password },
          {
            withCredentials: true,
          },
        )
        .then(() => {
          revalidate();
        })
        .catch((error) => {
          console.log(error.response);
          setLogInError(error.response?.status === 401);
        });
    },
    [email, password],
  );

  console.log("userData", userData);
  // console.log("error", error);

  if (userData == undefined) return <div>loading...</div>
  if (!error && userData) {
    // console.log('ログイン', userData);
    return <Redirect to="/products" />;
  }

  return (
    <div id="container">
      <Header>SWOO</Header>
      <Form onSubmit={onSubmit}>
        <Label id="email-label">
          <span>email</span>
          <div>
            <Input type="email" id="email" name="email" value={email} onChange={onChangeEmail} />
          </div>
        </Label>
        <Label id="password-label">
          <span>password</span>
          <div>
            <Input type="password" id="password" name="password" value={password} onChange={onChangePassword} />
          </div>
          {logInError && <Error>栞さん、メールアドレスとパスワードの組み合わせが一致しません。</Error>}
        </Label>
        <Button type="submit">login</Button>
      </Form>
      <LinkContainer>
        まだ会員ではないですか?&nbsp;
        {/* <a href="/signup" style={{"pointerEvents" : "none", "textDecoration" : "line-through"}}>会員登録しに行く。</a> */}
        <a href="/signup">会員登録しに行く。</a>
      </LinkContainer>
    </div>
  );
};

export default LogIn;
