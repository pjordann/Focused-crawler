import http.client
import json
import urllib.parse
import re

# === OBJETIVO:
# Añadir a todos los documentos de ES el campo del userScoring para poder
# modificarlo.


def getAllDocsAndAddScoring():
    conn = http.client.HTTPConnection("localhost", 9200)
    headers = {'Content-type': 'application/json'}

    query = {"query": {"match_all": {}},
             "script": "if (ctx._source.userScoring == null) { ctx._source.userScoring = 0 }"}
    json_query = json.dumps(query)

    # hacemos el GET con la query
    conn.request("POST", "/nutch/_update_by_query", json_query, headers)
    resp = conn.getresponse()
    respuesta_entera = resp.read().decode()

    # obtenemos el total de documentos recuperados para poder iterar luego.
    json_response = json.loads(respuesta_entera)
    docs_totales = json_response["total"]
    docs_actualizados = json_response["updated"]
    print("\n[*] Actualizados " + str(docs_actualizados) +
          " documentos de un total de " + str(docs_totales))


if __name__ == "__main__":
    # empezamos a procesar
    getAllDocsAndAddScoring()
