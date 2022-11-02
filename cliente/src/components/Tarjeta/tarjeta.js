import React, { useState } from "react";
import { ResultList } from "@appbaseio/reactivesearch";
import Rating from "@mui/material/Rating";
import BotonesCard from "../BotonesCard/botonesCard";

// función que rellena las estrellas en base al valor numérico de la relevancia.
function rellenarEstrellas(scoring) {
  /*if (scoring >= 0 && scoring <= 9) return 0;
  else if (scoring >= 10 && scoring <= 27) return 1;
  else if (scoring >= 28 && scoring <= 45) return 2;
  else if (scoring >= 46 && scoring <= 63) return 3;
  else if (scoring >= 63 && scoring <= 81) return 4;
  else return 5;*/

  if (scoring > 5) return 5;
  else return scoring;
}

// componente Tarjeta que se encarga de renderizar la información en partcicular
// de cada elemento de la lista.
function Tarjeta(item) {
  let titulo_doc = item.item.title;
  if (titulo_doc === undefined) titulo_doc = "[Title N/A]";
  const [tit, setTit] = useState(titulo_doc);
  // HOOK para que cuando se edite el documento, se actualice el título tb.
  const handleTitleUpdate = (valor) => {
    setTit(valor);
  };

  const [rel, setRel] = useState(item.item.userScoring);
  // HOOK para la relevancia al darle like.
  const handleScoringUpdate = () => {
    setRel(rel + 1);
  };

  const [tipo, setTipo] = useState(item.item.tipo);
  // HOOK para la relevancia al darle like.
  const handleTypeUpdate = (tipo) => {
    setTipo(tipo);
  };

  // en los ficheros no hay metadatos (fecha_pub) así que metemos un N/A
  let fechaPub = item.item.fecha_pub;
  if (fechaPub === undefined) fechaPub = "N/A";

  return (
    <>
      <ResultList.Title>
        <div
          className="page-title"
          dangerouslySetInnerHTML={{
            __html: tit,
          }}
        />
      </ResultList.Title>
      <ResultList.Description>
        <div className="flex column justify-space-between">
          <div>
            src:
            <span className="url">
              {" "}
              <a target="_blank" href={item.item.url} rel="noreferrer">
                {item.item.url}
              </a>
            </span>
            {/*Categoría:
            <span className="url"> {item.item.keyword}</span>*/}
          </div>
          <div className="relevancia">
            Relevancia:{" "}
            <Rating
              name="read-only"
              value={rellenarEstrellas(rel)}
              readOnly
              style={{ verticalAlign: "middle" }}
            />
            {"  ("}
            {rel}
            {")"}
          </div>
          <div className="fechaPub">Fecha de publicación: {fechaPub}</div>
        </div>
      </ResultList.Description>
      <div className="botonesCard">
        <BotonesCard
          obj={item.item}
          tituloTarjeta={tit}
          handleTitleUpdate={handleTitleUpdate}
          tipoTarjeta={tipo}
          handleTypeUpdate={handleTypeUpdate}
          handleScoringUpdate={handleScoringUpdate}
        />
      </div>
      <br />
    </>
  );
}

export default Tarjeta;
