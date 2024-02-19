//api/tasks/[id]/route.ts
import client from "@/lib/app_client";
import { Databases } from "appwrite";
import { NextResponse } from "next/server";

const database = new Databases(client);
// Fetch a specific interpretation

async function fetchTask(id: string) {
  try {
    const task = await database.getDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      "task",
      id
    );
    return task;
  } catch (error) {
    console.error("Error fetching task:", error);
    throw new Error("Failed to fetch task");
  }
}

// Delete a specific interpretation

async function deleteTask(id: string) {
  try {
    const response = await database.deleteDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      "task",
      id
    );
    return response;
  } catch (error) {
    console.error("Error deleting task:", error);
    throw new Error("Failed to delete task");
  }
}

// Update a specific interpretation

async function udpateTask(
  id: string,
  data: { task: string; description: string }
) {
  try {
    const response = await database.updateDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      "task",
      id,
      data
    );

    return response;
  } catch (error) {
    console.error("Error Update task:", error);
    throw new Error("Failed to Update task");
  }
}
//新增部分
async function udpateCheck(id: string, done: boolean) {
  try {
    const response = await database.updateDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      "task",
      id,
      (done = true)
    );

    return response;
  } catch (error) {
    console.error("Error Update done:", error);
    throw new Error("Failed to Update done");
  }
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const task = await fetchTask(id);
    return NextResponse.json({ task });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch task" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    await deleteTask(id);
    return NextResponse.json({ message: "Task deleted" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    //傳到後端需要用.json接住
    const task = await req.json();
    await udpateTask(id, task);
    return NextResponse.json({ message: "Task updated" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    );
  }
}
//新增部分

export async function PUT_1(
  req: Request,
  { params }: { params: { id: string; done: boolean } }
) {
  try {
    const id = params.id;
    const done = params.done;
    console.log("這裡是後端ID", params.id);
    console.log("這裡是後端DONE", params.done);
    //傳到後端需要用.json接住
    const data = await req.json(); // 从请求中获取 done 变量
    console.log("後端有進去抓資料");
    await udpateCheck(id, done); // 传递 done 变量给 udpateCheck 函数
    console.log("更改完資料", done);
    return NextResponse.json({ message: "Done updated" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update Done Status" },
      { status: 500 }
    );
  }
}
