import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import React from "react";

// Lo de ordenar por lo gestiona este componentes
function CustomOrder() {
  // decimos que eleccion vale 1 (el valor que se muestra por defecto en el Seletct
  //será el 1, es decir, la relevancia).
  const [eleccion, setEleccion] = React.useState(1);
  // cuando cambie el valor del Select, se ejecutará esta función, ya que así
  // lo hemos establecido en el onChange del Select.
  const updateSelectedValue = (e) => {
    console.log(
      "Habría que hacer llamada a Elastic para reordenar por el nuevo valor en cuestión"
    );
    console.log("Hook haciendo de las suyas. Ordenar por: " + e.target.value);
    setEleccion(e.target.value);
  };
  return (
    <FormControl size="small">
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        sx={{ fontSize: 12 }}
        value={eleccion}
        displayEmpty
        onChange={updateSelectedValue}
      >
        <MenuItem value={1} sx={{ fontSize: 12 }}>
          Relevancia
        </MenuItem>
        <MenuItem value={2} sx={{ fontSize: 12 }}>
          Fecha
        </MenuItem>
      </Select>
    </FormControl>
  );
}

export default CustomOrder;
