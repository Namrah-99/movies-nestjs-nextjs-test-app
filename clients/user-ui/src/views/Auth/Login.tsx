import { useState } from "react";
import styles from "../../utils/styles";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useMutation } from "@apollo/client";
import { LOGIN_USER } from "@/src/graphql/actions/login.action";
import Cookies from "js-cookie";
// import { signIn } from "next-auth/react";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters long!"),
});

type LoginSchema = z.infer<typeof formSchema>;

const Login = ({
  setActiveState,
  setOpen,
}: {
  setActiveState: (e: string) => void;
  setOpen: (e: boolean) => void;
}) => {
  const [Login, { loading }] = useMutation(LOGIN_USER);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LoginSchema>({
    resolver: zodResolver(formSchema),
  });
  const [show, setShow] = useState(false);

  const onSubmit = async (data: LoginSchema) => {
    const loginData = {
      email: data.email,
      password: data.password,
    };
    console.log("loginn");
    const response = await Login({
      variables: loginData,
    });
    console.log("response.data.Login.user : ", response.data.Login.user);
    if (response.data.Login.user) {
      toast.success("Login Successfull!");
      Cookies.set("refresh_token", response.data.Login.refreshToken);
      Cookies.set("access_token", response.data.Login.accessToken);
      setOpen(false);
      reset();
      window.location.reload();
    } else {
      toast.error(response.data.Login.error.message);
    }
  };

  return (
    <div className="py-5 px-10">
      <h1 className={`${styles.title}`}>Login</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label className={`${styles.label}`}>Enter your Email</label>
        <input
          {...register("email")}
          type="email"
          placeholder="loginmail@gmail.com"
          className={`${styles.input}`}
        />
        {errors.email && (
          <span className="text-red-500 block mt-1">
            {`${errors.email.message}`}
          </span>
        )}
        <div className="w-full mt-5 relative mb-1">
          <label htmlFor="password" className={`${styles.label}`}>
            Enter your password
          </label>
          <input
            {...register("password")}
            type={!show ? "password" : "text"}
            placeholder="password!@%"
            className={`${styles.input}`}
          />
          {!show ? (
            <AiOutlineEyeInvisible
              className="absolute bottom-3 right-2 z-1 cursor-pointer"
              size={20}
              onClick={() => setShow(true)}
            />
          ) : (
            <AiOutlineEye
              className="absolute bottom-3 right-2 z-1 cursor-pointer"
              size={20}
              onClick={() => setShow(false)}
            />
          )}
        </div>
        {errors.password && (
          <span className="text-red-500">{`${errors.password.message}`}</span>
        )}
        <div className="w-full mt-5">
          <span
            className={`text-[#1de9b6] block text-right cursor-pointer`}
            onClick={() => setActiveState("Forgot-Password")}
          >
            Forgot your password?
          </span>
          <div className="w-full flex justify-center mt-5">
            <input
              type="submit"
              value="Login"
              disabled={isSubmitting || loading}
              className="my-button-styles w-2/5 mt-3"
            />
          </div>
        </div>
        <br />
        <h5 className="text-center pt-4 font-Poppins text-[14px]">
          Not have any account?
          <span
            className="text-[#1de9b6] pl-1 cursor-pointer"
            onClick={() => setActiveState("Signup")}
          >
            Sign up
          </span>
        </h5>
        <br />
      </form>
    </div>
  );
};

export default Login;
