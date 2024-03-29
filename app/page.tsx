"use client";
//page.tsx

import Link from "next/link";
import { useEffect, useState } from "react";

//interface介面
interface ITask {
  $id: string;
  task: string;
  description: string;
  done: boolean;
}

export default function Home() {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchTasks = async () => {
      //把 isLoading 改成 true
      setIsLoading(true);
      try {
        const response = await fetch("/api/tasks");
        if (response.ok != true) {
          throw new Error("Fail to fetch tasks");
        }
        //用 data 接住回傳的 response.json
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.log("Error:", error);
        setError("Failed to load tasks. Please try reloading the page.");
      } finally {
        setIsLoading(false);
      }
    };
    // 调用 fetchTasks 函数
    fetchTasks();
  }, []);
  const handleDelete = async (id: string) => {
    alert("任務即將被刪除");
    try {
      await fetch(`/api/tasks/${id}`, { method: "DELETE" });
      setTasks((prevTasks) => prevTasks?.filter((i) => i.$id !== id));
    } catch (error) {
      console.log("Error:", error);
      setError("fail to delete task");
    }
  };
  //新增部分Checkbutton
  const handleCheck = async (
    id: string,
    task: string,
    description: string,
    done: boolean
  ) => {
    alert("任務已經完成");
    console.log("一開始done狀態", done); //default false
    done = true;
    try {
      console.log("這裡是ID", id);
      console.log("進去抓資料中....");
      await fetch(`/api/tasks`, {
        method: "PUT",
        /*headers: {
          "Content-Type": "application/json",
        },*/
        body: JSON.stringify({
          id: id,
          task: task,
          description: description,
          done: done,
        }),
      });
    } catch (error) {
      console.log("Error:", error);
      setError("fail to Update done status");
    }
  };

  return (
    <div>
      {error && <p className="py-4 text-red-500">{error}</p>}
      {isLoading ? (
        <p>Loading tasks.....</p>
      ) : (
        tasks.map((task) => (
          <div
            key={task.$id}
            className="p-4 my-2 rounded-md border-b leading-8 bg-gray-400"
          >
            <div className="font-bold">{task.task}</div>
            <div>{task.description}</div>
            <div className="flex gap-4 mt-4 justify-end">
              <button
                className="bg-green-300 text-yellow-900 px-4 py-2 rounded-md uppercase text-sm font-bold tracking-widest"
                onClick={() =>
                  handleCheck(task.$id, task.task, task.description, task.done)
                }
              >
                Done
              </button>
              <Link
                className="bg-slate-200 px-4 py-2 rounded-md uppercase text-sm font-bold tracking-widest"
                href={`/edit/${task.$id}`}
              >
                Edit
              </Link>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md uppercase text-sm font-bold tracking-widest"
                onClick={() => handleDelete(task.$id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
/*
這邊新增button 按鈕
*/
