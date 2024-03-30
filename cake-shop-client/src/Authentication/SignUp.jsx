import React, { useState } from "react";
import LOGO from "../visuals/imgs/LOGO.png";
import { Link } from "react-router-dom";
import "react-phone-number-input/style.css";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import PhoneInput from "react-phone-number-input";

const SignUp = () => {
  // for phone number
  const [number, setNumber] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirm_password, setConfirm_Password] = useState("");
  const [seepassword, set_See_Password] = useState(true);
  const [see_confirm_password, set_See_Confirm_Password] = useState(true);
  const [flag, set_Flag] = useState(true);
  const [otp, setOTP] = useState("");

  const [confirmobj, setConfirmObj] = useState("");

  return (
    <div>
      <div>
        <div
          className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8"
          style={{ display: flag ? "block" : "none" }}
        >
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img
              className="mx-auto h-24 w-auto"
              src={LOGO}
              alt="Your Company"
            />
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Create your account
            </h2>
          </div>

          <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
            <form className="space-y-6" action="#" method="POST">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Phone Number
                </label>
                <div className="mt-2">
                  <PhoneInput
                    defaultCountry="IN"
                    value={number}
                    onChange={setNumber}
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Full Name
                </label>
                <div className="mt-1">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Password
                  </label>
                </div>
                <div className="mt-1 flex items-center ">
                  <input
                    id="password"
                    name="password"
                    type={seepassword ? "password" : "text"}
                    pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                    title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
                    required
                    className="block w-5/6 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  {seepassword ? (
                    <BsEyeFill
                      className="flex justify-center items-center ml-2"
                      onClick={() =>
                        seepassword
                          ? set_See_Password(false)
                          : set_See_Password(true)
                      }
                    />
                  ) : (
                    <BsEyeSlashFill
                      onClick={() =>
                        seepassword
                          ? set_See_Password(false)
                          : set_See_Password(true)
                      }
                    />
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Confirm Password
                  </label>
                </div>
                <div className="mt-1 flex items-center">
                  <input
                    id="confirm password"
                    name="confirm password"
                    type={see_confirm_password ? "password" : "text"}
                    pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                    title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
                    required
                    className="block w-5/6 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  {see_confirm_password ? (
                    <BsEyeFill
                      className="flex justify-center items-center ml-2"
                      onClick={() =>
                        see_confirm_password
                          ? set_See_Confirm_Password(false)
                          : set_See_Confirm_Password(true)
                      }
                    />
                  ) : (
                    <BsEyeSlashFill
                      onClick={() =>
                        see_confirm_password
                          ? set_See_Confirm_Password(false)
                          : set_See_Confirm_Password(true)
                      }
                    />
                  )}
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-gray-green px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                >
                  Verify Phone Number
                </button>
              </div>
            </form>

            <p className="mt-10 text-center text-sm text-gray-500">
              Have an Account?{" "}
              <Link
                to="/login"
                className="font-semibold leading-6 text-gray-green hover:text-blue-600 "
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* // Otp component */}

      <div>
        <div>
          <div
            className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8"
            style={{ display: flag ? "none" : "block" }}
          >
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
              <img
                className="mx-auto h-24 w-auto"
                src={LOGO}
                alt="Your Company"
              />
              <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                Verify Your Phone Number
              </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
              <form className="space-y-6" action="#" method="POST">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Enter OTP
                  </label>
                  <div className="mt-2">
                    <input
                      id="otp"
                      name="otp"
                      type="text"
                      required
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-gray-green px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Create an Account
                  </button>
                </div>
              </form>

              <p className="mt-10 text-center text-sm text-gray-500">
                <Link
                  to="/signup"
                  className="font-semibold leading-6 text-gray-green hover:text-blue-600 "
                >
                  Resend OTP
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
