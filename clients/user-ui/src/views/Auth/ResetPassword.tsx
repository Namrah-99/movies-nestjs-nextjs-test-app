"use client";
import { useState } from "react";
import styles from "../../utils/styles";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useMutation } from "@apollo/client";
import { RESET_PASSWORD } from "@/src/graphql/actions/reset-password.action";
import { useRouter } from "next/navigation";

const formSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters long!"),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters long!"),
  })
  .refine(
    (values) => {
      return values.password === values.confirmPassword;
    },
    {
      message: "Passwords must match",
      path: ["confirmPassword"],
    }
  );

type ResetPwdSchema = z.infer<typeof formSchema>;

const ResetPassword = ({
  activationToken,
}: {
  activationToken: string | string[];
}) => {
  const router = useRouter();
  const [resetPassword, { loading }] = useMutation(RESET_PASSWORD);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ResetPwdSchema>({
    resolver: zodResolver(formSchema),
  });
  const [show, setShow] = useState(false);
  const [confirmPwdShow, setConfirmPwdShow] = useState(false);

  const onSubmit = async (data: ResetPwdSchema) => {
    try {
      const response = await resetPassword({
        variables: {
          activationToken,
          password: data.password,
        },
      });
      toast.success("Password reset successfully");
      reset();
      router.push("/");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="w-full flex justify-center items-center h-screen">
      <div className="md:w-[500px] w-full py-5 px-10">
        <h1 className={`${styles.title}`}>Reset Password</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="w-full mt-5 relative mb-1">
            <label htmlFor="password" className={`${styles.label}`}>
              Enter your password
            </label>
            <input
              {...register("password")}
              type={!show ? "password" : "text"}
              placeholder="password@!#&$"
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
          <div className="w-full mt-5 relative mb-1">
            <label htmlFor="password" className={`${styles.label}`}>
              Enter your confirm password
            </label>
            <input
              {...register("confirmPassword")}
              type={!confirmPwdShow ? "password" : "text"}
              placeholder="password@!#&$"
              className={`${styles.input}`}
            />
            {!confirmPwdShow ? (
              <AiOutlineEyeInvisible
                className="absolute bottom-3 right-2 z-1 cursor-pointer"
                size={20}
                onClick={() => setConfirmPwdShow(true)}
              />
            ) : (
              <AiOutlineEye
                className="absolute bottom-3 right-2 z-1 cursor-pointer"
                size={20}
                onClick={() => setConfirmPwdShow(false)}
              />
            )}
          </div>
          {errors.confirmPassword && (
            <span className="text-red-500">{`${errors.confirmPassword.message}`}</span>
          )}
          <br />
          <div className="w-full flex justify-center mt-5">
            <input
              type="submit"
              value="Reset"
              disabled={isSubmitting || loading}
              className="my-button-styles w-2/5 mt-3"
            />
          </div>
          <br />
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
