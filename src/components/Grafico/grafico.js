import BarChart from "./graficoBarras/graficoBarras";
import LineChart from "./graficoPuntos/graficoPuntos";
import React, { useEffect, useState } from "react";

const Grafico = (props) => {
  let renderGrafico = null;
  const [render, setRender] = useState(null);
  const [tipo, setTipo] = useState("barras");

  useEffect(() => {
    renderGrafico = null;
    delete document.getElementById("#mycanvas");
    delete document.getElementById("#mycanvas2");
    if (props.datos.length !== 0) {
      setTipo(props.tipo);
      setRender(true);
    }
  }, [props.datos.length, props.tipo]);

  if (tipo === "barras" && render) {
    renderGrafico = (
      <BarChart data={props.datos} title="DOLAR" color="#70CAD1" />
    );
  } else if (tipo !== "barras" && render) {
    renderGrafico = (
      <LineChart data={props.datos} title="DOLAR" color="#3E517A" />
    );
  }
  return <div>{renderGrafico}</div>;
};

export default Grafico;
