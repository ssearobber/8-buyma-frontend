import { LoadingWrapper, LoadingCircle } from '@components/Loading/styles';
import React from 'react';

const Loading = () => {

  return (
    <LoadingWrapper>
      <LoadingCircle>
        <circle cx="50%" cy="50%" r="25"></circle>
      </LoadingCircle>
    </LoadingWrapper>
  );
};

export default Loading;
