import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import MapView, { Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import { LocationObject } from 'expo-location';
import { LocationSubscription } from 'expo-location';
import haversine from 'haversine';
import { createNewBucketActivity } from '../services/dbService'; // Import the function to save activity to Firestore
import { getAuth } from 'firebase/auth';
import { Picker } from '@react-native-picker/picker';

// Define a type for the route coordinates
type RouteCoordinate = {
  latitude: number;
  longitude: number;
};

// Component for creating a new activity
const CreateActivityScreen = () => {
  // State variables for activity details
  const [activityName, setActivityName] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [type, setType] = useState('');
  const [route, setRoute] = useState<RouteCoordinate[]>([]); // Use the defined type for the route state
  const [currentPosition, setCurrentPosition] = useState({ latitude: 0, longitude: 0 }); // Store current position with initial values
  const [subscription, setSubscription] = useState<LocationSubscription | null>(null); // To manage the location subscription
  const [modalVisible, setModalVisible] = useState(false); // State to control modal visibility
  const [isRecording, setIsRecording] = useState(false); // State to track recording status
  const [startTime, setStartTime] = useState<Date | null>(null); // State to store start time of recording
  const mapRef = useRef<MapView>(null); // Reference to the MapView

  useEffect(() => {
    const getCurrentLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setCurrentPosition({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      });
    };

    getCurrentLocation();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  // Function to start recording the route
  const startRecording = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.error('Permission to access location was denied');
      return;
    }

    const LocationSubscription = await Location.watchPositionAsync({
      accuracy: Location.Accuracy.BestForNavigation,
      timeInterval: 1000,
      distanceInterval: 0
    }, (locationUpdate: LocationObject) => {
      const { latitude, longitude } = locationUpdate.coords;
      setRoute(prevRoute => [...prevRoute, { latitude, longitude }]);
      setCurrentPosition({ latitude, longitude });
    });

    setSubscription(LocationSubscription);
    setIsRecording(true);
    setStartTime(new Date()); // Set the start time when recording starts
  };

  // Function to stop recording the route and show modal
  const stopRecording = () => {
    if (subscription) {
      subscription.remove();
      setSubscription(null);
      setModalVisible(true); // Show modal on stop
      setIsRecording(false);
    }
  };

  // Function to cancel recording the route
  const cancelRecording = () => {
    if (subscription) {
      subscription.remove();
      setSubscription(null);
    }
    setIsRecording(false);
    setRoute([]); // Clear the recorded route
    setModalVisible(false); // Hide modal
    setActivityName(''); // Reset activity name
    setLocation(''); // Reset location
    setDescription(''); // Reset description
    setDifficulty(''); // Reset difficulty
    setType(''); // Reset type
    setStartTime(null); // Reset start time
  };

  // Function to resume recording the route
  const resumeRecording = () => {
    setModalVisible(false);
    startRecording();
  };

  // Calculate total workout time in minutes
  const calculateWorkoutTime = () => {
    if (startTime) {
      const endTime = new Date();
      const duration = endTime.getTime() - startTime.getTime();
      return Math.floor(duration / 60000); // Convert milliseconds to minutes
    }
    return 0;
  };

  // Calculate total kilometers
  const calculateTotalKilometers = () => {
    let totalKilometers = 0;
    for (let i = 1; i < route.length; i++) {
      totalKilometers += haversine(route[i - 1], route[i], { unit: 'km' });
    }
    return totalKilometers.toFixed(2);
  };

  // Calculate average speed in km/h
  const calculateAverageSpeed = () => {
    const totalKilometers = parseFloat(calculateTotalKilometers());
    const totalHours = calculateWorkoutTime() / 60;
    return totalHours > 0 ? (totalKilometers / totalHours).toFixed(2) : '0.00';
  };

  // Check if all input fields are filled
  const allFieldsFilled = activityName && location && description && difficulty && type && route.length > 0;

  // Function to save activity to Firestore and reset state
  const saveActivity = async () => {
    if (!allFieldsFilled) {
      console.error('Please fill all fields before saving.');
      return;
    }

    // Get current user
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      console.error('No user logged in');
      return;
    }

    const activityData = {
      userId: user.uid, // Include the user's ID
      activityName,
      location,
      description,
      difficulty,
      type,
      route,
      startTime,
      endTime: new Date(),
      totalDistance: calculateTotalKilometers(),
      averageSpeed: calculateAverageSpeed()
    };

    try {
      const success = await createNewBucketActivity(activityData); // Save to Firestore
      if (success) {
        console.log('Activity saved successfully');
      } else {
        console.error('Failed to save activity');
      }
    } catch (error) {
      console.error('Error saving activity:', error);
    }
    // Reset all fields after saving
    setModalVisible(false);
    setIsRecording(false);
    setRoute([]);
    setActivityName('');
    setLocation('');
    setDescription('');
    setDifficulty('');
    setType('');
    setStartTime(null);
  };

  // Render the input fields, map view for recording route, and create button
  return (
    <View style={styles.container}>
      <Text style={styles.modalHeading}>Create New Activity</Text>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: currentPosition.latitude,
          longitude: currentPosition.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation={true}
      >
        {route.length > 0 && (
          <Polyline
            coordinates={route}
            strokeColor="#FFCE1C" // Line color for the route
            strokeWidth={10}
          />
        )}
      </MapView>
      <View style={styles.currentContainer}>
        <Text style={styles.currentText}>{calculateWorkoutTime()} minutes</Text>
        <Text style={styles.currentText}>{calculateTotalKilometers()} km</Text>
        <Text style={styles.currentText}>{calculateAverageSpeed()} km/h</Text>
      </View>
      {!isRecording ? (
        <TouchableOpacity
          style={styles.buttonStart}
          onPress={startRecording}
        >
          <Text style={styles.buttonText}>Start Recording Route</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.buttonStop}
          onPress={stopRecording}
        >
          <Text style={styles.buttonText}>Stop Recording Route</Text>
        </TouchableOpacity>
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            
            <Text style={styles.modalHeading}>Finish Activity</Text>
            <View style={styles.currentContainer}>
              <Text style={styles.modalText}>{calculateWorkoutTime()} minutes</Text>
              <Text style={styles.modalText}>{calculateTotalKilometers()} km</Text>
              <Text style={styles.modalText}>{calculateAverageSpeed()} km/h</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Activity Title"
              placeholderTextColor="#ccc"
              value={activityName}
              onChangeText={setActivityName}
            />
            <TextInput
              style={styles.input}
              placeholder="Location"
              placeholderTextColor="#ccc"
              value={location}
              onChangeText={setLocation}
            />
            <TextInput
              style={styles.input}
              placeholder="Description"
              placeholderTextColor="#ccc"
              value={description}
              onChangeText={setDescription}
              multiline
            />
          
              <Picker
                selectedValue={difficulty}
                style={styles.inputPicker}
                onValueChange={(itemValue: string, itemIndex: number) => setDifficulty(itemValue)}
              >
                <Picker.Item label="Easy" value="easy" />
                <Picker.Item label="Moderate" value="moderate" />
                <Picker.Item label="Challenging" value="challenging" />
                <Picker.Item label="Difficult" value="difficult" />
                <Picker.Item label="Extreme" value="extreme" />
              </Picker>
              <Picker
                selectedValue={type}
                style={styles.inputPicker}
                onValueChange={(itemValue: string, itemIndex: number) => setType(itemValue)}
              >
                <Picker.Item label="Running" value="running" />
                <Picker.Item label="Cycling" value="cycling" />
                <Picker.Item label="Hiking" value="hiking" />
                <Picker.Item label="Swimming" value="swimming" />
                <Picker.Item label="Gym Workout" value="gym" />
              </Picker>
            
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.buttonSeconday}
                    onPress={resumeRecording}
                    >
                    <Text style={styles.buttonText}>Resume</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.buttonPrimary}
                    onPress={saveActivity}
                    disabled={!allFieldsFilled}
                    >
                    <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.buttonCancel}
                    onPress={cancelRecording}
                    >
                    <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
            </View>
            
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Styles for the CreateActivityScreen component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#24252A',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 'auto',
    marginBottom: 10,
    borderRadius: 25,
    borderColor: '#108DF9',
    borderWidth: 3,
    padding: 15,
    backgroundColor: '#3C3E47',
    color: '#fff',
  },
  inputPicker: {
    width: '100%',
    height: 120,
    justifyContent: 'center',
    marginBottom: 10,
    borderRadius: 25,
    borderColor: '#108DF9',
    borderWidth: 3,
    backgroundColor: '#3C3E47',
    color: '#fff',
  },
  picker: {
    width: '100%',
    height: 50,
    borderRadius: 25,
    borderColor: '#108DF9',
    borderWidth: 3,
    backgroundColor: '#3C3E47',
    color: '#fff',
  },
  map: {
    width: '100%',
    height: '60%',
    borderWidth: 3,
    borderBottomColor: '#FFCE1C',
    borderTopColor: '#FFCE1C',
  },
currentContainer: {
  borderTopWidth: 3,
  borderBottomWidth: 3,
  borderColor: '#F3C94F',
  padding: 15,
  width: '100%',
  backgroundColor: '#3C3E47',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 20
  },
  currentText: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  buttonPrimary: { // Added missing style for button
    width: '30%',
    height: 60,
    backgroundColor: '#108DF9',
    borderRadius: 25,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
  },
  buttonSeconday: { // Added missing style for button
    width: '30%',
    height: 60,
    borderWidth: 3,
    borderColor: '#108DF9',
    borderRadius: 25,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
  },
  buttonStop: {
    width: '90%',
    height: 60,
    backgroundColor: '#F9A1A1',
    borderRadius: 25,
    borderColor: 'red',
    borderWidth: 3,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    marginBottom: 10
  },
  buttonStart: {
    width: '90%',
    height: 60,
    backgroundColor: '#108DF9',
    borderRadius: 25,
    borderColor: '#108DF9',
    borderWidth: 3,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    marginBottom: 10
  },
  buttonCancel: {
    width: '30%',
    height: 60,
    backgroundColor: '#F9A1A1',
    borderRadius: 25,
    borderColor: 'red',
    borderWidth: 3,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    marginBottom: 10
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: '#3C3E47',
    width: '90%',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeading: {
    marginBottom: 15,
    color: '#FFCE1C',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 24
  },
  modalText: {
    marginBottom: 10,
    color: '#fff',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },

});

export default CreateActivityScreen;

