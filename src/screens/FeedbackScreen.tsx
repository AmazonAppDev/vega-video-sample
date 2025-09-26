import { Button, Header } from '@amazon-devices/kepler-ui-components';
import LinearGradient from '@amazon-devices/react-linear-gradient';
import { Formik } from 'formik';
import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import * as Yup from 'yup';
import { AppStackScreenProps, Screens } from '../components/navigation/types';
import { COLORS } from '../styles/Colors';
import { scaleUxToDp } from '../utils/pixelUtils';

const FeedbackSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Name is too short')
    .max(30, 'Name is too long')
    .required('Required'),
  email: Yup.string()
    .matches(
      /^[a-zA-Z0-9]([a-zA-Z0-9._%-]*[a-zA-Z0-9])?@[a-zA-Z0-9]([a-zA-Z0-9.-]*[a-zA-Z0-9])?\.[a-zA-Z]{2,}$/,
      'Invalid email format',
    )
    .required('Required'),
  feedback: Yup.string().min(5, 'Feedback is too short').required('Required'),
});

const FeedBackScreen = ({
  navigation,
}: AppStackScreenProps<Screens.FEEDBACK_SCREEN>) => {
  return (
    <View style={styles.container} testID="settings-main-view">
      <LinearGradient
        testID={`${COLORS.GRAY}-${COLORS.DARK_GRAY}-${COLORS.DARK_GRAY}-${COLORS.BLACK}`}
        colors={[
          COLORS.GRAY,
          COLORS.DARK_GRAY,
          COLORS.DARK_GRAY,
          COLORS.BLACK,
        ]}>
        <View style={styles.headerStyle}>
          <Header
            iconSize={44}
            title={''}
            titleAlignment={'start'}
            titleSize="lg"
            titleVariant="headline"
            headerColor={COLORS.WHITE}
            backIconFocusedStyle={styles.headerBackIconStyle}
            onBackPress={() => navigation.goBack()}
            testID="detail-header"
          />
        </View>
        <View style={styles.linearGradient}>
          <Text style={styles.title}>Feedback</Text>
          <Formik
            initialValues={{ name: '', email: '', feedback: '' }}
            validationSchema={FeedbackSchema}
            onSubmit={() => {
              // handle form submission
              navigation.goBack();
            }}>
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
            }) => (
              <View style={styles.formikBlock}>
                <TextInput
                  style={styles.input}
                  onChangeText={handleChange('name')}
                  onBlur={handleBlur('name')}
                  value={values.name}
                  placeholder="Name"
                  testID="form-name"
                />
                {errors.name && touched.name ? (
                  <Text style={styles.errorText} testID="form-error-name">
                    {errors.name}
                  </Text>
                ) : null}
                <TextInput
                  style={styles.input}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  value={values.email}
                  placeholder="Email"
                  keyboardType="email-address"
                  testID="form-email"
                />
                {errors.email && touched.email ? (
                  <Text style={styles.errorText} testID="form-error-email">
                    {errors.email}
                  </Text>
                ) : null}
                <TextInput
                  style={styles.input}
                  onChangeText={handleChange('feedback')}
                  onBlur={handleBlur('feedback')}
                  value={values.feedback}
                  placeholder="Feedback"
                  multiline
                  testID="form-feedback"
                />
                {errors.feedback && touched.feedback ? (
                  <Text style={styles.errorText} testID="form-error-feedback">
                    {errors.feedback}
                  </Text>
                ) : null}
                <Button
                  label="Submit"
                  onPress={() => {
                    handleSubmit();
                  }}
                  variant="secondary"
                  mode="contained"
                  testID="form-submit"
                  style={styles.submit}
                />
              </View>
            )}
          </Formik>
        </View>
      </LinearGradient>
    </View>
  );
};

export default React.memo(FeedBackScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BLACK,
  },
  formikBlock: {
    justifyContent: 'center',
  },
  title: {
    color: COLORS.SMOKE_WHITE,
    fontSize: 60,
    marginTop: 20,
    marginBottom: 30,
    alignSelf: 'center',
  },
  linearGradient: {
    borderRadius: 5,
    justifyContent: 'flex-start',
    paddingHorizontal: '30%',
  },
  input: {
    height: 80,
    borderColor: 'white',
    borderBottomWidth: 1,
    marginVertical: 15,
    padding: 10,
    width: '100%',
    alignSelf: 'center',
    color: 'white',
    fontSize: 36,
  },
  errorText: {
    color: 'red',
    fontSize: 25,
  },
  submit: { marginTop: scaleUxToDp(30) },
  headerStyle: {
    height: scaleUxToDp(150),
    width: '100%',
    justifyContent: 'center',
    marginLeft: scaleUxToDp(20),
  },
  headerBackIconStyle: {
    borderColor: COLORS.ORANGE,
    borderWidth: 2,
    borderRadius: scaleUxToDp(33),
    padding: scaleUxToDp(10),
  },
});
