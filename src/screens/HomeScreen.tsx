import React, {useEffect, useState} from 'react';
import {
  Alert,
  Button,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  createTodo,
  deleteTodo,
  getTodos,
  TodosRow,
  updateTodo,
} from '../api/todos-api';

const HomeScreen = ({navigation}: {navigation: any}): JSX.Element => {
  // 전체 목록 state
  const [todos, setTodos] = useState<TodosRow[]>([]);
  // 수정 관련 state
  const [editId, setEditId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');

  // 새글 관련 state
  const [newTitle, setNewTitle] = useState('');

  // 전체목록 가져오기
  const fetchGetTodos = async () => {
    const result = await getTodos();
    if (!result) {
      console.log('데이터 호출 실패');
      return;
    }
    const {data, error, status} = result;
    if (error) {
      console.log('Error : ', error.message);
      return;
    }
    if (data) {
      console.log(status);
      setTodos(data);
    }
  };

  // 목록 삭제하기
  const handleDelete = async (id: number) => {
    const {data} = await deleteTodo(id);
    console.log(data);
    // 전체 목록 다시 받기
    fetchGetTodos();
  };

  // 제목 업데이트
  const handleEdit = async (id: number) => {
    if (editTitle.trim() === '') {
      Alert.alert('수정할 제목을 입력하세요.');
      return;
    }

    const {data, error, status} = await updateTodo(id, editTitle);
    console.log(data);
    setEditId(null);
    setEditTitle('');
    Alert.alert('제목이 수정되었습니다');
    fetchGetTodos();
  };

  // 새글 추가
  const handleAdd = async () => {
    if (newTitle.trim() === '') {
      Alert.alert('제목을 입력하세요.');
      return;
    }
    const result = await createTodo(newTitle);
    if (!result) {
      Alert.alert('입력에 실패했습니다.');
      return;
    }
    const {data, error, status} = result;
    console.log(data);
    setNewTitle('');
    Alert.alert('제목이 추가되었습니다');
    fetchGetTodos();
  };

  useEffect(() => {
    fetchGetTodos();
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text>Home Screen</Text>
        <Button
          title={'About 로 이동'}
          onPress={() => navigation.navigate('About')}
        />
        <Button
          title={'WebView 로 이동'}
          onPress={() => navigation.navigate('WebView')}
        />
        <Button
          title={'Profile 로 이동'}
          onPress={() => navigation.navigate('Profile')}
        />
      </View>
      {/* 추가 */}
      <View style={[styles.inputArea, {marginTop: 20}]}>
        <TextInput
          style={styles.input}
          value={newTitle}
          onChangeText={setNewTitle}
        />
        <Button title="추가" color={'#0b72e0'} onPress={() => handleAdd()} />
      </View>
      <ScrollView style={styles.todoList}>
        {todos.map(item => (
          <View key={item.id} style={styles.todoCard}>
            {editId === item.id ? (
              <>
                <TextInput
                  style={styles.input}
                  value={editTitle}
                  onChangeText={setEditTitle}
                />
                <View style={styles.todoButtons}>
                  <Button
                    title="저장"
                    color={'#0b72e0'}
                    onPress={() => handleEdit(item.id)}
                  />
                  <Button
                    title="취소"
                    color={'#cb05ee'}
                    onPress={() => {
                      setEditId(null);
                      setEditTitle('');
                    }}
                  />
                </View>
              </>
            ) : (
              <>
                <Text style={styles.todoTitle}>
                  {item.title ? item.title : 'No Title'}
                </Text>
                <View style={styles.todoButtons}>
                  <Button
                    title="수정"
                    color={'#4caf50'}
                    onPress={() => {
                      setEditId(item.id);
                      setEditTitle(item.title || '');
                    }}
                  />
                  <Button
                    title="삭제"
                    color={'#ff4436'}
                    onPress={() => handleDelete(item.id)}
                  />
                </View>
              </>
            )}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

// css
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  todoList: {
    flex: 1,
  },
  todoCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
  },
  todoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  todoButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
    gap: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 8,
    marginRight: 8,
  },
  inputArea: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
});

export default HomeScreen;
