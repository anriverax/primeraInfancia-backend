import { UploadFilesDto } from "./profile.dto";

export type IFile = UploadFilesDto;

export interface IUploadProfile {
  Person: {
    id: number;
    dui: string;
    Academic: {
      id: number;
    } | null;
  };
}

export interface IUploadCv {
  cv: Express.Multer.File;
  academicId: number;
  dui: string;
}

export interface IUploadAvatar extends Pick<IUploadCv, "dui"> {
  userId: number;
  avatar: Express.Multer.File;
}

export interface IUploadDui extends Pick<IUploadCv, "dui"> {
  personId: number;
  duiImg: Express.Multer.File[];
}

export interface IUpdateUserAvatar extends Pick<IUploadAvatar, "userId"> {
  avatar: string;
}
