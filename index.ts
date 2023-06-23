import { parseFile, isNil } from "./parser";

const inputRef = document.querySelector("#file") as HTMLInputElement;
inputRef.addEventListener("change", (e: any) => {
  const file = e.target.files[0] as File;

  parseFile(file).then((data) => {
    render(data);
  });
});

function render(data: string[][]) {}

