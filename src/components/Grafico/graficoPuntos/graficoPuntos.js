import React, { useEffect } from "react";
import Chart from "chart.js";

const GraficoPuntos = (props) => {
  const canvasRef = React.createRef();

  useEffect(() => {
    let myChart = new Chart(canvasRef.current, {
      type: "line",
      data: {
        labels: props.data.map((d) => d.Fecha),
        datasets: [
          {
            label: props.title,
            data: props.data.map((d) => d.Valor.replace(",", ".")),
            fill: "none",
            backgroundColor: props.color,
            pointRadius: 2,
            borderColor: props.color,
            borderWidth: 1,
            lineTension: 0,
          },
        ],
      },
    });
    return () => {
      myChart.destroy();
    };
  });

  return <canvas id="mycanvas2" ref={canvasRef} />;
};

export default GraficoPuntos;
