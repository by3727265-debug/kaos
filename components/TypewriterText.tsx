"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  text: string;
  speed?: number;
  onDone?: () => void;
};

/** Metni karakter karakter yazan "daktilo" efekti. */
export default function TypewriterText({ text, speed = 16, onDone }: Props) {
  const [visible, setVisible] = useState(0);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    setVisible(0);
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setVisible(i);
      if (i >= text.length) {
        clearInterval(id);
        doneRef.current?.();
      }
    }, speed);

    return () => clearInterval(id);
  }, [text, speed]);

  if (text.length === 0) return null;

  return (
    <span>
      {text.slice(0, visible)}
      {visible < text.length && <span className="tw-caret">▍</span>}
    </span>
  );
}