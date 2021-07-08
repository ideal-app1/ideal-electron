import 'dart:convert';
import 'dart:io';
import 'dart:async' as async;

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

class CodeLinkRequest {

  final int userId;
  final int id;
  final String title;

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
}