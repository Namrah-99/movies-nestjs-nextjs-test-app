import useRecommendedMovies from "@/src/hooks/useRecommendedMovies";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import RateMovie from "./RateMovie";

const Movies = () => {
  const [openRatingForm, setOpenRatingForm] = useState(false);
  const [selectedMovie, setselectedMovie] = useState(null);
  const { recommendedMovies, user, loading } = useRecommendedMovies();
  if (loading) return <p>Loading...</p>;
  if (!recommendedMovies) return <p>No recommended movies found.</p>;
  console.log(recommendedMovies);

  const calculateAverageRating = (ratings: any) => {
    const totalRatings = ratings.reduce(
      (sum: number, rating: any) => sum + rating.value,
      0
    );
    return totalRatings / ratings.length;
  };

  const renderStars = (averageRating: any) => {
    const fullStars = Math.floor(averageRating);
    return (
      <svg
        width="100"
        height="20"
        viewBox="0 0 100 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        {Array.from({ length: fullStars }, (_, index) => (
          <polygon
            key={index}
            points="10,1 12,7 18,7 13,11 15,18 10,14 5,18 7,11 2,7 8,7"
            fill="#FFD700"
            transform={`translate(${index * 20}, 0)`}
          />
        ))}
      </svg>
    );
  };

  return (
    <div className="text-gray-400 bg-pattern body-font overflow-hidden">
      <div className="container px-5 py-24 mx-auto">
        <div className="flex flex-wrap gap-y-10 m-12">
          {recommendedMovies.map((rec_movie: any, index: number) => (
            <div
              key={`${index}${rec_movie.id}`}
              className="p-12 md:w-1/2 flex flex-col items-start "
            >
              <div className="flex flex-row gap-4">
                <span className="inline py-1 px-2 rounded bg-gray-200 text-gray-900 text-opacity-75 text-xs font-medium tracking-widest">
                  {rec_movie?.movie?.category?.name || "Category"}
                </span>
              </div>
              <h2 className="sm:text-3xl text-2xl title-font font-medium text-white mt-4 mb-4">
                {rec_movie?.movie?.title || "Movie Title"}
              </h2>
              <p className="leading-relaxed mb-8">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Maiores, voluptas consectetur ratione sed, accusamus facere
                alias, quidem voluptate vero voluptates reprehenderit
                asperiores! Commodi, cupiditate accusamus!
              </p>
              <div className="flex items-center flex-wrap pb-4 mb-4 border-b-1 border-black-800 border-opacity-75 mt-auto w-full">
                <Link
                  href=""
                  className="text-[#2dffc4] inline-flex items-center"
                  onClick={() => {
                    setselectedMovie(rec_movie?.movie);
                    setOpenRatingForm(!openRatingForm);
                  }}
                >
                  Rate Movie
                  <svg
                    className="w-4 h-4 ml-2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14"></path>
                    <path d="M12 5l7 7-7 7"></path>
                  </svg>
                </Link>
                <span className="text-gray-500 mr-3 inline-flex items-center ml-auto leading-none text-sm pr-3 py-1">
                  {renderStars(
                    calculateAverageRating(rec_movie?.movie?.ratings)
                  )}
                </span>
              </div>
              <a className="inline-flex items-center">
                <Image
                  alt="filmmaker"
                  src="https://dummyimage.com/104x104"
                  className="w-12 h-12 rounded-full flex-shrink-0 object-cover object-center"
                  width={48}
                  height={48}
                />
                <span className="flex-grow flex flex-col pl-4">
                  <span className="title-font font-medium text-white">
                    Director
                  </span>
                  <span className="text-gray-500 text-xs tracking-widest mt-0.5">
                    William Shatner
                  </span>
                </span>
              </a>
            </div>
          ))}
        </div>
      </div>
      {openRatingForm && (
        <RateMovie
          setOpen={setOpenRatingForm}
          selectedMovie={selectedMovie}
          user={user}
        />
      )}
    </div>
  );
};

export default Movies;
