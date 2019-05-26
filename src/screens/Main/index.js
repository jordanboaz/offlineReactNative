import React, { useState, useEffect } from 'react';
import { Keyboard } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import api from '../../services/api';
import getRealm from '../../services/realm';
import Repository from '../../Components/Repository';
import {
  Container, Title, Form, Input, Submit, List,
} from './styles';

export default function Main() {
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);
  const [repositories, setRepositories] = useState([]);

  useEffect(() => {
    async function loadRepositories() {
      const realm = await getRealm();
      const data = realm.objects('Repository').sorted('stars', true);

      setRepositories(data);
    }

    loadRepositories();
  }, []);

  async function saveRepository(repository) {
    const data = {
      id: repository.id,
      name: repository.name,
      fullName: repository.full_name,
      description: repository.description,
      stars: repository.stargazers_count,
      forks: repository.forks_count,
    };

    try {
      const realm = await getRealm();

      realm.write(() => {
        realm.create('Repository', data, 'modified');
      });

      return data;
    } catch (err) {
      console.tron.log('err on real');
      console.tron.log(err);
    }
  }

  async function handleRefreshRepository(repository) {
    const response = await api.get(`/repos/${repository.fullName}`);

    const data = await saveRepository(response.data);

    setRepositories(repositories.map(repo => (repo.id === data.id ? data : repo)));
  }

  async function handleAddRepository() {
    try {
      const response = await api.get(`/repos/${input}`);

      await saveRepository(response.data);

      setInput('');
      setError(false);
      Keyboard.dismiss();
    } catch (err) {
      console.tron.log(err);
      setError(true);
    }
  }

  return (
    <Container>
      <Title>Repositories</Title>

      <Form>
        <Input
          value={input}
          error={error}
          onChangeText={text => setInput(text)}
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="Search for repository"
        />
        <Submit onPress={handleAddRepository}>
          <Icon name="add" size={22} color="#FFF" />
        </Submit>
      </Form>

      <List
        keyboardShouldPersistTaps="handled"
        data={repositories}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => (
          <Repository
            data={item}
            onRefresh={() => {
              handleRefreshRepository(item);
            }}
          />
        )}
      />
    </Container>
  );
}
