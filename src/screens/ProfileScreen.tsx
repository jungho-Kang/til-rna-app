import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';

// 키명 (추후 : /src/constants 폴더 / key.ts 등에 보관하고 export ...)
const STORAGE_KEY = '@tasks';

type Task = {
  id: string;
  title: string;
};

export default function ProfileScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState('');

  const renderItem = ({item}: {item: Task}) => (
    <View style={styles.taskItem}>
      <Text style={styles.taskText}>{item.title}</Text>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDelete(item.id)}>
        <Text style={styles.deleteText}>삭제</Text>
      </TouchableOpacity>
    </View>
  );

  // 추가
  const handleAdd = () => {
    if (input.trim() === '') {
      Alert.alert('입력 오류', '할 일을 입력해주세요!');
      return;
    }

    const newTask: Task = {
      id: Date.now().toString(),
      title: input.trim(),
    };

    const updatedTasks = [...tasks, newTask];
    setTasks(prev => [...prev, newTask]);
    saveTask(updatedTasks);
    setInput('');
  };

  // 삭제
  const handleDelete = (id: string) => {
    Alert.alert('삭제 확인', '정말 삭제할까요?', [
      {text: '취소', style: 'cancel'},
      {
        text: '삭제',
        style: 'destructive',
        onPress: () => {
          setTasks(prev => prev.filter(task => task.id !== id));
        },
      },
    ]);
  };

  // 자료 불러오기
  const loadTask = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      console.log('📦 저장소에서 불러온 값:', stored);

      if (!stored) {
        Alert.alert('자료가 없습니다.');
        return;
      }

      console.log(stored);

      const parsed = JSON.parse(stored);
      console.log('✅ 파싱된 데이터:', parsed);

      setTasks(parsed);
      Alert.alert('자료 호출이 완료 되었습니다.');
    } catch (error) {
      console.log('❌ 불러오기 실패:', error);
    }
  };
  // 자료 저장하기
  const saveTask = async (data: Task[]) => {
    try {
      console.log('저장?', JSON.stringify(data));

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.log('error', error);
    }
  };

  // 데이터는 tasks의 state가 변경될 때 저장
  useEffect(() => {
    saveTask(tasks);
  }, [tasks]);

  // 데이터는 마운트시 불러오기
  useEffect(() => {
    loadTask();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.container, {width: '100%'}]}>
        <Text style={styles.title}>저장되는 할일목록 📥</Text>
        <FlatList
          data={tasks}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          ListEmptyComponent={
            <Text style={{color: '#929292'}}>할 일이 없습니다.</Text>
          }
        />
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="할 일을 입력해주세요."
            value={input}
            onChangeText={setInput}
          />
          <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
            <Text style={styles.addText}>추가</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 14,
  },
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  taskText: {
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: '#ff4d4d',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  deleteText: {
    color: '#fff',
    fontWeight: '600',
  },
  inputRow: {
    flexDirection: 'row',
    marginTop: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    marginLeft: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
  },
  addText: {
    color: '#fff',
  },
});
