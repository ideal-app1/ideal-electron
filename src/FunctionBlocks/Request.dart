import 'dart:convert';
import 'dart:io';
import 'dart:async' as async;


import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

String encodeUrl(var url) {
  var encoded = Uri.encodeFull(url);
  assert(encoded == url);
  return encoded;
}

String decodedURl(var url) {
  var decoded = Uri.decodeFull(url);
  assert(url == decoded);
  return decoded;
}

class CodeLinkRequest {

  final int userId;
  final int id;
  final String title;
  Map<String, dynamic> sample = Map<String, dynamic>();

  CodeLinkRequest({
    required this.userId,
    required this.id,
    required this.title,
  });

  

  factory CodeLinkRequest.fromJson(Map<String, dynamic> json) {
    return CodeLinkRequest(
      userId: json['userId'],
      id: json['id'],
      title: json['title'],
    );
  }

  CodeLinkRequest JsonToObject() {
    String rawJson = '{"name":"Mary","age":30}';
    Map<String, dynamic> map = jsonDecode(rawJson);
    CodeLinkRequest person = CodeLinkRequest(userId: userId, id: id, title: title).fromJson(map);
  }

  Future<CodeLinkRequest> getRequest(String request) async {
    final response =
      await http.get(Uri.parse('$request'));
    if (response.statusCode == 200) {
      // If the server did return a 200 OK response,
      // then parse the JSON.
      return CodeLinkRequest.fromJson(jsonDecode(response.body));
    }
    return(response);
  }

  Future<http.Response> deleteRequest(String id, String request) async {
    final http.Response response = await http.delete(
      Uri.parse('$request/$id'),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
      },
    );
    return response;
  }
  
  Future<void> makeGetRequest(urlstring) async {
    final url = Uri.parse('$urlstring/posts');
    Response response = await get(url);
    print('Status code: ${response.statusCode}');
    print('Headers: ${response.headers}');
    print('Body: ${response.body}');
  }

  Future<void> makePostRequest(urlstring) async {
    final url = Uri.parse('$urlstring/posts');
    final headers = {"Content-type": "application/json"};
    final json = '{"title": "Hello", "body": "body text", "userId": 1}';
    final response = await post(url, headers: headers, body: json);
    print('Status code: ${response.statusCode}');
    print('Body: ${response.body}');
  }

  Future<void> makePutRequest(urlstring) async {
    final url = Uri.parse('$urlstring/posts/1');
    final headers = {"Content-type": "application/json"};
    final json = '{"title": "Hello", "body": "body text", "userId": 1}';
    final response = await put(url, headers: headers, body: json);
    print('Status code: ${response.statusCode}');
    print('Body: ${response.body}');
  }

  Future<void> makePatchRequest(urlstring) async {
    final url = Uri.parse('$urlstring/posts/1');
    final headers = {"Content-type": "application/json"};
    final json = '{"title": "Hello"}';
    final response = await patch(url, headers: headers, body: json);
    print('Status code: ${response.statusCode}');
    print('Body: ${response.body}');
  }

  Future<void> makeDeleteRequest(urlstring) async {
    final url = Uri.parse('$urlstring/posts/1');
    final response = await delete(url);
    print('Status code: ${response.statusCode}');
    print('Body: ${response.body}');
  }
}