import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateAppendixTestCommand } from "./createAppendixTest.command";
import { AppendixTestProjection } from "../../projections/appendixTest.projection";
import { NestResponse } from "@/common/helpers/types";
import { AppendixTest } from "@prisma/client";

@CommandHandler(CreateAppendixTestCommand)
export class CreateAppendixTestHandler implements ICommandHandler<CreateAppendixTestCommand> {
  constructor(private readonly appendixTestProjection: AppendixTestProjection) { }
  async execute(command: CreateAppendixTestCommand): Promise<NestResponse<AppendixTest>> {
    const value = [
      {
        "name": "Anexo 8",
        "textQuestion": "2||A. Desarrollo y Aprendizaje Activos. Currículo integrado||Aprendizaje significativo||El docente vincula las experiencias de desarrollo y aprendizaje con situaciones cotidianas de las niñas y los niños de Primera Infancia.",
        "textAnswer": "Nunca",
        "teacherRoleId": 500,
        "mentorRoleId": 2, "createdBy": 5321
      },
      {
        "name": "Anexo 8",
        "textQuestion": "2||A. Desarrollo y Aprendizaje Activos. Currículo integrado||Enfoque constructivista||El docente retoma los conocimientos previos de las niñas y los niños de Primera Infancia en la construcción de nuevos aprendizajes.",
        "textAnswer": "Nunca",
        "teacherRoleId": 500,
        "mentorRoleId": 2, "createdBy": 5321
      },
      {
        "name": "Anexo 8",
        "textQuestion": "2||A. Desarrollo y Aprendizaje Activos. Currículo integrado||Aprendizaje significativo||Respeto a las características individuales e inclusión educativa||El docente promueve la participación y el aprendizaje de todas las niñas y los niños del aula respetando sus características individuales.",
        "textAnswer": "Nunca",
        "teacherRoleId": 500,
        "mentorRoleId": 2, "createdBy": 5321
      },
      {
        "name": "Anexo 8",
        "textQuestion": "2||A. Desarrollo y Aprendizaje Activos. Currículo integrado||Respeto a las características individuales e inclusión educativa||El docente intenciona los procesos de desarrollo y aprendizaje de todas las niñas y los niños de Primera Infancia en el aula y lo hace con respeto a su ritmo e intereses.",
        "textAnswer": "Nunca",
        "teacherRoleId": 500,
        "mentorRoleId": 2, "createdBy": 5321
      },
      {
        "name": "Anexo 8",
        "textQuestion": "2||A. Desarrollo y Aprendizaje Activos. Currículo integrado||Juego como estrategia pedagógica||El docente reconoce e integra el juego como elemento natural para el desarrollo y aprendizaje.",
        "textAnswer": "Nunca",
        "teacherRoleId": 500,
        "mentorRoleId": 2, "createdBy": 5321
      },
      {
        "name": "Anexo 8",
        "textQuestion": "2||A. Desarrollo y Aprendizaje Activos. Currículo integrado||Ambientes, espacios y materiales||El docente crea espacios seguros, creativos y acogedores en el aula que favorecen la libre expresión y el juego.",
        "textAnswer": "Nunca",
        "teacherRoleId": 500,
        "mentorRoleId": 2, "createdBy": 5321
      },
      {
        "name": "Anexo 8",
        "textQuestion": "2||A. Desarrollo y Aprendizaje Activos. Currículo integrado||Ambientes, espacios y materiales||El docente reconoce la importancia de la ambientación de los espacios del aula de Primera Infancia de acuerdo a los objetivos didácticos de la planificación",
        "textAnswer": "Nunca",
        "teacherRoleId": 500,
        "mentorRoleId": 2, "createdBy": 5321
      },
      {
        "name": "Anexo 8",
        "textQuestion": "2||A. Desarrollo y Aprendizaje Activos. Currículo integrado||Ambientes, espacios y materiales||El docente organiza las zonas de desarrollo y aprendizaje de manera que cumplan con características mínimas: activas, participativas, situadas que promuevan la experimentación, el juego, la exploración y favorecedoras del desarrollo y el aprendizaje integral de las niñas y los niños de Primera Infancia",
        "textAnswer": "Nunca",
        "teacherRoleId": 500,
        "mentorRoleId": 2, "createdBy": 5321
      },
      {
        "name": "Anexo 8",
        "textQuestion": "2||A. Desarrollo y Aprendizaje Activos. Currículo integrado||Ambientes, espacios y materiales||El docente selecciona materiales y recursos didácticos seguros, accesibles, variados teniendo en cuenta los intereses y características individuales de las niñas y niños del aula.",
        "textAnswer": "Nunca",
        "teacherRoleId": 500,
        "mentorRoleId": 2, "createdBy": 5321
      },
      {
        "name": "Anexo 8",
        "textQuestion": "2||A. Desarrollo y Aprendizaje Activos. Currículo integrado||Ambientes, espacios y materiales||El docente enriquece y renueva las zonas de desarrollo y aprendizaje según las planificaciones considerando que cada zona tenga la capacidad para ser utilizada por 6 niñas o niños de Primera Infancia",
        "textAnswer": "Nunca",
        "teacherRoleId": 500,
        "mentorRoleId": 2, "createdBy": 5321
      },
      {
        "name": "Anexo 8",
        "textQuestion": "2||A. Desarrollo y Aprendizaje Activos. Currículo integrado||Ambientes, espacios y materiales||El docente Incluye, promueve, y acompañamiento la rotación libre entre las zonas de desarrollo y aprendizaje instaladas en el aula. Algunos ejemplos de zona según el marco curricular pueden ser: zona de lectura, Zona de expresión gráfica, plástica y visual , zona de pensamiento lógico y matemática, sensoriomotora (página 107)",
        "textAnswer": "Nunca",
        "teacherRoleId": 500,
        "mentorRoleId": 2, "createdBy": 5321
      },
      {
        "name": "Anexo 8",
        "textQuestion": "2||A. Desarrollo y Aprendizaje Activos. Currículo integrado||Motricidad y expresión emocional||El docente planifica actividades que favorecen el desarrollo integral físico y emocional",
        "textAnswer": "Nunca",
        "teacherRoleId": 500,
        "mentorRoleId": 2, "createdBy": 5321
      },
      {
        "name": "Anexo 8",
        "textQuestion": "2||A. Desarrollo y Aprendizaje Activos. Currículo integrado||Instalaciones de interacción entre iguales y los objetos||El docente selecciona y organiza materiales para facilitar la libre interacción entre pares, en pequeños o grandes grupos o trabajo individual",
        "textAnswer": "Nunca",
        "teacherRoleId": 500,
        "mentorRoleId": 2, "createdBy": 5321
      },
      {
        "name": "Anexo 8",
        "textQuestion": "2||A. Desarrollo y Aprendizaje Activos. Currículo integrado||Instalaciones de interacción entre iguales y los objetos||El docente promueve la expresión de emociones a través de diferentes formas de expresión",
        "textAnswer": "Nunca",
        "teacherRoleId": 500,
        "mentorRoleId": 2, "createdBy": 5321
      },
      {
        "name": "Anexo 8",
        "textQuestion": "2||A. Desarrollo y Aprendizaje Activos. Currículo integrado||Instalaciones de interacción entre iguales y los objetos||El docente acompañará desde la observación, la escucha y la mediación, realizando preguntas que profundicen el pensamiento o brindando apoyos cuando se requiera a las niñas y los niños de Primera Infancia.(107)",
        "textAnswer": "Nunca",
        "teacherRoleId": 500,
        "mentorRoleId": 2, "createdBy": 5321
      },
      {
        "name": "Anexo 8",
        "textQuestion": "2||A. Desarrollo y Aprendizaje Activos. Currículo integrado||Estrategias pedagógicas pertinentes||El docente conoce y utiliza estrategias pedagógicas pertinentes para la primera infancia: abordadas en la formación: talleres pedagógicos , proyectos, zonas de desarrollo y aprendizaje y asamblea.(96)",
        "textAnswer": "Nunca",
        "teacherRoleId": 500,
        "mentorRoleId": 2, "createdBy": 5321
      },
      {
        "name": "Anexo 8",
        "textQuestion": "2||A. Desarrollo y Aprendizaje Activos. Currículo integrado||Estrategias pedagógicas pertinentes||El docente ajusta las estrategias pedagógicas orientadas por el marco curricular a la naturaleza de la niñas y los niños de Primera Infancia, favoreciendo el desarrollo integral y la promoción de aprendizajes pertinentes y significativos",
        "textAnswer": "Nunca",
        "teacherRoleId": 500,
        "mentorRoleId": 2, "createdBy": 5321
      },
      {
        "name": "Anexo 8",
        "textQuestion": "2||A. Desarrollo y Aprendizaje Activos. Currículo integrado||Estrategias pedagógicas pertinentes||El docente integra la estrategia pedagógica pertinente de talleres en su aula de acuerdo a las edades de su grupo, con una frecuencia que puede ser diaria con una duración de 30 a 60 minutos o de acuerdo a las necesidades e interese de las niñas y niños de Primera Infancia",
        "textAnswer": "Nunca",
        "teacherRoleId": 500,
        "mentorRoleId": 2, "createdBy": 5321
      },
      {
        "name": "Anexo 8",
        "textQuestion": "2||A. Desarrollo y Aprendizaje Activos. Currículo integrado||Estrategias pedagógicas pertinentes||El docente integra la estrategia pedagógica pertinente de proyecto en su aula de acuerdo a las edades e intereses genuinos de su grupo con una frecuencia que puede ser diaria con una duración de 40 a 50 minutos, donde se vincule la vida cotidiana y la educación",
        "textAnswer": "Nunca",
        "teacherRoleId": 500,
        "mentorRoleId": 2, "createdBy": 5321
      },
      {
        "name": "Anexo 8",
        "textQuestion": "2||A. Desarrollo y Aprendizaje Activos. Currículo integrado||Estrategias pedagógicas pertinentes||El docente integra la estrategia pedagógica pertinente de asamblea al inicio o al final de la jornada, donde se promueve el pensamiento crítico la deliberación colectiva y la construcción de acuerdos retomando los momentos para su desarrollo (apertura, propósito, conversación abierta y cierre) con una frecuencia que puede ser diaria con una duración de 20 a 50 minutos",
        "textAnswer": "Nunca",
        "teacherRoleId": 500,
        "mentorRoleId": 2, "createdBy": 5321
      },
      {
        "name": "Anexo 8",
        "textQuestion": "2||A. Desarrollo y Aprendizaje Activos. Currículo integrado||Estrategias pedagógicas pertinentes||El docente utiliza distintos tipos de agrupamientos (individual, grupos pequeños o grandes), según las distintas estrategias pedagógicas pertinentes planificadas en la rutina de desarrollo y aprendizaje",
        "textAnswer": "Nunca",
        "teacherRoleId": 500,
        "mentorRoleId": 2, "createdBy": 5321
      },
      {
        "name": "Anexo 8",
        "textQuestion": "2||A. Desarrollo y Aprendizaje Activos. Currículo integrado||Rutinas y organización (pág 92)||El docente cuida, anticipa y planifica las transiciones entre momentos y rutinas",
        "textAnswer": "Nunca",
        "teacherRoleId": 500,
        "mentorRoleId": 2, "createdBy": 5321
      },
      {
        "name": "Anexo 8",
        "textQuestion": "2||A. Desarrollo y Aprendizaje Activos. Currículo integrado||Rutinas y organización (pág 92)||El docente organiza las rutinas de la jornada con criterios de estabilidad, flexibilidad y secuencialidad",
        "textAnswer": "Nunca",
        "teacherRoleId": 500,
        "mentorRoleId": 2, "createdBy": 5321
      },
      {
        "name": "Anexo 8",
        "textQuestion": "2||A. Desarrollo y Aprendizaje Activos. Currículo integrado||Rutinas y organización (pág 92)||El docente utiliza herramientas que facilitan a las niñas y los niños la anticipación de la secuencia de las rutinas del día",
        "textAnswer": "Nunca",
        "teacherRoleId": 500,
        "mentorRoleId": 2, "createdBy": 5321
      },
      {
        "name": "Anexo 8",
        "textQuestion": "2||A. Desarrollo y Aprendizaje Activos. Currículo integrado||Rutinas y organización||El docente responde a necesidades básicas (aseo, comida y descanso), afectivas, educativas y de interacción social a través de la organización del tiempo de acuerdo a la secuencia de rutinas",
        "textAnswer": "Nunca",
        "teacherRoleId": 500,
        "mentorRoleId": 2, "createdBy": 5321
      },
      {
        "name": "Anexo 8",
        "textQuestion": "2||A. Desarrollo y Aprendizaje Activos. Currículo integrado||Rutinas y organización||El docente tiene en cuenta el criterio de flexibilidad en la organización de la rutina y respeta los intereses y características individuales de las niñas y los niños de Primera Infancia",
        "textAnswer": "Nunca",
        "teacherRoleId": 500,
        "mentorRoleId": 2, "createdBy": 5321
      },
      {
        "name": "Anexo 8",
        "textQuestion": "2||A. Desarrollo y Aprendizaje Activos. Currículo integrado||Rutinas y organización||El docente organiza el tiempo de la jornada con rutinas claras, coherentes y adecuadas a los procesos de desarrollo y aprendizaje de la Primera Infancia",
        "textAnswer": "Nunca",
        "teacherRoleId": 500,
        "mentorRoleId": 2, "createdBy": 5321
      },
      {
        "name": "Anexo 8",
        "textQuestion": "2||A. Desarrollo y Aprendizaje Activos. Currículo integrado||Planificación y evaluación||El docente considera en su planificación los elementos clave del diseño pedagógico: objetivos, recursos, rutinas y tiempos, estrategias pedagógicas pertinentes, los agrupamientos diferentes de niñas y niños, la evaluación y los reajustes derivados de ella",
        "textAnswer": "Nunca",
        "teacherRoleId": 500,
        "mentorRoleId": 2, "createdBy": 5321
      },
      {
        "name": "Anexo 8",
        "textQuestion": "2||A. Desarrollo y Aprendizaje Activos. Currículo integrado||Planificación y evaluación||El docente involucra a las familias en la planificación educativa",
        "textAnswer": "Nunca",
        "teacherRoleId": 500,
        "mentorRoleId": 2, "createdBy": 5321
      },
      {
        "name": "Anexo 8",
        "textQuestion": "2||A. Desarrollo y Aprendizaje Activos. Currículo integrado||Planificación y evaluación||El docente utiliza herramientas de evaluación variadas y pertinentes (observaciones, registros, anecdotarios, recursos audiovisuales)",
        "textAnswer": "Nunca",
        "teacherRoleId": 500,
        "mentorRoleId": 2, "createdBy": 5321
      },
      {
        "name": "Anexo 8",
        "textQuestion": "2||A. Desarrollo y Aprendizaje Activos. Currículo integrado||Planificación y evaluación||El docente registra y documenta las observaciones sobre las niñas y los niños del aula de Primera Infancia, tanto en las actividades individuales como en las grupales",
        "textAnswer": "Nunca",
        "teacherRoleId": 500,
        "mentorRoleId": 2, "createdBy": 5321
      },
      {
        "name": "Anexo 8",
        "textQuestion": "2||A. Desarrollo y Aprendizaje Activos. Currículo integrado||Planificación y evaluación||El docente planifica teniendo en cuenta el principio de flexibilidad, adaptándose a los intereses del grupo y prioriza enfoques inclusivos y participativos",
        "textAnswer": "Nunca",
        "teacherRoleId": 500,
        "mentorRoleId": 2, "createdBy": 5321
      },
      {
        "name": "Anexo 8",
        "textQuestion": "2||A. Desarrollo y Aprendizaje Activos. Currículo integrado||Planificación y evaluación||El docente evalúa para acompañar las niñas y los niños de Primera Infancia de acuerdo a sus características socioeducativas y grupo etario",
        "textAnswer": "Nunca",
        "teacherRoleId": 500,
        "mentorRoleId": 2, "createdBy": 5321
      },
      {
        "name": "Anexo 8",
        "textQuestion": "2||B. Ambiente de aprendizaje. Cuidado cariñoso y sensible. El rol del docente de Primera Infancia||Ambiente de aprendizaje. Cuidado cariñoso y sensible||El docente establece ambientes de aprendizaje afectivos, que reconocen las características individuales de las niñas y los niños de Primera Infancia y promueve la interacción de calidad",
        "textAnswer": "Nunca",
        "teacherRoleId": 500,
        "mentorRoleId": 2, "createdBy": 5321
      },
      {
        "name": "Anexo 8",
        "textQuestion": "2||B. Ambiente de aprendizaje. Cuidado cariñoso y sensible. El rol del docente de Primera Infancia||Ambiente de aprendizaje. Cuidado cariñoso y sensible||El docente ofrece oportunidades a las niñas y los niños para asumir responsabilidades en el aula, adecuadas a su edad, fomentando su autonomía",
        "textAnswer": "Nunca",
        "teacherRoleId": 500,
        "mentorRoleId": 2, "createdBy": 5321
      },
      {
        "name": "Anexo 8",
        "textQuestion": "2||B. Ambiente de aprendizaje. Cuidado cariñoso y sensible. El rol del docente de Primera Infancia||Ambiente de aprendizaje. Cuidado cariñoso y sensible||El docente crea un ambiente acogedor y seguro que hace que las niñas y los niños de Primera Infancia disfruten en el aula",
        "textAnswer": "Nunca",
        "teacherRoleId": 500,
        "mentorRoleId": 2, "createdBy": 5321
      },
      {
        "name": "Anexo 8",
        "textQuestion": "2||B. Ambiente de aprendizaje. Cuidado cariñoso y sensible. El rol del docente de Primera Infancia||Ambiente de aprendizaje. Cuidado cariñoso y sensible||El docente muestra actitudes positivas y genera ambientes seguros en las rutinas de desarrollo y aprendizaje de las niñas y los niños de Primera Infancia",
        "textAnswer": "Nunca",
        "teacherRoleId": 500,
        "mentorRoleId": 2, "createdBy": 5321
      },
      {
        "name": "Anexo 8",
        "textQuestion": "2||B. Ambiente de aprendizaje. Cuidado cariñoso y sensible. El rol del docente de Primera Infancia||Comunicación positiva, atención y respeto||El docente usa lenguaje positivo para dar retroalimentación a las niñas y los niños de Primera Infancia, reforzando su desarrollo, autoestima y autonomía",
        "textAnswer": "Nunca",
        "teacherRoleId": 500,
        "mentorRoleId": 2, "createdBy": 5321
      },
      {
        "name": "Anexo 8",
        "textQuestion": "2||B. Ambiente de aprendizaje. Cuidado cariñoso y sensible. El rol del docente de Primera Infancia||Comunicación positiva, atención y respeto||El docente trata respetuosamente y con cariño a todas las niñas y los niños del aula de Primera Infancia",
        "textAnswer": "Nunca",
        "teacherRoleId": 500,
        "mentorRoleId": 2, "createdBy": 5321
      },
      {
        "name": "Anexo 8",
        "textQuestion": "2||B. Ambiente de aprendizaje. Cuidado cariñoso y sensible. El rol del docente de Primera Infancia||Comunicación positiva, atención y respeto||El docente realiza sus prácticas pedagógicas a partir de la escucha atenta de los intereses de las niñas y niños de Primera Infancia",
        "textAnswer": "Nunca",
        "teacherRoleId": 500,
        "mentorRoleId": 2, "createdBy": 5321
      },
      {
        "name": "Anexo 8",
        "textQuestion": "2||B. Ambiente de aprendizaje. Cuidado cariñoso y sensible. El rol del docente de Primera Infancia||Comunicación positiva, atención y respeto||El docente da respuesta a las necesidades de las niñas y los niños del aula de Primera Infancia",
        "textAnswer": "Nunca",
        "teacherRoleId": 500,
        "mentorRoleId": 2, "createdBy": 5321
      },
      {
        "name": "Anexo 8",
        "textQuestion": "2||B. Ambiente de aprendizaje. Cuidado cariñoso y sensible. El rol del docente de Primera Infancia||Desarrollo socioemocional, colaboración y valores||El docente promueve entre las niñas y los niños actitudes como la empatía en la resolución de conflictos",
        "textAnswer": "Nunca",
        "teacherRoleId": 500,
        "mentorRoleId": 2, "createdBy": 5321
      },
      {
        "name": "Anexo 8",
        "textQuestion": "2||B. Ambiente de aprendizaje. Cuidado cariñoso y sensible. El rol del docente de Primera Infancia||Desarrollo socioemocional, colaboración y valores||El docente fomenta el trabajo en equipo en el aula para compartir ideas y lograr un objetivo común",
        "textAnswer": "Nunca",
        "teacherRoleId": 500,
        "mentorRoleId": 2, "createdBy": 5321
      },
      {
        "name": "Anexo 8",
        "textQuestion": "2||B. Ambiente de aprendizaje. Cuidado cariñoso y sensible. El rol del docente de Primera Infancia||Desarrollo socioemocional, colaboración y valores||El docente promueve la libre expresión de opiniones e intereses en las niñas y los niños del aula de Primera Infancia",
        "textAnswer": "Nunca",
        "teacherRoleId": 500,
        "mentorRoleId": 2, "createdBy": 5321
      },
      {
        "name": "Anexo 8",
        "textQuestion": "2||C. Integración de las familias en los procesos de desarrollo y aprendizaje. Acompañamiento docente a las familias||Integración de las familias en los procesos de desarrollo y aprendizaje||El docente promueve la participación de las familias en el aula o el centro escolar en acciones puntuales que favorezcan el desarrollo y aprendizaje de las niñas y niños de Primera Infancia",
        "textAnswer": "Nunca",
        "teacherRoleId": 500,
        "mentorRoleId": 2, "createdBy": 5321
      },
      {
        "name": "Anexo 8",
        "textQuestion": "2||C. Integración de las familias en los procesos de desarrollo y aprendizaje. Acompañamiento docente a las familias||Integración de las familias en los procesos de desarrollo y aprendizaje||El docente escucha y respeta la opinión de las familias",
        "textAnswer": "Nunca",
        "teacherRoleId": 500,
        "mentorRoleId": 2, "createdBy": 5321
      },
      {
        "name": "Anexo 8",
        "textQuestion": "2||C. Integración de las familias en los procesos de desarrollo y aprendizaje. Acompañamiento docente a las familias||Integración de las familias en los procesos de desarrollo y aprendizaje||El docente muestra una actitud receptiva a las propuestas de las familias para colaborar en el aula",
        "textAnswer": "Nunca",
        "teacherRoleId": 500,
        "mentorRoleId": 2, "createdBy": 5321
      },
      {
        "name": "Anexo 8",
        "textQuestion": "2||C. Integración de las familias en los procesos de desarrollo y aprendizaje. Acompañamiento docente a las familias||Integración de las familias en los procesos de desarrollo y aprendizaje||El docente incluye a las familias en alguna actividad facilitando su colaboración y espacios donde realizarla",
        "textAnswer": "Nunca",
        "teacherRoleId": 500,
        "mentorRoleId": 2, "createdBy": 5321
      },
      {
        "name": "Anexo 8",
        "textQuestion": "2||C. Integración de las familias en los procesos de desarrollo y aprendizaje. Acompañamiento docente a las familias||Acompañamiento docente a las familias||El docente tiene en cuenta el contexto social y familiar de las niñas y los niños de Primera Infancia, para favorecer su desarrollo y aprendizaje",
        "textAnswer": "Nunca",
        "teacherRoleId": 500,
        "mentorRoleId": 2, "createdBy": 5321
      },
      {
        "name": "Anexo 8",
        "textQuestion": "2||C. Integración de las familias en los procesos de desarrollo y aprendizaje. Acompañamiento docente a las familias||Acompañamiento docente a las familias||El docente implementa mecanismo de comunicación con las familias para informar el progreso de las niñas y niños de primera infancia, como: informes escritos, cuaderno viajero, u otras",
        "textAnswer": "Nunca",
        "teacherRoleId": 500,
        "mentorRoleId": 2, "createdBy": 5321
      },
      {
        "name": "Anexo 8",
        "textQuestion": "2||C. Integración de las familias en los procesos de desarrollo y aprendizaje. Acompañamiento docente a las familias||Partición del docente en el modelo de Atención Integral||El docente realiza prácticas pedagógicas en el aula basadas en el modelo de Atención Integral a la Primera Infancia",
        "textAnswer": "Nunca",
        "teacherRoleId": 500,
        "mentorRoleId": 2, "createdBy": 5321
      },
      {
        "name": "Anexo 8",
        "textQuestion": "2||D. Trabajo cooperativo y en equipo de los docentes. Utilización de recursos tecnológicos||Trabajo cooperativo y en equipo||El docente se marca metas y objetivos realistas, razonables y alcanzables en colaboración con el resto del cuerpo docente de su centro escolar",
        "textAnswer": "Nunca",
        "teacherRoleId": 500,
        "mentorRoleId": 2, "createdBy": 5321
      },
      {
        "name": "Anexo 8",
        "textQuestion": "2||D. Trabajo cooperativo y en equipo de los docentes. Utilización de recursos tecnológicos||Trabajo cooperativo y en equipo||El docente se autoevalúa respecto de su labor en el aula y la propia planificación",
        "textAnswer": "Nunca",
        "teacherRoleId": 500,
        "mentorRoleId": 2, "createdBy": 5321
      },
      {
        "name": "Anexo 8",
        "textQuestion": "2||D. Trabajo cooperativo y en equipo de los docentes. Utilización de recursos tecnológicos||Trabajo cooperativo y en equipo||El docente evalúa con el resto del cuerpo docente para buscar la mejora continua en su práctica docente",
        "textAnswer": "Nunca",
        "teacherRoleId": 500,
        "mentorRoleId": 2, "createdBy": 5321
      },
      {
        "name": "Anexo 8",
        "textQuestion": "2||D. Trabajo cooperativo y en equipo de los docentes. Utilización de recursos tecnológicos||Trabajo cooperativo y en equipo||El docente planifica actividades, talleres o proyectos que le permiten compartir su práctica con otros docentes y otras aulas",
        "textAnswer": "Nunca",
        "teacherRoleId": 500,
        "mentorRoleId": 2, "createdBy": 5321
      },
      {
        "name": "Anexo 8",
        "textQuestion": "2||D. Trabajo cooperativo y en equipo de los docentes. Utilización de recursos tecnológicos||Trabajo cooperativo y en equipo||El docente tiene conciencia de equipo y llega a acuerdos sobre cómo planificar, el diseño de ambientes de las aulas o el uso de materiales",
        "textAnswer": "Nunca",
        "teacherRoleId": 500,
        "mentorRoleId": 2, "createdBy": 5321
      },
      {
        "name": "Anexo 8",
        "textQuestion": "2||D. Trabajo cooperativo y en equipo de los docentes. Utilización de recursos tecnológicos||Aula y recursos virtuales||El docente gestiona el aula virtual",
        "textAnswer": "Nunca",
        "teacherRoleId": 500,
        "mentorRoleId": 2, "createdBy": 5321
      },
      {
        "name": "Anexo 8",
        "textQuestion": "2||D. Trabajo cooperativo y en equipo de los docentes. Utilización de recursos tecnológicos||Aula y recursos virtuales||El docente usa Google Drive y Google Docs para crear materiales",
        "textAnswer": "Nunca",
        "teacherRoleId": 500,
        "mentorRoleId": 2, "createdBy": 5321
      },
      {
        "name": "Anexo 8",
        "textQuestion": "2||D. Trabajo cooperativo y en equipo de los docentes. Utilización de recursos tecnológicos||Aula y recursos virtuales||El docente utiliza recursos tecnológicos adaptados a la Primera Infancia",
        "textAnswer": "Nunca",
        "teacherRoleId": 500,
        "mentorRoleId": 2, "createdBy": 5321
      },
      {
        "name": "Anexo 8",
        "textQuestion": "2||D. Trabajo cooperativo y en equipo de los docentes. Utilización de recursos tecnológicos||Aula y recursos virtuales||El docente usa significativamente audiovisuales (grabadoras de sonido, cámaras fotográficas) con las niñas y niños de Primera Infancia",
        "textAnswer": "Nunca",
        "teacherRoleId": 500,
        "mentorRoleId": 2, "createdBy": 5321
      }
    ]
    //const { data } = command;
    value.map(async (data) => {
      await this.appendixTestProjection.create(data);
    })
    const { data } = command;

    const res = await this.appendixTestProjection.create(data);

    return {
      statusCode: 201,
      message: "Anexo creado con éxito.",
      data: res
    };
  }
}
