import styled, { keyframes } from '@emotion/styled';

export const LoadingWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 100;
  background: white;
  opacity: 0;
  transition: 0.5s;
`;

const loadingSpin = keyframes`
 transform: rotate(360deg);
`;

const loadingCircleAni = keyframes`
  0% {
    stroke-dashoffset: 157;
  }
  75% {
    stroke-dashoffset: -147;
  }
  100% {
    stroke-dashoffset: -157;
  }
`;

export const LoadingCircle = styled.svg`
  width: 54px;
  height: 54px;
  animation: ${loadingSpin} 3s infinite;
  & > circle {
    stroke: black;
    stroke-width: 4;
    /* getTotalLength()로 stroke의 길이를 얻어올 수 있음 */
    stroke-dasharray: 157;
    stroke-dashoffset: 0;
    fill: transparent;
    animation: ${loadingCircleAni} 1s infinite;
    /* transition: 1s; */
  }  
`;
