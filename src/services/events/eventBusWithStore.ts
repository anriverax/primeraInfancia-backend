import { Injectable, Logger } from "@nestjs/common";
import { EventBus, IEvent } from "@nestjs/cqrs";
import { EventStoreService } from "./eventStore.service";
import { StoredEvent } from "@prisma/client";

@Injectable({})
export class EventBusWithStore {
  // Logger para registrar información y errores relacionados con esta clase.
  private readonly logger = new Logger(EventBusWithStore.name);

  // Constructor que inyecta dependencias necesarias.
  constructor(
    private readonly eventBus: EventBus,
    private readonly eventStore: EventStoreService
  ) {}

  // Método principal para publicar un evento individual.
  async publish(event: IEvent, payload: Pick<StoredEvent, "payload">): Promise<void> {
    try {
      if (!event) throw new Error("El evento está indefinido o es nulo.");

      // Guarda el evento en la base de datos
      await this.eventStore.save(event, payload);

      // Publica el evento en el EventBus para que otros manejadores lo procesen.
      this.eventBus.publish(event);

      // Registra un mensaje indicando que el evento fue publicado exitosamente.
      this.logger.log(`✅ Evento publicado: ${event.constructor.name}`);
    } catch (error) {
      // En caso de error, registra un mensaje de error con detalles del evento y el error.
      this.logger.error(
        `❌ Error al publicar el evento ${event?.constructor?.name || "unknown"}:`,
        error
      );

      // Relanza el error para que pueda ser manejado por el llamador.
      throw error;
    }
  }

  // Método adicional para publicar múltiples eventos a la vez.
  async publishAll(events: IEvent[], payload: Pick<StoredEvent, "payload">): Promise<void> {
    try {
      for (const event of events) {
        if (!event) continue; // Ignora eventos nulos o indefinidos.

        await this.eventStore.save(event, payload);
      }

      this.eventBus.publishAll(events);
      this.logger.log(`✅ ${events.length} Eventos publicados.`);
    } catch (error) {
      this.logger.error(`❌ Error al publicar múltiples eventos:`, error);
      throw error;
    }
  }
}
