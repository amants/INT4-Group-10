/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';
// import ActionButton from './ActionButton';
import { logOutUser } from '../services/apiRouterService';
import ActionButton from './ActionButton';

const ProfileComponent = ({ userStore, interfaceStore }) => {
  const logoutUser = async () => {
    const [, status] = await logOutUser();
    if (status === 200) {
      location.reload();
    }
  };

  return (
    <Container>
      <Page>
        <HeaderContainer>
          <Avatar
            src={userStore?.user?.avatar || '../assets/images/lara.jpg'}
          />
          <HeaderContent>
            <Title>{userStore?.user?.username}</Title>
          </HeaderContent>
          <Stickers>
            {userStore?.user?.unlocked_cocktails?.map((cocktail) => (
              <Sticker
                key={cocktail?.cocktail_id}
                left={Math.random() * 60}
                top={Math.random() * 60}
                src={`/assets/images/stamps/${cocktail?.stamp_url}`}
              />
            ))}
          </Stickers>
          <StyledActionButton onClick={logoutUser}>Logout</StyledActionButton>
        </HeaderContainer>
      </Page>
    </Container>
  );
};

const StyledActionButton = styled(ActionButton)`
  padding: 1rem 2rem;
`;

const Stickers = styled.div`
  position: relative;
  height: 15rem;
`;

const Sticker = styled.img`
  position: absolute;
  left: calc(30px - ${({ left }) => `${left}px`});
  top: calc(30px - ${({ top }) => top}px);
`;

const Avatar = styled.img`
  filter: sepia(100%) hue-rotate(190deg) saturate(150%) brightness(80%);
  border-radius: 20px;
  height: 126px;
  width: 126px;
  object-fit: contain;
`;

const HeaderContainer = styled.div`
  grid-column: 1 / span 2;
  display: flex;
  padding-top: 4rem;
  flex-direction: column;
  align-items: center;
`;

const HeaderContent = styled.div`
  display: flex;
  flex-wrap: wrap;
  position: relative;
  margin-bottom: 4rem;
  padding-left: 1rem;
`;

const Page = styled.div`
  width: 50%;
  height: 100%;
  flex-grow: 0;
  padding: 2rem;
  padding-top: 0;
  position: relative;
  padding-bottom: 4rem;
`;

const Title = styled.h2`
  font-size: 3rem;
  margin-top: 4rem;
  font-weight: 900;
  margin-bottom: 0.5rem;
  width: auto;
  flex-grow: 0;
  flex-shrink: 0;
  color: #102146;
  font-family: sirenne-text-mvb, serif;
  ${'' /* flex: 0 0 100%; */}
  position: relative;

  &::after {
    content: '';
    position: absolute;
    background-size: cover;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0.8rem;
    background-image: url('/assets/images/titleVector.svg');
  }
`;

const Container = styled.div`
  display: flex;
  flex-wrap: no-wrap;
  height: 100%;
`;

export default inject(
  'interfaceStore',
  'userStore',
)(observer(ProfileComponent));
