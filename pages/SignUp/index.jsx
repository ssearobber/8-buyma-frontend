import useInput from '@hooks/useInput';
import { Button, Error, Form, Header, Input, Label, LinkContainer, Success } from '@pages/SignUp/styles';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { useCallback, useState } from 'react';
import { Redirect } from 'react-router-dom';
import useSWR from 'swr';

const SignUp = () => {
  const { data: userData } = useSWR('/api/users', fetcher);
  const [signUpError, setSignUpError] = useState(false);
  const [signUpSuccess, setSignUpSuccess] = useState(false);
  const [mismatchError, setMismatchError] = useState(false);
  const [email, onChangeEmail] = useInput('');
  const [nickname, onChangeNickname] = useInput('');
  const [password, , setPassword] = useInput('');
  const [passwordCheck, , setPasswordCheck] = useInput('');

  const onChangePassword = useCallback(
    (e) => {
      setPassword(e.target.value);
      setMismatchError(passwordCheck !== e.target.value);
    },
    [passwordCheck],
  );

  const onChangePasswordCheck = useCallback(
    (e) => {
      setPasswordCheck(e.target.value);
      setMismatchError(password !== e.target.value);
    },
    [password],
  );

  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (!nickname || !nickname.trim()) {
        return;
      }
      if (!mismatchError) {
        setSignUpError(false);
        setSignUpSuccess(false);
        axios
          .post('/api/users', { email, nickname, password })
          .then(() => {
            setSignUpSuccess(true);
          })
          .catch((error) => {
            setSignUpError(error.response?.data?.statusCode === 403);
          });
      }
    },
    [email, nickname, password, mismatchError],
  );

  if (userData) {
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
        <Label id="nickname-label">
          <span>nickname</span>
          <div>
            <Input type="text" id="nickname" name="nickname" value={nickname} onChange={onChangeNickname} />
          </div>
        </Label>
        <Label id="password-label">
          <span>password</span>
          <div>
            <Input type="password" id="password" name="password" value={password} onChange={onChangePassword} />
          </div>
        </Label>
        <Label id="password-check-label">
          <span>password confirm</span>
          <div>
            <Input
              type="password"
              id="password-check"
              name="password-check"
              value={passwordCheck}
              onChange={onChangePasswordCheck}
            />
          </div>
          {mismatchError && <Error>パスワードが一致しません。</Error>}
          {nickname && <Error>ニックネームを入力してください。</Error>}
          {signUpError && <Error>이登録済みのメールアドレスです。</Error>}
          {signUpSuccess && <Success>員登録しました！ ログインしてください。</Success>}
        </Label>
        <Button type="submit">Sign Up</Button>
      </Form>
      <LinkContainer>
        もう会員ですか?&nbsp;
        <a href="/login">ログインしに行く</a>
      </LinkContainer>
    </div>
  );
};

export default SignUp;
