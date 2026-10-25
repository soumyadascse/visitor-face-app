export const euclideanDistance = (
  descriptor1: number[],
  descriptor2: number[]
) => {

  let sum = 0;

  for (
    let i = 0;
    i < descriptor1.length;
    i++
  ) {

    sum += Math.pow(
      descriptor1[i] -
      descriptor2[i],
      2
    );

  }

  return Math.sqrt(sum);
};