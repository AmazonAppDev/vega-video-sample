import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  BackHandler,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  ingestChannelLineup,
  ingestProgramLineup,
} from './livetv/task/EpgSyncTask';
import { COLORS } from './styles/Colors';
import { scaleUxToDp } from './utils/pixelUtils';

const TIME_TO_LEAVE_APP = 3000;

const LiveForceSync = () => {
  // NOTE: You should replace the code with your own business logic to render the splash screen and show progress status.
  const [isInProgress, setIsInProgress] = useState<boolean>(true);

  // Progress of ingestion from 0-100.
  const [progress, setProgress] = useState<number>(0);

  const [failed, setFailed] = useState<boolean>(false);

  /**
   * Takes in a decimal representing the percentage of the progress made for channel ingestion and updates the progress bar.
   * For this example, we are treating channel ingestion completion as being 50% complete on the progress bar.
   * @param channelProgress - values between 0 and 1 to set current progress.
   */
  const channelProgressCallback = (channelProgress: number) => {
    // Channel ingestion is the first 50% of progress bar.
    setProgress(channelProgress * 50);
  };

  /**
   * Takes in a decimal representing the percentage of the progress made for program ingestion and updates the progress bar.
   * Move progress bar to 100% once program ingestion has completed.
   * @param programProgress - values between 0 and 1 to set current progress.
   */
  const programProgressCallback = (programProgress: number) => {
    // Program ingestion happens second and is the last 50% of progress bar.
    setProgress(50 + programProgress * 50);
  };

  const ingestLineup = async () => {
    try {
      /*
        NOTE: The current timestamp is being used as the 'latestVersion' for mocking purposes.
        You should be querying this information from your backend.
      */
      const latestVersion = new Date(Date.now()).toISOString();
      await ingestChannelLineup(latestVersion, channelProgressCallback);
      console.info(
        '[LiveForceSync.tsx] - ingestLineup -Channel ingestion complete',
      );
      await ingestProgramLineup(latestVersion, programProgressCallback);
      setIsInProgress(false);
      await new Promise((resolve) => setTimeout(resolve, TIME_TO_LEAVE_APP));
      BackHandler.exitApp();
    } catch (error) {
      setIsInProgress(false);
      setFailed(true);
    }
  };

  useEffect(() => {
    /*
      NOTE: If the customer is not entitled to any channels, re-route to your app's login screen.
      Otherwise, call your ingestion logic to push your latest EPG data.
      You should add your own business logic to manage the user session before calling the ingestLineup function.
    */

    ingestLineup();
    console.info('[LiveForceSync.tsx] - useEffect - ingestLineup called');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.container}>
      {isInProgress ? (
        <>
          <Text style={styles.title}>Updating Channel Info</Text>
          <Text style={styles.text}>
            This may take a few minutes, please do not leave this screen{' '}
          </Text>
          <ActivityIndicator style={styles.activityIndicator} />
          <View style={styles.progressBar}>
            <View
              style={{ backgroundColor: COLORS.BLUE, width: `${progress}%` }}
            />
          </View>
        </>
      ) : (
        <>
          {failed ? (
            <>
              <Text style={styles.title}>Channel Update Failed</Text>
              <Text style={styles.text}>Please try again later</Text>
            </>
          ) : (
            <>
              <Text style={styles.title}>Channel Sync Complete</Text>
              <Text style={styles.text}>This screen will exit shortly</Text>
            </>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BLACK,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: COLORS.WHITE,
    fontSize: scaleUxToDp(70),
    margin: scaleUxToDp(10),
  },
  text: {
    color: COLORS.WHITE,
    fontSize: scaleUxToDp(26),
    margin: scaleUxToDp(10),
  },
  progressBar: {
    height: scaleUxToDp(20),
    width: '50%',
    flexDirection: 'row',
    backgroundColor: COLORS.WHITE,
    borderColor: COLORS.BLACK,
    borderWidth: 2,
    borderRadius: scaleUxToDp(5),
  },
  activityIndicator: {
    padding: scaleUxToDp(20),
  },
});

export default LiveForceSync;
