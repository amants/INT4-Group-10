import React, { useState, useEffect } from 'react';
import style from './parties.module.css';
import Header from './Header';
import Background from './Background';
import moment from 'moment';
import styled from 'styled-components';
import CountdownComponent from './CountdownComponent';
import { getPartiesFromUser } from '../services/apiRouterService';

const Parties = ({ closePopUp }) => {
  const [parties, setParties] = useState([]);

  const getParties = async () => {
    const [response, status] = await getPartiesFromUser();
    if (status !== 200) return;
    setParties(response);
  };

  useEffect(() => {
    getParties();
  }, []);

  return (
    <>
      <Container className={style.container}>
        <div>
          <Header />
          <div className={style.parties__container}>
            <div className={style.parties__header}>
              <h1 className={style.parties__title}>My parties</h1>
              <button onClick={closePopUp} className={style.button}>
                {'<'} Back
              </button>
            </div>
            <div className={style.parties__scroll}>
              {parties.map((item) => (
                <ContainerLink
                  href={`/party/${item.lobby_id}`}
                  className={style.parties__item}
                >
                  <img
                    className={style.parties__background}
                    src="../assets/images/parties/Boarding-pass.png"
                    width="692"
                    height="167"
                    alt=""
                  />
                  <div className={style.parties__wrapper}>
                    <span className={[style.item, style.item1].join(' ')}>
                      {item.members.length} attendee
                      {item.members.length > 1 ? 's' : ''}
                    </span>
                    <span className={[style.item, style.item2].join(' ')}>
                      {item.name}
                    </span>
                    <div className={[style.item, style.item3].join(' ')}>
                      <span>
                        {moment(item.start_date).format('DD/MM/YYYY HH:MM')}
                      </span>
                      <span>
                        <CountdownComponent
                          startDate={new Date(item.start_date)}
                        />
                      </span>
                    </div>
                  </div>
                </ContainerLink>
              ))}
            </div>

            <a
              href="/party/new"
              className={[style.button, style.button__parties].join(' ')}
            >
              Start a new party
            </a>
          </div>
        </div>
      </Container>
      <Background />
    </>
  );
};

const Container = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ContainerLink = styled.a`
  transition: all 0.1s;
  &:hover {
    transform: scale(1.01);

    & button {
      background-color: #102146;
      color: white;
    }
  }
`;

export default Parties;
