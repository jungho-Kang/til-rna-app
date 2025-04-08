import React, {useRef, useState} from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import WebView from 'react-native-webview';
const WebViewScreen = () => {
  const webUrl = 'http://192.168.0.204:3000';
  // WebView의 url에 있는 페이지가 모두 로딩이 되었는지 체크
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  // 어떤 WebView를 대상으로 메세지 체크를 할 것인가?
  const webViewRef = useRef<WebView>(null);

  // count state 관련
  const [count, setCount] = useState<number>(0);
  // 전달받은 message 관련
  const [message, setMessage] = useState<string>('');

  // WebView로 데이터를 보내는 함수
  const sendDataWeb = (data: any) => {
    const messageData = JSON.stringify(data);
    webViewRef.current?.injectJavaScript(`
      window.postMessage('${messageData}', '*');
      true;
    `);
  };
  // WebView로 부터 데이터를 받는 함수
  const onMessage = (event: any) => {
    const data = event.nativeEvent.data;
    console.log(data);
    if (data === 'load') {
      setIsLoaded(true);
      // 모두 준비가 되었으니 WebView로 메세지를 보내준다
      sendDataWeb({type: 'INIT_DATA', payload: {message: 'Hello Next!'}});
      return;
    }
    // WebView에서 INIT_DATA 글자가 전송된 경우
    if (data === 'INIT_DATA') {
      setCount(0);
      return;
    }
    // 날짜가 전송된 경우
    setMessage(data);
  };

  // 버튼 클릭 시 count 값을 1 올려주고, 데이터 전송
  const handleButtonClick = () => {
    const temp = count + 1;
    setCount(temp);
    // WebView로 전송
    sendDataWeb({type: 'UPDATE_COUNT', payload: {count: temp}});
  };

  return (
    <SafeAreaView style={styles.container}>
      <WebView
        ref={webViewRef}
        onMessage={onMessage}
        injectedJavaScript={`
          window.ReactNativeWebView.postMessage('load');
          window.addEventListener('message',function(event){
            try {
              const data = JSON.parse(event.data);
              if(data.type === 'UPDATE_COUNT') {
                // 웹페이지에서 카운트 데이터 처리
                console.log('Count Updated : ', data.payload.count);
              }
            } catch (e) {
              console.log(e);
            }
          });
          true;
        `}
        style={styles.webview}
        source={{uri: webUrl}} // WebView에 보여줄 주소
        startInLoadingState={true} // WebView 로딩 인디케이터 표시
        // 로딩 중일 때 보여줄 내용
        renderLoading={() => (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        )}
      />
      <View style={styles.messageContainer}>
        <Text>{message}</Text>
      </View>
      <View style={styles.control}>
        <TouchableOpacity
          style={styles.roundButton}
          onPress={handleButtonClick}>
          <Text style={styles.buttonTxt}>{count}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// css
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'blue',
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  messageContainer: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    zIndex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 5,
  },
  control: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 1,
  },
  roundButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonTxt: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
});
export default WebViewScreen;
