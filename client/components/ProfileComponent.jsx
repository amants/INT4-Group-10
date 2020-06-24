/* eslint-disable react/prop-types */
import React from 'react';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';
import typo from '../styles/typo.module.css';
import { logOutUser } from '../services/apiRouterService';
import TextInput from './TextInput';
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
      <Page>
        <HeaderContainer>
          <HeaderContent>
            <TitleDetail className={typo.h1}>Passport info</TitleDetail>
          </HeaderContent>
        </HeaderContainer>
        <Form>
          <TextInput
            type="text"
            name="username"
            placeholder="************"
            value={userStore.user.username}
            disabled
            onChange={() => {}}
          >
            01. Username
          </TextInput>
          <TextInput
            type="text"
            name="email"
            placeholder="************"
            disabled
            value={userStore.user.email}
            onChange={() => {}}
          >
            02. Email
          </TextInput>
          <TextInput
            type="text"
            name="email"
            placeholder="************"
            disabled
            value={userStore.user.country_name}
            onChange={() => {}}
          >
            03. Country
          </TextInput>
          <TextInput
            type="text"
            name="email"
            placeholder="************"
            disabled
            value="************"
            onChange={() => {}}
          >
            04. password
          </TextInput>
        </Form>
      </Page>
    </Container>
  );
};

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

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

const TitleDetail = styled.h2`
  font-size: 3rem;
  font-weight: 900;
  padding-bottom: 4rem;
  margin-bottom: -3rem;
  flex-grow: 0;
  flex-shrink: 0;
  padding-right: 2rem;
  ${'' /* flex: 0 0 100%; */}
  position: relative;

  &::after {
    content: '';
    position: absolute;
    background-size: 100%;
    left: 0rem;
    right: 1rem;
    bottom: 0rem;
    top: 0rem;
    background-image: url('/assets/images/Krulletje.svg');
    background-repeat: no-repeat;
  }
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
