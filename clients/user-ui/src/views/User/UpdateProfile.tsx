"use client";

import React, { useState, ChangeEvent, DragEvent } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import styles from "@/src/utils/styles";
import Image from "next/image";
import { useMutation } from "@apollo/client";
import { UPDATE_USER_PROFILE } from "@/src/graphql/actions/update-user-profile.action";

const formSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters long!")
    .optional(),
  phone_number: z
    .number()
    .min(10, "Phone number must be at least 11 characters!")
    .optional(),
  address: z.string().optional(),
  image: z.string().optional(),
  dob: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date format",
    })
    .optional(),
  categories: z.array(z.string()).optional(),
});

type UpdateProfileSchema = z.infer<typeof formSchema>;

const UpdateProfile = () => {
  const [updateProfile, { loading }] = useMutation(UPDATE_USER_PROFILE);
  const [dragging, setDragging] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    watch,
    register,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<UpdateProfileSchema>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: UpdateProfileSchema) => {
    try {
      if (data.dob) {
        data.dob = new Date(data.dob).toISOString();
      }
      data.categories = data.categories || [];

      const result = await updateProfile({
        variables: {
          name: data.name,
          phone_number: data.phone_number,
          address: data.address,
          image: data.image,
          dob: data.dob,
          //   categories: data.categories,
          categories: [
            "clwxtyl1f0000pshwhmzkeg5e",
            "clwxtyl1g0002pshw9rqmylcw",
          ],
        },
      });
      console.log(result.data);
      toast.success("Profile Updated successfully!");
    } catch (error: any) {
      if (error.name === "ApolloError") {
        toast.error("Image size should be less than 50MB");
      } else {
        toast.error(error.message);
      }
    }
  };

  const handleDragOver = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleImageDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setValue("image", reader.result as string);
        }
      };

      reader.readAsDataURL(file);
    }
  };

  const handleImageFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setValue("image", reader.result as string);
        }
      };

      reader.readAsDataURL(file);
    }
  };

  const imageUrl = watch("image") || "";

  return (
    <div className="bg-pattern flex items-center justify-center p-5">
      <div className="w-3/5">
        <h1 className={`${styles.title}`}>Update Profile</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="label mt-3">Upload Food image</label>
            <div className="w-full">
              <input
                type="file"
                required
                accept="image/*"
                id="file"
                className="hidden"
                onChange={handleImageFileChange}
              />
              <label
                htmlFor="file"
                className={`w-full mt-2 rounded-md min-h-[15vh] border-[#1de9b6] p-3 border flex items-center justify-center ${
                  dragging ? "bg-[#1de9b6]" : "bg-transparent"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleImageDrop}
              >
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt="Food Image"
                    width={300}
                    height={300}
                    className="w-full md:w-[48%] object-cover md:m-2 my-2"
                  />
                ) : (
                  <span className="text-white">
                    Drag and drop your food image here or click to browse
                  </span>
                )}
              </label>
            </div>
          </div>
          {imagePreview && (
            <div className="mt-3">
              <Image
                src={imagePreview}
                alt="Profile Image"
                width={100}
                height={100}
              />
            </div>
          )}
          <div className="w-full relative mb-3">
            <label className={`${styles.label}`}>Enter your Name</label>
            <input
              {...register("name")}
              type="text"
              placeholder="namrah**"
              className={`${styles.input}`}
            />
          </div>
          <label className={`${styles.label}`}>Enter your Address</label>
          <input
            {...register("address")}
            type="text"
            placeholder="address"
            className={`${styles.input}`}
          />
          {errors.address && (
            <span className="text-red-500 block mt-1">
              {`${errors.address.message}`}
            </span>
          )}
          <div className="w-full relative mt-3">
            <label className={`${styles.label}`}>Enter your Phone Number</label>
            <input
              {...register("phone_number", { valueAsNumber: true })}
              type="number"
              placeholder="+92*********"
              className={`${styles.input}`}
            />
            {errors.phone_number && (
              <span className="text-red-500 block mt-1">
                {`${errors.phone_number.message}`}
              </span>
            )}
          </div>
          <div className="w-full relative mt-3">
            <label className={`${styles.label}`}>
              Enter your Date of Birth
            </label>
            <input
              {...register("dob")}
              type="date"
              className={`${styles.input}`}
            />
            {errors.dob && (
              <span className="text-red-500 block mt-1">
                {errors.dob.message}
              </span>
            )}
          </div>

          <div className="w-full relative mb-3">
            <label className={`${styles.label}`}>Select Categories</label>
            <select
              {...register("categories")}
              multiple
              className={`${styles.input} h-auto`}
            >
              <option value="ACTION">Action</option>
              <option value="HORROR">Horror</option>
              <option value="COMEDY">Comedy</option>
              <option value="ANIMATED">Animated</option>
            </select>
            {errors.categories && (
              <span className="text-red-500 block mt-1">
                {`${errors.categories.message}`}
              </span>
            )}
          </div>

          <div className="w-full flex justify-center mt-5">
            <input
              type="submit"
              value="Update User Data"
              disabled={isSubmitting}
              className={`my-button-styles mt-3`}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;
