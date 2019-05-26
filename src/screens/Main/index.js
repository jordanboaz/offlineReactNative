import React from 'react';

import Icon from 'react-native-vector-icons/MaterialIcons';
import Repository from '../../Components/Repository';
import {
  Container, Title, Form, Input, Submit, List,
} from './styles';

export default function Main() {
  return (
    <Container>
      <Title>Repositories</Title>

      <Form>
        <Input autoCapitalize="none" autoCorrect={false} placeholder="Search for repository" />
        <Submit onPress={() => {}}>
          <Icon name="add" size={22} color="#FFF" />
        </Submit>
      </Form>

      <List
        keyboardShouldPersistTaps="handled"
        data={[{
          id: 1, name: 'XD', stars: 1234, forks: 123, description: 'XD desc',
        }]}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => <Repository data={item} />}
      />
    </Container>
  );
}
