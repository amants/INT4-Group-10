import React from 'react';
import style from './AddFriends.module.css';
import styled, { keyframes } from 'styled-components';
import SearchInput from './SearchInput';

const AddFriends = ({
  usersList,
  setAddedFriends,
  addFriendInput,
  setAddFriendInput,
}) => {
  return (
    <>
      <Title className={(style.sidebar__title, style.h2)}>Add a friend</Title>
      <form className={style.sidebar__input}>
        <SearchInput
          className={[style.input, style.inputsidebar, style.h2].join(' ')}
          name="friends"
          type="text"
          size="20"
          value={addFriendInput}
          onChange={(e) => setAddFriendInput(e.value.replace(/\?/g, ''))}
        />
      </form>
      {usersList.length > 0 ? (
        <ResultsContainer>
          {usersList.map((item) => (
            <ResultItem
              onClick={() => {
                setAddedFriends((prevValue) => {
                  const temp = [...prevValue];
                  temp.push(item);
                  return temp;
                });
                setAddFriendInput('');
              }}
            >
              <Avatar src={item.avatar || '../assets/images/lara.jpg'} />
              <UserInfo>
                <Username className={style.h2}>{item.username}</Username>
                <Country>
                  <FlagImg src={`/assets/images/flags/${item.flag_url}`} />
                  {item.name}
                </Country>
              </UserInfo>
              <AddButton>
                <AddImg src={`/assets/images/add_button.png`} />
              </AddButton>
            </ResultItem>
          ))}
        </ResultsContainer>
      ) : null}
    </>
  );
};

const scaleIn = keyframes`
 0% { transform: scaleY(0); opacity: 0; max-height: 0; }
 100% { transform: scaleY(1); opacity: 1; max-height: 200px;}`;

const Title = styled.h2`
  font-family: sirenne-text-mvb, serif;
  font-weight: bold;
  font-style: normal;
  font-size: 2rem;
  line-height: 2.4rem;
`;

const AddImg = styled.img``;

const Country = styled.div`
  font-size: 1.2rem;
`;

const FlagImg = styled.img`
  height: 10px;
  margin-top: 5px;
  margin-right: 5px;
`;

const Username = styled.p`
  font-family: sirenne-text-mvb, serif;
  font-weight: bold;
  font-style: normal;
  font-size: 2rem;
  line-height: 2.4rem;
`;

const UserInfo = styled.div`
  flex: 1 1 100%;
  overflow: hidden;
  margin-right: 2rem;
`;

const AddButton = styled.a`
  flex-grow: 0;
  flex-shrink: 0;
`;

const Avatar = styled.img`
  height: 50px;
  width: 50px;
  margin-right: 1rem;
  border-radius: 50%;
  object-fit: contain;
  flex-grow: 0;
  flex-shrink: 0;
`;

const ResultsContainer = styled.div`
  width: 100%;
  transform-origin: 0 0;
  animation-name: ${scaleIn};
  animation-duration: 0.2s;
  animation-iteration-count: 1;
`;

const ResultItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 1rem 0;
  align-items: center;
`;

export default AddFriends;
