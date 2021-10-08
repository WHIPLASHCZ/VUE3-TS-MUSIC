export function turnSecsToMin(alltime: number) {
  alltime = alltime | 0;
  let min = (((alltime / 60) | 0) + "").padStart(2, "0");
  let sec = ((alltime % 60 | 0) + "").padStart(2, "0");
  if (sec == "60") {
    sec = "00";
    min = (((alltime / 60) | 0) + "").padStart(2, "0");
  }
  return `${min}:${sec}`;
}
