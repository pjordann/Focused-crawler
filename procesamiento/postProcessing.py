import http.client
import json
import urllib.parse


# function que maneja los inlinks. Converts el campo inliks en una lista que será luego tratada.
def handleInliks(inlinks):
    filetype_string = ''.join(str(v) for v in inlinks)
    filetype_string = filetype_string.replace(']', '')
    filetype_string = filetype_string.replace("'", '')
    filetype_string = filetype_string.replace('[', '')
    filetype_list = filetype_string.split(",")
    return filetype_list


# marca el fichero en cuestión (pdf/xml/word...) como visitado para no leerse en futuras llamadas
def marcarVisitado(fichero):
    conn = http.client.HTTPConnection("localhost", 9200)
    query = {
        "script": "if (ctx._source.visitado == null) { ctx._source.visitado = \"true\"}"}
    json_query_visitado = json.dumps(query)
    endpoint = "/nutch/_update/"
    headers = {'Content-type': 'application/json'}
    doc_endpoint = endpoint + urllib.parse.quote_plus(fichero)
    conn.request("POST", doc_endpoint, json_query_visitado, headers)
    resp = conn.getresponse()
    resp.read()
    print("  >>>>   Fichero visitado: " + str(resp.status))


# función que actualiza la información del documento padre. pdf_list contiene enlaces entrantes de un pdf (o el que sea).
def updateParentInfo(fileType_list, fileType):
    conn = http.client.HTTPConnection("localhost", 9200)
    # query to add field depending on filetype
    addFieldQuery = ""
    if fileType == "application/pdf":
        addFieldQuery = {
            "script": "if (ctx._source.numPDF == null) { ctx._source.numPDF = 1 } else { ctx._source.numPDF += 1} if (ctx._source.tienePDF == null) { ctx._source.tienePDF = \"true\"}"}
    elif fileType == "application/msword":
        addFieldQuery = {
            "script": "if (ctx._source.numMSWORD == null) { ctx._source.numMSWORD = 1 } else { ctx._source.numMSWORD += 1} if (ctx._source.tieneMSWORD == null) { ctx._source.tieneMSWORD = \"true\"}"}
    elif fileType == "application/xml":
        addFieldQuery = {
            "script": "if (ctx._source.numXML == null) { ctx._source.numXML = 1 } else { ctx._source.numXML += 1} if (ctx._source.tieneXML == null) { ctx._source.tieneXML = \"true\"}"}
    elif fileType == "application/vnd.openxmlformats-officedocument.presentationml.presentation":
        addFieldQuery = {
            "script": "if (ctx._source.numPPTX == null) { ctx._source.numPPTX = 1 } else { ctx._source.numPPTX += 1} if (ctx._source.tienePPTX == null) { ctx._source.tienePPTX = \"true\"}"}
    elif fileType == "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        addFieldQuery = {
            "script": "if (ctx._source.numDOCX == null) { ctx._source.numDOCX = 1 } else { ctx._source.numDOCX += 1} if (ctx._source.tieneDOCX == null) { ctx._source.tieneDOCX = \"true\"}"}
    elif fileType == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
        addFieldQuery = {
            "script": "if (ctx._source.numXLSX == null) { ctx._source.numXLSX = 1 } else { ctx._source.numXLSX += 1} if (ctx._source.tieneXLSX == null) { ctx._source.tieneXLSX = \"true\"}"}
    else:
        addFieldQuery = {
            "script": "if (ctx._source.numOTROS == null) { ctx._source.numOTROS = 1 } else { ctx._source.numOTROS += 1} if (ctx._source.tieneOTROS == null) { ctx._source.tieneOTROS = \"true\"}"}
    json_query_fileType = json.dumps(addFieldQuery)
    # ruta de actualización. Como es de actualización, le concatenamos el id del documento en cuestión.
    endpoint = "/nutch/_update/"
    headers = {'Content-type': 'application/json'}
    # iteramos por cada fichero entrante de tipo fileType
    for i in range(0, len(fileType_list)):
        # quitamos posibles espacios de URLs
        parent = fileType_list[i].replace(' ', '')
        print("   Updating info about " + parent, end=" ")
        # como la ruta es /nutch/_update/<id> y el <id> es una url, hay que encodearla.
        doc_endpoint = endpoint + \
            urllib.parse.quote_plus(parent)
        conn.request("POST", doc_endpoint, json_query_fileType, headers)
        resp = conn.getresponse()
        resp.read()
        print("  >>>>   status: " + str(resp.status))


def fileProcessing(fileType):
    conn = http.client.HTTPConnection("localhost", 9200)

    headers = {'Content-type': 'application/json'}

    # ES por defecto nos devueve solo 10 elementos. Ponemos 10.000 de size para
    # que nos devuelva todos los que tiene.
    query = {"_source": "inlinks", "size": 10000, "query": {
        "bool": {"must": [{"match": {"mimeType.keyword": fileType}}], "must_not": {"exists": {"field": "visitado"}}}}}
    json_query = json.dumps(query)

    # hacemos el GET con la query
    conn.request("GET", "/nutch/_search", json_query, headers)
    resp = conn.getresponse()
    respuesta_entera = resp.read().decode()

    # obtenemos el total de documentos recuperados para poder iterar luego.
    json_response = json.loads(respuesta_entera)
    docs_recuperados = json_response["hits"]["total"]["value"]
    print("\n[*] Total de documentos " + fileType +
          " recuperados: " + str(docs_recuperados))

    # iteramos sobre ellos para sacar los inlinks y añadir que ese doc "tienePDF"
    hits = json_response["hits"]["hits"]
    for i in range(0, docs_recuperados):
        file_inlinks = hits[i]["_source"]["inlinks"]
        fileType_list = handleInliks(file_inlinks)
        updateParentInfo(fileType_list, fileType)
        marcarVisitado(hits[i]["_id"])
        print("   ====================================================")


if __name__ == "__main__":
    # los diferentes tipos de ficheros que tenemos de momento
    fileTypes = ["application/pdf", "application/xml", "application/msword", "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                 "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                 "application/vnd.ms-powerpoint"]
    for filetype in fileTypes:
        fileProcessing(filetype)

# cuando haya más tipos de ficheros:
#   *: añadirlos al array del main, 109
