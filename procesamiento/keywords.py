import http.client
import json
import urllib.parse
import re

# === OBJETIVO:
# Clasificar los documentos en categorías. Estas categorías hay que buscarlas o bien en el título o bien en el propio dominio del documento.


# función que obtiene todos los documentos.
def obtenerDocumentos():
    conn = http.client.HTTPConnection("localhost", 9200)
    headers = {'Content-type': 'application/json'}

    # con el "track_total_hits": "true" consigo más de 10k resultados (que son
    # los que devuelve Elastic como máximo por defecto)
    query = {"size": 10000, "query": {
        "bool": {"must_not": {"exists": {"field": "etiquetado"}}}}}
    json_query = json.dumps(query)

    # hacemos el GET con la query
    conn.request("GET", "/nutch/_search", json_query, headers)
    resp = conn.getresponse()
    respuesta_entera = resp.read().decode()

    # obtenemos el total de documentos recuperados para poder iterar luego.
    json_response = json.loads(respuesta_entera)
    return json_response["hits"]


# función que convierte Alimentación en alimentacion, Agricultura en agricultura, etc
def etiquetaSinAcentosYMinuscula(texto):
    if (texto == "Agricultura"):
        return "agricultura"
    elif (texto == "Alimentación"):
        return "alimentacion"
    else:
        return "otros"


# función que decide si "doc" se puede etiquetar y en caso afirmativo, lo hace.
def tratarDocumento(doc):
    keyword = "otros"
    # para los doc de tipo "aplicacion"
    if "title" in doc["_source"]:
        titulo = doc["_source"]["title"]
        matchTitulo = re.search("\[([^\]]*)]\s-\s(.*)\s-\smapa.gob.es", titulo)
        if matchTitulo:
            splitTitulo = titulo.split("-")
            etiqueta = splitTitulo[1]
            etiqueta = etiqueta.strip()
            keyword = etiquetaSinAcentosYMinuscula(etiqueta)

    # para el resto de documentos, miramos las URLs a ver si nos dan alguna pista
    url = doc["_id"]
    urlSplit = url.split("/")
    posibleTag = urlSplit[4]
    if (posibleTag == "agricultura" or posibleTag == "ganaderia" or posibleTag == "pesca"
            or posibleTag == "alimentacion" or posibleTag == "desarrollo-rural"
            or posibleTag == "cartografia-y-sig"):
        keyword = posibleTag

    print(doc["_id"] + " etiquetado como: " + keyword)

    # --> query = {"doc": {"etiquetado": "true", "keyword": keyword}}
    conn = http.client.HTTPConnection("localhost", 9200)
    headers = {'Content-type': 'application/json'}
    endpoint = "/nutch/_update/" + urllib.parse.quote_plus(doc["_id"])
    query = {"doc": {"etiquetado": "true", "keyword": keyword}}
    json_query = json.dumps(query)
    # actualizamos campo "keyword" con este valor
    conn.request("POST", endpoint, json_query, headers)
    resp = conn.getresponse()
    resp.read()
    if (resp.status != 200):
        print(">>>> " + doc["_id"] + str(resp.status))


# función que va recorriendo los documentos devueltos y categorizando uno a uno.
def catalogarDocumentos(docs):
    documentosTotales = docs["total"]["value"]
    print("\n[*] Cantidad de documentos en el corpus a catalogar: " +
          str(documentosTotales))

    # si es una noticia plana, es decir, que no contiene otros documentos ==> nos
    # la quitamos de encima.

    documentos = docs["hits"]
    for i in range(0, documentosTotales):
        tratarDocumento(documentos[i])


if __name__ == "__main__":
    # empezamos a procesar
    continuar = True
    i = 1
    while(continuar):
        print("Iteracion " + str(i))
        documentos = obtenerDocumentos()
        if (documentos["total"]["value"] != 0):
            catalogarDocumentos(documentos)
        else:
            print("No hay más documentos que no hayan sido etiquetados")
            continuar = False
        i = i+1
