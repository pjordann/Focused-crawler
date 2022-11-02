import "./notFound.css";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

function NotFound() {
  return (
    <div id="wrapper">
      <img class="imagen" src="https://i.imgur.com/qIufhof.png" />
      <div className="texto" id="info">
        <Typography variant="h6" component="h6">
          <b>Hmmm... La página no se ha encontrado. </b>
          <span>
            <Link href="/login" underline="hover">
              {" Volver a inicio."}
            </Link>
          </span>
        </Typography>
        ;
      </div>
    </div>
  );
}

export default NotFound;
