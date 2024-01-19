import styles from "./Testimonial.module.css";
import React, { useEffect, useRef, useState } from "react";

const TESTIMONIAL_DELAY = 3000;

const Testimonial = (props: any) => {
  const { testimonialData } = props;
  const refFeedbackParentDiv = useRef<any>(null);
  const refButtonsParentDiv = useRef<any>(null);
  const timeoutRef = useRef<any>(null);
  const [delay, setDelay] = useState<number>(100);
  const [index, setIndex] = useState<number>(0);

  useEffect(() => setDelay(TESTIMONIAL_DELAY), []);

  useEffect(() => {
    timeoutRef.current = setTimeout(
      () =>
        setIndex((prevIndex) =>
          prevIndex === props.testimonialData.length - 1 ? 0 : prevIndex + 1
        ),
      delay
    );

    return () => clearTimeout(timeoutRef.current);
  }, [props.testimonialData.length, index, delay]);

  const dotsHelper = (idx: number) => {
    if (refButtonsParentDiv.current === null) return;

    if (index === idx) {
      const arr2 = [...refFeedbackParentDiv.current.children];

      arr2.forEach((el, i) => {
        if (window.document.querySelector(`.feedbackText--${i}`))
          document
            ?.querySelector(`.feedbackText--${i}`)
            ?.classList.add(styles["not-visible"]);
      });

      arr2[index + 1].classList.remove(styles["not-visible"]);

      return styles["myDot--active"];
    }
  };

  const dotClickHandler = (arr: any, indx: number) => {
    setIndex(indx);
    arr.forEach((_el: any, i: number) => {
      document
        ?.querySelector(`.feedbackText--${i}`)
        ?.classList.add(styles["not-visible"]);
      document
        ?.querySelector(`.buttonDot${i}`)
        ?.classList.remove(styles["myDot--active"]);
    });
    document
      ?.querySelector(`.feedbackText--${indx}`)
      ?.classList.remove(styles["not-visible"]);
    document
      ?.querySelector(`.buttonDot${indx}`)
      ?.classList.add(styles["myDot--active"]);
  };

  return (
    <div className={`${styles["section-three-main-div"]} testimonial`}>
      <div
        ref={refFeedbackParentDiv}
        className={styles["section-three-sub-div-one"]}
      >
        <div
          className={`${styles["quotes-img"]} ${styles["quotes-img-right"]}`}
        />
        {testimonialData.map((el: any, i: number) => {
          return (
            <div
              key={i}
              className={`feedbackText--${i} ${styles["main-quotes-div"]} ${styles["not-visible"]}`}
            >
              <div className={styles.para}>{el.testimonial}</div>
              <div className={styles.subText}>{el.author}</div>
            </div>
          );
        })}
        <div
          className={`${styles["quotes-img"]} ${styles["quotes-img-left"]}`}
        />
      </div>
      <div ref={refButtonsParentDiv}>
        {testimonialData.map((_: any, i: number, arr: any) => {
          return (
            <div
              nonce="change testimonial"
              key={i}
              className={`buttonDot${i} ${styles.myDot} ${
                index === i ? dotsHelper(i) : ""
              }`}
              onClick={() => dotClickHandler(arr, i)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default React.memo(Testimonial);
