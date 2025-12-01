import { Injectable } from "@nestjs/common";
import { IEvent } from "@nestjs/cqrs";
import { PrismaService } from "../prisma/prisma.service";
import { StoredEvent } from "prisma/generated/client";

@Injectable({})
export class EventStoreService {
  constructor(private readonly prisma: PrismaService) {}

  async save(event: IEvent, payload: Pick<StoredEvent, "payload">): Promise<void> {
    const type: string = event.constructor.name;

    // Eliminar el campo passwd si existe

    await this.prisma.storedEvent.create({
      data: {
        type,
        payload: {
          payload
        }
      }
    });
  }
}
