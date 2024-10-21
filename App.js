import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  Button,
  TextInput,
  Vibration,
  StyleSheet,
} from "react-native";
import { vibrate } from "./utils";

const PomodoroTimer = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [isWorkSession, setIsWorkSession] = useState(true);
  const [workMinutes, setWorkMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);
  const [minutes, setMinutes] = useState(workMinutes);
  const [seconds, setSeconds] = useState(0);

  const handleWorkTimeChange = (text) => {
    const minutes = parseInt(text) || 0;
    setWorkMinutes(minutes);
    if (isWorkSession) {
      setMinutes(minutes);
    }
  };

  const handleBreakTimeChange = (text) => {
    const minutes = parseInt(text) || 0;
    setBreakMinutes(minutes);
    if (!isWorkSession) {
      setMinutes(minutes);
    }
  };

  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            vibrate();
            setIsWorkSession(!isWorkSession);
            const nextMinutes = isWorkSession ? breakMinutes : workMinutes;
            setMinutes(nextMinutes);
            setSeconds(0);
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    } else if (!isRunning && minutes !== 0) {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isRunning, minutes, seconds, isWorkSession, workMinutes, breakMinutes]);

  const startTimer = () => {
    setIsRunning(true);
  };

  const stopTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setMinutes(isWorkSession ? workMinutes : breakMinutes);
    setSeconds(0);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.timer}>
        {minutes < 10 ? `0${minutes}` : minutes}:
        {seconds < 10 ? `0${seconds}` : seconds}
      </Text>
      <Text style={styles.label}>Робочий час (хвилини):</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={workMinutes.toString()}
        onChangeText={handleWorkTimeChange}
      />
      <Text style={styles.label}>Час перерви (хвилини):</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={breakMinutes.toString()}
        onChangeText={handleBreakTimeChange}
      />

      <View style={styles.buttonContainer}>
        <Button
          title={isRunning ? "Пауза" : "Старт"}
          onPress={isRunning ? stopTimer : startTimer}
        />
        <Button title="Обновлення" onPress={resetTimer} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "black",
  },
  label: {
    fontSize: 18,
    marginVertical: 10,
    color: "white",
  },
  input: {
    height: 40,
    width: 100,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 20,
    textAlign: "center",
    color: "white",
    backgroundColor: "#333",
  },
  timer: {
    fontSize: 48,
    marginVertical: 20,
    color: "white",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "60%",
    marginTop: 20,
  },
});

export default PomodoroTimer;
