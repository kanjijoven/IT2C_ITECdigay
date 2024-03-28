import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { StyleSheet, Text, View, Button, Image } from "react-native";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import AsyncStorage from "@react-native-async-storage/async-storage";

//expo go : 835124650344-9bh7d0efa4q296it8pn08qi0s02kgbus.apps.googleusercontent.com
//android : 835124650344-9gqmdq1lvtratciuok9s4ofbfkncd6ua.apps.googleusercontent.com
//ios : 835124650344-1leakq564l82cl5e9ktg6kgg1a3glbt0.apps.googleusercontent.com
//web : 835124650344-2udfj8ap83pe9rcu6eohuscrfu1jklgv.apps.googleusercontent.com

WebBrowser.maybeCompleteAuthSession();

export default function App() {
  const [userInfo, setUserInfo] = React.useState(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: "835124650344-9bh7d0efa4q296it8pn08qi0s02kgbus.apps.googleusercontent.com",
    androidClientId: "835124650344-9gqmdq1lvtratciuok9s4ofbfkncd6ua.apps.googleusercontent.com",
    iosClientId: "835124650344-1leakq564l82cl5e9ktg6kgg1a3glbt0.apps.googleusercontent.com",
    webClientId: "835124650344-2udfj8ap83pe9rcu6eohuscrfu1jklgv.apps.googleusercontent.com",
    scopes: ["profile", "email"],
});

React.useEffect(() => {
  handleEffect();
}, [response]);

async function handleEffect(){
  // console.warn("token = " + response.authentication.accessToken);

  const user = await getLocalUser();
  //console.warn("AsyncStorage User = " + user);
  if (!user){
    getUserInfo(response.authentication.accessToken);
  }else{
    setUserInfo(user);
  }
}

const getLocalUser = async() => {
  const data = await AsyncStorage.getItem("@user");
  if (!data) return null;
  return JSON.parse(data);
};

const getUserInfo = async (token) => {
  if (!token) return;

  try {
    const response = await fetch (
      "https://www.googleapis.com/userinfo/v2/me",
      {
        headers: {Authorization: `Bearer ${token}` },
      }
    );
    
    const user = await response.json();
    console.warn(user);
    await AsyncStorage.setItem("@user", JSON.stringify(user));
    setUserInfo(user);
  } catch (error) {}
};

  return (
    <View style={styles.container}>
      { !userInfo ? (
          <Button
          title="Login with Google"
          onPress={() => {
            promptAsync();
          }}
      /> 
      ) : (
         <View>
          <Image style={styles.image} source={{ uri: userInfo?.picture }}/>
          <Text style={styles.text}>Email: {userInfo.email}</Text>
          <Text style={styles.text}>Full Name: {userInfo.name}</Text>

          <Button
          title="Remove AsyncStorage Value"
          onPress={async () => {
            await AsyncStorage.removeItem("@user")
          }}
      /> 
        </View>
      )}
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 25,
    fontWeight: "bold",
  },
  image:{
    width: 100,
    height: 100,
  }
});
