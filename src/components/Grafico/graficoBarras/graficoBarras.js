import React, { useEffect, useRef } from "react";
import Chart from "chart.js";

const GraficoBarras = (props) => {
  const canvasRef = useRef();
  let myChart = null;

  useEffect(() => {
    if (myChart) myChart.destroy();
    myChart = new Chart(canvasRef.current, {
      type: "bar",
      data: {
        labels: props.data.map((d) => d.Fecha),
        datasets: [
          {
            label: props.title,
            data: props.data.map((d) => d.Valor.replace(",", ".")),
            backgroundColor: props.color,
          },
        ],
      },
    });
    return () => {
      myChart.destroy();
    };
  });

  return <canvas id="mycanvas" ref={canvasRef} />;
};

export default GraficoBarras;
