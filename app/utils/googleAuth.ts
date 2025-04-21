// utils/googleAuth.ts
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { ResponseType } from 'expo-auth-session';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '../services/firebase';

WebBrowser.maybeCompleteAuthSession();

export const promptAsync = async () => {
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: '673383246167-iqctfht9kbhqpb0qk77u997m1s2knqbk.apps.googleusercontent.com',
    // iosClientId: 'YOUR_IOS_CLIENT_ID',
    // androidClientId: 'YOUR_ANDROID_CLIENT_ID',
    responseType: ResponseType.Token,
  });

  const result = await promptAsync();
  if (result?.type !== 'success') {
    throw new Error('Google sign-in was cancelled');
  }

  const credential = GoogleAuthProvider.credential(result.params.id_token);
  return await signInWithCredential(auth, credential);
};