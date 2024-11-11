import Prisma from "../src/db";
import { server } from "../src/server";

const createTestEntry = async () => {
  return await Prisma.entry.create({
    data: {
      title: "Test Entry",
      description: "Test Description",
      created_at: new Date(),
      scheduled_for: new Date(),
    },
  });
};

const deleteTestEntry = async (id: string) => {
  if (await Prisma.entry.findUnique({ where: { id: id } })) {
    await Prisma.entry.delete({
      where: {
        id: id,
      },
    });
  }
};

describe("server test", () => {
  it("should assert 1 + 1 is 2", () => {
    expect(1 + 1).toEqual(2);
  });
});

test("GET /get", async () => {
  const response = await server.inject({
    method: "GET",
    url: "/get/",
  });

  expect(response.statusCode).toBe(200);
});

test("GET /get/:id", async () => {
  const createdEntry = await createTestEntry();

  let response = await server.inject({
    method: "GET",
    url: `/get/${createdEntry.id}`,
  });

  expect(response.statusCode).toBe(200);
  expect(response.json()).toEqual({
    id: createdEntry.id,
    title: "Test Entry",
    description: "Test Description",
    created_at: expect.any(String),
    scheduled_for: expect.any(String),
  });

  await deleteTestEntry(createdEntry.id);

  response = await server.inject({
    method: "GET",
    url: `/get/${createdEntry.id}`,
  });

  expect(response.statusCode).toBe(500);
  expect(response.json()).toEqual({ msg: `Error finding entry with id ${createdEntry.id}` });
});

test("POST /create", async () => {
  const currentDate = new Date();

  let response = await server.inject({
    method: "POST",
    url: "/create/",
    payload: {
      title: "Test Entry",
      description: "Test Description",
      created_at: currentDate,
      scheduled_for: currentDate,
    },
  });

  expect(response.statusCode).toBe(200);
  expect(response.json()).toEqual({
    id: expect.any(String),
    title: "Test Entry",
    description: "Test Description",
    created_at: expect.any(String),
    scheduled_for: expect.any(String),
  });

  const createdEntry = await Prisma.entry.findUnique({
    where: {
      id: response.json().id,
    },
  });

  expect(createdEntry).toEqual({
    id: response.json().id,
    title: "Test Entry",
    description: "Test Description",
    created_at: currentDate,
    scheduled_for: currentDate,
  });

  await deleteTestEntry(response.json().id);
});

test("DELETE /delete/:id", async () => {
  const createdEntry = await createTestEntry();

  let response = await server.inject({
    method: "DELETE",
    url: `/delete/${createdEntry.id}`,
  });

  expect(response.statusCode).toBe(200);
  expect(response.json()).toEqual({ msg: "Deleted successfully" });

  const deletedEntry = await Prisma.entry.findUnique({
    where: {
      id: createdEntry.id,
    },
  });

  expect(deletedEntry).toBeNull();

  await deleteTestEntry(createdEntry.id);

  response = await server.inject({
    method: "DELETE",
    url: `/delete/${createdEntry.id}`,
  });

  expect(response.statusCode).toBe(500);
  expect(response.json()).toEqual({ msg: "Error deleting entry" });
});

test("PUT /update/:id", async () => {
  const createdEntry = await createTestEntry();
  const currentDate = new Date();

  let response = await server.inject({
    method: "PUT",
    url: `/update/${createdEntry.id}`,
    payload: {
      title: "Updated Test Entry",
      description: "Updated Test Description",
      created_at: currentDate,
      scheduled_for: currentDate,
    },
  });

  expect(response.statusCode).toBe(200);
  expect(response.json()).toEqual({ msg: "Updated successfully" });

  const updatedEntry = await Prisma.entry.findUnique({
    where: {
      id: createdEntry.id,
    },
  });

  expect(updatedEntry).toEqual({
    id: createdEntry.id,
    title: "Updated Test Entry",
    description: "Updated Test Description",
    created_at: currentDate,
    scheduled_for: currentDate,
  });

  response = await server.inject({
    method: "PUT",
    url: `/update/${createdEntry.id}`,
    payload: {
      scheduled_for: "invalid date",
    },
  });

  expect(response.statusCode).toBe(500);
  expect(response.json()).toEqual({ msg: "Error updating" });
});
