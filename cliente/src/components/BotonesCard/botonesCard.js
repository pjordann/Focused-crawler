import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import EditIcon from "@mui/icons-material/Edit";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import Swal from "sweetalert2";
import axios from "axios";
// importamos la variable de posibles ficheros
import MIME_TYPES from "./mimetypes.js";
import { URL_API } from "../../services/apiService";

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  width: 410,
  iconColor: "white",
  customClass: {
    popup: "colored-toast",
  },
  showConfirmButton: false,
  timer: 3000,
});

/*
 * Hacemos las funcion para los tags. A cada tag le pasamos el texto del boton
 * y el color del mismo.
 */
function BotonOtros(data) {
  const numFicheros = data.val[0];
  const url = data.val[1];
  const textoBoton = "OTROS(" + numFicheros + ")";
  return (
    <Button
      variant="contained"
      style={{ backgroundColor: "#610707" }}
      size="small"
      sx={{ fontWeight: "bold" }}
      onClick={() => window.open(url, "_blank", "noopener,noreferrer")}
    >
      {textoBoton}
    </Button>
  );
}

/* Las dos siguientes funciones...
 * Gestionan el tag del fichero .pdf, .xlsx, .docx
 * Al clickar, nos lleva al HTML donde lo podemos encontrar.
 */

function mostrarBotonUnicoFichero(informacion) {
  if (informacion.mimeType === "application/pdf")
    return <BotonIndividual val={["#bc4026", "PDF", informacion.inlinks]} />;
  if (informacion.mimeType === "application/xml")
    return <BotonIndividual val={["#c9c83f", "XML", informacion.inlinks]} />;
  if (informacion.mimeType === "application/msword")
    return <BotonIndividual val={["#3453C3", "MSWORD", informacion.inlinks]} />;
  if (
    informacion.mimeType ===
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  )
    return <BotonIndividual val={["#3CE02F", "XLSX", informacion.inlinks]} />;
  if (
    informacion.mimeType ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  )
    return <BotonIndividual val={["#72B7E7", "DOCX", informacion.inlinks]} />;
  // para un simple HTML, saco su link, no el de su padre.
  if (informacion.mimeType === "application/octet-stream")
    return <BotonIndividual val={["#FF8840", "HTML", informacion.url]} />;
  if (
    informacion.mimeType ===
    "application/vnd.openxmlformats-officedocument.presentationml.presentation"
  )
    return <BotonIndividual val={["#DE89F3", "PPTX", informacion.url]} />;
}

// mostramos el botón directamente
function BotonIndividual(data) {
  const color = data.val[0];
  const texto = data.val[1];
  let url = data.val[2];
  // en caso de tener varios padres, cogemos uno sólo (el primero)
  url = url.toString().split(",")[0];

  return (
    <Button
      variant="contained"
      style={{ backgroundColor: color, fontWeight: "bold" }}
      size="small"
      onClick={() => window.open(url, "_blank", "noopener,noreferrer")}
    >
      {texto}
    </Button>
  );
}

function BotonTag(data) {
  const color = data.val[0];
  const texto = data.val[1];
  const numFicheros = data.val[2];
  const url = data.val[3];
  const textoBoton = texto + "(" + numFicheros + ")";
  return (
    <Button
      variant="contained"
      style={{ backgroundColor: color, fontWeight: "bold" }}
      size="small"
      onClick={() => window.open(url, "_blank", "noopener,noreferrer")}
    >
      {textoBoton}
    </Button>
  );
}

/*
 * Recibe el objeto que recupera de Elastic. Miramos qué propiedades tiene
 * y mostramos esas propiedades como botones que apunten a esos recursos.
 * Por convención: XML: amarillo, PDF: rojo, Excel: verde, Ninguno: marrón
 * Devuelve los botones que tiene el componente en cuestión.
 */

function ShowTags(item) {
  var informacion = item.item;
  var xml, pdf, msword, docx, pptx, xlsx, otros;
  // si no tiene ningún fichero, pues nada
  if (
    informacion.tienePDF !== "true" &&
    informacion.tieneXML !== "true" &&
    informacion.tieneMSWORD !== "true" &&
    informacion.tieneDOCX !== "true" &&
    informacion.tienePPTX !== "true" &&
    informacion.tieneXLSX !== "true" &&
    informacion.tieneOTROS !== "true"
  ) {
    return mostrarBotonUnicoFichero(informacion);
  }
  // para cada fichero que tenga, lo sacamos
  if (informacion.tienePDF === "true")
    pdf = (
      <BotonTag val={["#bc4026", "PDF", informacion.numPDF, informacion.url]} />
    );
  if (informacion.tieneXML === "true")
    xml = (
      <BotonTag val={["#c9c83f", "XML", informacion.numXML, informacion.url]} />
    );
  if (informacion.tieneMSWORD === "true")
    msword = (
      <BotonTag
        val={["#3453C3", "MSWORD", informacion.numMSWORD, informacion.url]}
      />
    );
  if (informacion.tieneDOCX === "true")
    docx = (
      <BotonTag
        val={["#72B7E7", "DOCX", informacion.numDOCX, informacion.url]}
      />
    );
  if (informacion.tienePPTX === "true")
    pptx = (
      <BotonTag
        val={["#DE89F3", "PPTX", informacion.numPPTX, informacion.url]}
      />
    );
  if (informacion.tieneXLSX === "true")
    xlsx = (
      <BotonTag
        val={["#3CE02F", "XLSX", informacion.numXLSX, informacion.url]}
      />
    );
  if (informacion.tieneOTROS === "true")
    otros = <BotonOtros val={[informacion.numOTROS, informacion.url]} />;
  return (
    <>
      {pdf}
      {xml}
      {msword}
      {docx}
      {pptx}
      {xlsx}
      {otros}
    </>
  );
}

// alerta que sale cuando pulsamos botón manda petición a campo de elastic
function alerta(id, handleScoringUpdate) {
  // pasamos a back el target id url-encoded
  console.log(encodeURIComponent(id));
  const tokenValue = localStorage.getItem("userToken");
  const URL_LIKE = URL_API + "/like";
  axios
    .put(
      URL_LIKE,
      {
        id: encodeURIComponent(id),
      },
      {
        headers: { Authorization: `Bearer ${tokenValue}` },
      }
    )
    .then((response) => {
      //console.log(response);
      Swal.fire({
        icon: "success",
        showCancelButton: false,
        showConfirmButton: false,
        title: "Apuntado!",
        text: "Ahora el documento tiene más relevancia",
      });
      handleScoringUpdate();
    })
    .catch((err) => {
      //console.log(err);
      if (err.response.status === 403) {
        Swal.fire({
          icon: "error",
          showCancelButton: false,
          showConfirmButton: false,
          title: "Acción no permitida",
          text: "No tienes permiso para hacer esto",
        });
      } else {
        Swal.fire({
          icon: "error",
          showCancelButton: false,
          showConfirmButton: false,
          title: "Oops!",
          text: "Parece ser que algo ha ido mal en el servidor...",
        });
      }
    });
}

// detectamos los tags originales que se quitan
function tagsAntesSiAhoraNo(dataPre, dataPost) {
  // 1. de lo que había antes, miramos lo que sigue estando
  let tagsQuitados = {};
  let ficherosConCantidad = dataPre.toString().split(",");

  ficherosConCantidad.forEach((item) => {
    let fichero_y_cantidad = item.split("-");
    let fichero = fichero_y_cantidad[0];
    if (!dataPost.includes(fichero)) {
      let propiedad = "tiene" + fichero;
      tagsQuitados[propiedad] = "false";
      let numero = "num" + fichero;
      tagsQuitados[numero] = 0;
    }
  });
  return tagsQuitados;
}

// detectamos los tags nuevos que se añaden
function tagsAntesNoAhoraSi(dataPre, dataPost) {
  let tagsAnyadidos = {};
  let ficherosConCantidad = dataPost.split(",");
  ficherosConCantidad.forEach((item) => {
    let fichero_y_cantidad = item.split("-");
    let fichero = fichero_y_cantidad[0];
    if (!dataPre.includes(fichero)) {
      let propiedad = "tiene" + fichero;
      tagsAnyadidos[propiedad] = "true";
      let numero = "num" + fichero;
      tagsAnyadidos[numero] = parseInt(fichero_y_cantidad[1]);
    } else {
      // si antes hay PDF-3 y ahora hay PDF-11, el fichero es el mismo pero el
      // numero no, lo actualizamos.
      let numero = "num" + fichero;
      tagsAnyadidos[numero] = parseInt(fichero_y_cantidad[1]);
    }
  });
  return tagsAnyadidos;
}

// documentos con tagsChildren=Ninguno que pasan a tener algo
function tagsChildrenNinguno_a_Algo(dataPost) {
  // si cambiamos de Ninguno a Ningno... caso especial
  if (dataPost === "Ninguno" || dataPost === "NINGUNO") {
    return {};
  }
  let listaFinal = [];
  let tagsAnyadidos = {};
  let ficherosConCantidad = dataPost.split(",");
  ficherosConCantidad.forEach((item) => {
    let fichero_y_cantidad = item.split("-");
    // tienePDF: true, tieneXLSX: true ...
    let propiedad = "tiene" + fichero_y_cantidad[0];
    tagsAnyadidos[propiedad] = "true";
    // numPDF: 5, numXLSX: 11 ...
    let numero = "num" + fichero_y_cantidad[0];
    let numero_integer = parseInt(fichero_y_cantidad[1]);
    tagsAnyadidos[numero] = numero_integer;
    // lista final para tagsChildren
    listaFinal.push(fichero_y_cantidad[0]);
  });
  let newTagsChildren = { tagsChildren: listaFinal };

  return {
    ...tagsAnyadidos,
    ...newTagsChildren,
  };
}

function eliminarTagsChildren(id) {
  const tokenValue = localStorage.getItem("userToken");
  const URL_ELIMINAR_TAGSCHILDREN = URL_API + "/tagsChildren";
  axios
    .post(
      URL_ELIMINAR_TAGSCHILDREN,
      {
        id: id,
      },
      {
        headers: { Authorization: `Bearer ${tokenValue}` },
      }
    )
    .then((res) => {
      console.log("Eliminación de tagsChildren ha ido bien");
    })
    .catch((err) => {
      console.log("Eliminación de tagsChildren ha ido mal" + err);
    });
}

// documentos con tagsChildren=[cositas] que pasa a valer tagsChildren=Ninguno
function tagsChildrenAlgo_a_Ninguno(dataPre, id) {
  // si dataPre es Ninguno, es decir, cambiamos de Ninguno a Ninguno..
  if (dataPre === "Ninguno" || dataPre === "NINGUNO") {
    return {};
  }
  let tagsQuitados = {};
  let ficherosConCantidad = dataPre.toString().split(",");
  ficherosConCantidad.forEach((item) => {
    let fichero_y_cantidad = item.split("-");
    // tienePDF: true, tieneXLSX: true ...
    let propiedad = "tiene" + fichero_y_cantidad[0];
    tagsQuitados[propiedad] = "false";
    // numPDF: 5, numXLSX: 11 ...
    let numero = "num" + fichero_y_cantidad[0];
    tagsQuitados[numero] = 0;
  });

  // ponemos tagsChildren a undefined
  eliminarTagsChildren(id);
  return {
    ...tagsQuitados,
  };
}

// crea el JSON con los campos que debo poner a false (ya no están) y los que
// debo poner a true (los que están). Ademñas, añado la nueva lista tagsChildren
function handleEditTagsChildren(dataPre, dataPost, id) {
  if (dataPre === "Ninguno" || dataPre === "NINGUNO") {
    // caso especial
    return tagsChildrenNinguno_a_Algo(dataPost);
  }
  if (dataPost === "Ninguno" || dataPost === "NINGUNO") {
    // caso especial que tengo ficheros en tagsChildren y pongo Ninguno
    return tagsChildrenAlgo_a_Ninguno(dataPre, id);
  }

  // convertimos a array (lista) el string de dataPost
  let lista_dataPost = dataPost.split(",");
  let listaFicherosSoloPost = [];
  lista_dataPost.forEach((item) => {
    listaFicherosSoloPost.push(item.split("-")[0]);
  });

  // tags que hay que poner a false, tags que se quitan. Ej: tienePDF: false
  let antesSiAhoraNo = tagsAntesSiAhoraNo(dataPre, listaFicherosSoloPost);
  // tags que hay que poner a true, nuevos tags que se añaden. Ej: tieneXML:true
  let dataPreSoloFicherosPre = [];
  dataPre
    .toString()
    .split(",")
    .forEach((item) => {
      dataPreSoloFicherosPre.push(item.split("-")[0]);
    });
  let antesNoAhoraSi = tagsAntesNoAhoraSi(dataPreSoloFicherosPre, dataPost);
  // actualizamos la ruta final que quedaría (la nueva que mete el usuario vamos)
  // Ej: tagsChildren: ["XML"]
  let newTagsChildren = { tagsChildren: listaFicherosSoloPost };

  // fusionamos la anterior información
  const reunirInfo = {
    ...antesSiAhoraNo,
    ...antesNoAhoraSi,
    ...newTagsChildren,
  };

  return reunirInfo;
}

// actualiza el documento en cuestión y dependiendo de la respuesta, muestra
// un Toast de error o de éxito. Ya me pasan el id URLencoded.
function handleEdit(
  result,
  id,
  handleTitleUpdate,
  handleTypeUpdate,
  ficherosHijo
) {
  let updatedTags = handleEditTagsChildren(
    ficherosHijo,
    result.value.newFicherosHijo,
    id
  );
  let updatedTitleType = {
    title: result.value.titulo,
  };
  if (result.value.tipo !== "fichero") {
    updatedTitleType["tipo"] = result.value.tipo;
  }
  const JSON_final = {
    ...updatedTitleType,
    ...updatedTags,
  };

  alert("JSON FINAL: " + JSON.stringify(JSON_final));
  const tokenValue = localStorage.getItem("userToken");
  const URL_EDITAR = URL_API + "/editar";
  axios
    .put(
      URL_EDITAR,
      {
        id: id,
        doc: JSON_final,
      },
      {
        headers: { Authorization: `Bearer ${tokenValue}` },
      }
    )
    .then(() => {
      Toast.fire({
        icon: "success",
        title: "¡Documento actualizado con éxito!",
      });
      // hooks
      handleTitleUpdate(result.value.titulo);
      handleTypeUpdate(result.value.tipo);
    })
    .catch((err) => {
      if (err.response.status === 403) {
        Swal.fire({
          icon: "error",
          showCancelButton: false,
          showConfirmButton: false,
          title: "Acción no permitida",
          text: "No tienes permiso para hacer esto",
        });
      } else {
        Swal.fire({
          icon: "error",
          showCancelButton: false,
          showConfirmButton: false,
          title: "Oops!",
          text: "Parece ser que algo ha ido mal en el servidor...",
        });
      }
    });
}

function mostrarFicherosCantidad(data) {
  //console.log("mostrar: " + JSON.stringify(data));
  let ficheros_y_cantidad = [];
  data.tagsChildren.forEach((item) => {
    let fichero = item;
    let campo = "num" + fichero;
    let cantidad = data[campo];
    let ficheroConCantidad = fichero + "-" + cantidad;
    ficheros_y_cantidad.push(ficheroConCantidad);
  });
  return ficheros_y_cantidad;
}

// funcionalidad asociada a editar
function formularioEditar(
  data,
  tituloTarjeta,
  handleTitleUpdate,
  tipoTarjeta,
  handleTypeUpdate
) {
  const titleValue = tituloTarjeta;
  let tipo = tipoTarjeta;
  let ficherosHijo = data.tagsChildren;
  if (ficherosHijo !== undefined) ficherosHijo = mostrarFicherosCantidad(data);
  // si no tenemos hijos, sacamos Ninguno
  if (ficherosHijo === undefined) ficherosHijo = "Ninguno";
  if (tipo === undefined) tipo = "fichero";
  return Swal.fire({
    title: "¡Ayúdanos a mejorar!",
    html: `
    <div class="input-container">
      <label for="titulo" class="textoLabel">Título del documento</label> 
      <input type="text" id="titulo" class="swal2-input" value="${titleValue}">
    </div>
    <div class="input-container">
      <label for="tipo" class="textoLabel">Tipo de documento</label> 
      <input type="text" id="tipo" class="swal2-input" value="${tipo}">
    </div>
    <div class="input-container">
      <label for="ficherosHijo" class="textoLabel">Ficheros que contiene</label> 
      <input type="text" id="ficherosHijo" class="swal2-input" value="${ficherosHijo}">
    </div>`,
    showCancelButton: true,
    confirmButtonText: "Continuar",
    cancelButtonText: "Cancelar",
    reverseButtons: true,
    preConfirm: () => {
      const titulo = Swal.getPopup().querySelector("#titulo").value;
      var tipoPost = Swal.getPopup().querySelector("#tipo").value;
      const ficherosHijo = Swal.getPopup().querySelector("#ficherosHijo").value;
      // no puedes dejar campos en blanco
      if (!titulo || !tipoPost || !ficherosHijo) {
        Swal.showValidationMessage(`No puedes dejar ningún campo en blanco!`);
      }
      // tipo debe ser una de esas tres
      if (
        tipoPost !== "contenido" &&
        tipoPost !== "noticia" &&
        tipoPost !== "aplicacion" &&
        tipoPost !== "fichero"
      ) {
        Swal.showValidationMessage(
          `El tipo de documento debe ser contenido, noticia, aplicacion ó fichero`
        );
      }
      // si tipo=cont/aplic/form no lo cambies a undefined(fichero)
      if (tipoPost === "fichero" && tipo !== "fichero") {
        Swal.showValidationMessage(
          `Inválido. Cont/notic/aplic no puede ser fichero`
        );
      }
      // si es un fichero (el que sea), tagsChildren no se toca. Va a ser "Ninguno" 100%
      if (
        data.mimeType !== "application/octet-stream" &&
        ficherosHijo !== "Ninguno"
      ) {
        Swal.showValidationMessage(`Inválido. Un fichero no contiene a otros`);
      }
      // si eres un fichero (el que sea) y quieres tocar el tipo, no puedes.
      if (
        data.mimeType !== "application/octet-stream" &&
        tipoPost !== "fichero"
      ) {
        Swal.showValidationMessage(`Inválido`);
      }
      // en caso de que tipo=formulario, en ES no hay formulario sino "aplicacion"
      if (tipoPost === "formulario") tipoPost = "aplicacion";
      // tratamiento de los ficheros hijos
      if (ficherosHijo !== "Ninguno" && ficherosHijo !== "NINGUNO") {
        let puedo = true;
        let arrayHijos = ficherosHijo.split(",");
        arrayHijos.forEach((item) => {
          let ficheroCantidad = item.split("-");
          if (!MIME_TYPES.tiposFicheros.includes(ficheroCantidad[0]))
            puedo = false;

          if (isNaN(ficheroCantidad[1]) || ficheroCantidad[1] === "")
            puedo = false;
        });
        if (!puedo) {
          Swal.showValidationMessage(
            `Ejemplo de formato: PDF-3,XLS-11,MSWORD-9`
          );
        }
      }
      // si me sale que arrayHijos es Ninguno, entonces debo quitar la propiedad
      // "tagsChildren" a mi doc en ES.
      return { titulo: titulo, tipo: tipoPost, newFicherosHijo: ficherosHijo };
    },
  }).then((result) => {
    handleEdit(
      result,
      encodeURIComponent(data._id),
      handleTitleUpdate,
      handleTypeUpdate,
      ficherosHijo
    );
  });
}

// le pasamos el objeto para tener acceso a todos sus campos
function BotonesCard(props) {
  //console.log(props.obj);   props.obj tiene todos los campos de la card
  var handleTitleUpdate = props.handleTitleUpdate;
  var handleScoringUpdate = props.handleScoringUpdate;
  var handleTypeUpdate = props.handleTypeUpdate;
  // variable necesaria para que (SIN darle a la ruleta de actualizar de Chrome),
  // al editar un titulo y acto seguido, volverlo a editar, coja el título nuevo
  // y no el inicial, como hacía antes. Le paso el estado y fin, me despreocupo.
  var tituloTarjeta = props.tituloTarjeta;
  var tipoTarjeta = props.tipoTarjeta;
  return (
    <Stack direction="row">
      <Stack direction="row" spacing={1}>
        <ShowTags item={props.obj} />
      </Stack>
      <div className="espacioizquierda">
        <Stack direction="row" spacing={3}>
          <Button
            style={{
              borderRadius: 25,
              backgroundColor: "#f2ad4e",
              textTransform: "none",
            }}
            variant="contained"
            startIcon={<EditIcon />}
            size="small"
            onClick={formularioEditar.bind(
              this,
              props.obj,
              tituloTarjeta,
              handleTitleUpdate,
              tipoTarjeta,
              handleTypeUpdate
            )}
          >
            Editar
          </Button>
          <Button
            style={{
              borderRadius: 25,
              backgroundColor: "#3ad184",
              textTransform: "none",
            }}
            variant="contained"
            startIcon={<ThumbUpIcon />}
            size="small"
            onClick={alerta.bind(this, props.obj._id, handleScoringUpdate)}
          >
            Like
          </Button>
        </Stack>
      </div>
    </Stack>
  );
}

export default BotonesCard;

// El componente Stack gestiona la disposición de los hijos inmediatos a lo
// largo del eje vertical u horizontal con espaciado y/o divisores opcionales
// entre cada hijo. https://mui.com/material-ui/react-stack/

// Al 2º de los botones le he metido lo que se llama un "inline style". Es decir,
// le aplico un estilo al botón "en línea", no en un respectivo CSS. Generalmente,
// esto es algo malo en cuanto a rendimiento. https://www.freecodecamp.org/news/how-to-style-react-apps-with-css/

// Ayuda: metiendo esto <p>{JSON.stringify(props.obj)}</p> por algún lado arriba,
// nos muestra el JSON devuelto por Elastic.
