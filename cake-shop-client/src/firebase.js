import {initializeApp} from 'firebase/app';
import {getAuth} from 'firebase/auth';


const firebaseConfig = {
  apiKey: "AIzaSyAmvh5P0M9ZO9yaPpLHtbkzYW6fMjd1JjI",
  authDomain: "cake-shop-61ea4.firebaseapp.com",
  projectId: "cake-shop-61ea4",
  storageBucket: "cake-shop-61ea4.appspot.com",
  messagingSenderId: "32727514762",
  appId: "1:32727514762:web:86235d5478024cf6bff773"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
