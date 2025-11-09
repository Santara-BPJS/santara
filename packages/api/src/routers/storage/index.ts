import { o } from "../../index";
import { fileRouter } from "./file.router";
import { folderRouter } from "./folder.router";

export const storageRouter = o.tag("Storage").router({
  fileRouter,
  folderRouter,
});
