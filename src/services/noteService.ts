import { v4 as uuidv4 } from "uuid";
import prisma from "../config/prisma.js";

interface CreateNoteData {
  title: string;
  content: string;
  imageUrl?: string | undefined;
  tags?: string[] | undefined;
  userId: string;
}

interface UpdateNoteData {
  title?: string | undefined;
  content?: string | undefined;
  imageUrl?: string | undefined;
  tags?: string[] | undefined;
}

export const createNote = async (data: CreateNoteData) => {
  const { title, content, imageUrl, tags, userId } = data;
  const shareId = uuidv4();

  const dataPayload: any = {
    title,
    content,
    imageUrl: imageUrl ?? null,
    userId,
    shareId,
  };

  if (tags && tags.length > 0) {
    dataPayload.tags = {
      create: tags.map((tag) => {
        const trimmedTag = tag.trim();
        const slug = trimmedTag.toLowerCase();
        return {
          tag: {
            connectOrCreate: {
              where: { slug },
              create: { name: trimmedTag, slug },
            },
          },
        };
      }),
    };
  }

  const note = await prisma.note.create({
    data: dataPayload,
    include: {
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });

  return note;
};

export const getNotesByUser = async (userId: string) => {
  return prisma.note.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });
};

export const getNoteById = async (id: string, userId: string) => {
  return prisma.note.findFirst({
    where: { id, userId },
    include: {
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });
};

export const updateNote = async (
  id: string,
  userId: string,
  data: UpdateNoteData,
) => {
  const { title, content, imageUrl, tags } = data;

  // First, verify the note belongs to the user
  const existingNote = await prisma.note.findFirst({
    where: { id, userId },
  });

  if (!existingNote) {
    return null; // Note not found or not owned by the user
  }

  const updateData: any = {};
  if (title !== undefined) updateData.title = title;
  if (content !== undefined) updateData.content = content;
  if (imageUrl !== undefined) updateData.imageUrl = imageUrl;

  if (tags && tags.length > 0) {
    updateData.tags = {
      deleteMany: {}, // Clear existing tags
      create: tags.map((tag) => {
        const trimmedTag = tag.trim();
        const slug = trimmedTag.toLowerCase();
        return {
          tag: {
            connectOrCreate: {
              where: { slug },
              create: { name: trimmedTag, slug },
            },
          },
        };
      }),
    };
  } else if (tags && tags.length === 0) {
    updateData.tags = {
      deleteMany: {}, // Clear existing tags if empty array is provided
    };
  }

  return prisma.note.update({
    where: { id },
    data: updateData,
    include: {
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });
};

export const deleteNote = async (id: string, userId: string) => {
  // First, verify the note belongs to the user
  const existingNote = await prisma.note.findFirst({
    where: { id, userId },
  });

  if (!existingNote) {
    return null; // Note not found or not owned by the user
  }

  // We need to delete the related NoteTag entries before deleting the Note
  await prisma.noteTag.deleteMany({
    where: { noteId: id },
  });

  return prisma.note.delete({
    where: { id },
  });
};

export const getNotesByUserPaginated = async (
  userId: string,
  page: number = 1,
  limit: number = 10,
) => {
  const skip = (page - 1) * limit;

  const [notes, total] = await Promise.all([
    prisma.note.findMany({
      where: { userId },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    }),
    prisma.note.count({ where: { userId } }),
  ]);

  return { notes, page, limit, total };
};

export const searchNotes = async (userId: string, query: string) => {
  return prisma.note.findMany({
    where: {
      userId,
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { content: { contains: query, mode: "insensitive" } },
        {
          tags: {
            some: {
              tag: {
                name: { contains: query, mode: "insensitive" },
              },
            },
          },
        },
      ],
    },
    orderBy: { createdAt: "desc" },
    include: {
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });
};

export const getNotesByTag = async (userId: string, slug: string) => {
  return prisma.note.findMany({
    where: {
      userId,
      tags: {
        some: {
          tag: { slug },
        },
      },
    },
    orderBy: { createdAt: "desc" },
    include: {
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });
};

export const toggleNoteShare = async (
  id: string,
  userId: string,
  isPublic: boolean,
) => {
  const existingNote = await prisma.note.findFirst({
    where: { id, userId },
  });

  if (!existingNote) {
    return null;
  }

  return prisma.note.update({
    where: { id },
    data: { isPublic },
    include: {
      tags: {
        include: { tag: true },
      },
    },
  });
};

export const getPublicNote = async (shareId: string) => {
  return prisma.note.findFirst({
    where: {
      shareId,
      isPublic: true,
    },
    include: {
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });
};
