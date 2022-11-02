import { ReactiveComponent } from "@appbaseio/reactivesearch";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";

function handleChange(evt) {
  console.log("new value", evt.target.value);
}

function CustomFilter(props) {
  return (
    <div>
      <br />
      <div>Según el tipo de contenido que tienen...</div>
      <FormGroup>
        <FormControlLabel
          //onChange={handleChange}
          control={<Checkbox />}
          label="PDF"
        />
        <FormControlLabel
          //onChange={handleChange}
          control={<Checkbox />}
          label="MSWORD"
        />
        <FormControlLabel
          //onChange={handleChange}
          control={<Checkbox />}
          label="XML"
        />
      </FormGroup>
    </div>
  );
}

export default CustomFilter;
