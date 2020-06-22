/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getCocktails } from '../services/apiRouterService';
import { inject, observer } from 'mobx-react';
import typo from '../styles/typo.module.css';
import style from '../styles/components.module.css';

const LoginForm = ({
  // userStore,
  // interfaceStore,
  title,
  // closePopUp,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [cocktailList, setCocktailList] = useState([]);
  const [orderBy, setOrderBy] = useState(null);
  const [pageType, setPageType] = useState('overview');
  // const [unlockedCocktails, setUnlockedCocktails] = useState(0);
  // const [lockCocktailCount, setLockedCocktailCount] = useState(0);
  // const { togglePopUp } = interfaceStore;

  const loadCocktails = async () => {
    const [response, status] = await getCocktails(orderBy);
    const tempCocktailList = [];
    if (status !== 200) return;
    response.items.forEach((item) => tempCocktailList.push(item));
    for (let i = 0; i < response.not_unlocked_count; i++) {
      tempCocktailList.push({ image: 'http://via.placeholder.com/50x50' });
    }
    setCocktailList(tempCocktailList);
  };

  useEffect(() => {
    loadCocktails();
  }, [orderBy]);

  if (pageType === 'detail') {
  } else {
    return (
      <Container>
        <Page>
          <HeaderContainer>
            <HeaderContent>
              <Title className={typo.h1}>{title || 'Cocktails'}</Title>
              <OrderContainer>
                <Button
                  active={orderBy === 'duration'}
                  className={style.button}
                  onClick={() =>
                    setOrderBy((prevValue) =>
                      prevValue !== 'duration' ? 'duration' : null,
                    )
                  }
                >
                  Duration
                </Button>
                <Button
                  active={orderBy === 'difficulty'}
                  className={style.button}
                  onClick={() =>
                    setOrderBy((prevValue) =>
                      prevValue !== 'difficulty' ? 'difficulty' : null,
                    )
                  }
                >
                  Difficulty
                </Button>
                <Button
                  active={orderBy === 'price'}
                  className={style.button}
                  onClick={() =>
                    setOrderBy((prevValue) =>
                      prevValue !== 'price' ? 'price' : null,
                    )
                  }
                >
                  Budget
                </Button>
              </OrderContainer>
            </HeaderContent>
          </HeaderContainer>
          {cocktailList
            .filter(
              (item, key) =>
                key >= (currentPage - 1) * 10 &&
                key < (currentPage - 1) * 10 + 4,
            )
            .map((item) =>
              item.name ? (
                <CocktailContainer onClick={() => goToDetail(item.cocktail_id)}>
                  <UnlockedCocktailItem>
                    <CountryFlag src="/assets/images/flags/Cuba.png" />
                    <p>{item.name}</p>
                    <CocktailImage src="/assets/images/cocktailPlaceholder.png" />
                  </UnlockedCocktailItem>
                </CocktailContainer>
              ) : (
                <CocktailContainer>
                  <LockedCocktailItem>
                    <CocktailImage src="/assets/images/cocktailPlaceholder.png" />
                    {/* <CocktailImage src={item.image} /> */}
                  </LockedCocktailItem>
                </CocktailContainer>
              ),
            )}
          {currentPage > 1 ? (
            <PreviousPage
              onClick={() => setCurrentPage((prevValue) => (prevValue -= 1))}
            >
              {'<'} Back
            </PreviousPage>
          ) : null}
        </Page>
        <Page>
          {cocktailList
            .filter(
              (item, key) =>
                key >= (currentPage - 1) * 10 + 6 &&
                key < (currentPage - 1) * 10 + 12,
            )
            .map((item) =>
              item.name ? (
                <CocktailContainer>
                  <UnlockedCocktailItem>
                    <CountryFlag src="/assets/images/flags/Cuba.png" />
                    <p>{item.name}</p>
                    {/* <CocktailImage src={item.image} /> */}
                    <CocktailImage src="/assets/images/cocktailPlaceholder.png" />
                  </UnlockedCocktailItem>
                </CocktailContainer>
              ) : (
                <CocktailContainer>
                  <LockedCocktailItem>
                    <CocktailImage src="/assets/images/cocktailPlaceholder.png" />
                  </LockedCocktailItem>
                </CocktailContainer>
              ),
            )}
          {cocktailList.length > 21 &&
          cocktailList.length / 21 > currentPage ? (
            <NextPage
              onClick={() => setCurrentPage((prevValue) => (prevValue += 1))}
            >
              Next {'>'}
            </NextPage>
          ) : null}
        </Page>
      </Container>
    );
  }
};

LoginForm.getInitialProps = async ({
  store: { userStore, interfaceStore },
}) => {
  return {
    interfaceStore,
    userStore,
  };
};

const CountryFlag = styled.img`
  position: absolute;
  top: 1.5rem;
  height: 2rem;
  left: 1rem;
  user-drag: none;
`;

const HeaderContainer = styled.div`
  grid-column: 1 / span 2;
`;

const CocktailContainer = styled.div`
  position: relative;
  padding-top: 100%;
`;

const CocktailImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  user-drag: none;
`;

const UnlockedCocktailItem = styled.a`
  position: absolute;
  top: 1rem;
  right: 1rem;
  bottom: 1rem;
  user-select: none;
  left: 1rem;
  cursor: pointer;
  transition: all 0.1s ease;

  &:hover {
    transform: scale(1.02);
  }

  &:active {
    transform: scale(0.97);
  }

  & p {
    position: absolute;
    bottom: 1rem;
    left: 1rem;
    right: 0.5rem;
    color: #102146;
    font-weight: 900;
    text-transform: uppercase;
  }
`;

const LockedCocktailItem = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  bottom: 1rem;
  left: 1rem;
  & img {
    filter: opacity(40%);
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const PreviousPage = styled.button`
  position: absolute;
  font-weight: bold;
  bottom: 2rem;
  left: 2rem;
  cursor: pointer;
  border-bottom: 2px solid rgba(0, 0, 0, 0);
  transition: all 0.2s ease;

  &:hover {
    border-bottom: 2px solid #505050;
  }
`;

const NextPage = styled.button`
  position: absolute;
  font-weight: bold;
  bottom: 2rem;
  right: 3rem;
  cursor: pointer;
  border-bottom: 2px solid rgba(0, 0, 0, 0);
  transition: all 0.2s ease;

  &:hover {
    border-bottom: 2px solid #505050;
  }
`;

const OrderContainer = styled.div`
  position: absolute;
  bottom: 0rem;
`;

const HeaderContent = styled.div`
  display: flex;
  flex-wrap: wrap;
  position: relative;
  height: 0;
  padding-bottom: calc(100% / 2);
  padding-left: 1rem;
`;

const Button = styled.button`
  border: 2.5px solid #102146;
  padding: 0.5rem 1rem;
  font-size: 1.4rem;
  font-weight: 900;
  margin-right: 1rem;
  background-color: ${({ active }) => (active ? '#102146' : 'none')};
  color: ${({ active }) => (active ? 'white' : '#102146')};
  transition: all 0.2s ease;
  cursor: pointer;
`;

const Page = styled.div`
  width: 50%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(3, 1fr);
  grid-auto-flow: dense;
  flex-grow: 0;
  padding: 2rem;
  padding-top: 0;
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

export default inject('interfaceStore', 'userStore')(observer(LoginForm));
