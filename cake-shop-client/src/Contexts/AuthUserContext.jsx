import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { createContext, useContext } from "react";
import { auth } from "../firebase";

const authusercontext = createContext();

export function AuthUserContextProvider({ children }) {
  function reCaptcha(number) {
    const recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      {}
    );
    recaptchaVerifier.render();
    return signInWithPhoneNumber(auth,number,recaptchaVerifier);

  }
  return (
    <authusercontext.Provider value={{ reCaptcha }}>
      {children}
    </authusercontext.Provider>
  );
}

export function useAuthContext() {
  return useContext(authusercontext);
}