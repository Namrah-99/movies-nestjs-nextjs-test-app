import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import styles from "@/src/utils/styles";

const formSchema = z.object({
  value: z.number().min(1, "Rate movie (1-5)!").max(5, "Rate movie (1-5)!"),
});

type RateMovieSchema = z.infer<typeof formSchema>;

const RateMovie = ({
  setOpen,
  selectedMovie,
  user,
}: {
  setOpen: (e: boolean) => void;
  selectedMovie: any;
  user: any;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RateMovieSchema>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: RateMovieSchema) => {
    toast.success(`Rated Movie Successfull! ${data.value}`);
    reset();
    // const loginData = {
    //   email: data.email,
    //   password: data.password,
    // };
    // console.log("loginn");
    // const response = await Login({
    //   variables: loginData,
    // });
    // console.log("response.data.Login.user : ", response.data.Login.user);
    // if (response.data.Login.user) {
    //   toast.success("Login Successfull!");
    //   Cookies.set("refresh_token", response.data.Login.refreshToken);
    //   Cookies.set("access_token", response.data.Login.accessToken);
    //   setOpen(false);
    //   reset();
    //   window.location.reload();
    // } else {
    //   toast.error(response.data.Login.error.message);
    // }
  };

  const handleClose = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target instanceof HTMLDivElement && e.target.id === "screen") {
      setOpen(false);
    }
  };

  return (
    <div
      className="w-full fixed top-0 left-0 h-screen z-50 flex items-center justify-center bg-[#4f5b7927]"
      id="screen"
      onClick={handleClose}
    >
      <div className="w-[500px] bg-[#0A0713] rounded shadow-sm p-5">
        <h2 className="text-white text-2xl font-bold">
          Movie ({selectedMovie?.title})
        </h2>
        <form className="mt-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col m-6">
            <label htmlFor="value" className={`${styles.label} text-white`}>
              Rate movie (1-5) {}
            </label>
            <input
              id="value"
              {...register("value", { valueAsNumber: true })}
              type="number"
              min="1"
              max="5"
              placeholder="rate (1-5)"
              className={`${styles.input}`}
            />
            {errors.value && (
              <span className="text-red-500 block mt-1">
                {`${errors.value.message}`}
              </span>
            )}
          </div>

          <div className="w-full flex justify-center mt-5">
            <button
              type="submit"
              disabled={isSubmitting}
              className="my-button-styles m-3"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RateMovie;
