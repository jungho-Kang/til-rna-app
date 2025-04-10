# Supabase

- supabase 기존 테이블 사용(`todos`)

## 타입스크립트를 위한 `타입 참조`

- 이전 프로젝트에서 `package.json` 에 내용으로 `생성한 파일을 복사`해서 사용
- 이 작업은 Next.js 프로젝트에서 실행추천

```json
"generate-types": "npx supabase gen types typescript --project-id 프로젝트아이디 --schema public >  src/types/types_db.ts"
```

```bash
npm run generate-types
```

- 생성되어진 `/src/types/types_db.ts` 파일을 이용해서 진행할 예정

## Supabase 타입정의 파일

- `/src/types/types_db.ts 생성`

## npm 설치 (버전주의)

```bash
npm install @supabase/supabase-js@2.39.5
```

```bash
npm install react-native-url-polyfill
```

## .env에 대해서

### 1. 기존 프로젝트에서는 이미 env가 세팅되어 있음

- npx create-next-app@latest 프로젝트 생성(Next)

```env
NEXT_PUBLIC_SUPABASE_URL=문자열
```

```ts
process.env.NEXT_PUBLIC_SUPABASE_URL;
```

- npm create vite@latest 프로젝트 생성(React Vite)

```env
VITE_SUPABASE_URL=문자열
```

```ts
import.meta.env.VITE_SUPABASE_URL;
```

- npx create-react-app 프로젝트 생성(React CRA)

```env
REACT_APP_SUPABASE_URL=문자열
```

```ts
process.env.REACT_APP_SUPABASE_URL;
```

### 2. React Native는 개발자가 직접 세팅하여야 함

- babel.config.js 수정 및 추가 필요
- npm도 추가설정
- 사용법도 별도 진행

### 3. env 셋팅 방법

```bash
npm install react-native-config
```

- `/android/app/build.gradle`
- `app 경로 꼭 확인`
- 아래 문장을 추가한다.

```txt
apply from: project(':react-native-config').projectDir.getPath() + "/dotenv.gradle"
```

- / 에 .env 파일을 생성

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-public-key
```

- `/src/types/react-native-config.d.ts` 파일 생성

```ts
// types/react-native-config.d.ts
declare module 'react-native-config' {
  interface Env {
    SUPABASE_URL: string;
    SUPABASE_ANON_KEY: string;
  }

  const Config: Env;
  export default Config;
}
```

## Supabase 를 위한 폴더 및 파일 생성

- `/src/lib/supabase` 폴더 생성
- `/src/lib/supabase/client.ts` 파일 생성

```ts
import 'react-native-url-polyfill/auto'; // 무조건 첫줄

import Config from 'react-native-config';
import {createClient} from '@supabase/supabase-js';
import {Database} from '../../types/types_db';

export const supabase = createClient<Database>(
  Config.SUPABASE_URL,
  Config.SUPABASE_ANON_KEY,
);
```

## Supabase CRUD API 파일 만들기

- `/src/api/todos-api.ts` 파일 생성

```ts
import {supabase} from '../lib/supabase/client';
import {Database} from '../types/types_db';
import {v4 as uuidv4} from 'uuid';
import 'react-native-get-random-values';
export type TodosRow = Database['public']['Tables']['todos']['Row'];
export type TodosRowInsert = Database['public']['Tables']['todos']['Insert'];
export type TodosRowUpdate = Database['public']['Tables']['todos']['Update'];

// Read
export const getTodos = async () => {
  let {data, error, status} = await supabase
    .from('todos')
    .select('*')
    .order('id', {ascending: false});

  if (error) {
    console.log(error.message);
    return;
  }
  return {data, error, status} as {
    data: TodosRow[] | null;
    error: Error | null;
    status: number;
  };
};
// Create
export const createTodo = async (title: string) => {
  const {data, error, status} = await supabase
    .from('todos')
    .insert([
      {
        title,
        contents: JSON.stringify([]),
        start_date: new Date().toISOString(),
        end_date: new Date().toISOString(),
        user_id: uuidv4(), // 로그인 사용자 정보
        user_email: '', // 로그인 사용자 정보
      },
    ])
    .select()
    .single();

  return {data, error, status};
};
// Update
export const updateTodo = async (id: number, title: string) => {
  const {data, error, status} = await supabase
    .from('todos')
    .update({
      title,
    })
    .eq('id', id)
    .select()
    .single();

  return {data, error, status} as {
    data: TodosRow | null;
    error: Error | null;
    status: number;
  };
};
// Delete
export const deleteTodo = async (id: number) => {
  const {data, error} = await supabase.from('todos').delete().eq('id', id);
  if (error) {
    console.log(error.message);
    return {error};
  }
  return {data};
};
```

## Supabase 테이블 출력하기 (CRUD)

- `/src/screens/HomeScreen.tsx` 적용

```tsx
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
```
