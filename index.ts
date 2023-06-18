import * as Xlsx from "xlsx";

const isNil = (val: unknown) => val === undefined || val === null;

interface Parser {
  (file: File): Promise<string[][]>;
}

const parseXLSXFile: Parser = (file) => {
  return new Promise((resolve, reject) => {
    const data: string[][] = [];
    const reader = new FileReader();

    reader.addEventListener("error", (error: any) => {
      reject(error);
    });

    reader.addEventListener("load", (e: any) => {
      const workbook = Xlsx.read(e.target.result, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const rawData = Xlsx.utils.sheet_to_json(worksheet, {
        header: 1,
      }) as unknown[][];
      data.push(
        ...rawData.map((_) => _.map((val) => (isNil(val) ? "" : String(val))))
      );
    });

    reader.addEventListener("loadend", () => {
      resolve(data);
    });

    reader.readAsBinaryString(file);
  });
};

const fileInputRef = document.querySelector("#file")!;
fileInputRef.addEventListener("change", (e: any) => {
  const file = e.target.files[0] as File;

  parseXLSXFile(file).then((data) => {
    console.log(data);
  });
});

// render
// drag and responsive degisn

// upload file dialog
