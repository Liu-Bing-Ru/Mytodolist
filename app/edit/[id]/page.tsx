"use client";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";

//只要有export functuin名稱要大寫
//寫法不同
export default function EditPage({ params }: { params: { id: string } }) {
  const [formData, setFormData] = useState({ task: "", description: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  useEffect(() => {
    const fetchData = async () => {
      try {
        //console.log(params.id);
        const response = await fetch(`/api/tasks/${params.id}`);
        //如果resonse沒有成功
        if (!response.ok) {
          throw new Error("Failed to fetch task");
        } /*else {
          alert("請更改任務");
        }*/
        //用json接住
        const data = await response.json();
        //console.log(data);
        setFormData({
          task: data.task.task,
          description: data.task.description,
        });
      } catch (error) {
        setError("Failed to load task.");
      }
    };
    fetchData();
  }, []);

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
      setError("Please fill in all the fields");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch(`/api/tasks/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update task");
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
      <h2 className="text-2xl font-bold my-8 text-white">Edit task</h2>
      <form onSubmit={handleSubmit} className="flex gap-3 flex-col">
        <input
          type="text"
          name="task"
          placeholder="task"
          value={formData.task}
          onChange={handleInputChange}
          className="py-1 px-4 border rounded-md"
        />
        <textarea
          name="description"
          rows={4}
          value={formData.description}
          onChange={handleInputChange}
          placeholder="description"
          className="py-1 px-4 border rounded-md resize-none"
        ></textarea>
        <button
          className="bg-black text-white mt-5 px-4 py-1 rounded-md cursor-pointer"
          type="submit"
        >
          {isLoading ? "Updating..." : "Update task"}
        </button>
      </form>
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}
