import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetPersonAppendicesQuery } from "./getAllAppendixAnswer.query";
import { PrismaService } from "@/services/prisma/prisma.service";
import { Answer } from "@prisma/client";

// Define the shape of the desired output
interface QuestionAnswerDto {
  questionText: string;
  answer: string;
}

interface AppendixDto {
  title: string;
  questions: QuestionAnswerDto[];
}

interface PersonAppendixDto {
  Person: {
    firstName: string;
    lastName1: string;
    lastName2: string | null;
  };
  Appendix: AppendixDto[];
}

// Define the extended Answer type returned by Prisma for deep nested joins
type DetailedAnswer = Answer & {
  Question: {
    text: string;
    orderBy: number;
    Section: {
      orderBy: number;
      Appendix: { title: string };
    };
  };
  Inscription: {
    PersonRole: {
      Person: {
        id: number;
        firstName: string;
        lastName1: string;
        lastName2: string | null;
      };
    };
  };
};

@QueryHandler(GetPersonAppendicesQuery)
export class GetPersonAppendicesHandler implements IQueryHandler<GetPersonAppendicesQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetPersonAppendicesQuery): Promise<PersonAppendixDto[]> {
    const { inscriptionIds } = query;

    const rawAnswers = (await this.prisma.answer.findMany({
      where: {
        inscriptionId: { in: inscriptionIds }
      },
      include: {
        Question: {
          select: {
            text: true,
            orderBy: true,
            Section: {
              select: {
                orderBy: true,
                Appendix: {
                  select: { title: true }
                }
              }
            }
          }
        },
        Inscription: {
          select: {
            PersonRole: {
              select: {
                Person: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName1: true,
                    lastName2: true
                  }
                }
              }
            }
          }
        }
      }
    })) as unknown as DetailedAnswer[];

    if (rawAnswers.length === 0) {
      return [];
    }

    const personData = {} as PersonAppendixDto;
    const appendixMap = new Map<string, AppendixDto>();

    for (const answer of rawAnswers) {
      const person = answer.Inscription.PersonRole.Person;
      const appendixTitle = answer.Question.Section.Appendix.title;

      if (!personData.Person) {
        personData.Person = {
          firstName: person.firstName,
          lastName1: person.lastName1,
          lastName2: person.lastName2
        };
      }

      if (!appendixMap.has(appendixTitle)) {
        appendixMap.set(appendixTitle, {
          title: appendixTitle,
          questions: []
        });
      }

      const appendix = appendixMap.get(appendixTitle)!;
      appendix.questions.push({
        questionText: answer.Question.text,
        answer: answer.valueText,
        sectionOrderBy: answer.Question.Section.orderBy,
        questionOrderBy: answer.Question.orderBy
      } as QuestionAnswerDto & { sectionOrderBy: number; questionOrderBy: number });
    }

    const appendices = Array.from(appendixMap.values()).map((appendix) => {
      (appendix.questions as (QuestionAnswerDto & { sectionOrderBy: number; questionOrderBy: number })[])
        .sort((a, b) => {
          if (a.sectionOrderBy !== b.sectionOrderBy) {
            return a.sectionOrderBy - b.sectionOrderBy;
          }
          return a.questionOrderBy - b.questionOrderBy;
        })
        .forEach((q) => {
          /* eslint-disable @typescript-eslint/no-explicit-any */
          delete (q as any).sectionOrderBy;
          delete (q as any).questionOrderBy;
          /* eslint-enable @typescript-eslint/no-explicit-any */
        });

      return appendix;
    });

    personData.Appendix = appendices;

    return [personData];
  }
}
