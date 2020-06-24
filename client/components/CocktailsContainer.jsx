/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getCocktails, getCocktailById } from '../services/apiRouterService';
import { inject, observer } from 'mobx-react';
import Postit from './Postit';
import typo from '../styles/typo.module.css';
import style from '../styles/components.module.css';
import getConfig from 'next/config';

const {
  publicRuntimeConfig: { API_URL }, // Available both client and server side
} = getConfig();

const LoginForm = ({
  // userStore,
  // interfaceStore,
  title,
  // getCocktailById,
  // closePopUp,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [cocktailList, setCocktailList] = useState([]);
  const [orderBy, setOrderBy] = useState(null);
  const [cocktailDetail, setCocktailDetail] = useState(null);
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

  const goToDetail = async (cocktailId) => {
    const [response, status] = await getCocktailById(cocktailId);
    if (status !== 200) return;
    setCocktailDetail(response);
    setPageType('detail');
  };

  const goBack = (e) => {
    e.preventDefault();
    setPageType('overview');
    setCocktailDetail(null);
  };

  if (pageType === 'detail') {
    return (
      <Container>
        <Page>
          <HeaderContainer>
            <HeaderContent>
              <Title className={typo.h1}>{cocktailDetail.name}</Title>
              <OrderContainer>
                <Button className={style.button}>
                  Duration: {cocktailDetail.duration}
                </Button>
                <Button className={style.button}>
                  Difficulty: {cocktailDetail.difficulty}
                </Button>
                <Button className={style.button}>
                  Budget: {cocktailDetail.price}
                </Button>
              </OrderContainer>
            </HeaderContent>
          </HeaderContainer>
          <CocktailImageContainer>
            <CocktailImg
              src={
                cocktailDetail.photo_url
                  ? `${API_URL}/assets/img/cocktails/${cocktailDetail.photo_url}`
                  : `/assets/images/cocktails/${cocktailDetail.image}`
              }
            />
            <StyledGoBackButton onClick={goBack}>
              {'<'} Go back
            </StyledGoBackButton>
          </CocktailImageContainer>
        </Page>
        <Page>
          <HeaderContainer>
            <HeaderContent>
              <TitleDetail className={typo.h1}>Ingredients</TitleDetail>
            </HeaderContent>
          </HeaderContainer>
          <IngredientsContainer>
            {cocktailDetail.ingredients.map((ingr) => (
              <Ingredient>
                <IngrName>{ingr.name}</IngrName>
                <Amount>
                  {ingr.amount} {ingr.unit}
                </Amount>
              </Ingredient>
            ))}
          </IngredientsContainer>
        </Page>
        <StyledPostit
          title={'Cocktail recipe'}
          quiz={{ recipe: cocktailDetail.recipe }}
        />
      </Container>
    );
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
                <CocktailContainer
                  key={item.cocktail_id}
                  onClick={() => goToDetail(item.cocktail_id)}
                >
                  <UnlockedCocktailItem>
                    <CountryFlag
                      src={`/assets/images/flags/${item.flag_url}`}
                    />
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
                <CocktailContainer
                  key={item.cocktail_id}
                  onClick={() => goToDetail(item.cocktail_id)}
                >
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

const StyledPostit = styled(Postit)`
  z-index: 999;
  right: -25rem;
  top: 3rem;
  transform: rotate(-10deg);
  position: absolute;
`;

const Ingredient = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 0.7rem;
`;

const IngrName = styled.p`
  font-size: 1.8rem;
`;

const Amount = styled.p`
  font-family: sirenne-text-mvb, serif;
  font-weight: 700;
  font-style: bold;
  font-size: 1.4rem;
  line-height: 2.4rem;
`;

const IngredientsContainer = styled.div`
  grid-column: 1 / span 2;
`;

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
const CocktailImageContainer = styled.div`
  width: 100%;
  grid-column: 1 / span 2;
  margin-top: 6rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
const CocktailImg = styled.img`
  height: 20rem;
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

const StyledGoBackButton = styled.a`
  border: none;
  padding: 1rem 2rem;
  border: #102146 0.2rem solid;
  color: #102146;
  background: none;
  border-radius: 10rem;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 3rem;

  :active {
    transform: scale(0.95);
  }

  :focus {
    outline: none;
  }

  &:hover {
    background-color: #102146;
    color: white;
    text-decoration: none;
  }
  cursor: pointer;
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
  margin-right: 0.5rem;
  background-color: ${({ active }) => (active ? '#102146' : 'none')};
  color: ${({ active }) => (active ? 'white' : '#102146')};
  transition: all 0.2s ease;
  cursor: pointer;

  &:last-child {
    margin-right: 0;
  }
`;

const Page = styled.div`
  width: 50%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(3, 1fr);
  grid-auto-flow: dense;
  flex-grow: 0;
  padding: 4rem;
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

const TitleDetail = styled.h2`
  font-size: 3rem;
  margin-top: 4rem;
  font-weight: 900;
  padding-bottom: 1rem;
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
  }
`;

const Container = styled.div`
  display: flex;
  flex-wrap: no-wrap;
  height: 100%;
  position: relative;
`;

export default inject('interfaceStore', 'userStore')(observer(LoginForm));
