"use client";
//使用useState 請更改client端
import { useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";

export default function CreatePage() {
  //沒有搞懂要blank的用意
  const [formData, setFormData] = useState({ task: "", description: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prevData) => ({
      ...prevData,
      //e.target.name 就是task
      [e.target.name]: e.target.value,
    }));
    //console.log("這裡是data", formData);
    //console.log("這裡是task", formData.task);
    //console.log("這裡是description", formData.description);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.task || !formData.description) {
      alert("任務與描述不能為空白");
      setError("Please fill in all the fields");
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to create task");
      }

      router.push("/");
    } catch (error) {
      console.log(error);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold my-8 text-white">Add New task</h2>
      <form onSubmit={handleSubmit} className="flex gap-3 flex-col">
        <input
          type="text"
          name="task"
          placeholder="task"
          value={formData.task}
          className="py-1 px-4 border rounded-md bg-gray-400"
          onChange={handleInputChange}
        />
        <textarea
          name="description"
          rows={4}
          placeholder="description"
          value={formData.description}
          className="py-1 px-4 border rounded-md resize-none bg-gray-400"
          onChange={handleInputChange}
        ></textarea>
        <button
          className="bg-gray-300 text-black mt-5 px-4 py-1 rounded-md cursor-pointer"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Adding...." : "Add New task"}
        </button>
      </form>
      {error && <h2 className="text-red-400 mt-4">{error}</h2>}
    </div>
  );
}
