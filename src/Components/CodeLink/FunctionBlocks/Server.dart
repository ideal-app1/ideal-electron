import 'dart:convert';
import 'dart:io';
import 'dart:async' as async;

import 'package:uuid/uuid.dart';


class CodeLinkServer {

  String CreateUniqueKey() {
    // Create uuid object
    var uuid = Uuid();

    // Generate a v1 (time-based) id
    uuid.v1(); // -> '6c84fb90-12c4-11e1-840d-7b25c5ee775a'

    // Generate a v4 (random) id
    return(uuid.v4());
  }

  Future<void> createServer(String url, int port) async {
    final requests = await HttpServer.bind(url, port);
    await for (var request in requests) {
      processRequest(request);
    }
  }

  void processRequest(HttpRequest request) {
    print('Got request for ${request.uri.path}');
    final response = request.response;
    if (request.uri.path == '/dart') {
      response
        ..headers.contentType = ContentType(
          'text',
          'plain',
        )
        ..write('Hello from the server');
    } else {
      response.statusCode = HttpStatus.notFound;
    }
    response.close();
  }
}

class CodeLinkClient {
  Future<void> createClient(String path) async {
    var url = Uri.parse(path);
    var httpClient = HttpClient();
    var request = await httpClient.getUrl(url);
    var response = await request.close();
    var data = await utf8.decoder.bind(response).toList();
    print('Response ${response.statusCode}: $data');
    httpClient.close();
  }
}