import * as Speech from 'expo-speech';
import React, { useEffect, useState } from 'react';
import Slider from '@react-native-community/slider';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';


import assist_help from './gestures/assist_help.png';
import bathroom from './gestures/bathroom.png';
import better from './gestures/better.png';
import bye from './gestures/bye.png';
import come from './gestures/come.png';
import dizzy from './gestures/dizzy.png';
import doctor from './gestures/doctor.png';
import drink from './gestures/drink.png';
import eat_food from './gestures/eat_food.png';
import fine_ok from './gestures/fine_ok.png';
import go from './gestures/go.png';
import hi_hello from './gestures/hi_hello.png';
import i_mine from './gestures/i_mine.png';
import later from './gestures/later.png';
import medicine from './gestures/medicine.png';
import more from './gestures/more.png';
import no from './gestures/no.png';
import now from './gestures/now.png';
import nurse from './gestures/nurse.png';
import phone from './gestures/phone.png';
import please from './gestures/please.png';
import quiet from './gestures/quiet.png';
import sleep_bed from './gestures/sleep_bed.png';
import stop from './gestures/stop.png';
import thanks from './gestures/thanks.png';
import tired from './gestures/tired.png';
import wait from './gestures/wait.png';
import want from './gestures/want.png';
import yes from './gestures/yes.png';
import you_yours from './gestures/you_yours.png';

// create a map to store the images'
const imageMap = {
  word1: assist_help,
  word2: bathroom,
  word3: better,
  word4: bye,
  word5: dizzy,
  word6: doctor,
  word7: drink,
  word8: eat_food,
  word9: fine_ok,
  word10: go,
  word11: hi_hello,
  word12: i_mine,
  word13: later,
  word14: medicine,
  word15: more,
  word16: no,
  word17: now,
  word18: nurse,
  word19: phone,
  word21: please,
  word22: quiet,
  word23: sleep_bed,
  word24: stop,
  word25: thanks,
  word26: tired,
  word27: wait,
  word28: want,
  word29: yes,
  word30: you_yours,
};

// Home screen displaying word of gesture along with image and speech button
const HomeScreen = () => {
  const [word, setWord] = useState('');
  const [imageSource, setImageSource] = useState(null);

  // fetch the word from the server
  useEffect(() => {
    fetch('http://localhost:5000/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ num_words: 1 }),
    })
      .then((response) => response.json())
      .then((data) => {
        setWord(data.word);
        setImageSource(imageMap[data.word]); // Use the image from the map based on the word
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  // set the speech button to the word
  const speakWord = () => {
    Speech.speak(word);
  };

  // -----------------------------------
  // tester speak function
  const speakTest = () => {
    Speech.speak("nurse");
  };
  // ------------------------------------

  return (
    <View style={styles.container}>
      {imageSource && <Image source={imageSource} style={styles.gestureImage} />}
      <Text style={styles.word}>{word}</Text>

      {/* // ------------------------------------ */}
      <Image source={require('./gestures/nurse.png')} style={styles.gestureImage} />
      <Text style={[{fontSize: 40, fontWeight: "bold", marginBottom: 35}]}>Nurse</Text> 
      <TouchableOpacity onPress={speakTest} style={styles.button}>
      {/* // ------------------------------------ */}

      {/* <TouchableOpacity onPress={speakWord} style={styles.button}> */}
        <View style={styles.speakButtonContainer}>
        <Image source={require('./images/speaker.png')} style={styles.speakerImage} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

// Logs screen updates any gestures used in newest to oldest order
// allows user to view to word, use speech button, and delete individual lofs
const LogsScreen = () => {
  const [logs, setLogs] = useState([]);

  const addLog = (word) => {
    const newLog = { id: Date.now(), word };
    setLogs((prevLogs) => [newLog, ...prevLogs]);
  };

  const deleteLog = (id) => {
    setLogs((prevLogs) => prevLogs.filter((log) => log.id !== id));
  };

  return (
    <View style={styles.container}>

      {/* // ------------------------------------ */}
      <View style={[styles.button, {backgroundColor: '#3485FF'}]}>
        <Text style={[styles.text, {color: 'white'}, {fontWeight: "bold"}]}>No Logs Available!</Text>
      </View>
      {/* // ------------------------------------ */}

      {logs.map((log) => (
        <View key={log.id} style={styles.logContainer}>
          <Text style={styles.logWord}>{log.word}</Text>
          <TouchableOpacity onPress={() => Speech.speak(log.word)} style={styles.button}>
            <View style={styles.button}>
              <Text style={styles.text}>Speak</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => deleteLog(log.id)} style={styles.button}>
            <View style={[styles.button, { backgroundColor: 'red' }]}>
              <Text style={styles.text}>Delete</Text>
            </View>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

// Connectivity screen displays whethere a connection exists between the app and server
// Outputs to screen a red button if connection doesn't exist and green button if it does
const ConnectivityScreen = () => {
  const [connectivityStatus, setConnectivityStatus] = useState(false);

  useEffect(() => {
    // Check the connectivity status here
    const checkConnectivity = async () => {
      try {
        const response = await fetch('http://localhost:5000/check-connection');
        if (response.status === 200) {
          setConnectivityStatus(true);
        } else {
          setConnectivityStatus(false);
        }
      } catch (error) {
        setConnectivityStatus(false);
      }
    };

    checkConnectivity();
  }, []);

  return (
    <View style={styles.container}>
      <View style={[styles.button, { backgroundColor: connectivityStatus ? '#3485FF' : '#FF4646' }]}>
        <Text style={styles.text}>
          {connectivityStatus ? 'Connected to Server!' : 'Disconnected from Server!'}
        </Text>
      </View>
    </View>
  );
};

// Settings Screen
const SettingsScreen = () => {
  const [volume, setVolume] = useState(0.5); // Initial volume value

  const handleVolumeChange = (value) => {
    setVolume(value);
    // Update the volume of the text-to-speech functionality here
    // You can use the volume value to control the volume of Speech.speak()
    Speech.updateVolume(value);
  };

  const deleteAllLogs = () => {
    // Implement the logic to delete all logs from the Logs screen here
    // You can use a function to clear the logs array or update the state accordingly
    setLogs([]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.settingsSection}>
        <View style={styles.volumeContainer}>
          <Text style={styles.volumeText}>Volume</Text>
          <Slider
            style={styles.volumeSlider}
            minimumValue={0}
            maximumValue={1}
            value={volume}
            onValueChange={handleVolumeChange}
          />
        </View>
      </View>
      <TouchableOpacity onPress={deleteAllLogs} style={[styles.button, {backgroundColor: "#3485FF"}]}>
        <View style={styles.button}>
          <Text style={styles.text}>Delete All Logs</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, {backgroundColor: "#3485FF"}]}>
        <View style={styles.button}>
          <Text style={styles.text}>Delete All Devices</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, {backgroundColor: "#3485FF"}]}>
        <View style={styles.button}>
          <Text style={styles.text}>Change Language</Text>
        </View>
      </TouchableOpacity>

      <Text>Motion 2 Sound App</Text>
      <Text>WEAR Lab</Text>
      <Text>Version 1.0</Text>
      <Text>May 2023</Text>
    </View>
  );
};

// Navigation Bar is set to the bottom of the screen
const Tab = createBottomTabNavigator();

const App = () => (
  <NavigationContainer>
    <Tab.Navigator barStyle={styles.navBar}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused }) => {
            let iconSource;

            if (route.name === 'Home') {
              iconSource = focused
                ? require('./images/home.png')
                : require('./images/home.png');
            } else if (route.name === 'Logs') {
              iconSource = focused
                ? require('./images/logs.png')
                : require('./images/logs.png');
            } else if (route.name === 'Connectivity') {
              iconSource = focused
                ? require('./images/connectivity.png')
                : require('./images/connectivity.png');
            } else if (route.name === 'Settings') {
              iconSource = focused
                ? require('./images/settings.png')
                : require('./images/settings.png');
            }

            return <Image source={iconSource} style={styles.navIcon} />;
          },
        })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Logs" component={LogsScreen} />
      <Tab.Screen name="Connectivity" component={ConnectivityScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  </NavigationContainer>
);

// Style Sheet containing all styles used in app
const styles = StyleSheet.create({
  // blocks and containers
  container: {
    backgroundColor: 'F1F1F1',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: 300,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    marginTop: 10,
    marginBottom: 10,
  },
  speakButtonContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#3485FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  navBar: {
    backgroundColor: 'white',
    height: 70,
  },

  // images
  image: {
    width: 100,
    height: 100,
    borderRadius: 25,
    marginBottom: 10,
  },
  gestureImage: {
    width: 300,
    height: 300,
    borderRadius: 25,
    marginBottom: 20,
  },
  speakerImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  navIcon: {
    width: 24,
    height: 24,
    marginTop: 15,
  },

  // text
  text: {
    color: 'white',
    fontSize: 20,
    fontWeight: "bold",
  },
  volumeText: {
    color: 'black',
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 145,
  }
});

export default App;
