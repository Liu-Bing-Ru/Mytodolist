///api/tasks routes.ts
import client from "@/lib/app_client";
import { Databases, ID, Query } from "appwrite";
import { NextResponse } from "next/server";

const database = new Databases(client);
//29:09
// Create Interpretation
//第二個參數是 appwrite的collections
async function createTasks(data: { task: string; description: string }) {
  try {
    const response = await database.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      "task",
      ID.unique(),
      data
    );

    return response;
  } catch (error) {
    console.error("Error creating task", error);
    throw new Error("Failed to create task");
  }
}

// Fetch Interpretations
async function fetchTasks() {
  try {
    const response = await database.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      "task",
      [Query.orderDesc("$createdAt")]
    );

    return response.documents;
  } catch (error) {
    console.error("Error fetching tasks", error);
    throw new Error("Failed to fetch tasks");
  }
}

export async function POST(req: Request) {
  try {
    const { task, description } = await req.json();
    const data = { task, description };
    const response = await createTasks(data);
    return NextResponse.json({ message: "task created" });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to create task",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const tasks = await fetchTasks();
    return NextResponse.json(tasks);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

//FUCT===============================
//新增部分
async function udpateCheck(
  id: string,
  data: { task: string; description: string; done: boolean }
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
    console.error("Error Update done:", error);
    throw new Error("Failed to Update done");
  }
}
//=====================新增

export async function PUT(req: Request) {
  const task = await req.json();
  const m = { task: task.task, description: task.description, done: task.done };
  console.log("這裡是m", m);
  //console.log("這裡是後端TASK", task);
  //console.log("這裡是後端params", id, done);
  try {
    console.log("後端有進去抓資料");
    await udpateCheck(task.id, m);
    console.log("更改完資料");
    console.log("這裡是更改後m", m);
    return NextResponse.json({ message: "Done updated" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update Done Status" },
      { status: 500 }
    );
  }
}
