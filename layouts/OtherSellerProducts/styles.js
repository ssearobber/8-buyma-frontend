import styled from '@emotion/styled';

export const RightMenu = styled.div`
  float: right;
`;

export const Header = styled.header`
  height: 38px;
  background: white;
  box-shadow: 0 1px 0 0 rgba(255, 255, 255, 0.1);
  padding: 5px;
  text-align: center;
`;

export const ProfileImg = styled.img`
  width: 28px;
  height: 28px;
  position: absolute;
  top: 5px;
  right: 16px;
`;

export const ProfileModal = styled.div`
  display: flex;
  padding: 20px;

  & img {
    display: flex;
  }

  & > div {
    display: flex;
    flex-direction: column;
    margin-left: 10px;
  }

  & #profile-name {
    font-weight: bold;
    display: inline-flex;
  }

  & #profile-active {
    font-size: 13px;
    display: inline-flex;
  }
`;

export const LogOutButton = styled.button`
  border: none;
  width: 100%;
  border-top: 1px solid rgb(29, 28, 29);
  background: transparent;
  display: block;
  height: 33px;
  padding: 5px 20px 5px;
  outline: none;
  cursor: pointer;
`;

export const Product = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  & div {
    &:hover {
      cursor: pointer;
      color: red;
    }
  }
`;

export const Tab = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: large;
  font-weight: 500;
  & span {
    margin-left: 1em;
    &:hover {
      cursor: pointer;
      color: red;
    }
  }
`;

export const Loading = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: large;
  font-weight: 800;
  opacity: 0.7;
`;

export const Error = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: large;
  font-weight: 800;
`;

export const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  & div {
    &:hover {
      cursor: pointer;
      color: blue;
    }
  }
`;
