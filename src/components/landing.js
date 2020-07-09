import React, { useState, useEffect } from "react";
import Dolar from "../containers/dolar";
import {
  Container,
  Grid,
  Header,
  Input,
  Select,
  Icon,
  Card,
} from "semantic-ui-react";

const Landing = () => {
  const [deshabilitado, setDeshabilitado] = useState(true);
  const [fechaInicio, setFechaInicio] = useState(null);
  const [fechaFinal, setFechaFinal] = useState(null);
  const [grafico, setGrafico] = useState("barras");
  const [disableFechaFinal, setDisableFechaFinal] = useState(true);
  const [maxFechaInicio, setMaxFechaInicio] = useState(
    new Date(Date.now() - 2 * 86400000).toISOString().split("T")[0]
  );
  const [maxFechaFin, setMaxFechaFin] = useState(
    new Date(Date.now() - 86400000).toISOString().split("T")[0]
  );
  const [minFechaInicio, setMinFechaInicio] = useState("2000-01-01");
  const [minFechaFin, setMinFechaFin] = useState("2000-01-01");

  const modificaFechaFinal = (event) => {
    setMaxFechaInicio(event.target.value);
    setFechaFinal(event.target.value);
  };
  const modificaFechaInicio = (event) => {
    setFechaInicio(event.target.value);
    setMinFechaFin(event.target.value);
    setDisableFechaFinal(false);
  };

  useEffect(() => {
    const dateDiff = new Date(fechaFinal) - new Date(fechaInicio);
    if (dateDiff > 0) {
      setDeshabilitado(false);
    } else {
      setDeshabilitado(true);
    }
  }, [fechaFinal, fechaInicio]);

  let dolar = null;
  if (!deshabilitado) {
    dolar = (
      <Dolar
        fechaInicio={fechaInicio}
        fechaFinal={fechaFinal}
        apiKey="9c84db4d447c80c74961a72245371245cb7ac15f"
        tipo={grafico}
      />
    );
  }
  const options = [
    { key: "barras", text: "barras", value: "barras" },
    { key: "puntos", text: "puntos", value: "puntos" },
  ];

  return (
    <Container>
      <Header as="h2" color="blue" icon textAlign="center">
        <Icon loading name="money bill alternate outline" circular />
        <Header.Content>Valor histórico del dolar</Header.Content>
      </Header>
      <Grid inverted divided columns="equal">
        <Grid.Row centered textAlign="center">
          <Card.Group centered>
            <Card>
              <Card.Header>Fecha de inicio</Card.Header>
              <Card.Content>
                <Input
                  type="date"
                  name="fechaInicio"
                  max={maxFechaInicio}
                  min={minFechaInicio}
                  onChange={modificaFechaInicio}
                />
              </Card.Content>
            </Card>
            <Card>
              <Card.Header>Fecha final</Card.Header>
              <Card.Content>
                <Input
                  disabled={disableFechaFinal}
                  type="date"
                  name="fechaFinal"
                  max={maxFechaFin}
                  min={minFechaFin}
                  onChange={modificaFechaFinal}
                />
              </Card.Content>
            </Card>

            <Card>
              <Card.Header>Tipo de grafico</Card.Header>
              <Card.Content>
                <Select
                  options={options}
                  defaultValue="barras"
                  onChange={(e) => setGrafico(e.currentTarget.textContent)}
                />
              </Card.Content>
            </Card>
          </Card.Group>
        </Grid.Row>
        <Grid.Row>{dolar}</Grid.Row>
      </Grid>
    </Container>
  );
};

export default Landing;
