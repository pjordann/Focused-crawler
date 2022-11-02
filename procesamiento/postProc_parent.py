import http.client
import json
import urllib.parse
import re

# === OBJETIVO:
# Consulta a ES para obtener doc con las propiedades tienePDF OR tieneXML OR tieneMSWORD
# y reunir todo eso en propiedad que se llama tagsChildren. Así, por ejmplo, con un documento
# tienePDF=true y tieneMSWORD=true entonces, parent=["MSWORD", "PDF"].


def addParentInfo(doc):
    # documento padre que habrá que actualizar
    padre = doc["_id"]
    print("   Adding parent info for " + padre, end=" ")
    # miramos qué ficheros tiene
    pdf_in_doc = "tienePDF" in doc["_source"]
    xml_in_doc = "tieneXML" in doc["_source"]
    msword_in_doc = "tieneMSWORD" in doc["_source"]
    xlsx_in_doc = "tieneXLSX" in doc["_source"]
    docx_in_doc = "tieneDOCX" in doc["_source"]
    pptx_in_doc = "tienePPTX" in doc["_source"]
    otros_in_doc = "tieneOTROS" in doc["_source"]

    # mirar cuáles son true
    totalFicheros = []
    if pdf_in_doc:
        if (doc["_source"]["tienePDF"] == "true"):
            totalFicheros.append("PDF")
    if xml_in_doc:
        if (doc["_source"]["tieneXML"] == "true"):
            totalFicheros.append("XML")
    if msword_in_doc:
        if (doc["_source"]["tieneMSWORD"] == "true"):
            totalFicheros.append("MSWORD")
    if xlsx_in_doc:
        if (doc["_source"]["tieneXLSX"] == "true"):
            totalFicheros.append("XLSX")
    if docx_in_doc:
        if (doc["_source"]["tieneDOCX"] == "true"):
            totalFicheros.append("DOCX")
    if pptx_in_doc:
        if (doc["_source"]["tienePPTX"] == "true"):
            totalFicheros.append("PPTX")
    if otros_in_doc:
        if (doc["_source"]["tieneOTROS"] == "true"):
            totalFicheros.append("OTROS")

    # definimos todo lo necesario
    conn = http.client.HTTPConnection("localhost", 9200)
    headers = {'Content-type': 'application/json'}
    urlPadre = padre.replace(' ', '')
    endpoint = "/nutch/_update/" + urllib.parse.quote_plus(urlPadre)
    # añadimos también el scoring
    query = {"doc": {"tagsChildren": totalFicheros}}
    json_query = json.dumps(query)
    # actualizamos campo "children" con este valor
    conn.request("POST", endpoint, json_query, headers)
    resp = conn.getresponse()
    resp.read()
    print("  >>>>   status: " + str(resp.status))


def getDocsWithFileTypes():
    conn = http.client.HTTPConnection("localhost", 9200)
    headers = {'Content-type': 'application/json'}

    # ES por defecto devueve solo 10 elementos. Ponemos 10.000 de size para
    # que nos devuelva todos los que tiene. Query: dame los documentos para los
    # cuales existan los campos tienePDF ó tieneMSWORD ó tieneXML
    query = {"size": 10000, "query": {"bool": {"should": [{"exists": {"field": "tieneXML"}}, {
        "exists": {"field": "tienePDF"}}, {"exists": {"field": "tieneMSWORD"}},
        {"exists": {"field": "tieneXLSX"}}, {"exists": {
            "field": "tieneOTROS"}}, {"exists": {"field": "tienePPTX"}},
        {"exists": {"field": "tieneDOCX"}}]}}}
    json_query = json.dumps(query)

    # hacemos el GET con la query
    conn.request("GET", "/nutch/_search", json_query, headers)
    resp = conn.getresponse()
    respuesta_entera = resp.read().decode()

    # obtenemos el total de documentos recuperados para poder iterar luego.
    json_response = json.loads(respuesta_entera)
    docs_recuperados = json_response["hits"]["total"]["value"]
    print("\n[*] Total de documentos (que contienen otros) recuperados: " +
          str(docs_recuperados))

    # iteramos sobre ellos para sacar los inlinks y añadir que ese doc "tienePDF"
    hits = json_response["hits"]["hits"]
    for i in range(0, docs_recuperados):
        # añadimos al documento en cuestión "parent=PDF,XLS"
        addParentInfo(hits[i])


if __name__ == "__main__":
    # empezamos a procesar
    getDocsWithFileTypes()
