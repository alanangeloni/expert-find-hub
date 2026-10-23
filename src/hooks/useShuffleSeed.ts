import { useEffect, useState } from "react";

/**
 * 0 during the prerendered/first render (stable order, so hydration matches),
 * then a random seed after the page loads so advisor order stays fair.
 */
export const useShuffleSeed = () => {
  const [seed, setSeed] = useState(0);
  useEffect(() => setSeed(Math.floor(Math.random() * 2 ** 31) + 1), []);
  return seed;
};
