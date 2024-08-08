"use client";

import AuthContext from "@/contextApi/AuthProvider";
import { yupResolver } from "@hookform/resolvers/yup";
import { useContext, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is Required"),
});

export default function Home() {
  const [type, setType] = useState("Login");
  const authContext = useContext(AuthContext);

  if (!authContext) {
    return null;
  }

  const { register, login } = authContext;

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleRegister = (data: { email: string; password: string }) => {
    register(data.email, data.password);
  };

  const handleLogin = (data: { email: string; password: string }) => {
    login(data.email, data.password);
  };

  const onSubmit = (data: { email: string; password: string }) => {
    if (type === "Register") {
      handleRegister(data);
    } else {
      handleLogin(data);
    }
  };

  return (
    <div className="flex justify-center items-center bg-slate-900 min-h-screen w-full">
      <div className="bg-slate-700 rounded-md p-8 w-[25%] flex flex-col items-center justify-center">
        <h1 className="text-white text-xl text-bold">{type}</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-8 pb-4 w-full mt-4"
        >
          <div>
            <h1 className="text-base text-gray-400 ml-1 mb-1">Email :</h1>
            <Controller
              name="email"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <input
                  {...field}
                  placeholder="Enter E-mail"
                  className="w-full p-5 outline-none border-[2px] border-gray-200 rounded-lg"
                />
              )}
            />
            {errors.email && (
              <p className="text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div>
            <h1 className="text-base text-gray-400 ml-1 mb-1">Password :</h1>
            <Controller
              name="password"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <input
                  {...field}
                  placeholder="Enter Password"
                  className="w-full p-5 outline-none border-[2px] border-gray-200 rounded-lg"
                />
              )}
            />
            {errors.password && (
              <p className="text-red-500">{errors.password.message}</p>
            )}
          </div>

          <div className="flex justify-center mt-3">
            <button
              type="submit"
              className="p-2 px-4 bg-green-400 text-white rounded-lg"
            >
              {type === "Login" ? "Login" : "Sign Up"}
            </button>
          </div>
        </form>

        {type == "Login" ? (
          <div className="flex items-center justify-center">
            <h1 className="text-white">Not a Existing User ?</h1>
            <button
              className="text-blue-400 ml-2"
              onClick={() => setType("Register")}
            >
              Sign Up
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <h1 className="text-white">Already a User ?</h1>
            <button
              className="text-blue-400 ml-2"
              onClick={() => setType("Login")}
            >
              Log In
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
