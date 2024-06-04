import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import styles from "@/src/utils/styles";
import { useMutation } from "@apollo/client";
import { RATE_MOVIE_FROM_USER } from "@/src/graphql/actions/rate-movie.action";

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
  const [rateMovieFromUser, { loading }] = useMutation(RATE_MOVIE_FROM_USER);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RateMovieSchema>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: RateMovieSchema) => {
    console.log("Rating movie...", data.value, selectedMovie.id, user.id);
    try {
      const response = await rateMovieFromUser({
        variables: {
          value: data.value,
          userId: user.id,
          movieId: selectedMovie.id,
        },
      });
      console.log("Mutation response:", response.data);
      toast.success(`Rated Movie Successfull! ${data.value}`);
      setOpen(false);
      reset();
      window.location.reload();
    } catch (error) {
      console.error("Error rating movie:", error);
      // toast.error(error.message);
    }
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
              disabled={isSubmitting || loading}
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
