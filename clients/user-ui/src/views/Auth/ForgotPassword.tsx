import styles from "../../utils/styles";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useMutation, useQuery } from "@apollo/client";
import { FORGOT_PASSWORD } from "@/src/graphql/actions/forgot-password.action";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email!"),
});

type ForgotPasswordSchema = z.infer<typeof formSchema>;

const ForgotPassword = ({
  setActiveState,
}: {
  setActiveState: (e: string) => void;
}) => {
  const [forgotPassword, { loading }] = useMutation(FORGOT_PASSWORD);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: ForgotPasswordSchema) => {
    try {
      await forgotPassword({
        variables: {
          email: data.email,
        },
      });
      toast.success("Check your email for password reset link!");
      reset();
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <div className="py-3 px-10">
      <h1 className={`${styles.title}`}>Forgot your password?</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="py-5">
        <div className="py-2">
          <label className={`${styles.label}`}>Enter your Email</label>
          <input
            {...register("email")}
            type="email"
            placeholder="abcdefg@gmail.com"
            className={`${styles.input}`}
          />
          {errors.email && (
            <span className="text-red-500 block mt-1">
              {`${errors.email.message}`}
            </span>
          )}
        </div>
        <div className="w-full flex justify-center mt-5">
          <input
            type="submit"
            value="Submit"
            disabled={isSubmitting || loading}
            className="my-button-styles w-2/5 mt-3"
          />
        </div>
        <h5 className="text-center pt-4 font-Poppins text-[14px]">
          Or Go Back to
          <span
            className="text-[#1de9b6] pl-1 cursor-pointer"
            onClick={() => setActiveState("Login")}
          >
            Login
          </span>
        </h5>
      </form>
    </div>
  );
};

export default ForgotPassword;
