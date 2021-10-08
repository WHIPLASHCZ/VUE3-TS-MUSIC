let randomMap: obj = {};
export function shuffle(list: any[]) {
  let arr = list.slice();
  arr.forEach((item, index, arr) => {
    let randomIdx = getNotRepeatIdx(arr);
    randomMap[randomIdx] = true;
    let temp = arr[index];
    arr[index] = arr[randomIdx];
    arr[randomIdx] = temp;
  });
  randomMap = {};
  return arr;
}

function getNotRepeatIdx(arr: any[]): number {
  let randomIdx = getRandomIdx(arr.length - 1);
  if (!randomMap[randomIdx]) {
    return randomIdx;
  } else {
    return getNotRepeatIdx(arr);
  }
}

function getRandomIdx(max: number) {
  let res = Math.floor(Math.random() * (max + 1));
  return res;
}
