import "../../App.css";
import React from "react";
import Tarjeta from "../Tarjeta/tarjeta";
import CustomHeader from "../Header/header";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import FindInPageIcon from "@mui/icons-material/FindInPage";
import DateRangeIcon from "@mui/icons-material/DateRange";
import StorageIcon from "@mui/icons-material/Storage";
import TagIcon from "@mui/icons-material/Tag";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import {
  ReactiveBase,
  DataSearch,
  ReactiveList,
  ResultList,
  MultiDataList,
  MultiList,
  DateRange,
  SelectedFilters,
  ToggleButton,
  SingleDataList,
  RangeSlider,
} from "@appbaseio/reactivesearch";
import { useNavigate, Navigate } from "react-router-dom";

function Filter1Title() {
  return (
    <div>
      <div className="AppFiltroIcono">
        {<FilterAltIcon fontSize="medium" />} <span>Formatos</span>
      </div>
    </div>
  );
}

function Filter2Title() {
  return (
    <div>
      <div className="AppFiltroIcono">
        {<FindInPageIcon fontSize="medium" />}{" "}
        <span>Páginas web que contienen...</span>
      </div>
    </div>
  );
}

function FilterFecha() {
  return (
    <div>
      <div className="AppFiltroIcono">
        {<DateRangeIcon fontSize="medium" />}{" "}
        <span>Filtrar por fecha de publicación</span>
      </div>
    </div>
  );
}

function FilterKeyword() {
  return (
    <div>
      <div className="AppFiltroIcono">
        {<TagIcon fontSize="medium" />} <span>Categoría</span>
      </div>
    </div>
  );
}

function FilterRelevancia() {
  return (
    <div>
      <div className="AppFiltroIcono">
        {<StarBorderIcon fontSize="medium" />} <span>Relevancia</span>
      </div>
    </div>
  );
}

function FormTitle() {
  return (
    <div>
      <div className="AppFiltroIcono">
        {<StorageIcon fontSize="medium" />} <span>Tipo de página</span>
      </div>
    </div>
  );
}

function moreValues(value, sizze) {
  var query = {
    query: {
      bool: {
        must: [],
        filter: [
          {
            match_all: {},
          },
        ],
      },
    },
  };
  for (var i = 0; i < sizze; i++) {
    var template = {
      match_phrase: {
        "tagsChildren.keyword": {
          query: "",
        },
      },
    };
    template["match_phrase"]["tagsChildren.keyword"]["query"] = value[i];
    query["query"]["bool"]["filter"].push(template);
    //console.log(JSON.stringify(query));
  }
  return query;
}

function zeroValues() {
  var query = {
    query: {
      bool: {
        must: [],
        filter: [
          {
            match_all: {},
          },
        ],
      },
    },
  };
  return query;
}

function myQuery(value, props) {
  // value = botones que están clickados
  // hacer que la query sea: docs con PDF Y XML (ambos)
  // console.log(value.length);
  if (value.length === 0) return zeroValues();
  if (value.length > 0) return moreValues(value, value.length);
}

// dame los documentos publicados justo en esa fecha
function DateQuery(value, props) {
  var query = {
    query: { bool: { must: [], filter: { range: {} } } },
  };
  if (value) {
    let pregunta = { fecha_pub: { gte: value, lte: value } };
    query["query"]["bool"]["filter"]["range"] = pregunta;
    return query;
  } else return null;
}

function Principal(props) {
  /* para movernos por la app */
  //const navigate = useNavigate();

  // rebotar al login si no has iniciado sesión
  if (
    localStorage.getItem("userToken") == null ||
    localStorage.getItem("userTipo") !== "admin"
  ) {
    return <Navigate to="/login" />;
  }
  /*if (!props.logueado) {
    return <Navigate to="/login" />;
  }*/
  return (
    <ReactiveBase app="nutch" url="http://localhost:9200">
      <div className="App"></div>
      <CustomHeader userName={localStorage.getItem("userName")} />
      <br />
      <div className="row reverse-labels">
        <div
          className="col"
          style={{
            backgroundColor: "#ECECEC",
          }}
        >
          <MultiDataList
            componentId="Formato"
            placeholder="Buscar formato"
            dataField="mimeType.keyword"
            data={[
              {
                label: ".pdf",
                value: "application/pdf",
              },
              {
                label: ".doc",
                value: "application/msword",
              },
              {
                label: ".xml",
                value: "application/xml",
              },
              {
                label: ".html",
                value: "application/octet-stream",
              },
              {
                label: ".docx",
                value:
                  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
              },
              {
                label: ".xlsx",
                value:
                  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
              },
              {
                label: ".pptx",
                value:
                  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
              },
            ]}
            title={<Filter1Title />}
            showCount="true"
            showSearch={false}
          />
          <br />
          <MultiList
            placeholder="Buscar tipo de fichero(s)"
            componentId="Contiene"
            dataField="tagsChildren.keyword"
            title={<Filter2Title />}
            customQuery={myQuery}
          />
          <br />
          <ToggleButton
            componentId="TipoDePagina"
            title={<FormTitle />}
            dataField="tipo.keyword"
            innerClass={{
              button: "botNotFormCont",
            }}
            className="botoncitosFormulario"
            data={[
              { label: "Contenido", value: "contenido" },
              { label: "Noticia", value: "noticia" },
              { label: "Formulario", value: "aplicacion" },
            ]}
          />
          <br />
          <br />
          <DateRange
            componentId="Fechas"
            //placeholder="Seleccione una fecha"
            dataField="fecha_pub"
            queryFormat="date"
            placeholder={{
              start: "Fecha de inicio",
              end: "Fecha de fin",
            }}
            title={<FilterFecha />}
            focused={false}
            showClear={true}
            //customQuery={DateQuery}
          />
          <br />
          <br />
          <SingleDataList
            componentId="Categoría"
            title={<FilterKeyword />}
            showSearch={false}
            dataField="keyword.keyword"
            data={[
              {
                label: "Agricultura",
                value: "agricultura",
              },
              {
                label: "Ganadería",
                value: "ganaderia",
              },
              {
                label: "Pesca",
                value: "pesca",
              },
              {
                label: "Alimentación",
                value: "alimentacion",
              },
              {
                label: "Desarrollo rural",
                value: "desarrollo-rural",
              },
              {
                label: "Cartografía y SIG",
                value: "cartografia-y-sig",
              },
              {
                label: "Otros",
                value: "otros",
              },
            ]}
          />
          <br />
          <RangeSlider
            componentId="Relevancia"
            dataField="userScoring"
            title={<FilterRelevancia />}
            range={{
              start: 0,
              end: 5,
            }}
            stepValue={1}
            showHistogram={true}
            rangeLabels={{
              start: "0 Estrellas",
              end: "5 Estrellas",
            }}
          />
        </div>
        <div className="col">
          <DataSearch
            componentId="mainSearch"
            dataField={["title"]}
            //className="search-bar"
            placeholder="Búsqueda genérica"
            react={{
              and: "mainSearch",
            }}
          />
          {/*<div className="customOrdenar">
            Ordenar por: <CustomOrder />
          </div>*/}
          <br />
          <SelectedFilters />
          <ReactiveList
            componentId="SearchResult"
            //dataField="title.keyword"
            //sortBy="desc"
            size={5}
            //className="result-list-container"
            pagination
            showLoader={true}
            loader="Cargando resultados.."
            URLParams
            /*sortOptions={[
              {
                label: "Fecha pub. - Más antigua primero",
                dataField: "fecha_pub",
                sortBy: "asc",
              },
              {
                label: "Fecha pub. - Más reciente primero",
                dataField: "fecha_pub",
                sortBy: "desc",
              },
              {
                label: "Título - Alfabéticamente",
                dataField: "title.keyword",
                sortBy: "asc",
              },
              {
                label: "Título - Alfabéticamente inverso",
                dataField: "title.keyword",
                sortBy: "desc",
              },
              {
                label: "Relevancia - Mayor a menor",
                dataField: "userScoring",
                sortBy: "desc",
              },
            ]}*/
            renderNoResults={function () {
              return (
                <div>
                  No se encontraron resultados
                  <SentimentVeryDissatisfiedIcon
                    style={{ marginLeft: 5, verticalAlign: "middle" }}
                  />
                </div>
              );
            }}
            react={{
              and: [
                "mainSearch",
                "Contiene",
                "Formato",
                "TipoDePagina",
                "Fechas",
                "Categoría",
                "Relevancia",
              ],
            }}
            renderResultStats={function (stats) {
              return (
                <p className="statResult">
                  {stats.displayedResults} de {stats.numberOfResults} resultados
                  encontrados en {stats.time} ms
                </p>
              );
            }}
            render={({ data }) => (
              <ReactiveList.ResultListWrapper>
                {data.map((item) => (
                  <ResultList
                    key={item._id}
                    style={{
                      borderWidth: 1,
                      borderColor: "black",
                      maxWidth: 800,
                    }}
                  >
                    <ResultList.Content>
                      <Tarjeta item={item} />
                    </ResultList.Content>
                  </ResultList>
                ))}
              </ReactiveList.ResultListWrapper>
            )}
          />
        </div>
      </div>
    </ReactiveBase>
  );
}

export default Principal;

// crear el boton "this is not a form" de feedback para decirle a elsasticseacrh que le baje la prioridad.
// hooks -> cuando detecte que algun evento se hace. dispara un proceso en segundo plano para hacer algo

// El DataSearch lo puedo literalmente customizar como quiera. Puedo meterle
// un className con los css que yo quiera, cambiarle el icono que viene por defecto
// y demás (https://docs.appbase.io/docs/reactivesearch/v3/search/datasearch/).

// ** antes había queryFormat: "and" en el ReactiveList de la línea 146
