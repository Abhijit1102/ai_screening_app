import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserSchema, UserFormData } from "../model/UserFormSchema";
import { useNavigate } from "react-router-dom";

const UserForm: React.FC = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UserFormData>({
    resolver: zodResolver(UserSchema),
  });

  const onSubmit = async (data: UserFormData) => {
    try {
      const res = await fetch(
        `http://localhost:8000/api/v1/user/?email=${encodeURIComponent(data.email)}`
      );

      if (res.ok) {
        const user = await res.json();
        console.log("User already exists:", user);
        const id = user.data._id;
        navigate(`/user/${id}`);
      } else if (res.status === 404) {
        const createRes = await fetch("http://localhost:8000/api/v1/user/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (createRes.ok) {
          const created = await createRes.json();
          console.log("User created:", created);
          const id = created.data._id;
          navigate(`/user/${id}`);
        } else {
          const err = await createRes.json();
          alert(`Failed to create user: ${err.detail}`);
        }
      } else {
        const err = await res.json();
        alert(`Error: ${err.detail}`);
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      reset();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-md rounded-lg p-6 w-full max-w-2xl space-y-5"
      >
       <div className="bg-blue-50 border border-blue-200 rounded-xl shadow-sm p-6 my-8">
        <h2 className="text-3xl font-bold text-center text-blue-900">
          📝 Pre-Consultation Questionnaire
        </h2>
        <p className="text-center text-sm text-blue-700 mt-2">
          Help us understand you better — this won't take long.
        </p>
      </div>

        <div>
          <label className="block font-medium mb-1">Name</label>
          <input
            {...register("name")}
            className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block font-medium mb-1">Age</label>
          <input
            type="number"
            {...register("age", { valueAsNumber: true })}
            className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.age && (
            <p className="text-red-500 text-sm mt-1">{errors.age.message}</p>
          )}
        </div>

        <div>
          <label className="block font-medium mb-1">Gender</label>
          <select
            {...register("gender")}
            className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Trans">Trans</option>
          </select>
          {errors.gender && (
            <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>
          )}
        </div>

        <div>
          <label className="block font-medium mb-1">Email</label>
          <input
            type="email"
            {...register("email")}
            className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded w-full transition-colors"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default UserForm;
