import http.client
import json
import urllib.parse
import re

# === OBJETIVO:
# Quitar de nuestro corpus de documentos aquellas noticias que no contengan
# otros documentos.


# función que obtiene todas las noticias que hay.
def obtenerNoticias():
    conn = http.client.HTTPConnection("localhost", 9200)
    headers = {'Content-type': 'application/json'}

    query = {"size": 10000, "query": {
        "match": {"tipo.keyword": "noticia"}}}
    json_query = json.dumps(query)

    # hacemos el GET con la query
    conn.request("GET", "/nutch/_search", json_query, headers)
    resp = conn.getresponse()
    respuesta_entera = resp.read().decode()

    # obtenemos el total de documentos recuperados para poder iterar luego.
    json_response = json.loads(respuesta_entera)
    return json_response["hits"]


# función que decide si "doc" es relevante o no lo es.
def tratarDocumento(doc):
    tienepdf = "tienePDF" in doc["_source"]
    tienexml = "tieneXML" in doc["_source"]
    tienemsword = "tieneMSWORD" in doc["_source"]
    tienexlsx = "tieneXLSX" in doc["_source"]
    tienedocx = "tieneDOCX" in doc["_source"]
    tienepptx = "tienePPTX" in doc["_source"]
    tieneotros = "tieneOTROS" in doc["_source"]

    contieneAlgo = tienepdf or tienexml or tienemsword or tienexlsx or tienedocx or tienepptx or tieneotros

    # si no contiene nada, lo eliminamos.
    if (not contieneAlgo):
        # en este punto lo que se haría es eliminar el documento en cuestión.
        print("==DELETE== id: " + doc["_id"])
        conn = http.client.HTTPConnection("localhost", 9200)
        headers = {'Content-type': 'application/json'}
        # endpoint de eliminar
        endpoint = "/nutch/_doc/" + urllib.parse.quote_plus(doc["_id"])
        print(endpoint)
        conn.request("DELETE", endpoint, {}, headers)
        resp = conn.getresponse()
        resp.read()
        print("  >>>>   status: " + str(resp.status))


# recorre todas las noticias y pasa una a una a la función de tratarDocumento,
# que es la que decidirá si eliminarlo o no.
def cribar(noticias):
    noticiasTotales = noticias["total"]["value"]
    print("\n[*] Cantidad de noticias en el corpus a cribar: " +
          str(noticiasTotales))

    # si es una noticia plana, es decir, que no contiene otros documentos ==> nos
    # la quitamos de encima.

    documentos = noticias["hits"]
    for i in range(0, noticiasTotales):
        tratarDocumento(documentos[i])


if __name__ == "__main__":
    # empezamos a procesar
    noticias = obtenerNoticias()
    cribar(noticias)
