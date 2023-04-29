import React, { useState, useEffect, useCallback, useRef } from "react";
import panelStyles from "./Panel.module.scss";
import ModuleTitle from "./ModuleTitle";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";

const PredictionList = React.memo(function ({
  stopsSequence,
  prediction,
  onListRendered,
}) {
  const startFrom = 11;
  let abort = false;
  let abortIndex = null;
  const predictionListEl = stopsSequence.slice(startFrom).map((stop, index) => {
    if (abort) return null;
    const isBunched = prediction[index];
    const status = isBunched ? "Bunch" : "Fine";
    const buttonVariant = isBunched ? "danger" : "success";
    if (isBunched) {
      abort = true;
      abortIndex = index;
    }
    return (
      <ListGroup.Item key={index} className={panelStyles.tripListItem}>
        <Button
          variant="secondary"
          className={`p-0 ${panelStyles.tripButton} ${panelStyles.nextButton}`}
        >{`Next ${index + startFrom}`}</Button>
        {stop.name}
        <Button
          variant={buttonVariant}
          className={`p-0 ${panelStyles.tripButton} ${panelStyles.resultButton}`}
        >
          {status}
        </Button>
      </ListGroup.Item>
    );
  });
  const listRef = useRef(null);
  useEffect(() => {
    if (listRef.current && onListRendered) {
      onListRendered(listRef.current);
    }
  }, [listRef, onListRendered]);

  const message =
    abort && abortIndex <= 10
      ? "Predictions not available after initiation of bunching."
      : "Predictions not available after 20 stops ahead";
  return (
    <ListGroup ref={listRef} variant="flush" className={panelStyles.tripList}>
      {predictionListEl}
      <ListGroup.Item className={panelStyles.tripListItem}>
        {message}
      </ListGroup.Item>
    </ListGroup>
  );
});

export default React.memo(function ({ stopsArray, currentStop, prediction }) {
  console.log(currentStop);
  const [stopsSequence, setStopsSequence] = useState([]);
  useEffect(() => {
    stopsArray.forEach((stop, index) => {
      if (Number(stop.id) === Number(currentStop)) {
        const sliced = stopsArray.slice(index, index + 20);
        setStopsSequence(stopsArray.slice(index, index + 20));
        return;
      }
    });
  }, [currentStop]);
  const modalContent =
    "Predict whether a trip is going to bunch in the near future";

  // Automatically scroll to the bottom of the list
  const handleListRendered = useCallback((listElement) => {
    listElement.scrollTop = listElement.scrollHeight;
  }, []);
  return (
    <div className={`${panelStyles.module} ${panelStyles.resultModule}`}>
      <ModuleTitle
        title={"Prediction Results"}
        modalHeading={"Prediction Results"}
        modalContent={modalContent}
      />
      <PredictionList
        onListRendered={handleListRendered}
        stopsSequence={stopsSequence}
        prediction={prediction}
      />
    </div>
  );
});
