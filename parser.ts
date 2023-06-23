import { read, utils } from "xlsx";

export const isNil = (val: unknown) => val === undefined || val === null;

interface Parser {
  (file: File): Promise<string[][]>;
}

export const parseFile: Parser = (file) => {
  return new Promise((resolve, reject) => {
    const data: string[][] = [];
    const reader = new FileReader();

    reader.addEventListener("error", (error: any) => {
      reject(error);
    });

    reader.addEventListener("load", (e: any) => {
      const workbook = read(e.target.result, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const rawData = utils.sheet_to_json(worksheet, {
        header: 1,
      }) as unknown[][];
      data.push(
        ...rawData.map((_) => _.map((val) => (isNil(val) ? "" : String(val))))
      );
    });

    reader.addEventListener("loadend", () => {
      let i = data.length - 1;
      while (i >= 0) {
        const item = data[i];
        if (item.length === 0) {
          data.pop();
          i--;
        } else {
          break;
        }
      }

      resolve(data);
    });

    reader.readAsBinaryString(file);
  });
};