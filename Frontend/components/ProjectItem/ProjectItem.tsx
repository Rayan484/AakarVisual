import React from "react";
import { Card } from "react-bootstrap";
import styles from "./ProjectItem.module.css";

function ProjectItem(props: any) {
  return (
    <Card className={`text-white text-center ${styles.projectcard}`}>
      <Card.Img src={props.img} alt="Project image" />
      <Card.ImgOverlay>
        <Card.Title className={styles.cardtitle}>{props.title}</Card.Title>
      </Card.ImgOverlay>
    </Card>
  );
}

export default ProjectItem;
