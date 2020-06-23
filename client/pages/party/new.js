import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import { inject, observer } from 'mobx-react';
import styled from 'styled-components';
import * as Yup from 'yup';
import style from './Style.module.css';
import { useDebouncedCallback } from 'use-debounce';
import { useRouter } from 'next/router';
import moment from 'moment';
import useForm from '../../hooks/useForm.js';
import { getUsersByQ, createParty } from '../../services/apiRouterService';
import SidebarBigNewParty from '../../containers/Sidebar/SidebarBig/SidebarBigNewParty';
import Header from '../../components/Header';
import { string } from '../../constants/validationSchemas.js';
import Background from '../../components/Background';
import TextInput from '../../components/TextInput';
import DateInput from '../../components/DateInput';
import TimeInput from '../../components/TimeInput';

const Home = ({ userStore }) => {
  const [addedFriends, setAddedFriends] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [addFriendInput, setAddFriendInput] = useState(null);

  const router = useRouter();

  const getUsersByInput = async () => {
    if (!addFriendInput) return;
    const [response, status] = await getUsersByQ(addFriendInput);
    if (status === 200) {
      setUsersList(
        response.filter(
          (item) =>
            !addedFriends.includes(item.user_id) &&
            !addedFriends.includes(userStore.user.user_id),
        ),
      );
    } else {
      setUsersList([]);
    }
  };

  const dateFormat = `DD/MM/YYYY`;

  const validationSchema = Yup.object().shape({
    party_name: string.required,
    party_date: Yup.string()
      .test('future', 'Invalid date', (value) => value.length === 10)
      .test('date', 'Not a valid date', (value) =>
        moment(value, dateFormat).isValid(),
      )
      .test(
        'future',
        "Date can't be in the past",
        (value) => moment().diff(moment(value, dateFormat), 'days') < 1,
      ),
    party_time: Yup.string().required('Required'),
  });

  const { errors, values, handleSubmit, handleChange } = useForm({
    validationSchema,
  });

  const handleFormValues = async () => {
    const friends = addedFriends.map((item) => item.user_id);
    const dateSplit = values.party_date.split('/');
    const hourSplit = values.party_time.split(':');
    const startDate = `${dateSplit[2]}-${dateSplit[1]}-${dateSplit[0]} ${hourSplit[0]}:${hourSplit[1]}`;
    const [response, status] = await createParty({
      friends,
      startDate,
      name: values.party_name,
    });
    if (status === 200) router.push(`/party/${response.party_key}`);
  };

  const formSubmitHandler = (e) => {
    e.preventDefault();
    handleSubmit(handleFormValues);
  };

  useEffect(() => {
    if (addFriendInput) {
      debounceFetchResults();
    } else {
      setUsersList([]);
    }
  }, [addFriendInput]);

  const [debounceFetchResults] = useDebouncedCallback(getUsersByInput, 500);

  if (!userStore.auth) {
    return (
      <div className="container">
        <Head>
          <title>Create Next App</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main>
          <h1>Not logged in</h1>
        </main>
      </div>
    );
  }

  return (
    <div className={style.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className={style.container}>
          <Header page={'new-party'} />
          <div className={style.party__container}>
            <div className={style.party__header}>
              <span className={[style.party__participants, style.h2].join(' ')}>
                Participants {addedFriends.length + 1}/6
              </span>
              <h1 className={[style.party__title, style.h1].join(' ')}>
                Plan a new party
              </h1>
              {/* <span className={[style.uiz__info, style.h2].join(' ')}>
                This party is complete, <br /> registrations are closed.
              </span> */}
            </div>
            <SidebarBigNewParty
              user={userStore.user}
              usersList={usersList}
              addedFriends={addedFriends}
              setAddedFriends={setAddedFriends}
              setAddFriendInput={setAddFriendInput}
              addFriendInput={addFriendInput}
            />
            <div className={style.party__content}>
              <div className={style.content__needs}>
                <BoxContainer className={style.needs__wrapper}>
                  <form onSubmit={formSubmitHandler}>
                    <TextInput
                      placeholder="Give the party a name"
                      name="party_name"
                      onChange={handleChange}
                      value={values.party_name}
                      error={errors.party_name}
                    >
                      Party name
                    </TextInput>
                    <DateInput
                      name="party_date"
                      onChange={handleChange}
                      value={values.party_date}
                      error={errors.party_date}
                    >
                      Party date
                    </DateInput>
                    <TimeInput
                      name="party_time"
                      onChange={handleChange}
                      value={values.party_time}
                      error={errors.party_time}
                    >
                      Party hour
                    </TimeInput>
                    <ButtonContainer>
                      <Button
                        type="submit"
                        className={style.button}
                        value="Confirm your party"
                      />
                    </ButtonContainer>
                  </form>
                </BoxContainer>
                <img
                  className={style.needs__background}
                  src="../assets/images/clipboard.png"
                  alt=""
                />
              </div>
              {/* <Postit type={'need'} title={'Need to buy'} quiz={quiz} /> */}
            </div>
          </div>
        </div>
        <br />
        {/* BACKGROUND */}
        <Background />
      </main>
    </div>
  );
};

const ButtonContainer = styled.div`
  display: flex;
  margin-top: 5rem;
`;

const Button = styled.input`
  height: 3.5rem;
  self-align: center;
  margin: auto;
  font-size: 1.6rem;
`;

const BoxContainer = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 5rem;
  & form {
    width: 70%;
  }
`;

export default inject('userStore')(observer(Home));
