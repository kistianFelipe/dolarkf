import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import Grafico from "../components/Grafico/grafico";
import {
  Grid,
  Container,
  Card,
  Segment,
  Icon,
  Divider,
} from "semantic-ui-react";

const Dolar = (props) => {
  let max = 0;
  let min = 0;
  let prom = 0;
  let cargado = false;
  const [resultado, setResultado] = useState(null);

  const formateaFecha = (fechaEntrada) => {
    let fechaSalida = fechaEntrada.replace("-", "");
    fechaSalida = fechaSalida.replace("-", "");
    return fechaSalida;
  };

  const calculaPromedio = async (fechaInicio, fechaFinal, actualiza) => {
    if (cargado || actualiza) {
      const fechaMasAntigua = sessionStorage.getItem("fechaMasAntigua");
      const datos = await JSON.parse(sessionStorage.getItem("datos"));
      if (formateaFecha(fechaInicio) - fechaMasAntigua >= 0) {
        let busqueda = [];
        datos.map((dato) => {
          if (
            new Date(dato.Fecha).getTime() - new Date(fechaInicio).getTime() >=
              0 &&
            new Date(dato.Fecha).getTime() - new Date(fechaFinal).getTime() <= 0
          ) {
            busqueda = [...busqueda, dato];
          }
        });
        setResultado(busqueda);
      } else {
        conectaApi(formateaFecha(fechaInicio));
      }
    }
  };

  const conectaApi = async (primeraCarga) => {
    const fechaActual = new Date();
    let dia = (fechaActual.getDate() < 10 ? "0" : "") + fechaActual.getDate();
    let mes =
      (fechaActual.getMonth() + 1 < 10 ? "0" : "") +
      (fechaActual.getMonth() + 1);
    let ano = fechaActual.getFullYear();
    let anoFinal = ano - 1;
    let fechaInicial = anoFinal + mes + dia;
    const apiKey = "aca va la api key";
    let url = null;
    if (primeraCarga === true) {
      url = `https://api.sbif.cl/api-sbifv3/recursos_api/dolar/periodo/${anoFinal}/${mes}/dias_i/${dia}/${ano}/${mes}/dias_f/${dia}?apikey=${apiKey}&formato=json`;
      fetch(url)
        .then((response) => response.json())
        .then((data) => guardaInfoEnStorage(data, fechaInicial, "primera"))
        .catch((error) => console.log(error));
    } else {
      //ultima fecha cargada serian la fecha hasta
      const ultimaFecha = sessionStorage.getItem("fechaMasAntigua");
      const anoHasta = ultimaFecha.slice(0, 4);
      const mesHasta = ultimaFecha.slice(4, 6);
      const diaHasta = ultimaFecha.slice(6, 8);
      // fecha desde, es la que entró como primeraCarga
      ano = primeraCarga.slice(0, 4);
      const mesI = primeraCarga.slice(4, 6);
      const diaI = primeraCarga.slice(6, 8);
      url = `https://api.sbif.cl/api-sbifv3/recursos_api/dolar/periodo/${ano}/${mesI}/dias_i/${diaI}/${anoHasta}/${mesHasta}/dias_f/${diaHasta}?apikey=${apiKey}&formato=json`;
      fetch(url)
        .then((response) => response.json())
        .then((data) => guardaInfoEnStorage(data, primeraCarga, "segunda"))
        .catch((error) => console.log(error));
    }
  };

  useEffect(() => {
    const primeraCarga = true;
    conectaApi(primeraCarga);
  }, []); //component did mount

  useEffect(() => {
    let actualiza = false;
    if (resultado) actualiza = true;
    calculaPromedio(props.fechaInicio, props.fechaFinal, actualiza);
  }, [props.fechaInicio, props.fechaFinal]);

  const guardaInfoEnStorage = (response, fechaInicial, carga) => {
    let datos = Object.values(response.Dolares);
    sessionStorage.setItem("primeraCarga", true);
    if (carga === "primera") {
      sessionStorage.setItem("fechaMasAntigua", fechaInicial);
      sessionStorage.setItem("datos", JSON.stringify(datos));
      cargado = true;
      calculaPromedio(props.fechaInicio, props.fechaFinal, false);
    } else {
      sessionStorage.setItem("fechaMasAntigua", fechaInicial);
      const datosActuales = JSON.parse(sessionStorage.getItem("datos"));
      const datosNuevos = [...datosActuales, ...datos];
      sessionStorage.setItem("datos", JSON.stringify(datosNuevos));
      cargado = true;
      calculaPromedio(props.fechaInicio, props.fechaFinal, false);
    }
  };

  let grafico = null;
  if (resultado) {
    const arregloDolares = resultado.map((item) => parseFloat(item.Valor));
    const sumaTotal = arregloDolares.reduce((previous, current) => {
      return previous + current;
    });
    prom = sumaTotal / resultado.length;
    min = Math.min(...arregloDolares);
    max = Math.max(...arregloDolares);

    grafico = <Grafico datos={resultado} tipo={props.tipo} />;
  }

  return (
    <Container>
      <Segment>
        <Grid.Row centered color="black" textAlign="center">
          <Card.Group centered>
            <Card>
              <Card.Header>
                <Icon name="arrow alternate circle up" />
                Maximo
              </Card.Header>
              ${resultado ? max : 0}
            </Card>
            <Card>
              <Card.Header>
                <Icon name="money bill alternate outline" />
                Promedio
              </Card.Header>
              ${resultado ? Math.round(prom) : 0}
            </Card>
            <Card>
              <Card.Header>
                <Icon name="arrow alternate circle down" />
                Minimo
              </Card.Header>
              ${resultado ? min : 0}
            </Card>
          </Card.Group>
        </Grid.Row>
        <Divider />
        <Grid.Row>{grafico}</Grid.Row>
      </Segment>
    </Container>
  );
};

export default withRouter(Dolar);
