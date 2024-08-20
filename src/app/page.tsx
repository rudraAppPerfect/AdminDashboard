"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";
import jwt from "jsonwebtoken";
import { UserContext, UserContextType } from "@/contextApi/UserState";
import { User } from "./users/page";

const schema = z.object({
  email: z.string().email("Invalid email").min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});

type FormData = z.infer<typeof schema>;

export default function Home() {
  const [type, setType] = useState("Login");

  const { push } = useRouter();

  const context = useContext(UserContext);
  const { setUser } = context as UserContextType;

  useEffect(() => {
    const jwtToken = localStorage.getItem("token");
    if (jwtToken) {
      try {
        const decodedUser = jwt.verify(
          jwtToken,
          process.env.NEXT_PUBLIC_JWT_SECRET as string
        );
        setUser(decodedUser as User);
        push("/users");
      } catch (error) {
        console.error("Invalid token");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const handleRegister = async (data: FormData) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_HOST}/api/register`,
        {
          email: data.email,
          password: data.password,
        }
      );
      console.log(response.data);
      localStorage.setItem("token", response.data.token);
      const decodedUser = jwt.verify(
        response.data.token as string,
        process.env.NEXT_PUBLIC_JWT_SECRET as string
      );
      console.log("dUser: ", decodedUser);
      setUser(decodedUser as User);
      push("/users");
    } catch (error) {
      let message;
      if (axios.isAxiosError(error) && error.response) {
        message = error.response.data.message;
      } else message = String(error);
      toast.error(message);
    }
  };

  const handleLogin = async (data: FormData) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_HOST}/api/login`,
        {
          email: data.email,
          password: data.password,
        }
      );
      console.log(response.data);
      localStorage.setItem("token", response.data.token);
      const decodedUser = jwt.verify(
        response.data.token,
        `${process.env.NEXT_PUBLIC_JWT_SECRET}`
      );
      setUser(decodedUser as User);
      push("/users");
    } catch (error) {
      let message;
      if (axios.isAxiosError(error) && error.response) {
        message = error.response.data.message;
      } else message = String(error);
      toast.error(message);
    }
  };

  const onSubmit = (data: FormData) => {
    if (type === "Register") {
      handleRegister(data);
    } else {
      handleLogin(data);
    }
  };

  return (
    <div className="flex justify-center items-center bg-slate-900 min-h-screen w-full">
      <div className="bg-slate-700 rounded-md p-8 w-[75%] min-[1100px]:w-[25%] flex flex-col items-center justify-center">
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
              <p className="text-red-500">{errors.email.message?.toString()}</p>
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
                  type="password"
                  autoComplete="on"
                  placeholder="Enter Password"
                  className="w-full p-5 outline-none border-[2px] border-gray-200 rounded-lg"
                />
              )}
            />
            {errors.password && (
              <p className="text-red-500">
                {errors.password.message?.toString()}
              </p>
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
              onClick={() => {
                setType("Register");
                setValue("email", "");
                setValue("password", "");
              }}
            >
              Sign Up
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <h1 className="text-white">Already a User ?</h1>
            <button
              className="text-blue-400 ml-2"
              onClick={() => {
                setType("Login");
                setValue("email", "");
                setValue("password", "");
              }}
            >
              Log In
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
