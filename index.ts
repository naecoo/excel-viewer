import { parseFile } from "./parser";
import { Grid } from "./lib/ag-grid.js";

const inputRef = document.querySelector("#file") as HTMLInputElement;
inputRef.addEventListener("change", (e: any) => {
  const file = e.target.files[0] as File;

  parseFile(file).then((data) => {
    render(data);
  });
});

let gridInstance: any;
function render(data: string[][]) {
  if (gridInstance) {
    gridInstance.destroy();
  }
  const gridOptions = {
    columnDefs: getColumnDefs(data.length),
    rowData: data,
    defaultColDef: {
      editable: true,
      resizable: true,
    },
  };
  gridInstance = new Grid(document.querySelector("#grid")!, gridOptions);
}

function getColumnDefs(size: number) {
  const maxSize = Math.ceil(
    Math.max(
      document.documentElement.clientWidth,
      document.documentElement.clientHeight
    ) / 100
  );
  size = Math.max(maxSize, size);
  const records = [-1];
  let k = 0;

  // A->Z AA -> ZZ AAA -> ZZZ
  return Array.from({ length: size }, (_, i) => {
    records[k]++;
    if (records[k] === 26) {
      let c = k;
      while (c >= 0) {
        if (records[c] < 25) break;
        c--;
      }

      if (c >= 0) {
        records[c]++;
      } else {
        k++;
      }

      for (c++; c <= k; c++) {
        records[c] = 0;
      }
    }
    return {
      width: 100,
      headerName: records.map((v) => String.fromCodePoint(65 + v)).join(""),
      field: `${i}`,
    };
  });
}
