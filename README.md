# 컴포넌트 응용 화면 구성

- `/src/screens/ProfileScreen.tsx 파일` 생성

```tsx
import React from 'react';
import {SafeAreaView, Text, View} from 'react-native';

function ProfileScreen() {
  return (
    <SafeAreaView>
      <View>
        <Text>Profile Screen</Text>
      </View>
    </SafeAreaView>
  );
}

export default ProfileScreen;
```

- /src/navigations/ScreenStackNavigator.tsx 수정

```tsx
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import HomeScreen from '../screens/HomeScreen';
import AboutScreen from '../screens/AboutScreen';
import WebViewScreen from '../screens/WebViewScreen';
import ProfileScreen from '../screens/ProfileScreen';

const ScreenStackNavigator = () => {
  // screen 스택에 대한 정보관리
  // 관례상 변수명을 Stack 으로 한다.(참조)
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="About" component={AboutScreen} />
      <Stack.Screen name="WebView" component={WebViewScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
};

export default ScreenStackNavigator;
```

- /src/screens/HomeScreen.tsx

```tsx
import React from 'react';
import {Button, SafeAreaView, StyleSheet, Text, View} from 'react-native';

const HomeScreen = ({navigation}: {navigation: any}): JSX.Element => {
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
    </SafeAreaView>
  );
};

// css
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default HomeScreen;
```

```bash
npm start
a
```

# 컴포넌트 기본 구성

## 1. 기본 화면 구성은 SafeAreaView 부터 셋팅하자.

```tsx
import React from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';

function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text>Profile Screen</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // 전체 너비 차지
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default ProfileScreen;
```

## 2. 프로필 스크린 만들어보기

```tsx
import React, {useState} from 'react';
import {Alert} from 'react-native';
import {
  Button,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

function ProfileScreen() {
  const [name, setName] = useState('');
  const [introduce, setIntroduce] = useState('');
  const [submitted, setSubmmited] = useState(false);

  const handlePress = () => {
    if (name.trim() === '' || introduce.trim() === '') {
      Alert.alert('입력 오류', '이름과 소개를 입력해주세요.', [{text: '확인'}]);
      return;
    }
    setSubmmited(true);
    Alert.alert('환영합니다.', `${name}님 환영합니다.`, [{text: '확인'}]);
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.container, {width: '100%'}]}>
        {/* 로컬 이미지는 require 사용 */}
        <Image
          source={{uri: 'https://picsum.photos/200/300?random=1'}}
          style={styles.image}
        />
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="이름을 입력하세요."
        />
        <TextInput
          style={styles.input}
          value={introduce}
          onChangeText={setIntroduce}
          multiline
          placeholder="자기소개를 입력하세요."
        />
        <Button title="나의 프로필" onPress={handlePress} />

        {submitted && (
          <View style={styles.resultBox}>
            <Text style={styles.resultText}>{name}</Text>
            <Text style={styles.resultText}>{introduce}</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // 전체 너비 차지
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#ccc',
  },
  input: {
    width: '90%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  resultBox: {
    marginTop: 30,
    alignItems: 'center',
  },
  resultText: {
    fontSize: 16,
    marginTop: 5,
    color: '#333',
  },
});

export default ProfileScreen;
```

## 3. 오늘 할일 체크 리스트 만들기

```tsx
import React, {useState} from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Switch,
  Text,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';

type Task = {
  id: string;
  title: string;
  done: boolean;
};

export default function ProfileScreen() {
  // 할일 데이터 state
  const [tasks, setTasks] = useState<Task[]>([
    {id: '1', title: '아침 먹기', done: true},
    {id: '2', title: '점심 먹기', done: false},
    {id: '3', title: '저녁 먹기', done: false},
  ]);

  // 할일 목록중  state의 done 변경
  const toggleSwitch = (id: string) => {
    setTasks(prev =>
      prev.map(item => (item.id === id ? {...item, done: !item.done} : item)),
    );
  };

  const renderItem = ({item}: {item: Task}) => (
    <View style={styles.itemRow}>
      <Text style={[styles.itemText, item.done && styles.checkedText]}>
        {item.done ? '✔' : '✘'} {item.title}
      </Text>
      <Switch
        value={item.done}
        onValueChange={() => toggleSwitch(item.id)}
        thumbColor={item.done ? 'orange' : 'gray'}
        trackColor={{false: '#ccc', true: 'green'}}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.viewContainer}>
        <Text style={styles.title}>할일체크리스트</Text>
        {/* 목록 출력 */}
        <FlatList
          data={tasks}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={() => Alert.alert('오늘도 화이팅하세요. ^^')}
          onPressIn={() => console.log('onPressIn')}
          onPressOut={() => console.log('onPressOut')}>
          <Text style={styles.buttonText}>메시지 보내기</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    width: '100%',
  },
  viewContainer: {
    flex: 1,
    width: '100%',
    padding: 30,
    backgroundColor: '#f2f2f2',
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  itemText: {
    fontSize: 18,
  },
  checkedText: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
  separator: {
    height: 5,
    backgroundColor: '#f2f2f2',
  },
  button: {
    marginTop: 30,
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
```

## 4. 오늘 할일 추가하기 (입력창, 리스트 등)

- KeyboardAvoidingView
  - 키보드가 화면에 올라올 때 입력창이나 UI 요소가 키보드에 가리지 않도록 자동으로 레이아웃을 조절해줌
  - behavior, style
- `/src/screens/ProfileScreen.tsx`

```tsx
import React, {useState} from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function ProfileScreen() {
  // 입력중인 할일 state
  const [task, setTask] = useState('');
  // 할일 목록 state
  const [taskList, setTaskList] = useState<string[]>([]);
  // 할일 추가 핸들러
  const handleAddTask = () => {
    if (task.trim() === '') {
      Alert.alert('할일을 입력해주세요.');
      return;
    }
    setTaskList(prev => [...prev, task]);
    setTask('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={[styles.container, styles.view]}>
          <Text style={styles.title}>오늘의 할 일 📋</Text>
          {/* 할일 추가 */}
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={task}
              onChangeText={setTask}
              placeholder="할일을 입력해주세요."
            />
            <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
              <Text style={styles.addButtonText}>추가</Text>
            </TouchableOpacity>
          </View>
          {/* 할일 목록 */}
          <ScrollView style={styles.list}>
            {taskList.map((item, index) => (
              <Text key={index} style={styles.taskItem}>
                - {item}
              </Text>
            ))}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  view: {
    width: '100%',
    padding: 24,
    paddingTop: 50,
    backgroundColor: '#f0f4f8',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    marginLeft: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
  },
  list: {
    flex: 1,
    marginTop: 10,
  },
  taskItem: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 12,
    padding: 10,
  },
});
```

## 5. 팝업창 만들어보기

- `/src/screens/ProfileScreen.tsx`

```tsx
import React, {useState} from 'react';
import {
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';

export default function ProfileScreen() {
  // modal 보이기 state
  const [modalVisible, setModalVisible] = useState(false);
  // 확인 기능
  const handleConfirm = () => {
    setModalVisible(false);
    Alert.alert('안내보기확인', '안내를 읽어주셔서 감사합니다.');
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.container, styles.view]}>
        <TouchableOpacity
          style={styles.openButton}
          onPress={() => setModalVisible(true)}>
          <Text style={styles.openButtonText}>📒 안내보기</Text>
        </TouchableOpacity>
        <Modal transparent visible={modalVisible}>
          <View style={styles.modalBackground}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>개인정보 안내 🔑</Text>
              <Text style={styles.modalContent}>
                이 앱은 사용자 정보를 저장하지 않습니다.
              </Text>
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.modalButton, {backgroundColor: '#b62424'}]}
                  onPress={() => setModalVisible(false)}>
                  <Text style={{color: '#fff'}}>닫기</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, {backgroundColor: '#4caf50'}]}
                  onPress={() => handleConfirm()}>
                  <Text style={{color: '#fff'}}>확인</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  view: {
    width: '100%',
    backgroundColor: '#fff',
  },
  openButton: {
    backgroundColor: '#2196F3',
    padding: 14,
    borderRadius: 10,
  },
  openButtonText: {
    fontSize: 18,
    color: '#fff',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 12,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  modalContent: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginHorizontal: 5,
  },
});
```

## 6. FlatList 응용해보기

```tsx
import React, {useRef, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

// 현재 화면의 가로너비를 가져오기
const {width} = Dimensions.get('window');

// 외부에서 데이터를 가져옴
const datas = [
  {id: '1', uri: 'https://i.pravatar.cc/400'},
  {id: '2', uri: 'https://i.pravatar.cc/400'},
  {id: '3', uri: 'https://i.pravatar.cc/400'},
];

export default function ProfileScreen() {
  // 몇 번째 이미지가 보여지는지 관리하는 state
  const [currentIndex, setCurrentIndex] = useState(0);

  // 필요에 의해서 만약 FlatList 에 접근하는 경우라면
  const flatListRef = useRef<FlatList>(null);

  // 목록 표현(사진을 한개, 한개씩 어떻게 보여줄지를 정의한다)
  const renderItem = ({item}: {item: {id: string; uri: string}}) => (
    <Image source={{uri: item.uri}} style={styles.image} />
  );
  // 스크롤 할 때 마다 처리됨
  const handleScroll = (event: any) => {
    // 몇 번째 슬라이드인지 파악하기 위한 용도로 활용
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.container, {width: '100%'}]}>
        <FlatList
          ref={flatListRef}
          data={datas}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
        />

        <View style={styles.indicateRow}>
          {datas.map((_, index) => (
            <View
              key={index}
              style={[styles.dot, currentIndex === index && styles.activeDot]}
            />
          ))}
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
  image: {
    width: width, // 사진은 화면 가로 크기만큼
    height: 300, // 높이는 300으로 고정
    resizeMode: 'cover', // 사진이 안 잘리게 채워요
  },
  indicateRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ccc',
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: 'hotpink',
  },
});
```

## 7. AsyncStorage로 저장 및 읽어오기

- 설치 (앱을 껐다가 켜도 유지되도록 하기 위한 목적)

```bash
npm install @react-native-async-storage/async-storage
```

### 7.1. 기본 예제

- `/src/screens/ProfileScreen.tsx`

```tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

export default function ProfileScreen() {
  const [name, setName] = useState('');
  // 저장하기
  const handleSave = async () => {
    try {
      await AsyncStorage.setItem('user_name', name);
      Alert.alert('저장성공');
    } catch (error) {
      console.log('저장오류', error);
    }
  };

  // 데이터 읽어오기
  const loadData = async () => {
    try {
      const result = await AsyncStorage.getItem('user_name');
      console.log('불러오기 : ', result);
      if (result) {
        setName(result);
        Alert.alert('불러오기 성공');
      }
    } catch (error) {
      console.log('불러오기 오류', error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.container, {width: '100%'}]}>
        <Text>간단 저장 및 읽어오기</Text>
        <TextInput
          style={styles.input}
          placeholder="이름입력"
          value={name}
          onChangeText={setName}
        />
        <Button title="이름저장" onPress={() => handleSave()} />
        <Text>저장된 이름 : {name}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  input: {
    borderWidth: 3,
    padding: 10,
  },
});
```

### 7.2. 응용 예제

- `/src/screens/ProfileScreen.tsx`

```tsx
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

    setTasks(prev => [newTask, ...prev]);
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
      if (!stored) {
        Alert.alert('자료가 없습니다.');
        return;
      }

      // json 문자열일 것이므로
      setTasks(JSON.parse(stored));
      Alert.alert('자료 호출이 완료 되었습니다.');
    } catch (error) {
      console.log('error', error);
    }
  };

  // 자료 저장하기
  const saveTask = async (data: Task[]) => {
    try {
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
```
