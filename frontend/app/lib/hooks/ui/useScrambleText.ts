import { useEffect, useRef, useState } from "react";
import { useScramble } from "use-scramble";

/**
 * Allow to return each element of the array in turn
 * @param array - array of strings
 * @returns generator function
 */
function* generatorQueue<T>(array: T[]): Generator<T, void, unknown> {
  let index = 0;
  while (true) {
    if (index >= array.length) {
      index = 0;
    }
    yield array[index];
    index++;
  }
}

/**
 * Allow to scramble text by the turn
 * @param initialText first text to scramble
 * @param textArray array of texts to scramble
 */
export default function useScrambleText(
  initialText: string,
  textArray: string[],
) {
  const [text, setText] = useState(initialText);
  const genRef = useRef(generatorQueue(textArray));
  const { ref, replay } = useScramble({
    playOnMount: false,
    text: text,
    speed: 0.3,
    tick: 1,
    seed: 2,
    scramble: 1,
    step: 2,
    range: [65, 72],
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const next = genRef.current.next();
      setText(next.value!);
      replay();
    }, 3000);
    return () => clearInterval(interval);
  }, [replay]);

  return ref;
}
