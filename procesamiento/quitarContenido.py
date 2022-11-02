import http.client
import json
import urllib.parse
import re

# === OBJETIVO:
# Quitar de nuestro corpus de documentos aquellos documentos "contenido" que no
# contengan a otros documentos.


# función que obtiene todos los documentos "contenido" que hay.
def obtenerContenidos():
    conn = http.client.HTTPConnection("localhost", 9200)
    headers = {'Content-type': 'application/json'}

    query = {"size": 10000, "query": {
        "match": {"tipo.keyword": "contenido"}}}
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
        #conn = http.client.HTTPConnection("localhost", 9200)
        #headers = {'Content-type': 'application/json'}
        # endpoint de eliminar
        #endpoint = "/nutch/_doc/" + urllib.parse.quote_plus(doc["_id"])
        # print(endpoint)
        #conn.request("DELETE", endpoint, {}, headers)
        #resp = conn.getresponse()
        # resp.read()
        #print("  >>>>   status: " + str(resp.status))


# recorre todos los doc "contenido" y pasa uno a uno a la función de tratarDocumento,
# que es la que decidirá si eliminarlo o no.
def cribar(contenido):
    contenidosTotales = contenido["total"]["value"]
    print("\n[*] Cantidad de documentos de tipo \"contenido\" en el corpus a cribar: " +
          str(contenidosTotales))

    # si es un doc "contenido" plano, es decir, que no contiene otros documentos ==> nos
    # lo quitamos de encima.

    documentos = contenido["hits"]
    for i in range(0, contenidosTotales):
        tratarDocumento(documentos[i])


if __name__ == "__main__":
    # empezamos a procesar
    contenidos = obtenerContenidos()
    cribar(contenidos)
